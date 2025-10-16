import { resolveApiUrl, extractErrorMessage, safeJson } from '../utils';
import { normalizePrograms } from '../utils';
import type { ProgramOption } from '../types';

/**
 * Fetches program options from the API and normalizes them.
 * @param signal Optional AbortSignal to cancel the request.
 */
export async function fetchPrograms(signal?: AbortSignal): Promise<ProgramOption[]> {
  const response = await fetch(resolveApiUrl('/programs'), { signal: signal ?? null });
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
  const payload = await safeJson(response);
  return normalizePrograms(payload);
}