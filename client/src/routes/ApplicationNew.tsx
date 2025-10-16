import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { usePrograms } from './ApplicationNew/hooks/usePrograms';
import { useApplicationForm } from './ApplicationNew/hooks/useApplicationForm';
import { ApplicantNameField } from './ApplicationNew/components/ApplicantNameField';
import { ApplicantEmailField } from './ApplicationNew/components/ApplicantEmailField';
import { ProgramSelect } from './ApplicationNew/components/ProgramSelect';
import { AmountInput } from './ApplicationNew/components/AmountInput';
import { PurposeTextarea } from './ApplicationNew/components/PurposeTextarea';
import { FileUploadField } from './ApplicationNew/components/FileUploadField';
import { SubmitButton } from './ApplicationNew/components/SubmitButton';

const MIN_APPLICATION_AMOUNT = 5000;

export default function ApplicationNew(): ReactElement {
  const {
    formState,
    selectedFile,
    fieldErrors,
    submitError,
    isSubmitting,
    handleFieldChange,
    handleFileChange,
    handleSubmit,
    submitLabel,
  } = useApplicationForm();

  const { programs, isLoading, error: programsError } = usePrograms();

  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
    []
  );

  const minAmountHint = useMemo(
    () => `Mindestbetrag: ${currencyFormatter.format(MIN_APPLICATION_AMOUNT)} €`,
    [currencyFormatter]
  );

  return (
    <section className="app-card" data-testid="application-new-page">
      <header className="page-header">
        <h2 data-testid="application-new-title">Neue Antragstellung</h2>
        <p data-testid="application-new-subtitle">
          Formular zur Einreichung neuer Förderanträge inklusive Validierung und Dateiupload.
        </p>
      </header>

      <p data-testid="application-new-description">
        Füllen Sie die benötigten Felder aus, laden Sie die Antragsunterlagen hoch und reichen Sie den
        Antrag zur weiteren Prüfung ein. Nach erfolgreicher Übermittlung folgt eine Weiterleitung in
        die Detailansicht.
      </p>

      {programsError ? (
        <div
          className="form-feedback form-feedback--error"
          role="alert"
          data-testid="application-programs-error"
        >
          {programsError}
        </div>
      ) : null}

      <form
        className="application-form"
        noValidate
        onSubmit={handleSubmit}
        aria-describedby={submitError ? 'application-submit-error' : undefined}
      >
        <div className="application-form-grid">
          <ApplicantNameField
            value={formState.applicantName}
            onChange={handleFieldChange('applicantName')}
            error={fieldErrors.applicantName}
            disabled={isSubmitting}
          />
          <ApplicantEmailField
            value={formState.applicantEmail}
            onChange={handleFieldChange('applicantEmail')}
            error={fieldErrors.applicantEmail}
            disabled={isSubmitting}
          />
        </div>

        <div className="application-form-grid">
          <ProgramSelect
            programs={programs}
            isLoading={isLoading}
            error={fieldErrors.programId}
            value={formState.programId}
            onChange={handleFieldChange('programId')}
            currencyFormatter={currencyFormatter}
            disabled={isSubmitting}
          />
          <AmountInput
            value={formState.amount}
            onChange={handleFieldChange('amount')}
            error={fieldErrors.amount}
            disabled={isSubmitting}
            inlineHint={minAmountHint}
          />
        </div>

        <PurposeTextarea
          value={formState.purpose}
          onChange={handleFieldChange('purpose')}
          error={fieldErrors.purpose}
          disabled={isSubmitting}
          inlineHint="Beschreiben Sie das Vorhaben und die geplanten Maßnahmen für die Förderung."
        />

        <FileUploadField
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
          error={fieldErrors.file}
          disabled={isSubmitting}
        />

        {submitError ? (
          <div
            className="form-feedback form-feedback--error"
            id="application-submit-error"
            role="alert"
            aria-live="assertive"
            data-testid="application-submit-error"
          >
            {submitError}
          </div>
        ) : null}

        <SubmitButton label={submitLabel} disabled={isSubmitting} />
      </form>
    </section>
);
}