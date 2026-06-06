import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    openapi: '3.1.0',
    info: {
      title: 'LORAX HUB API',
      version: '1.0.0',
      description: 'REST API for AI chat, short links, QR, files, visitors, status, FiveM and Telegram.'
    },
    paths: {
      '/api/auth/login': { post: { summary: 'Admin login with JWT cookie' } },
      '/api/ai/chat': { post: { summary: 'Streaming AI response proxy' } },
      '/api/links': { get: { summary: 'List short links' }, post: { summary: 'Create short link' } },
      '/api/qr': { post: { summary: 'Generate QR PNG data URL or SVG' } },
      '/api/files': { get: { summary: 'List files' }, post: { summary: 'Create file metadata' } },
      '/api/visitors': { get: { summary: 'Visitor analytics' }, post: { summary: 'Track visitor' } },
      '/api/status': { get: { summary: 'API status center' } },
      '/api/fivem/status': { get: { summary: 'FiveM server status' } },
      '/api/telegram/accounts': { get: { summary: 'Telegram account list' } }
    }
  });
}
