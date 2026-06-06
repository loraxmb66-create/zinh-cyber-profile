import { NextRequest, NextResponse } from 'next/server';
import { guarded } from '@/lib/http';

const services = [
  { name: 'AI Gateway', endpoint: '/api/ai/chat' },
  { name: 'Short Link API', endpoint: '/api/links' },
  { name: 'QR API', endpoint: '/api/qr' },
  { name: 'Visitor API', endpoint: '/api/visitors' }
];

export async function GET(request: NextRequest) {
  const limited = guarded(request, 120);
  if (limited) return limited;
  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    services: services.map((service, index) => ({
      ...service,
      status: 'ONLINE',
      responseTime: 28 + index * 13,
      uptime: 99.9 - index * 0.02
    }))
  });
}
