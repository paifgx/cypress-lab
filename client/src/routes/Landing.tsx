import type { ChangeEvent, FormEvent, ReactElement } from 'react';
import { useState } from 'react';

import {
  evaluateEligibility,
  type EligibilityFieldErrors,
  type EligibilityResult,
  validateEligibilityInput
} from '@/lib/eligibility';

const INITIAL_FORM_STATE = {
  purpose: '',
  amount: '',
  postalCode: ''
};

type FormFieldName = keyof typeof INITIAL_FORM_STATE;

function Landing(): ReactElement {
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState<EligibilityFieldErrors>({});
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const updateField =
    (field: FormFieldName) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      const nextValue = event.target.value;
      const nextState = { ...formState, [field]: nextValue };

      setFormState(nextState);
      setResult(null);

      if (hasSubmitted) {
        const validation = validateEligibilityInput(nextState);
        setFieldErrors(validation.errors);
      }
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setHasSubmitted(true);

    const validation = validateEligibilityInput(formState);
    setFieldErrors(validation.errors);

    if (!validation.value) {
      setResult(null);
      return;
    }

    const evaluation = evaluateEligibility(validation.value);
    setResult(evaluation);
  };

  const hasValidationErrors = Object.keys(fieldErrors).length > 0;

  return (
    <section className="app-card" data-testid="landing-page">
      <header className="page-header">
        <h2 data-testid="landing-title">Förderfähigkeit prüfen</h2>
        <p data-testid="landing-subtitle">
          Prüfen Sie in wenigen Schritten, ob Ihr Vorhaben voraussichtlich förderfähig ist.
        </p>
      </header>

      <p data-testid="landing-description">
        Geben Sie den geplanten Verwendungszweck, den gewünschten Förderbetrag sowie Ihre Postleitzahl an. Die
        Prüfung erfolgt vollständig im Browser und liefert ein deterministisches Ergebnis.
      </p>

      <form
        className="eligibility-form"
        data-testid="landing-form"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="eligibility-form-grid">
          <div className="eligibility-field">
            <label className="eligibility-label" htmlFor="landing-purpose-input">
              Verwendungszweck
            </label>
            <input
              className="eligibility-input"
              id="landing-purpose-input"
              name="purpose"
              type="text"
              placeholder="z. B. Energetische Sanierung eines Wohngebäudes"
              value={formState.purpose}
              onChange={updateField('purpose')}
              aria-invalid={Boolean(fieldErrors.purpose)}
              aria-describedby={fieldErrors.purpose ? 'landing-purpose-error' : undefined}
              data-testid="landing-purpose"
            />
            {fieldErrors.purpose ? (
              <p
                className="field-error"
                data-testid="landing-purpose-error"
                id="landing-purpose-error"
                role="alert"
              >
                {fieldErrors.purpose}
              </p>
            ) : null}
          </div>

          <div className="eligibility-field">
            <label className="eligibility-label" htmlFor="landing-amount-input">
              Förderbetrag (EUR)
            </label>
            <input
              className="eligibility-input"
              id="landing-amount-input"
              name="amount"
              type="text"
              inputMode="decimal"
              placeholder="z. B. 10 000"
              value={formState.amount}
              onChange={updateField('amount')}
              aria-invalid={Boolean(fieldErrors.amount)}
              aria-describedby={fieldErrors.amount ? 'landing-amount-error' : undefined}
              data-testid="landing-amount"
            />
            {fieldErrors.amount ? (
              <p className="field-error" data-testid="landing-amount-error" id="landing-amount-error" role="alert">
                {fieldErrors.amount}
              </p>
            ) : null}
          </div>

          <div className="eligibility-field">
            <label className="eligibility-label" htmlFor="landing-postal-code-input">
              Postleitzahl
            </label>
            <input
              className="eligibility-input"
              id="landing-postal-code-input"
              name="postalCode"
              type="text"
              inputMode="numeric"
              placeholder="z. B. 10115"
              value={formState.postalCode}
              onChange={updateField('postalCode')}
              aria-invalid={Boolean(fieldErrors.postalCode)}
              aria-describedby={fieldErrors.postalCode ? 'landing-postal-code-error' : undefined}
              data-testid="landing-zip"
            />
            {fieldErrors.postalCode ? (
              <p
                className="field-error"
                data-testid="landing-zip-error"
                id="landing-postal-code-error"
                role="alert"
              >
                {fieldErrors.postalCode}
              </p>
            ) : null}
          </div>
        </div>

        <button
          className="eligibility-submit"
          data-testid="landing-check-eligibility"
          type="submit"
        >
          Förderfähigkeit prüfen
        </button>
      </form>

      {hasSubmitted ? (
        result ? (
          <section
            className={`eligibility-result eligibility-result--${result.status}`}
            data-testid="landing-result-card"
            aria-live="polite"
            role="status"
          >
            <header className="eligibility-result-header">
              <span className="eligibility-result-chip" data-testid="landing-result-chip">
                Prüfergebnis
              </span>
              <h3 className="eligibility-result-title" data-testid="landing-result-status">
                {result.outcomeLabel}
              </h3>
            </header>

            <p className="eligibility-result-summary">
              {result.status === 'eligible'
                ? 'Ihr Vorhaben erfüllt derzeit alle Kriterien für eine voraussichtliche Förderfähigkeit.'
                : 'Die Eingaben erfüllen aktuell nicht alle Förderkriterien. Prüfen Sie die folgenden Punkte.'}
            </p>

            <ul className="eligibility-check-list">
              {result.checks.map((check) => (
                <li
                  key={check.id}
                  className={`eligibility-check ${
                    check.passed ? 'eligibility-check--passed' : 'eligibility-check--failed'
                  }`}
                  data-testid={`eligibility-check-${check.id}`}
                >
                  <span className="eligibility-check-label">{check.label}</span>
                  <span className="eligibility-check-requirement">{check.requirement}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : hasValidationErrors ? (
          <div
            className="eligibility-result eligibility-result--pending"
            data-testid="landing-result-pending"
            aria-live="assertive"
            role="alert"
          >
            <p>Korrigieren Sie bitte die markierten Felder, um eine Förderaussage zu erhalten.</p>
          </div>
        ) : null
      ) : null}
    </section>
  );
}

export default Landing;