import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://api.trios.com';

async function handleProxy(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
  method: string
) {
  try {
    const { path } = await context.params;
    const urlPath = path.join('/');
    
    // Extract query parameters (like ?page=1&limit=20)
    const { search } = new URL(request.url);
    const targetUrl = `${BACKEND_API_URL}/admin/${urlPath}${search}`;

    // Securely retrieve the HttpOnly session token on the server
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

    // Forward the body for POST/PATCH write requests
    if (method !== 'GET' && method !== 'DELETE') {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const bodyText = await request.text();
        requestOptions.body = bodyText;
        headers.set('Content-Type', 'application/json');
      } else {
        // Fallback support for file uploads (e.g., Multipart Form-Data)
        const bodyBlob = await request.blob();
        requestOptions.body = bodyBlob;
        headers.set('Content-Type', contentType);
      }
    }

    // Server-to-server fetch request (completely immune to CORS blocks!)
    const backendResponse = await fetch(targetUrl, requestOptions);

    if (backendResponse.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await backendResponse.json().catch(() => ({}));

    return NextResponse.json(data, { status: backendResponse.status });

  } catch (error) {
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