import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/utils/auth';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value || 
                 request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'No token provided' 
      }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid token' 
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: { id: payload.userId }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Token verification failed' 
    }, { status: 500 });
  }
}
