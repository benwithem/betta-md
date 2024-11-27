import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/app/utils/auth';
import { CloudflareEnv } from '@/app/types/cloudflare';

export const runtime = 'edge';

export async function POST(request: NextRequest, { env }: { env: CloudflareEnv }) {
  try {
    const { email, password } = await request.json() as { email: string, password: string };
    
    const db = env.DB;

    const user = await db.prepare(
      'SELECT id, email, password_hash FROM users WHERE email = ?'
    ).bind(email).first() as { id: number, email: string, password_hash: string } | null;

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Here you should use a proper password hashing library to compare passwords
    // For example, bcrypt or Argon2. This is a simplified version.
    if (user.password_hash !== password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }

    const token = await createToken({ userId: user.id });

    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, email: user.email }
    }, {
      headers: {
        'Set-Cookie': `auth-token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Authentication failed' 
    }, { status: 500 });
  }
}
