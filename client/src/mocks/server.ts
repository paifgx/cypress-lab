import { setupServer } from 'msw/node';

import { handlers } from './handlers';
import { seedDb } from './db';

export const server = setupServer(...handlers);

export function startServer() {
  seedDb();
  server.listen({ onUnhandledRequest: 'warn' });
  return server;
}

export function closeServer() {
  server.close();
}

export function resetHandlers() {
  server.resetHandlers();
}