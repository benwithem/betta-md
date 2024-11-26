import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { CloudflareEnv } from '@/app/types/cloudflare';
import { sign, verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json() as { email: string, password: string };
    
    const ctx = getRequestContext();
    const env = ctx.env as CloudflareEnv;
    const db = env.DB;

    const user = await db.prepare(
      'SELECT id, email FROM users WHERE email = ? AND password_hash = ?'
    ).bind(email, password).first() as { id: number, email: string } | null;

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid credentials' 
      }, { status: 401 });
    }

    const token = sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

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

// app/api/auth/register/route.ts
export async function registerPOST(request: NextRequest) {
  try {
    const { email, password } = await request.json() as { email: string, password: string };
    
    const ctx = getRequestContext();
    const env = ctx.env as CloudflareEnv;
    const db = env.DB;

    // Check if user exists
    const existing = await db.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existing) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email already registered' 
      }, { status: 400 });
    }

    // Create new user
    const result = await db.prepare(
      'INSERT INTO users (email, password_hash) VALUES (?, ?) RETURNING id'
    ).bind(email, password).first() as { id: number };

    const token = sign({ userId: result.id }, JWT_SECRET, { expiresIn: '24h' });

    return NextResponse.json({
      success: true,
      token,
      user: { id: result.id, email }
    }, {
      headers: {
        'Set-Cookie': `auth-token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Registration failed' 
    }, { status: 500 });
  }
}

// app/api/auth/verify/route.ts
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'No token provided' 
      }, { status: 401 });
    }

    const decoded = verify(token, JWT_SECRET) as { userId: number };
    
    const ctx = getRequestContext();
    const env = ctx.env as CloudflareEnv;
    const db = env.DB;

    const user = await db.prepare(
      'SELECT id, email FROM users WHERE id = ?'
    ).bind(decoded.userId).first() as { id: number, email: string } | null;

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid token' 
    }, { status: 401 });
  }
}