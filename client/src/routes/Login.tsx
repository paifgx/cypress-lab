import type { ChangeEvent, FormEvent, ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '@/lib/auth';

interface LoginFormState {
  username: string;
  password: string;
}

type LoginField = keyof LoginFormState;

interface LoginLocationState {
  from?: string;
}

const QUICK_CREDENTIALS = {
  applicant: {
    username: 'alice',
    password: 'test123'
  },
  officer: {
    username: 'officer',
    password: 'test123'
  }
} as const;

function Login(): ReactElement {
  const [formState, setFormState] = useState<LoginFormState>(() => ({
    username: '',
    password: ''
  }));
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<LoginField, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user, status, isAuthenticating, error: authError } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state as LoginLocationState | null) ?? null;
  const redirectFrom = useMemo(() => locationState?.from ?? null, [locationState]);

  useEffect(() => {
    if (status === 'authenticated' && user) {
      const fallbackDestination =
        user.role === 'officer' ? '/backoffice/applications' : '/applications/new';

      navigate(redirectFrom ?? fallbackDestination, { replace: true });
    }
  }, [navigate, redirectFrom, status, user]);

  const handleFieldChange =
    (field: LoginField) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      const value = event.target.value;
      setFormState((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      setSubmitError(null);
    };

  const validateForm = (state: LoginFormState): Partial<Record<LoginField, string>> => {
    const errors: Partial<Record<LoginField, string>> = {};

    if (!state.username.trim()) {
      errors.username = 'Bitte den Benutzernamen eingeben.';
    }

    if (!state.password.trim()) {
      errors.password = 'Bitte das Passwort eingeben.';
    }

    return errors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const trimmedState: LoginFormState = {
      username: formState.username.trim(),
      password: formState.password
    };

    const errors = validateForm(trimmedState);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const authenticatedUser = await login(trimmedState);

      const destination =
        redirectFrom ??
        (authenticatedUser.role === 'officer'
          ? '/backoffice/applications'
          : '/applications/new');

      navigate(destination, { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('Login fehlgeschlagen. Bitte erneut versuchen.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (role: keyof typeof QUICK_CREDENTIALS): void => {
    const credentials = QUICK_CREDENTIALS[role];
    setFormState({ ...credentials });
    setFieldErrors({});
    setSubmitError(null);
  };

  const aggregatedError = submitError ?? authError ?? null;
  const isBusy = isSubmitting || isAuthenticating || status === 'loading';

  return (
    <section className="app-card" data-testid="login-page">
      <header className="page-header">
        <h2 data-testid="login-title">Login</h2>
        <p data-testid="login-subtitle">
          Anmeldung für Antragsteller*innen und Sachbearbeiter*innen.
        </p>
      </header>

      <p data-testid="login-description">
        Melden Sie sich mit den bereitgestellten Test-Zugangsdaten an. Der Login simuliert die
        Vergabe eines JSON Web Tokens und stellt die Rolle über den globalen Auth-Kontext bereit.
      </p>

      <form
        className="login-form"
        data-testid="login-form"
        noValidate
        onSubmit={handleSubmit}
        aria-describedby={aggregatedError ? 'login-error-message' : undefined}
      >
        <div className="login-form-fields">
          <div className="login-field">
            <label className="login-label" htmlFor="login-username-input">
              Benutzername
            </label>
            <input
              className="login-input"
              id="login-username-input"
              name="username"
              type="text"
              autoComplete="username"
              value={formState.username}
              onChange={handleFieldChange('username')}
              disabled={isBusy}
              aria-invalid={Boolean(fieldErrors.username)}
              aria-describedby={fieldErrors.username ? 'login-username-error' : undefined}
              data-testid="login-username"
            />
            {fieldErrors.username ? (
              <p
                className="field-error"
                id="login-username-error"
                role="alert"
                data-testid="login-username-error"
              >
                {fieldErrors.username}
              </p>
            ) : null}
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="login-password-input">
              Passwort
            </label>
            <input
              className="login-input"
              id="login-password-input"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formState.password}
              onChange={handleFieldChange('password')}
              disabled={isBusy}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
              data-testid="login-password"
            />
            {fieldErrors.password ? (
              <p
                className="field-error"
                id="login-password-error"
                role="alert"
                data-testid="login-password-error"
              >
                {fieldErrors.password}
              </p>
            ) : null}
          </div>
        </div>

        <div className="login-actions">
          <button
            className="login-submit"
            type="submit"
            disabled={isBusy}
            data-testid="login-submit"
          >
            {isBusy ? 'Anmeldung läuft …' : 'Anmelden'}
          </button>
        </div>

        <div className="login-quickfill" data-testid="login-quickfill">
          <span className="login-quickfill-title">Schnellzugang:</span>
          <button
            type="button"
            className="login-quickfill-button"
            onClick={() => handleQuickFill('applicant')}
            disabled={isBusy}
            data-testid="login-fill-applicant"
          >
            Antragsteller*in (alice / test123)
          </button>
          <button
            type="button"
            className="login-quickfill-button"
            onClick={() => handleQuickFill('officer')}
            disabled={isBusy}
            data-testid="login-fill-officer"
          >
            Sachbearbeiter*in (officer / test123)
          </button>
        </div>

        {aggregatedError ? (
          <div
            className="form-feedback form-feedback--error"
            id="login-error-message"
            role="alert"
            aria-live="assertive"
            data-testid="login-error"
          >
            {aggregatedError}
          </div>
        ) : null}
      </form>

      <section className="login-hint" data-testid="login-hint">
        <h3 className="login-hint-title">Hinweise zur Demo-Anmeldung</h3>
        <ul className="login-hint-list">
          <li>
            Antragsteller*innen sehen nur die Antragsstrecke und können neue Förderanträge anlegen.
          </li>
          <li>Sachbearbeiter*innen sehen ausschließlich den Backoffice-Bereich.</li>
          <li>Netzwerk-Fehler lassen sich über die globalen Simulationsparameter reproduzieren.</li>
        </ul>
      </section>
    </section>
  );
}

export default Login;