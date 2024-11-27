import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@/app/types/cloudflare';
import { CloudflareEnv } from '@/app/types/cloudflare';
import * as bcrypt from 'bcryptjs';
import { createToken } from '@/app/utils/auth';

export async function POST(request: NextRequest, { env }: { env: CloudflareEnv }) {
  try {
    const { email, password } = await request.json() as { email: string, password: string };
    
    const db = env.DB;

    // Check if user already exists
    const existingUser = await db.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first();

    if (existingUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'User already exists' 
      }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const result = await db.prepare(
      'INSERT INTO users (email, password_hash) VALUES (?, ?) RETURNING id'
    ).bind(email, hashedPassword).first() as { id: number };

    // Create token
    const token = await createToken({ userId: result.id });

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: result.id, email }
    }, {
      status: 201,
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