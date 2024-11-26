import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { CloudflareEnv } from '../types/cloudflare';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export interface ExtendedNextRequest extends NextRequest {
  userId?: number;
}

export async function createToken(payload: any): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret);
  return token;
}

export async function verifyToken(token: string): Promise<any> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

type Handler = (request: NextRequest, env: CloudflareEnv) => Promise<NextResponse>;

export function authMiddleware(handler: Handler) {
  return async (request: NextRequest, env: CloudflareEnv): Promise<NextResponse> => {
    const token = request.cookies.get('auth-token')?.value || request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Create a new headers object with the user ID
    const headers = new Headers(request.headers);
    headers.set('X-User-Id', payload.userId.toString());

    // Create a new request with the updated headers
    const authenticatedRequest = new NextRequest(request, { headers });

    return handler(authenticatedRequest, env);
  };
}

