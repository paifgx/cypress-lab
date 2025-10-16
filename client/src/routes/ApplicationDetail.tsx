import type { ReactElement } from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { resolveApiUrl, safeJson, extractErrorMessage } from './ApplicationNew/utils';
import { fetchPrograms } from './ApplicationNew/services/programService';
import type { SeedApplication } from '../mocks/db/domain';
import type { ProgramOption } from './ApplicationNew/types';

function ApplicationDetail(): ReactElement {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [application, setApplication] = useState<SeedApplication | null>(null);
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(resolveApiUrl(`/applications/${applicationId}`), {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(await extractErrorMessage(response));
        }
        const data = (await safeJson(response)) as SeedApplication;
        setApplication(data);

        const progs = await fetchPrograms(controller.signal);
        setPrograms(progs);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [applicationId]);

  return (
    <section className="app-card" data-testid="application-detail-page">
      <header className="page-header">
        <h2 data-testid="application-detail-title">Antragsdetails</h2>
        <p data-testid="application-detail-subtitle">
          Detailansicht für eingereichte Förderanträge inklusive Status und Kommentaren.
        </p>
      </header>

      <p data-testid="application-detail-description">
        Diese Ansicht liest Daten über <code>GET /applications/:id</code>. Sie zeigt sämtliche
        Formularinformationen, den Bearbeitungsstatus und optionale Rückmeldungen.
      </p>

      {isLoading && (
        <div className="page-placeholder" data-testid="application-detail-loading">
          Lade Antragsdaten …
        </div>
      )}
      {error && (
        <div className="field-error" data-testid="application-detail-error">
          {error}
        </div>
      )}
      {!isLoading && !error && application && (
        <>
          <dl className="application-detail-list">
            <div className="application-detail-field">
              <dt data-testid="application-detail-applicant-name-label">Antragsteller*in</dt>
              <dd data-testid="application-detail-applicant-name">{application.applicantName}</dd>
            </div>
            <div className="application-detail-field">
              <dt data-testid="application-detail-applicant-email-label">E-Mail</dt>
              <dd data-testid="application-detail-applicant-email">{application.applicantEmail}</dd>
            </div>
            <div className="application-detail-field">
              <dt data-testid="application-detail-program-label">Förderprogramm</dt>
              <dd data-testid="application-detail-program">
                {programs.find((p) => p.id === application.programId)?.name ??
                  application.programId}
              </dd>
            </div>
            <div className="application-detail-field">
              <dt data-testid="application-detail-amount-label">Betrag</dt>
              <dd data-testid="application-detail-amount">
                {new Intl.NumberFormat('de-DE').format(application.amount)} €
              </dd>
            </div>
            <div className="application-detail-field">
              <dt data-testid="application-detail-purpose-label">Verwendungszweck</dt>
              <dd data-testid="application-detail-purpose">{application.purpose}</dd>
            </div>
            <div className="application-detail-field">
              <dt data-testid="application-detail-status-label">Status</dt>
              <dd data-testid="application-detail-status">{application.status}</dd>
            </div>
          </dl>
          <section
            className="application-detail-comments"
            data-testid="application-detail-comments-section"
          >
            <h3>Kommentare</h3>
            {application.comments.length > 0 ? (
              <ul data-testid="application-detail-comments-list">
                {application.comments.map((comment) => (
                  <li key={comment.id} data-testid="application-detail-comment">
                    <p data-testid="application-detail-comment-author">{comment.authorRole}</p>
                    <p data-testid="application-detail-comment-message">{comment.message}</p>
                    <p data-testid="application-detail-comment-date">{comment.createdAt}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p data-testid="application-detail-comments-empty">
                Keine Kommentare vorhanden.
              </p>
            )}
          </section>
        </>
      )}
    </section>
  );
}

export default ApplicationDetail;