import { authHandlers } from './auth';
import { programHandlers } from './programs';
import { applicationHandlers } from './applications';

export const handlers = [
  ...authHandlers,
  ...programHandlers,
  ...applicationHandlers
];