import type { ReactElement } from 'react';
import { usePrograms } from './ApplicationNew/hooks/usePrograms';

function Programs(): ReactElement {
  const { programs, isLoading, error } = usePrograms();
  const currencyFormatter = new Intl.NumberFormat('de-DE');

  return (
    <section className="app-card" data-testid="programs-page">
      <header className="page-header">
        <h2 data-testid="programs-title">Programme</h2>
        <p data-testid="programs-subtitle">
          Übersicht aller verfügbaren Förderprogramme.
        </p>
      </header>

      <p data-testid="programs-description">
        Diese Seite lädt eine Programmliste via <code>GET /programs</code> vom Express-Proxy
        und rendert die Ergebnisse in einer kompakten Übersicht.
      </p>

      {isLoading ? (
        <div data-testid="programs-loading" className="page-placeholder">
          Programme werden geladen …
        </div>
      ) : error ? (
        <p data-testid="programs-error" className="field-error" role="alert">
          {error}
        </p>
      ) : (
        <ul data-testid="programs-list">
          {programs.map((program) => (
            <li key={program.id} data-testid="programs-item">
              {program.name} ({currencyFormatter.format(program.amountMin)} € –{' '}
              {currencyFormatter.format(program.amountMax)} €)
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Programs;