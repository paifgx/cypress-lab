import type { ReactElement, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import type { UserRole } from './auth.types';
import { useAuth } from './auth.context';

interface RequireAuthProps {
  readonly children: ReactNode;
  readonly allowedRoles?: UserRole | UserRole[];
  readonly fallback?: ReactNode;
}

export function RequireAuth({
  children,
  allowedRoles,
  fallback,
}: RequireAuthProps): ReactElement {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="app-card" data-testid="auth-loading">
        <p>Authentifizierung wird geprüft …</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: `${location.pathname}${location.search}${location.hash}`,
        }}
      />
    );
  }

  if (allowedRoles) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(user.role)) {
      if (fallback) {
        return <>{fallback}</>;
      }
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}

export function RequireRole({
  children,
  roles,
  fallback,
}: {
  readonly children: ReactNode;
  readonly roles: UserRole | UserRole[];
  readonly fallback?: ReactNode;
}): ReactElement {
  return (
    <RequireAuth allowedRoles={roles} fallback={fallback}>
      {children}
    </RequireAuth>
  );
}