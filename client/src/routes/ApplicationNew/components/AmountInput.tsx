import type { ChangeEvent } from 'react';

interface AmountInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  error?: string | undefined;
  disabled: boolean;
  inlineHint: string;
}

export function AmountInput({
  value,
  onChange,
  error,
  disabled,
  inlineHint,
}: AmountInputProps) {
  return (
    <div className="application-field">
      <label className="application-label" htmlFor="application-amount">
        Förderbetrag (in Euro)
      </label>
      <input
        className="application-input"
        id="application-amount"
        name="amount"
        type="text"
        inputMode="decimal"
        placeholder="z. B. 25.000"
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'application-amount-error' : undefined}
        data-testid="application-amount"
      />
      <span className="application-inline-hint">{inlineHint}</span>
      {error ? (
        <p
          className="field-error"
          id="application-amount-error"
          role="alert"
          data-testid="application-amount-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}