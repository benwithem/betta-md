import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/app/utils/auth';
import { CloudflareEnv } from '@/app/types/cloudflare';

export const runtime = 'edge';

const PARAMETER_RANGES = {
  ph: { min: 6.5, max: 7.5, optimal: 7.0 },
  temperature: { min: 76, max: 82, optimal: 78 },
  ammonia: { max: 0.25, optimal: 0 },
  nitrite: { max: 0.25, optimal: 0 },
  nitrate: { max: 20, optimal: 5 },
  gh: { min: 3, max: 12, optimal: 7 },
  kh: { min: 3, max: 8, optimal: 5 }
};

async function handler(request: NextRequest, env: CloudflareEnv): Promise<NextResponse> {
  if (request.method === 'POST') {
    return handlePost(request, env);
  } else if (request.method === 'GET') {
    return handleGet(request, env);
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
}

async function handlePost(request: NextRequest, env: CloudflareEnv): Promise<NextResponse> {
  try {
    const { 
      ph, temperature, ammonia, nitrite, nitrate, gh, kh 
    } = await request.json() as { 
      ph: number, temperature: number, ammonia: number, nitrite: number, nitrate: number, gh: number, kh: number 
    };

    const validation = validateParameters({
      ph, temperature, ammonia, nitrite, nitrate, gh, kh
    });

    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.errors }, { status: 400 });
    }

    await env.DB.prepare(`
      INSERT INTO water_parameters 
      (ph, temperature, ammonia, nitrite, nitrate, gh, kh) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(ph, temperature, ammonia, nitrite, nitrate, gh, kh).run();

    return NextResponse.json({ 
      success: true,
      message: 'Parameters recorded successfully',
      recommendations: generateRecommendations({
        ph, temperature, ammonia, nitrite, nitrate, gh, kh
      })
    }, { status: 201 });

  } catch (error) {
    console.error('Parameters error:', error);
    return NextResponse.json({ success: false, error: 'Failed to record parameters' }, { status: 500 });
  }
}

async function handleGet(request: NextRequest, env: CloudflareEnv): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    const results = await env.DB.prepare(`
      SELECT * FROM water_parameters 
      WHERE created_at >= datetime('now', '-' || ? || ' days')
      ORDER BY created_at DESC
    `).bind(days).all();

    return NextResponse.json({ 
      success: true,
      data: results.results,
      ranges: PARAMETER_RANGES
    });

  } catch (error) {
    console.error('Parameters fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch parameters' }, { status: 500 });
  }
}

function validateParameters(params: Record<string, number>) {
  const errors = [];

  if (params.ph < PARAMETER_RANGES.ph.min || params.ph > PARAMETER_RANGES.ph.max) {
    errors.push(`pH should be between ${PARAMETER_RANGES.ph.min} and ${PARAMETER_RANGES.ph.max}`);
  }

  if (params.ammonia > PARAMETER_RANGES.ammonia.max) {
    errors.push(`Ammonia should be below ${PARAMETER_RANGES.ammonia.max}`);
  }

  if (params.nitrite > PARAMETER_RANGES.nitrite.max) {
    errors.push(`Nitrite should be below ${PARAMETER_RANGES.nitrite.max}`);
  }

  if (params.nitrate > PARAMETER_RANGES.nitrate.max) {
    errors.push(`Nitrate should be below ${PARAMETER_RANGES.nitrate.max}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function generateRecommendations(params: Record<string, number>) {
  const recommendations = [];

  if (params.ammonia > 0) {
    recommendations.push({
      level: 'critical',
      message: 'Perform immediate water change to reduce ammonia levels',
      action: 'water_change'
    });
  }

  if (params.nitrite > 0) {
    recommendations.push({
      level: 'critical',
      message: 'Perform water change and check filter maintenance',
      action: 'filter_maintenance'
    });
  }

  if (params.ph < 6.8 || params.ph > 7.2) {
    recommendations.push({
      level: 'warning',
      message: 'pH levels are outside optimal range for bettas',
      action: 'adjust_ph'
    });
  }

  return recommendations;
}

export const GET = authMiddleware(handler);
export const POST = authMiddleware(handler);