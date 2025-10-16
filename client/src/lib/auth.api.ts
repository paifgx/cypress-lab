import { DEFAULT_API_BASE } from './auth.constants';
import type { AuthUser, LoginCredentials, StoredSession, UserRole } from './auth.types';
import { isAuthUser } from './auth.types';

export function resolveApiUrl(pathname: string): string {
  const mockFlag = String(import.meta.env['VITE_API_MOCKING'] ?? 'on').toLowerCase();

  if (mockFlag !== 'off') {
    return pathname;
  }

  const providedBase = String(import.meta.env['VITE_API_URL'] ?? DEFAULT_API_BASE).trim();

  if (!providedBase) {
    return pathname;
  }

  const normalizedBase = providedBase.endsWith('/') ? providedBase.slice(0, -1) : providedBase;
  return `${normalizedBase}${pathname}`;
}

export async function fetchSessionSnapshot(
  token: string,
  signal?: AbortSignal
): Promise<StoredSession> {
  const requestInit: RequestInit = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  if (signal) {
    requestInit.signal = signal;
  }

  const response = await fetch(resolveApiUrl('/auth/me'), requestInit);

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  const payload = await response.json();
  return normalizeAuthResponse(payload);
}

export async function performLoginRequest(credentials: LoginCredentials): Promise<StoredSession> {
  const response = await fetch(resolveApiUrl('/auth/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: credentials.username.trim(),
      password: credentials.password
    })
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  const payload = await response.json();
  return normalizeAuthResponse(payload);
}

export async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.clone().json();
    const message = body?.error?.message;
    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }
  } catch {
    // ignore silently
  }

  if (response.status >= 500) {
    return 'Serverfehler. Bitte versuchen Sie es in Kürze erneut.';
  }

  if (response.status === 401 || response.status === 403) {
    return 'Ungültige Zugangsdaten.';
  }

  return 'Anfrage fehlgeschlagen. Bitte prüfen Sie Ihre Eingaben.';
}

function normalizeAuthResponse(payload: unknown): StoredSession {
  const data = (payload ?? {}) as {
    token?: unknown;
    role?: unknown;
    user?: unknown;
  };

  const sourceUserRaw = (data.user ?? {}) as Partial<AuthUser> & { token?: unknown };
  const tokenFromPayload = typeof data.token === 'string' ? data.token : '';
  const tokenFromUser = typeof sourceUserRaw.token === 'string' ? sourceUserRaw.token : '';
  const resolvedToken = tokenFromPayload || tokenFromUser;

  if (resolvedToken.length === 0) {
    throw new Error('Antwort enthält kein gültiges Token.');
  }

  const roleFromPayload = data.role;
  const roleFromUser = sourceUserRaw.role;
  let resolvedRole: UserRole = 'applicant';

  if (roleFromPayload === 'officer' || roleFromPayload === 'applicant') {
    resolvedRole = roleFromPayload;
  } else if (roleFromUser === 'officer' || roleFromUser === 'applicant') {
    resolvedRole = roleFromUser;
  }

  const resolvedUserCandidate: AuthUser = {
    id:
      typeof sourceUserRaw.id === 'string' && sourceUserRaw.id.trim().length > 0
        ? sourceUserRaw.id
        : typeof sourceUserRaw.username === 'string' && sourceUserRaw.username.trim().length > 0
          ? sourceUserRaw.username
          : 'unknown',
    username: typeof sourceUserRaw.username === 'string' ? sourceUserRaw.username : '',
    displayName:
      typeof sourceUserRaw.displayName === 'string'
        ? sourceUserRaw.displayName
        : typeof sourceUserRaw.username === 'string'
          ? sourceUserRaw.username
          : '',
    role: resolvedRole
  };

  if (!isAuthUser(resolvedUserCandidate)) {
    throw new Error('Antwort enthält keinen gültigen Benutzer.');
  }

  return {
    token: resolvedToken,
    user: resolvedUserCandidate
  };
}