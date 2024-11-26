import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { CloudflareEnv } from '@/app/types/cloudflare';

export const runtime = 'edge';

type Species = 'Mystery Snail' | 'Ghost Shrimp' | 'Nerite Snail';

const BETTA_COMPATIBLE_SPECIES: Record<Species, { max_count: number; current: number }> = {
  'Mystery Snail': { max_count: 4, current: 3 },
  'Ghost Shrimp': { max_count: 6, current: 4 },
  'Nerite Snail': { max_count: 2, current: 2 }
};

export async function POST(request: Request) {
  try {
    const { 
      species, 
      count, 
      notes,
      date_added
    }: { 
      species: Species; 
      count: number; 
      notes: string; 
      date_added: string 
    } = await request.json();

    const ctx = getRequestContext();
    const env = ctx.env as CloudflareEnv;
    const db = env.DB;

    // Validate compatibility
    if (!BETTA_COMPATIBLE_SPECIES[species]) {
      return NextResponse.json({ 
        success: false, 
        error: 'Species not compatible with betta fish' 
      }, { status: 400 });
    }

    // Check tank capacity
    const currentCount = BETTA_COMPATIBLE_SPECIES[species].current;
    const maxCount = BETTA_COMPATIBLE_SPECIES[species].max_count;
    
    if ((currentCount + count) > maxCount) {
      return NextResponse.json({ 
        success: false, 
        error: `Maximum recommended count for ${species} is ${maxCount}` 
      }, { status: 400 });
    }

    // Add inhabitant record
    await db.prepare(`
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

export async function GET() {
  try {
    const ctx = getRequestContext();
    const env = ctx.env as CloudflareEnv;
    const db = env.DB;

    const results = await db.prepare(`
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