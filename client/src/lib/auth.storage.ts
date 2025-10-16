
import { STORAGE_KEY } from './auth.constants';
import type { StoredSession } from './auth.types';
import { isAuthUser } from './auth.types';

export function readStoredSession(): StoredSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!isStoredSession(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function persistSession(session: StoredSession): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

function isStoredSession(value: unknown): value is StoredSession {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<StoredSession>;

  return (
    typeof candidate.token === 'string' &&
    candidate.token.length > 0 &&
    isAuthUser(candidate.user)
  );
}
