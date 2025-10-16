import type { ChangeEvent } from 'react';

interface FileUploadFieldProps {
  selectedFile: File | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error: string | undefined;
  disabled: boolean;
}

export function FileUploadField({
  selectedFile,
  onFileChange,
  error,
  disabled,
}: FileUploadFieldProps) {
  return (
    <div className="application-field">
      <label className="application-label" htmlFor="application-upload">
        Upload der Antragsunterlagen
      </label>
      <input
        className="application-file-input"
        id="application-upload"
        name="upload"
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        onChange={onFileChange}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'application-upload-error' : undefined}
        data-testid="application-upload"
      />
      {selectedFile ? (
        <span className="application-upload-meta" data-testid="application-upload-meta">
          Ausgewählte Datei: {selectedFile.name}
        </span>
      ) : null}
      {error ? (
        <p
          className="field-error"
          id="application-upload-error"
          role="alert"
          data-testid="application-upload-error"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}