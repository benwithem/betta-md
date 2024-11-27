import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/app/utils/auth';
import { CloudflareEnv } from '@/app/types/cloudflare';

export const runtime = 'edge';

type Species = 'Mystery Snail' | 'Ghost Shrimp' | 'Nerite Snail';

const BETTA_COMPATIBLE_SPECIES: Record<Species, { max_count: number; current: number }> = {
  'Mystery Snail': { max_count: 4, current: 3 },
  'Ghost Shrimp': { max_count: 6, current: 4 },
  'Nerite Snail': { max_count: 2, current: 2 }
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
      species, 
      count, 
      notes,
      date_added
    } = await request.json() as { 
      species: Species; 
      count: number; 
      notes: string; 
      date_added: string 
    };

    if (!BETTA_COMPATIBLE_SPECIES[species]) {
      return NextResponse.json({ 
        success: false, 
        error: 'Species not compatible with betta fish' 
      }, { status: 400 });
    }

    const currentCount = BETTA_COMPATIBLE_SPECIES[species].current;
    const maxCount = BETTA_COMPATIBLE_SPECIES[species].max_count;
    
    if ((currentCount + count) > maxCount) {
      return NextResponse.json({ 
        success: false, 
        error: `Maximum recommended count for ${species} is ${maxCount}` 
      }, { status: 400 });
    }

    await env.DB.prepare(`
      INSERT INTO inhabitants 
      (species, count, notes, date_added) 
      VALUES (?, ?, ?, ?)
    `).bind(species, count, notes, date_added).run();

    return NextResponse.json({ 
      success: true,
      message: 'Inhabitant added successfully'
    });

  } catch (error) {
    console.error('Inhabitants error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add inhabitant' 
    }, { status: 500 });
  }
}

async function handleGet(request: NextRequest, env: CloudflareEnv): Promise<NextResponse> {
  try {
    const results = await env.DB.prepare(`
      SELECT * FROM inhabitants 
      ORDER BY date_added DESC
    `).all();

    return NextResponse.json({ 
      success: true,
      data: results.results,
      compatible_species: BETTA_COMPATIBLE_SPECIES
    });

  } catch (error) {
    console.error('Inhabitants fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch inhabitants' 
    }, { status: 500 });
  }
}

export const GET = authMiddleware(handler);
export const POST = authMiddleware(handler);
