import type {
  ChangeEvent,
  FormEvent,
} from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  simulateUpload,
  createApplication,
} from '../services/applicationService';
import type {
  ApplicationFormState,
  FieldKey,
  SubmitStage,
  CreateApplicationPayload,
  CreatedApplication,
} from '../types';

const MIN_APPLICATION_AMOUNT = 5000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export function useApplicationForm() {
  const [formState, setFormState] = useState<ApplicationFormState>({
    applicantName: '',
    applicantEmail: '',
    programId: '',
    amount: '',
    purpose: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStage, setSubmitStage] = useState<SubmitStage>('idle');
  const navigate = useNavigate();

  const handleFieldChange =
    (field: keyof ApplicationFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setFormState((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => {
        if (prev[field] === undefined) {
          return prev;
        }
        const next = { ...prev };
        delete next[field];
        return next;
      });
      setSubmitError(null);
    };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setFieldErrors((prev) => {
      if (prev.file === undefined) {
        return prev;
      }
      const next = { ...prev };
      delete next.file;
      return next;
    });
    setSubmitError(null);
  };

  function parseAmountInput(value: string): number | null {
    const normalized = value
      .replace(/\s+/g, '')
      .replace(/\.(?=\d{3}(?:\D|$))/g, '')
      .replace(',', '.');
    if (!normalized) {
      return null;
    }
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function validateForm(
    state: ApplicationFormState,
    file: File | null
  ): Partial<Record<FieldKey, string>> {
    const errors: Partial<Record<FieldKey, string>> = {};
    const name = state.applicantName.trim();
    if (!name) {
      errors.applicantName = 'Bitte den Namen der antragstellenden Person eingeben.';
    }
    const email = state.applicantEmail.trim();
    if (!email) {
      errors.applicantEmail = 'Bitte die E-Mail-Adresse eingeben.';
    } else if (!EMAIL_REGEX.test(email)) {
      errors.applicantEmail = 'Bitte eine gültige E-Mail-Adresse eingeben.';
    }
    if (!state.programId) {
      errors.programId = 'Bitte ein Förderprogramm auswählen.';
    }
    const amountValue = parseAmountInput(state.amount);
    if (amountValue === null) {
      errors.amount = 'Bitte einen gültigen Betrag eingeben.';
    } else if (amountValue < MIN_APPLICATION_AMOUNT) {
      errors.amount = `Der Betrag muss mindestens ${MIN_APPLICATION_AMOUNT.toLocaleString('de-DE')} € betragen.`;
    }
    const purpose = state.purpose.trim();
    if (!purpose) {
      errors.purpose = 'Bitte den Verwendungszweck beschreiben.';
    } else if (purpose.length < 10) {
      errors.purpose = 'Bitte den Verwendungszweck mit mindestens 10 Zeichen beschreiben.';
    }
    if (!file) {
      errors.file = 'Bitte ein Dokument hochladen, um die Einreichung zu simulieren.';
    }
    return errors;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const trimmed: ApplicationFormState = {
      applicantName: formState.applicantName.trim(),
      applicantEmail: formState.applicantEmail.trim(),
      programId: formState.programId,
      amount: formState.amount.trim(),
      purpose: formState.purpose.trim(),
    };
    const errors = validateForm(trimmed, selectedFile);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    const amountValue = parseAmountInput(trimmed.amount);
    if (amountValue === null) {
      setFieldErrors((prev) => ({ ...prev, amount: 'Bitte einen gültigen Betrag eingeben.' }));
      return;
    }
    setFieldErrors({});
    setSubmitError(null);
    setIsSubmitting(true);
    setSubmitStage('upload');
    try {
      await simulateUpload(selectedFile);
      setSubmitStage('submit');
      const payload: CreateApplicationPayload = {
        applicantName: trimmed.applicantName,
        applicantEmail: trimmed.applicantEmail,
        programId: trimmed.programId,
        amount: amountValue,
        purpose: trimmed.purpose,
      };
      const created: CreatedApplication = await createApplication(payload);
      navigate(`/applications/${created.id}`);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Die Antragseinreichung ist fehlgeschlagen. Bitte erneut versuchen.';
      setSubmitError(message);
      setSubmitStage('idle');
    } finally {
      setIsSubmitting(false);
      setSubmitStage('idle');
    }
  };

  const submitLabel = useMemo(() => {
    if (!isSubmitting) {
      return 'Antrag einreichen';
    }
    if (submitStage === 'upload') {
      return 'Datei wird hochgeladen …';
    }
    if (submitStage === 'submit') {
      return 'Antrag wird übermittelt …';
    }
    return 'Antrag wird verarbeitet …';
  }, [isSubmitting, submitStage]);

  return {
    formState,
    selectedFile,
    fieldErrors,
    submitError,
    isSubmitting,
    submitStage,
    handleFieldChange,
    handleFileChange,
    handleSubmit,
    submitLabel,
  };
}