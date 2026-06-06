import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from './rate-limit';

export function guarded(request: NextRequest, limit = 60) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'local';
  const result = rateLimit(ip, limit);
  if (!result.ok) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }
  return null;
}
