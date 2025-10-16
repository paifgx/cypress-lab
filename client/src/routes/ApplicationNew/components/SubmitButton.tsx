interface SubmitButtonProps {
  label: string;
  disabled: boolean;
}

export function SubmitButton({ label, disabled }: SubmitButtonProps) {
  return (
    <div className="application-actions">
      <button
        className="application-submit"
        type="submit"
        disabled={disabled}
        data-testid="application-submit"
      >
        {label}
      </button>
    </div>
  );
}