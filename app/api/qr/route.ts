import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { z } from 'zod';
import { guarded } from '@/lib/http';

const schema = z.object({
  value: z.string().min(1),
  format: z.enum(['png', 'svg']).default('png'),
  dark: z.string().default('#00E5FF'),
  light: z.string().default('#0A0A0A00')
});

export async function POST(request: NextRequest) {
  const limited = guarded(request, 60);
  if (limited) return limited;
  const body = schema.parse(await request.json());

  if (body.format === 'svg') {
    const svg = await QRCode.toString(body.value, { type: 'svg', color: { dark: body.dark, light: body.light } });
    return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
  }

  const dataUrl = await QRCode.toDataURL(body.value, { color: { dark: body.dark, light: body.light }, width: 512 });
  return NextResponse.json({ dataUrl });
}
