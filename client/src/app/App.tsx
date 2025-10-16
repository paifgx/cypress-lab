import type { ReactElement } from 'react';
import { useMemo, useState, useEffect } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';

import {
  ApplicationDetail,
  ApplicationNew,
  BackofficeDetail,
  BackofficeList,
  Landing,
  Login,
  NotFound,
  Programs,
} from '@/routes';
import { RequireRole, useAuth, AuthProvider } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';

const navLinkClassName = (isActive: boolean): string =>
  isActive ? 'app-nav-link app-nav-link--active' : 'app-nav-link';

function App(): ReactElement {
  const { user, status, logout, hasRole } = useAuth();

  const isAuthenticated = status === 'authenticated' && Boolean(user);
  const isApplicant = hasRole('applicant');
  const isOfficer = hasRole('officer');

  const roleLabel = useMemo(() => {
    if (!user) {
      return null;
    }
    return user.role === 'officer' ? 'Sachbearbeiter*in' : 'Antragsteller*in';
  }, [user]);

  const timestamp = useMemo(() => {
    const generatedAt = new Date();
    return {
      iso: generatedAt.toISOString(),
      year: generatedAt.getFullYear(),
    };
  }, []);

  const [simDelay, setSimDelay] = useState<string>('');
  const [simError, setSimError] = useState<string>('');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (simDelay) params.set('__delay', simDelay);
    else params.delete('__delay');
    if (simError) params.set('__error', simError);
    else params.delete('__error');
    const newSearch = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`);
  }, [simDelay, simError]);

  const { lang, setLang, t } = useI18n();

  return (
    <BrowserRouter>
      <AuthProvider>
      <div className="app-shell" data-testid="app-shell">
        <header className="app-header" data-testid="app-header">
          <div className="app-header-meta">
            <h1 className="app-title">KfW Mini-Förderportal</h1>
            <p className="app-subtitle">
              Deterministic training environment for Cypress exercises
            </p>
          </div>

          <div className="app-header-controls">
            <div className="app-primary-controls" data-testid="app-primary-controls">
              <div className="app-primary-copy">
                <span className="app-primary-kicker">Interface language</span>
                <span className="app-primary-description">
                  Switch the portal language instantly across the experience.
                </span>
              </div>
              <label data-testid="language-select-label" className="app-language-control">
                <span className="app-field-label">Language</span>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Language)}
                  data-testid="language-select"
                >
                  <option value="de">Deutsch</option>
                  <option value="en">English</option>
                </select>
              </label>
            </div>
            <details
              className="app-advanced-controls"
              data-testid="app-advanced-controls"
              open={Boolean(simDelay) || Boolean(simError)}
            >
              <summary>
                <span className="app-advanced-title">Advanced simulator settings</span>
                <span className="app-advanced-subtitle">
                  Adjust response delay or simulate API errors.
                </span>
              </summary>
              <div className="app-advanced-content">
                <label className="app-advanced-field" data-testid="simulation-delay">
                  <span className="app-field-label">Global delay (ms)</span>
                  <input
                    type="number"
                    value={simDelay}
                    onChange={(e) => setSimDelay(e.target.value)}
                    data-testid="simulation-delay-input"
                  />
                </label>
                <label className="app-advanced-field" data-testid="simulation-error">
                  <span className="app-field-label">Simulated error (status code)</span>
                  <input
                    type="number"
                    value={simError}
                    onChange={(e) => setSimError(e.target.value)}
                    data-testid="simulation-error-input"
                  />
                </label>
              </div>
            </details>
            <nav
              className="app-nav"
              data-testid="app-nav"
              aria-label="Hauptnavigation"
            >
              <ul className="app-nav-list">
                <li>
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) => navLinkClassName(isActive)}
                    data-testid="nav-link-landing"
                  >
                    {t('landing')}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/programs"
                    className={({ isActive }) => navLinkClassName(isActive)}
                    data-testid="nav-link-programs"
                  >
                    {t('programs')}
                  </NavLink>
                </li>
                {!isAuthenticated ? (
                  <li>
                    <NavLink
                      to="/login"
                      className={({ isActive }) => navLinkClassName(isActive)}
                      data-testid="nav-link-login"
                    >
                      {t('login')}
                    </NavLink>
                  </li>
                ) : null}
                {isApplicant ? (
                  <li>
                    <NavLink
                      to="/applications/new"
                      className={({ isActive }) => navLinkClassName(isActive)}
                      data-testid="nav-link-application-new"
                    >
                      {t('applicationNew')}
                    </NavLink>
                  </li>
                ) : null}
                {isOfficer ? (
                  <li>
                    <NavLink
                      to="/backoffice/applications"
                      className={({ isActive }) => navLinkClassName(isActive)}
                      data-testid="nav-link-backoffice-list"
                    >
                      {t('backoffice')}
                    </NavLink>
                  </li>
                ) : null}
              </ul>
            </nav>

            <div className="app-auth-panel" data-testid="app-auth-panel">
              {status === 'loading' ? (
                <span data-testid="app-auth-status">Sitzung wird geprüft …</span>
              ) : isAuthenticated && user ? (
                <div className="app-authenticated" data-testid="app-authenticated">
                  <span className="app-auth-name" data-testid="app-auth-name">
                    {user.displayName}
                  </span>
                  <span className="app-auth-role" data-testid="app-auth-role">
                    {roleLabel ?? user.role}
                  </span>
                  <button
                    className="app-auth-logout"
                    type="button"
                    onClick={logout}
                    data-testid="app-auth-logout"
                  >
                    Abmelden
                  </button>
                </div>
              ) : (
                <span data-testid="app-auth-status">Nicht angemeldet</span>
              )}
            </div>
          </div>
        </header>

        <main className="app-main" data-testid="app-main">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/applications/new"
              element={
                <RequireRole roles="applicant">
                  <ApplicationNew />
                </RequireRole>
              }
            />
            <Route
              path="/applications/:applicationId"
              element={
                <RequireRole roles="applicant">
                  <ApplicationDetail />
                </RequireRole>
              }
            />
            <Route
              path="/backoffice/applications"
              element={
                <RequireRole roles="officer">
                  <BackofficeList />
                </RequireRole>
              }
            />
            <Route
              path="/backoffice/applications/:applicationId"
              element={
                <RequireRole roles="officer">
                  <BackofficeDetail />
                </RequireRole>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="app-footer" data-testid="app-footer">
          <div className="app-meta" data-testid="app-footer-meta">
            <span>Build baseline generated:</span>
            <time dateTime={timestamp.iso}>{timestamp.iso}</time>
          </div>
          <small>&copy; {timestamp.year} Patrik Garten</small>
        </footer>
      </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;