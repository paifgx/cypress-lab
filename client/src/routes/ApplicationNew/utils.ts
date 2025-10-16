import type { ProgramOption } from './types';

export function parseAmountInput(value: string): number | null {
  const normalized = value.replace(/\s+/g, '').replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.');
  if (!normalized) return null;
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizePrograms(payload: unknown): ProgramOption[] {
  if (!Array.isArray(payload)) {
    return [];
  }
  return payload
    .map((item: unknown): ProgramOption | null => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return null;
      }
      const record = item as Record<string, unknown>;
      const id = record['id'];
      const name = record['name'];
      if (typeof id !== 'string' || typeof name !== 'string') {
        return null;
      }
      const amountMinValue = Number(record['amountMin'] ?? 0);
      const amountMaxValue = Number(record['amountMax'] ?? amountMinValue);
      const amountMin = Number.isFinite(amountMinValue) ? amountMinValue : 0;
      const amountMax = Number.isFinite(amountMaxValue) ? amountMaxValue : amountMin;
      return { id, name, amountMin, amountMax };
    })
    .filter((prog): prog is ProgramOption => prog !== null)
    .sort((a, b) => a.name.localeCompare(b.name, 'de-DE'));
}

export async function safeJson(response: Response): Promise<unknown | null> {
  try {
    return await response.clone().json();
  } catch {
    return null;
  }
}

export async function extractErrorMessage(response: Response): Promise<string> {
  const result = (await safeJson(response)) as { error?: { message?: string } } | null;
  const raw = result?.error?.message?.trim() ?? response.statusText;
  if (raw) {
    return raw;
  }
  if (response.status >= 500) {
    return 'Serverfehler. Bitte versuchen Sie es später erneut.';
  }
  if (response.status === 400) {
    return 'Die Anfrage war fehlerhaft. Bitte prüfen Sie Ihre Eingaben.';
  }
  return 'Anfrage fehlgeschlagen. Bitte erneut versuchen.';
}

export function resolveApiUrl(pathname: string): string {
  const mockFlag = String(import.meta.env['VITE_API_MOCKING'] ?? 'on').toLowerCase();
  if (mockFlag !== 'off') {
    return pathname;
  }
  const base = String(import.meta.env['VITE_API_URL'] ?? '').trim();
  if (!base) {
    return pathname;
  }
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${normalizedBase}${pathname}`;
}