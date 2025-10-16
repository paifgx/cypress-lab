import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from '@/app/App';
import { AuthProvider } from '@/lib/auth';
import { I18nProvider } from '@/lib/i18n';

import '@/styles/global.css';
import { worker } from './mocks/browser';

async function enableMocking() {
  // The worker is started only in development to avoid interferences with E2E tests.
  if (import.meta.env.DEV) {
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
  return Promise.resolve();
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AuthProvider>
        <I18nProvider>
          <App />
        </I18nProvider>
      </AuthProvider>
    </StrictMode>,
  );
});
