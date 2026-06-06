import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guarded } from '@/lib/http';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  targetUrl: z.string().url(),
  slug: z.string().min(3).max(64).regex(/^[a-zA-Z0-9-_]+$/).optional(),
  title: z.string().optional()
});

export async function GET(request: NextRequest) {
  const limited = guarded(request, 120);
  if (limited) return limited;
  try {
    const links = await prisma.shortLink.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
    return NextResponse.json({ links });
  } catch {
    return NextResponse.json({ links: [], mode: 'fallback', warning: 'Database unavailable' });
  }
}

export async function POST(request: NextRequest) {
  const limited = guarded(request, 30);
  if (limited) return limited;
  const body = schema.parse(await request.json());
  const slug = body.slug ?? Math.random().toString(36).slice(2, 9);
  try {
    const link = await prisma.shortLink.create({ data: { slug, targetUrl: body.targetUrl, title: body.title } });
    return NextResponse.json({ link, shortUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/r/${link.slug}` }, { status: 201 });
  } catch {
    return NextResponse.json(
      {
        link: { slug, targetUrl: body.targetUrl, clicks: 0 },
        shortUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin}/r/${slug}`,
        mode: 'fallback',
        warning: 'Database unavailable; link is not persisted'
      },
      { status: 201 }
    );
  }
}
