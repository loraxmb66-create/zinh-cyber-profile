import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const encoder = new TextEncoder();
const cookieName = 'lorax_session';

function secret() {
  return encoder.encode(process.env.JWT_SECRET ?? 'dev-lorax-secret-change-me');
}

export async function createSession(payload: { sub: string; role: string; username: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret());
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, secret());
  return payload as { sub: string; role: string; username: string };
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function getCurrentSession() {
  const store = await cookies();
  const token = store.get(cookieName)?.value;
  if (!token) return null;
  try {
    return await verifySession(token);
  } catch {
    return null;
  }
}
