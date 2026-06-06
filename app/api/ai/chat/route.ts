import { NextRequest } from 'next/server';
import { guarded } from '@/lib/http';

export async function POST(request: NextRequest) {
  const limited = guarded(request, 20);
  if (limited) return limited;

  const { message } = await request.json();
  const encoder = new TextEncoder();
  const upstream = process.env.CUSTOM_AI_API_URL;

  if (upstream) {
    const response = await fetch(upstream, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.CUSTOM_AI_API_KEY ? `Bearer ${process.env.CUSTOM_AI_API_KEY}` : ''
      },
      body: JSON.stringify({ message })
    });
    return new Response(response.body, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const chunks = [
        'LORAX AI online.\n\n',
        `Received: ${message ?? 'empty message'}\n\n`,
        '```ts\n',
        'export const status = "streaming-ready";\n',
        '```\n'
      ];
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
        await new Promise((resolve) => setTimeout(resolve, 120));
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
