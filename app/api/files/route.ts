import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guarded } from '@/lib/http';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  name: z.string(),
  mimeType: z.string(),
  size: z.number().int().positive(),
  url: z.string().url()
});

export async function GET(request: NextRequest) {
  const limited = guarded(request, 120);
  if (limited) return limited;
  try {
    const files = await prisma.fileAsset.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ files: [], mode: 'fallback', warning: 'Database unavailable' });
  }
}

export async function POST(request: NextRequest) {
  const limited = guarded(request, 40);
  if (limited) return limited;
  const body = schema.parse(await request.json());
  try {
    const file = await prisma.fileAsset.create({ data: body });
    return NextResponse.json({ file }, { status: 201 });
  } catch {
    return NextResponse.json({ file: { ...body, id: crypto.randomUUID() }, mode: 'fallback' }, { status: 201 });
  }
}
