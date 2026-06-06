import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createOrderCode } from '@/lib/shop-data';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ orders: [], mode: 'fallback' });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const code = createOrderCode();
  try {
    const order = await prisma.order.create({
      data: {
        code,
        customerName: body.customer.fullName,
        phone: body.customer.phone,
        email: body.customer.email,
        address: body.customer.address,
        note: body.customer.note,
        subtotal: body.subtotal,
        discount: body.discount,
        total: body.total,
        couponCode: body.couponCode,
        paymentMethod: body.paymentMethod,
        items: {
          create: body.items.map((item: { id: string; name: string; price: number; quantity: number; imageUrl?: string }) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl
          }))
        }
      },
      include: { items: true }
    });
    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ order: { ...body, code, status: 'PENDING', createdAt: new Date().toISOString() }, mode: 'fallback' }, { status: 201 });
  }
}
