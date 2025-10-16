import { resolveApiUrl, extractErrorMessage, safeJson } from '../utils';
import type { CreateApplicationPayload, CreatedApplication } from '../types';
import type { SeedApplication } from '../../../mocks/db/domain';

/**
 * Simulates uploading a file to the backend.
 */
export async function simulateUpload(file: File | null): Promise<void> {
  if (!file) {
    throw new Error('Es wurde keine Datei ausgewählt.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(resolveApiUrl('/upload'), {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  const payload = (await safeJson(response)) as { ok?: boolean } | null;
  if (payload?.ok !== true) {
    throw new Error('Der Upload konnte nicht bestätigt werden.');
  }
}

/**
 * Sends a create-application request to the backend.
 */
export async function createApplication(
  payload: CreateApplicationPayload
): Promise<CreatedApplication> {
  const response = await fetch(resolveApiUrl('/applications'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  const data = (await response.json()) as CreatedApplication | null;
  if (!data || typeof data.id !== 'string' || data.id.length === 0) {
    throw new Error('Die Antwort enthält keine Antrags-ID.');
  }

  return data;
}

export async function listApplications(): Promise<SeedApplication[]> {
  const response = await fetch(resolveApiUrl('/applications'));
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
  const data = (await safeJson(response)) as SeedApplication[] | null;
  return data ?? [];
}

export async function getApplication(id: string): Promise<SeedApplication> {
  const response = await fetch(resolveApiUrl(`/applications/${id}`));
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
  const data = (await safeJson(response)) as SeedApplication;
  if (!data) {
    throw new Error('Application not found');
  }
  return data;
}

export async function updateApplication(
  id: string,
  updates: Partial<Pick<SeedApplication, 'status' | 'amount' | 'purpose' | 'comments'>>
): Promise<SeedApplication> {
  const response = await fetch(resolveApiUrl(`/applications/${id}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
  const data = (await safeJson(response)) as SeedApplication;
  if (!data) {
    throw new Error('Application not found');
  }
  return data;
}