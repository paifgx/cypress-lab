import type { ChangeEvent } from 'react';

interface ApplicantNameFieldProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  error: string | undefined;
  disabled: boolean;
}

export function ApplicantNameField({
  value,
  onChange,
  error,
  disabled,
}: ApplicantNameFieldProps) {
  return (
    <div className="application-field">
      <label className="application-label" htmlFor="application-applicant-name">
        Name der antragstellenden Person
      </label>
      <input
        className="application-input"
        id="application-applicant-name"
        name="applicantName"
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'application-applicant-name-error' : undefined}
        data-testid="application-applicant-name"
      />
      {error ? (
        <p
          className="field-error"
          id="application-applicant-name-error"
          role="alert"
          data-testid="application-applicant-name-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}