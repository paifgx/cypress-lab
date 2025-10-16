import type { ReactElement, ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  type AuthSessionSnapshot,
  type LoginCredentials,
  type AuthContextValue,
} from './auth.types';
import { fetchSessionSnapshot, performLoginRequest } from './auth.api';
import {
  clearStoredSession,
  persistSession,
  readStoredSession,
} from './auth.storage';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const INITIAL_SESSION: AuthSessionSnapshot = {
  status: 'loading',
  user: null,
  token: null,
  error: null,
};

interface AuthProviderProps {
  readonly children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): ReactElement {
  const [session, setSession] = useState<AuthSessionSnapshot>(INITIAL_SESSION);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = readStoredSession();
    if (!stored) {
      setSession({
        status: 'unauthenticated',
        user: null,
        token: null,
        error: null,
      });
      return;
    }

    const controller = new AbortController();

    setSession((prev) => ({
      ...prev,
      status: 'loading',
    }));

    const hydrateSession = async (): Promise<void> => {
      try {
        const normalized = await fetchSessionSnapshot(
          stored.token,
          controller.signal,
        );

        if (controller.signal.aborted) {
          return;
        }

        persistSession(normalized);

        setSession({
          status: 'authenticated',
          user: normalized.user,
          token: normalized.token,
          error: null,
        });
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === 'AbortError'
        ) {
          return;
        }

        clearStoredSession();

        const message =
          error instanceof Error && error.message ? error.message : null;

        setSession({
          status: 'unauthenticated',
          user: null,
          token: null,
          error: message,
        });
      }
    };

    void hydrateSession();

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorage = (): void => {
      const next = readStoredSession();
      if (!next) {
        setSession({
          status: 'unauthenticated',
          user: null,
          token: null,
          error: null,
        });
        return;
      }

      setSession({
        status: 'authenticated',
        user: next.user,
        token: next.token,
        error: null,
      });
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsAuthenticating(true);
      setSession((prev) => ({ ...prev, error: null }));

      try {
        const normalized = await performLoginRequest(credentials);

        persistSession(normalized);

        setSession({
          status: 'authenticated',
          user: normalized.user,
          token: normalized.token,
          error: null,
        });

        return normalized.user;
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : 'Login fehlgeschlagen. Bitte versuchen Sie es erneut.';

        clearStoredSession();

        setSession({
          status: 'unauthenticated',
          user: null,
          token: null,
          error: message,
        });

        throw new Error(message);
      } finally {
        setIsAuthenticating(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    clearStoredSession();

    setSession({
      status: 'unauthenticated',
      user: null,
      token: null,
      error: null,
    });
  }, []);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user: session.user,
      token: session.token,
      status: session.status,
      error: session.error,
      isAuthenticating,
      login,
      logout,
      hasRole: (roles) => {
        const candidate = session.user?.role;
        if (!candidate) {
          return false;
        }

        const roleList = Array.isArray(roles) ? roles : [roles];
        return roleList.includes(candidate);
      },
    }),
    [session, isAuthenticating, login, logout],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}