import type { ReactElement } from 'react';
import { Link } from 'react-router-dom';

function NotFound(): ReactElement {
  return (
    <section className="app-card" data-testid="not-found-page">
      <header className="page-header">
        <h2 data-testid="not-found-title">Seite nicht gefunden</h2>
        <p data-testid="not-found-subtitle">
          Die angeforderte Route existiert (noch) nicht im Förderportal.
        </p>
      </header>

      <p data-testid="not-found-description">
        Nutze die Navigation oder den folgenden Link, um zurück zur Startseite zu gelangen.
      </p>

      <Link
        to="/"
        className="page-link"
        data-testid="not-found-home-link"
      >
        Zur Landing Page
      </Link>
    </section>
  );
}

export default NotFound;