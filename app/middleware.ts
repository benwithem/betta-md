// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Add paths that don't require authentication
const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    // Redirect to login if accessing page
    if (!pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Return 401 if accessing API
    return NextResponse.json({ 
      success: false, 
      error: 'Authentication required' 
    }, { status: 401 });
  }

  try {
    // Verify token
    const decoded = verify(token, JWT_SECRET) as { userId: string };
    const response = NextResponse.next();
    
    // Add user info to headers for API routes
    response.headers.set('X-User-Id', decoded.userId);
    
    return response;
  } catch (error) {
    // Token is invalid
    if (!pathname.startsWith('/api/')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid token' 
    }, { status: 401 });
  }
}

export const config = {
  matcher: [
    // Pages that require auth
    '/maintenance/:path*',
    '/parameters/:path*',
    '/equipment/:path*',
    '/inhabitants/:path*',
    // API routes that require auth
    '/api/maintenance-logs/:path*',
    '/api/parameters/:path*',
    '/api/equipment/:path*',
    '/api/inhabitants/:path*'
  ]
};