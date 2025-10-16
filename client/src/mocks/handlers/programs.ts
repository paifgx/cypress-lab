import { http, HttpResponse } from 'msw';

import { listPrograms, updateProgram } from '../db';
import { ok, badRequest, notFound, readJsonBody, withNetworkSimulation } from '../utils';

export const programHandlers = [
  http.get('/programs', async ({ request }) =>
    withNetworkSimulation(request, () => ok(listPrograms()))
  ),

  http.patch('/programs/:id', async ({ request, params }) =>
    withNetworkSimulation(request, async () => {
      const updates = await readJsonBody<Partial<{
        name?: string;
        summary?: string;
        description?: string;
        amountMin?: number;
        amountMax?: number;
        tags?: string[];
      }>>(request);

      if (!updates || Object.keys(updates).length === 0) {
        return badRequest('Keine Änderungen übermittelt.');
      }

      const programId = String(params['id'] ?? '');
      const updated = updateProgram(programId, updates);

      if (!updated) {
        return notFound('Programm wurde nicht gefunden.');
      }

      return HttpResponse.json(updated);
    })
  )
];