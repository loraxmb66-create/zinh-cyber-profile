import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { coupons } from '@/lib/shop-data';

export async function GET() {
  try {
    const data = await prisma.coupon.findMany({ where: { isActive: true } });
    return NextResponse.json({ coupons: data });
  } catch {
    return NextResponse.json({ coupons, mode: 'fallback' });
  }
}
