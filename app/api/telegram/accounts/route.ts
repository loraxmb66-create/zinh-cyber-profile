import { NextRequest, NextResponse } from 'next/server';
import { guarded } from '@/lib/http';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const limited = guarded(request, 120);
  if (limited) return limited;
  const accounts = await prisma.telegramAccount.findMany({ orderBy: { updatedAt: 'desc' }, take: 50 });
  return NextResponse.json({ accounts });
}
