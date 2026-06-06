import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const link = await prisma.shortLink.findUnique({ where: { slug } });

  if (!link) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  await prisma.shortLink.update({
    where: { id: link.id },
    data: {
      clicks: { increment: 1 },
      events: {
        create: {
          country: request.headers.get('x-vercel-ip-country') ?? undefined,
          browser: request.headers.get('user-agent') ?? undefined
        }
      }
    }
  });

  return NextResponse.redirect(link.targetUrl);
}
