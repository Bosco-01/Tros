import { NextResponse } from 'next/server';
import { BACKEND_API_URL, SESSION_COOKIE } from '@/lib/config';

function extractToken(data: Record<string, unknown>): string | null {
  const direct =
    (data.access_token as string) ||
    (data.token as string) ||
    (data.accessToken as string);
  if (direct) return direct;

  const admin = data.admin as Record<string, unknown> | undefined;
  if (admin?.access_token) return admin.access_token as string;

  const user = data.user as Record<string, unknown> | undefined;
  if (user?.access_token) return user.access_token as string;

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    const backendResponse = await fetch(`${BACKEND_API_URL}/admin/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = (await backendResponse.json().catch(() => ({}))) as Record<string, unknown>;

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: (data.message as string) || 'Invalid email or password.' },
        { status: backendResponse.status },
      );
    }

    const token = extractToken(data);
    if (!token) {
      return NextResponse.json(
        { message: 'Login succeeded but no access token was returned.' },
        { status: 500 },
      );
    }

    const response = NextResponse.json({
      ok: true,
      admin: data.admin ?? data.user ?? null,
      message: (data.message as string) || 'Login successful',
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { message: 'Unable to reach authentication service.' },
      { status: 500 },
    );
  }
}
