import { http, HttpResponse } from 'msw';

import {
  createApplication,
  findApplication,
  listApplications,
  updateApplication
} from '../db';
import {
  badRequest,
  notFound,
  ok,
  readJsonBody,
  withNetworkSimulation
} from '../utils';

interface CreateApplicationPayload {
  applicantName: string;
  applicantEmail: string;
  programId: string;
  amount: number;
  purpose: string;
}

interface UpdateApplicationPayload {
  status?: 'submitted' | 'review' | 'approved' | 'rejected';
  amount?: number;
  purpose?: string;
  comments?: {
    id: string;
    authorRole: 'applicant' | 'officer';
    message: string;
    createdAt: string;
  }[];
}

export const applicationHandlers = [
  http.get('/applications', async ({ request }) =>
    withNetworkSimulation(request, () => ok(listApplications()))
  ),

  http.get('/applications/:id', async ({ request, params }) =>
    withNetworkSimulation(request, () => {
      const applicationId = String(params['id'] ?? '');
      const application = findApplication(applicationId);

      if (!application) {
        return notFound('Antrag wurde nicht gefunden.');
      }

      return HttpResponse.json(application);
    })
  ),

  http.post('/applications', async ({ request }) =>
    withNetworkSimulation(request, async () => {
      const body = await readJsonBody<CreateApplicationPayload>(request);

      if (
        !body?.applicantName ||
        !body.applicantEmail ||
        !body.programId ||
        typeof body.amount !== 'number' ||
        body.amount <= 0 ||
        !body.purpose
      ) {
        return badRequest(
          'Bitte alle notwendigen Felder (Name, E-Mail, Programm, Betrag, Zweck) ausfüllen.'
        );
      }

      const created = createApplication({
        applicantName: body.applicantName,
        applicantEmail: body.applicantEmail,
        programId: body.programId,
        amount: body.amount,
        purpose: body.purpose
      });

      return HttpResponse.json(created, { status: 201 });
    })
  ),

  http.patch('/applications/:id', async ({ request, params }) =>
    withNetworkSimulation(request, async () => {
      const updates = await readJsonBody<UpdateApplicationPayload>(request);

      if (!updates || Object.keys(updates).length === 0) {
        return badRequest('Keine Änderungen übermittelt.');
      }

      const applicationId = String(params['id'] ?? '');
      const updated = updateApplication(applicationId, updates);

      if (!updated) {
        return notFound('Antrag wurde nicht gefunden.');
      }

      return HttpResponse.json(updated);
    })
  ),
  http.post('/upload', async ({ request }) =>
    withNetworkSimulation(request, () => ok({ ok: true }))
  ),
];