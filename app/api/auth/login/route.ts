import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSession, setSessionCookie } from '@/lib/auth';
import { guarded } from '@/lib/http';

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

export async function POST(request: NextRequest) {
  const limited = guarded(request, 10);
  if (limited) return limited;

  const body = schema.parse(await request.json());
  const username = process.env.ADMIN_USERNAME ?? 'admin';
  const password = process.env.ADMIN_PASSWORD ?? '123456Dinh';

  if (body.username !== username || body.password !== password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await createSession({ sub: 'admin', role: 'ADMIN', username });
  await setSessionCookie(token);
  return NextResponse.json({ ok: true, role: 'ADMIN' });
}
