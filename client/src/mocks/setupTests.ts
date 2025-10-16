import { startServer, closeServer, resetHandlers } from './server';
import { resetDb } from './db';

export function setupMockServer() {
  resetDb();
  startServer();
}

export function teardownMockServer() {
  resetHandlers();
  closeServer();
}

export function resetMockState() {
  resetHandlers();
  resetDb();
}