import type { ChangeEvent } from 'react';

interface ApplicantEmailFieldProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  error: string | undefined;
  disabled: boolean;
}

export function ApplicantEmailField({
  value,
  onChange,
  error,
  disabled,
}: ApplicantEmailFieldProps) {
  return (
    <div className="application-field">
      <label className="application-label" htmlFor="application-applicant-email">
        E-Mail-Adresse
      </label>
      <input
        className="application-input"
        id="application-applicant-email"
        name="applicantEmail"
        type="email"
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'application-applicant-email-error' : undefined}
        data-testid="application-applicant-email"
      />
      {error ? (
        <p
          className="field-error"
          id="application-applicant-email-error"
          role="alert"
          data-testid="application-applicant-email-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}