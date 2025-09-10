import type { z } from 'zod';

export function parseBody<T>(schema: z.Schema<T>): (req: Request) => Promise<T> {
  return async (req: Request) => {
    const json = await req.json();
    const result = schema.safeParse(json);
    if (!result.success) {
      const err: any = new Error('Invalid request');
      err.status = 400;
      err.details = result.error.issues;
      throw err;
    }
    return result.data;
  };
}

export function errorResponse(error: unknown, fallbackStatus = 500): Response {
  const anyErr = error as any;
  const status: number = typeof anyErr?.status === 'number' ? anyErr.status : fallbackStatus;
  const payload: Record<string, unknown> = { error: anyErr?.message || 'Internal server error' };
  if (anyErr?.details) payload.details = anyErr.details;
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
