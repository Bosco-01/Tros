import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://api.trios.com';

// =========================================================================
// RESILIENT LOCAL MOCK DATA DICTIONARY
// This acts as an offline simulation of your backend database!
// =========================================================================
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
    const tokenObj = cookieStore.get('trios_session_token');
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

    // Attempt server-to-server connection to real backend REST API
    const backendResponse = await fetch(targetUrl, requestOptions);

    if (backendResponse.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await backendResponse.json().catch(() => ({}));
    return NextResponse.json(data, { status: backendResponse.status });

  } catch (error) {
    // =========================================================================
    // FUZZY FALLBACK CHECK: Matches 'profile', '/profile', 'admin/profile', etc.
    // =========================================================================
    const cleanPath = urlPath.toLowerCase().trim();
    const fallbackKey = Object.keys(mockFallbacks).find(key => 
      cleanPath === key || 
      cleanPath.endsWith('/' + key) || 
      key.endsWith('/' + cleanPath)
    );

    if (fallbackKey && mockFallbacks[fallbackKey]) {
      console.warn(`[Proxy Fallback Active] Backend server at ${BACKEND_API_URL} is unreachable. Displaying dynamic mock data for path: /admin/${urlPath}`);
      return NextResponse.json(mockFallbacks[fallbackKey], { status: 200 });
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