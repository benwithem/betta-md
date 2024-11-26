import { NextRequest, NextResponse } from 'next/server';
import { CloudflareEnv } from '@/app/types/cloudflare';

export function mockAuthMiddleware(
  handler: (
    req: NextRequest,
    env: CloudflareEnv
  ) => Promise<NextResponse>
) {
  return async (
    req: NextRequest,
    env: CloudflareEnv
  ): Promise<NextResponse> => {
    // Mock user authentication
    const mockUserId = '12345';
    
    // Create a new headers object
    const headers = new Headers(req.headers);
    headers.set('X-User-Id', mockUserId);

    // Create a new request with the updated headers
    const authenticatedRequest = new NextRequest(req, { headers });

    return handler(authenticatedRequest, env);
  };
}