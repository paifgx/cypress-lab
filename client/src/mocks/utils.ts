import { delay, HttpResponse, type DefaultBodyType } from 'msw';

const DEFAULT_DELAY_MS =
  resolvePositiveInteger(
    import.meta.env['VITE_API_DELAY_MS'] ?? import.meta.env['VITE_API_LATENCY_MS']
  ) ?? 0;

type MaybePromise<T> = T | Promise<T>;
type JsonPayload = Parameters<typeof HttpResponse.json>[0];
type AnyHttpResponse = HttpResponse<DefaultBodyType>;

export async function withNetworkSimulation(
  request: Request,
  resolver: () => MaybePromise<AnyHttpResponse>
): Promise<AnyHttpResponse> {
  const simulatedError = simulateErrorResponse(request);

  await applyLatency(request);

  if (simulatedError) {
    return simulatedError;
  }

  return resolver();
}

export async function readJsonBody<T>(
  request: Request
): Promise<T | null> {
  try {
    const text = await request.text();
    if (!text) {
      return null;
    }
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function ok<T extends JsonPayload>(
  payload: T,
  init?: ResponseInit
): HttpResponse<T> {
  return HttpResponse.json<T>(payload, { status: 200, ...init });
}

export function badRequest(
  message: string
): HttpResponse<{ error: { message: string } }> {
  return HttpResponse.json<{ error: { message: string } }>(
    { error: { message } },
    { status: 400, statusText: 'Bad Request' }
  );
}

export function unauthorized(
  message = 'Unauthorized'
): HttpResponse<{ error: { message: string } }> {
  return HttpResponse.json<{ error: { message: string } }>(
    { error: { message } },
    { status: 401, statusText: 'Unauthorized' }
  );
}

export function notFound(
  message: string
): HttpResponse<{ error: { message: string } }> {
  return HttpResponse.json<{ error: { message: string } }>(
    { error: { message } },
    { status: 404, statusText: 'Not Found' }
  );
}

export function serverError(
  message: string
): HttpResponse<{ error: { message: string } }> {
  return HttpResponse.json<{ error: { message: string } }>(
    { error: { message } },
    { status: 500, statusText: 'Internal Server Error' }
  );
}

function simulateErrorResponse(
  request: Request
): HttpResponse<{ error: { statusCode: number; message: string } }> | null {
  const statusOverride = resolvePositiveInteger(
    request.headers.get('x-sim-error') ?? extractQueryParam(request, '__error')
  );

  if (!statusOverride || statusOverride < 400) {
    return null;
  }

  return HttpResponse.json<{
    error: { statusCode: number; message: string };
  }>(
    {
      error: {
        statusCode: statusOverride,
        message: `Simulated ${statusOverride} response`
      }
    },
    {
      status: statusOverride,
      statusText: `Simulated ${statusOverride}`
    }
  );
}

async function applyLatency(request: Request): Promise<void> {
  const override = resolvePositiveInteger(
    request.headers.get('x-sim-delay') ?? extractQueryParam(request, '__delay')
  );

  const latency = override ?? DEFAULT_DELAY_MS;

  if (latency && latency > 0) {
    await delay(latency);
  }
}

function resolvePositiveInteger(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

function extractQueryParam(request: Request, key: string): string | null {
  try {
    const url = new URL(request.url);
    return url.searchParams.get(key);
  } catch {
    return null;
  }
}