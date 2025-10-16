import type { ChangeEvent } from 'react';
import type { ProgramOption } from '../types';

interface ProgramSelectProps {
  programs: ProgramOption[];
  isLoading: boolean;
  error: string | undefined;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  currencyFormatter: Intl.NumberFormat;
  disabled: boolean;
}

export function ProgramSelect({
  programs,
  isLoading,
  error,
  value,
  onChange,
  currencyFormatter,
  disabled,
}: ProgramSelectProps) {
  return (
    <div className="application-field">
      <label className="application-label" htmlFor="application-program">
        Förderprogramm
      </label>
      <select
        className="application-select"
        id="application-program"
        name="programId"
        value={value}
        onChange={onChange}
        disabled={disabled || isLoading}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'application-program-error' : undefined}
        data-testid="application-program"
      >
        <option value="">Bitte auswählen …</option>
        {programs.map((program) => (
          <option key={program.id} value={program.id}>
            {program.name} ({currencyFormatter.format(program.amountMin)} € –{' '}
            {currencyFormatter.format(program.amountMax)} €)
          </option>
        ))}
      </select>
      {isLoading ? (
        <span
          className="application-inline-hint"
          role="status"
          data-testid="application-programs-loading"
        >
          Programmliste wird geladen …
        </span>
      ) : null}
      {error ? (
        <p
          className="field-error"
          id="application-program-error"
          role="alert"
          data-testid="application-program-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}