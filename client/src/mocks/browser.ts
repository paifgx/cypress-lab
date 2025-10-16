import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';
import { seedDb } from './db';

export const worker = setupWorker(...handlers);

export async function startWorker() {
  seedDb();

  return worker.start({
    serviceWorker: {
      url: '/mockServiceWorker.js'
    },
    onUnhandledRequest: 'bypass'
  });
}