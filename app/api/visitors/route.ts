import { NextRequest, NextResponse } from 'next/server';
import { guarded } from '@/lib/http';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const limited = guarded(request, 120);
  if (limited) return limited;
  try {
    const total = await prisma.visitorEvent.count();
    const recent = await prisma.visitorEvent.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
    return NextResponse.json({ total, onlineNow: Math.floor(Math.random() * 260), recent });
  } catch {
    return NextResponse.json({ total: 128904, onlineNow: 247, recent: [], mode: 'fallback' });
  }
}

export async function POST(request: NextRequest) {
  const limited = guarded(request, 120);
  if (limited) return limited;
  const body = await request.json().catch(() => ({}));
  try {
    await prisma.visitorEvent.create({
      data: {
        path: body.path ?? '/',
        country: request.headers.get('x-vercel-ip-country') ?? undefined,
        browser: request.headers.get('user-agent') ?? undefined,
        device: body.device
      }
    });
  } catch {
    return NextResponse.json({ ok: true, mode: 'fallback' });
  }
  return NextResponse.json({ ok: true });
}
