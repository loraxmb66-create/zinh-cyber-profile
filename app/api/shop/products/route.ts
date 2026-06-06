import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { products } from '@/lib/shop-data';

export async function GET() {
  try {
    const data = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ products: data });
  } catch {
    return NextResponse.json({ products, mode: 'fallback' });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const product = await prisma.product.create({ data: body });
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ product: { ...body, id: `prod-${Date.now()}` }, mode: 'fallback' }, { status: 201 });
  }
}
