import { NextRequest, NextResponse } from 'next/server';
import { CloudflareEnv } from '@/app/types/cloudflare';
import { verifyToken } from './utils/auth';

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth-token')?.value || request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    if (!pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.json({ 
      success: false, 
      error: 'Authentication required' 
    }, { status: 401 });
  }

  const payload = await verifyToken(token) as { userId: number };
  if (!payload) {
    if (!pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid token' 
    }, { status: 401 });
  }

  const response = NextResponse.next();
  response.headers.set('X-User-Id', payload.userId.toString());
  
  return response;
}

export const config = {
  matcher: [
    '/maintenance/:path*',
    '/parameters/:path*',
    '/equipment/:path*',
    '/inhabitants/:path*',
    '/api/maintenance-logs/:path*',
    '/api/parameters/:path*',
    '/api/equipment/:path*',
    '/api/inhabitants/:path*'
  ]
};

export function authMiddleware(
    handler: (
      req: NextRequest,
      env: CloudflareEnv
    ) => Promise<NextResponse>
  ) {
    return async (
      req: NextRequest,
      env: CloudflareEnv
    ): Promise<NextResponse> => {
      const token = req.cookies.get('auth-token')?.value || req.headers.get('authorization')?.split(' ')[1];
  
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
  
      const payload = await verifyToken(token) as { userId: number };
      if (!payload) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
  
      // Create a new request object with the user ID added to headers
      const newRequest = new NextRequest(req);
      newRequest.headers.set('X-User-Id', payload.userId.toString());
  
      return handler(newRequest, env);
    };
  }
  