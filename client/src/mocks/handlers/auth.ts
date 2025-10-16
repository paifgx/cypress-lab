import { http, HttpResponse } from 'msw';

import type { AuthenticatedUser } from '../db/domain';
import {
  authenticateUser,
  snapshot
} from '../db';
import {
  badRequest,
  readJsonBody,
  unauthorized,
  withNetworkSimulation
} from '../utils';

interface LoginPayload {
  username: string;
  password: string;
}

export const authHandlers = [
  http.post('/auth/login', async ({ request }) =>
    withNetworkSimulation(request, async () => {
      const body = await readJsonBody<LoginPayload>(request);
      const { username, password } = body ?? {};

      if (!username || !password) {
        return badRequest('Bitte Benutzername und Passwort übermitteln.');
      }

      const user = authenticateUser(username, password);

      if (!user) {
        return unauthorized('Ungültige Zugangsdaten.');
      }

      return HttpResponse.json({
        user,
        token: user.token,
        role: user.role
      });
    })
  ),

  http.get('/auth/me', async ({ request }) =>
    withNetworkSimulation(request, async () => {
      const authHeader = request.headers.get('authorization') ?? '';

      if (!authHeader.startsWith('Bearer ')) {
        return unauthorized();
      }

      const token = authHeader.replace(/^Bearer\s+/i, '');

      const user = authenticateUserByToken(token);

      if (!user) {
        return unauthorized('Sitzung nicht mehr gültig.');
      }

      return HttpResponse.json({
        user,
        token: user.token,
        role: user.role
      });
    })
  )
];

function authenticateUserByToken(token: string): AuthenticatedUser | null {
  const users: AuthenticatedUser[] = snapshot().users;
  return users.find((candidate) => candidate.token === token) ?? null;
}
