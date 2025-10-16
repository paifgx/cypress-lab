import { useState, useEffect } from 'react';
import type { ReactElement, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { getApplication, updateApplication } from './ApplicationNew/services/applicationService';
import type { SeedApplication, SeedComment } from '../mocks/db/domain';

function BackofficeDetail(): ReactElement | null {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [application, setApplication] = useState<SeedApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        if (applicationId) {
          const data = await getApplication(applicationId);
          setApplication(data);
        } else {
          setError('Keine Antrags-ID angegeben.');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [applicationId]);

  const handleStatusChange = async (newStatus: SeedApplication['status']) => {
    if (!application) return;
    setIsUpdating(true);
    try {
      const updated = await updateApplication(application.id, { status: newStatus });
      setApplication(updated);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!application || !comment.trim()) return;
    setIsUpdating(true);
    try {
      const newComment: SeedComment = {
        id: `comment-${Date.now()}`,
        authorRole: 'officer',
        message: comment.trim(),
        createdAt: new Date().toISOString(),
      };
      const updated = await updateApplication(application.id, {
        comments: [...application.comments, newComment],
      });
      setApplication(updated);
      setComment('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-placeholder" data-testid="backoffice-detail-loading">
        Lade Antragsdaten …
      </div>
    );
  }


  if (!application) {
    return null;
  }

  return (
    <section className="app-card" data-testid="backoffice-detail-page">
      {error && (
        <div className="field-error" role="alert" data-testid="backoffice-detail-error">
          {error}
        </div>
      )}
      <header className="page-header">
        <h2 data-testid="backoffice-detail-title">Backoffice Detailansicht</h2>
        <p data-testid="backoffice-detail-subtitle">
          Detailbearbeitung einzelner Förderanträge inklusive Statuswechsel und Kommentaren.
        </p>
      </header>

      <dl className="application-detail-list">
        <div className="application-detail-field">
          <dt>Antragsteller*in</dt>
          <dd data-testid="backoffice-detail-applicant-name">{application.applicantName}</dd>
        </div>
        <div className="application-detail-field">
          <dt>E-Mail</dt>
          <dd data-testid="backoffice-detail-applicant-email">{application.applicantEmail}</dd>
        </div>
        <div className="application-detail-field">
          <dt>Programm</dt>
          <dd data-testid="backoffice-detail-program">{application.programId}</dd>
        </div>
        <div className="application-detail-field">
          <dt>Betrag</dt>
          <dd data-testid="backoffice-detail-amount">
            {new Intl.NumberFormat('de-DE').format(application.amount)} €
          </dd>
        </div>
        <div className="application-detail-field">
          <dt>Verwendungszweck</dt>
          <dd data-testid="backoffice-detail-purpose">{application.purpose}</dd>
        </div>
        <div className="application-detail-field">
          <dt>Status</dt>
          <dd data-testid="backoffice-detail-status">{application.status}</dd>
        </div>
      </dl>

      <div className="application-detail-actions">
        <button
          type="button"
          onClick={() => handleStatusChange('approved')}
          disabled={isUpdating}
          data-testid="backoffice-detail-approve-button"
        >
          Genehmigen
        </button>
        <button
          type="button"
          onClick={() => handleStatusChange('review')}
          disabled={isUpdating}
          data-testid="backoffice-detail-request-button"
        >
          Zur Prüfung
        </button>
        <button
          type="button"
          onClick={() => handleStatusChange('rejected')}
          disabled={isUpdating}
          data-testid="backoffice-detail-reject-button"
        >
          Ablehnen
        </button>
      </div>

      <section className="application-detail-comments" data-testid="backoffice-detail-comments-section">
        <h3>Kommentare</h3>
        {application.comments.length > 0 ? (
          <ul data-testid="backoffice-detail-comments-list">
            {application.comments.map((c) => (
              <li key={c.id} data-testid="backoffice-detail-comment">
                <p data-testid="backoffice-detail-comment-author">{c.authorRole}</p>
                <p data-testid="backoffice-detail-comment-message">{c.message}</p>
                <p data-testid="backoffice-detail-comment-date">{c.createdAt}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p data-testid="backoffice-detail-comments-empty">Keine Kommentare vorhanden.</p>
        )}
        <form onSubmit={handleAddComment} className="application-detail-comment-form">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isUpdating}
            data-testid="backoffice-detail-comment-input"
          />
          <button type="submit" disabled={isUpdating} data-testid="backoffice-detail-comment-submit">
            Kommentar hinzufügen
          </button>
        </form>
      </section>
    </section>
  );
}

export default BackofficeDetail;