import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BACKEND_API_URL, SESSION_COOKIE } from '@/lib/config';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    try {
      await fetch(`${BACKEND_API_URL}/admin/logout`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Ignore backend logout errors; still clear local session.
    }
  }

  const response = NextResponse.json({ ok: true, message: 'Logged out' });
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
