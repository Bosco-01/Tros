import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BACKEND_API_URL, SESSION_COOKIE, USE_MOCK_FALLBACK } from '@/lib/config';

// Safe sandbox defaults to prevent crashes when backend is down
const mockFallbacks: Record<string, any> = {
  'profile': {
    id: '001294',
    name: 'Emmanuel Isiguzo',
    email: 'emmanuel@gmail.com',
    role: 'SUPER_ADMIN',
    is_active: true,
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop'
  },
  'dashboard': {
    total_events: 860,
    total_users: 1450,
    total_vendors: 300,
    total_subscriptions: 705,
    total_bookings: 1080,
    total_revenue: 900000,
    events_trend_pct: -2,
    users_trend_pct: 15,
    vendors_trend_pct: 3,
    subscriptions_trend_pct: 5,
    pending_approvals: 12,
    pending_verifications: 8,
    recent_events: [],
    recent_vendors: []
  },
  'settings': {
    about_company_name: 'Trio',
    about_description: 'Trios is a premier event ticketing and management platform.'
  }
};

async function handleProxy(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
  method: string
) {
  const { path } = await context.params;
  const urlPath = path.join('/');
  const { search } = new URL(request.url);
  const targetUrl = `${BACKEND_API_URL}/admin/${urlPath}${search}`;

  try {
    const cookieStore = await cookies();
    const tokenObj = cookieStore.get(SESSION_COOKIE);
    const token = tokenObj?.value;

    const headers = new Headers();
    headers.set('Accept', 'application/json');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (method !== 'GET' && method !== 'DELETE') {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const bodyText = await request.text();
        requestOptions.body = bodyText;
        headers.set('Content-Type', 'application/json');
      } else {
        const bodyBlob = await request.blob();
        requestOptions.body = bodyBlob;
        headers.set('Content-Type', contentType);
      }
    }

    const backendResponse = await fetch(targetUrl, requestOptions);

    if (backendResponse.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await backendResponse.json().catch(() => ({}));
    return NextResponse.json(data, { status: backendResponse.status });

  } catch (error) {
    if (USE_MOCK_FALLBACK) {
      const cleanPath = urlPath.toLowerCase().trim();

      if (cleanPath.startsWith('settings/') && method === 'PATCH') {
        return NextResponse.json({ success: true, message: 'Mock patch succeeded' }, { status: 200 });
      }

      const fallbackKey = Object.keys(mockFallbacks).find(
        (key) =>
          cleanPath === key ||
          cleanPath.endsWith('/' + key) ||
          key.endsWith('/' + cleanPath),
      );

      if (fallbackKey && mockFallbacks[fallbackKey]) {
        console.warn(`[Proxy Fallback] Endpoint unreachable. Returning simulation payload for: /admin/${urlPath}`);
        return NextResponse.json(mockFallbacks[fallbackKey], { status: 200 });
      }
    }

    console.error('Server Proxy Error:', error);
    return NextResponse.json(
      { message: 'Failed to establish contact with the underlying backend services.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, context, 'GET');
}

export async function POST(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, context, 'POST');
}

export async function PATCH(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, context, 'PATCH');
}

export async function DELETE(request: Request, context: { params: Promise<{ path: string[] }> }) {
  return handleProxy(request, context, 'DELETE');
}