import type { ChangeEvent } from 'react';

interface PurposeTextareaProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  error: string | undefined;
  disabled: boolean;
  inlineHint: string;
}

export function PurposeTextarea({
  value,
  onChange,
  error,
  disabled,
  inlineHint,
}: PurposeTextareaProps) {
  return (
    <div className="application-field">
      <label className="application-label" htmlFor="application-purpose">
        Verwendungszweck
      </label>
      <textarea
        className="application-textarea"
        id="application-purpose"
        name="purpose"
        rows={6}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'application-purpose-error' : undefined}
        data-testid="application-purpose"
      />
      <span className="application-inline-hint">{inlineHint}</span>
      {error ? (
        <p
          className="field-error"
          id="application-purpose-error"
          role="alert"
          data-testid="application-purpose-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}