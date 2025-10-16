export type UserRole = 'applicant' | 'officer';

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface StoredSession {
  token: string;
  user: AuthUser;
}

export interface AuthSessionSnapshot {
  status: AuthStatus;
  user: AuthUser | null;
  token: string | null;
  error: string | null;
}

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  status: AuthStatus;
  error: string | null;
  isAuthenticating: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

export function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<AuthUser>;
  const hasValidRole = candidate.role === 'applicant' || candidate.role === 'officer';

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.username === 'string' &&
    typeof candidate.displayName === 'string' &&
    hasValidRole
  );
}