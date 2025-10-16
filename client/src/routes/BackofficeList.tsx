import { useState, useEffect } from 'react';
import type { ChangeEvent, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { listApplications } from './ApplicationNew/services/applicationService';
import type { ApplicationStatus, SeedApplication } from '../mocks/db/domain';

function BackofficeList(): ReactElement {
  const [applications, setApplications] = useState<SeedApplication[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all');

  useEffect(() => {
    async function loadApplications() {
      setIsLoading(true);
      try {
        const data = await listApplications();
        setApplications(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadApplications();
  }, []);

  const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value as ApplicationStatus | 'all');
  };

  const filteredApplications = applications.filter((app) => {
    if (filterStatus === 'all') {
      return true;
    }
    return app.status === filterStatus;
  });

  if (isLoading) {
    return (
      <div className="page-placeholder" data-testid="backoffice-list-loading">
        Lade Anträge …
      </div>
    );
  }

  if (error) {
    return (
      <div className="field-error" role="alert" data-testid="backoffice-list-error">
        {error}
      </div>
    );
  }

  return (
    <section className="app-card" data-testid="backoffice-list-page">
      <header className="page-header">
        <h2 data-testid="backoffice-list-title">Backoffice Übersicht</h2>
        <p data-testid="backoffice-list-subtitle">
          Verwaltung aller eingegangenen Anträge für Sachbearbeiter*innen.
        </p>
      </header>

      <div className="backoffice-filters">
        <label htmlFor="status-filter">Status:</label>
        <select
          id="status-filter"
          value={filterStatus}
          onChange={handleFilterChange}
          data-testid="backoffice-list-status-filter"
        >
          <option value="all">Alle</option>
          <option value="submitted">Eingereicht</option>
          <option value="review">Zur Prüfung</option>
          <option value="approved">Genehmigt</option>
          <option value="rejected">Abgelehnt</option>
        </select>
      </div>

      <table className="backoffice-table" data-testid="backoffice-list-table">
        <thead>
          <tr>
            <th>Antragsteller*in</th>
            <th>Programm</th>
            <th>Betrag</th>
            <th>Status</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {filteredApplications.map((app) => (
            <tr key={app.id} data-testid="backoffice-list-row">
              <td data-testid="backoffice-list-applicant-name">{app.applicantName}</td>
              <td data-testid="backoffice-list-program">{app.programId}</td>
              <td data-testid="backoffice-list-amount">
                {new Intl.NumberFormat('de-DE').format(app.amount)} €
              </td>
              <td data-testid="backoffice-list-status">{app.status}</td>
              <td>
                <Link to={`/backoffice/applications/${app.id}`} data-testid="backoffice-list-detail-link">
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default BackofficeList;