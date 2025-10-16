/**
 * Business rules and validation helpers for the Förderfähigkeit eligibility check.
 */

export type EligibilityStatus = 'eligible' | 'ineligible';

export type EligibilityCriterionId = 'purpose' | 'amount' | 'postalCode';

export interface EligibilityInput {
  purpose: string;
  amount: number;
  postalCode: string;
}

export interface EligibilityFieldErrors {
  purpose?: string;
  amount?: string;
  postalCode?: string;
}

export interface EligibilityCheck {
  id: EligibilityCriterionId;
  label: string;
  passed: boolean;
  requirement: string;
}

export interface EligibilityResult {
  status: EligibilityStatus;
  outcomeLabel: 'förderfähig' | 'nicht förderfähig';
  checks: EligibilityCheck[];
}

export interface EligibilityValidationResult {
  value: EligibilityInput | null;
  errors: EligibilityFieldErrors;
}

export const ELIGIBILITY_PURPOSE_KEYWORDS = [
  'sanierung',
  'energie',
  'effizienz',
  'modernisierung',
  'klima',
  'wohnen',
  'renovierung'
] as const;

export const MIN_ELIGIBLE_AMOUNT = 5000;
export const MAX_ELIGIBLE_AMOUNT = 200000;

export const VALID_POSTAL_CODE_REGEX = /^[0-9]{5}$/;

const ELIGIBLE_OUTCOME_LABEL: EligibilityResult['outcomeLabel'] = 'förderfähig';
const INELIGIBLE_OUTCOME_LABEL: EligibilityResult['outcomeLabel'] = 'nicht förderfähig';

const MIN_AMOUNT_LABEL = MIN_ELIGIBLE_AMOUNT.toLocaleString('de-DE');
const MAX_AMOUNT_LABEL = MAX_ELIGIBLE_AMOUNT.toLocaleString('de-DE');

const PURPOSE_REQUIREMENT =
  'Der Zweck sollte energiebezogene Sanierungs- oder Effizienzmaßnahmen beschreiben (z. B. Sanierung, Energieeffizienz, Klimaschutz).';
const AMOUNT_REQUIREMENT = `Betrag zwischen ${MIN_AMOUNT_LABEL} € und ${MAX_AMOUNT_LABEL} €.`;
const POSTAL_REQUIREMENT = 'Fünfstellige deutsche Postleitzahl (z. B. 10115).';

export function validateEligibilityInput(raw: {
  purpose: string;
  amount: string;
  postalCode: string;
}): EligibilityValidationResult {
  const errors: EligibilityFieldErrors = {};

  const purpose = normalizeText(raw.purpose);
  if (!purpose) {
    errors.purpose = 'Bitte den Verwendungszweck angeben.';
  } else if (purpose.length < 3) {
    errors.purpose = 'Bitte den Verwendungszweck mit mindestens 3 Zeichen beschreiben.';
  }

  const amount = parseAmountInput(raw.amount);
  if (amount === null) {
    errors.amount = 'Bitte einen gültigen Betrag eingeben.';
  } else if (!isAmountWithinRange(amount)) {
    errors.amount = `Der Betrag muss zwischen ${MIN_AMOUNT_LABEL} € und ${MAX_AMOUNT_LABEL} € liegen.`;
  }

  const postalCode = normalizePostalCode(raw.postalCode);
  if (!postalCode) {
    errors.postalCode = 'Bitte eine Postleitzahl angeben.';
  } else if (!isPostalCodeEligible(postalCode)) {
    errors.postalCode = 'Bitte eine fünfstellige deutsche Postleitzahl verwenden.';
  }

  if (Object.keys(errors).length > 0) {
    return { value: null, errors };
  }

  return {
    value: {
      purpose,
      amount: amount!,
      postalCode
    },
    errors
  };
}

export function evaluateEligibility(input: EligibilityInput): EligibilityResult {
  const normalizedPurpose = normalizeText(input.purpose).toLowerCase();
  const normalizedPostalCode = normalizePostalCode(input.postalCode);

  const purposePassed = containsEligiblePurpose(normalizedPurpose);
  const amountPassed = isAmountWithinRange(input.amount);
  const postalCodePassed = isPostalCodeEligible(normalizedPostalCode);

  const checks: EligibilityCheck[] = [
    {
      id: 'purpose',
      label: 'Verwendungszweck',
      passed: purposePassed,
      requirement: PURPOSE_REQUIREMENT
    },
    {
      id: 'amount',
      label: 'Förderbetrag',
      passed: amountPassed,
      requirement: AMOUNT_REQUIREMENT
    },
    {
      id: 'postalCode',
      label: 'Postleitzahl',
      passed: postalCodePassed,
      requirement: POSTAL_REQUIREMENT
    }
  ];

  const status = determineStatus(checks);

  return {
    status,
    outcomeLabel: status === 'eligible' ? ELIGIBLE_OUTCOME_LABEL : INELIGIBLE_OUTCOME_LABEL,
    checks
  };
}

export function isEligible(result: EligibilityResult): boolean {
  return result.status === 'eligible';
}

function determineStatus(checks: EligibilityCheck[]): EligibilityStatus {
  return checks.every((check) => check.passed) ? 'eligible' : 'ineligible';
}

function normalizeText(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).normalize('NFKC').trim();
}

function normalizePostalCode(value: string): string {
  return normalizeText(value).replace(/\s+/g, '').replace(/[^0-9]/g, '');
}

function containsEligiblePurpose(normalizedPurpose: string): boolean {
  if (!normalizedPurpose) return false;
  return ELIGIBILITY_PURPOSE_KEYWORDS.some((keyword) => normalizedPurpose.includes(keyword));
}

function isAmountWithinRange(amount: number): boolean {
  return Number.isFinite(amount) && amount >= MIN_ELIGIBLE_AMOUNT && amount <= MAX_ELIGIBLE_AMOUNT;
}

function isPostalCodeEligible(postalCode: string): boolean {
  return VALID_POSTAL_CODE_REGEX.test(postalCode);
}

function parseAmountInput(value: string): number | null {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }

  const numericOnly = normalized.replace(/[^\d.,-]/g, '');
  if (!numericOnly) {
    return null;
  }

  const sanitized = numericOnly.replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.');
  const parsed = Number.parseFloat(sanitized);

  return Number.isFinite(parsed) ? parsed : null;
}