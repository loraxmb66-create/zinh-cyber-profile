import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { createSession, setSessionCookie } from '@/lib/auth';
import { guarded } from '@/lib/http';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional()
});

export async function POST(request: NextRequest) {
  const limited = guarded(request, 10);
  if (limited) return limited;

  const body = schema.parse(await request.json());
  const passwordHash = await bcrypt.hash(body.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        passwordHash,
        fullName: body.fullName,
        phone: body.phone,
        address: body.address
      }
    });
    const token = await createSession({ sub: user.id, role: user.role, username: user.username });
    await setSessionCookie(token);
    return NextResponse.json({ user: { id: user.id, email: user.email, username: user.username, role: user.role } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Cannot create user. Email or username may already exist.' }, { status: 400 });
  }
}
