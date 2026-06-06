import { NextRequest, NextResponse } from 'next/server';
import { guarded } from '@/lib/http';

export async function GET(request: NextRequest) {
  const limited = guarded(request, 120);
  if (limited) return limited;
  return NextResponse.json({
    name: 'LORAX Roleplay',
    online: 84,
    maxPlayers: 128,
    ping: 72,
    discordUrl: 'https://discord.com',
    connectUrl: 'fivem://connect/127.0.0.1:30120',
    players: ['Lorax', 'Admin', 'Medic_01', 'Police_07']
  });
}
