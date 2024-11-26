// ./app/api/maintenance-logs/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import type { 
  CloudflareEnv, 
  MaintenanceLog 
} from '../../types/cloudflare.d';

export const runtime = 'edge';

type MaintenanceLogInput = Omit<MaintenanceLog, 'id' | 'created_at'>;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as MaintenanceLogInput;
    
    const ctx = getRequestContext();
    const env = ctx.env as CloudflareEnv;
    const db = env.DB;

    // Validate required fields
    if (!data.maintenance_type) {
      return NextResponse.json(
        { success: false, error: 'Maintenance type is required' },
        { status: 400 }
      );
    }

    // Validate other fields as needed
    if (typeof data.ph !== 'undefined' && (data.ph < 0 || data.ph > 14)) {
      return NextResponse.json(
        { success: false, error: 'pH value must be between 0 and 14' },
        { status: 400 }
      );
    }

    // Build dynamic query based on provided fields
    const fields = Object.keys(data).filter(key => data[key as keyof MaintenanceLogInput] !== undefined);
    const values = fields.map(key => data[key as keyof MaintenanceLogInput]);
    const query = `
      INSERT INTO maintenance_logs (${fields.join(', ')})
      VALUES (${fields.map(() => '?').join(', ')})
    `;

    await db.prepare(query).bind(...values).run();

    return NextResponse.json({ 
      success: true,
      message: 'Maintenance log created successfully'
    });

  } catch (error) {
    console.error('Error in maintenance log POST:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create maintenance log' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'DESC';
    const offset = (page - 1) * limit;

    const ctx = getRequestContext();
    const env = ctx.env as CloudflareEnv;
    const db = env.DB;

    const results = await db.prepare(`
      SELECT * FROM maintenance_logs
      ORDER BY ?? ${order}
      LIMIT ? OFFSET ?
    `).bind(sort, limit, offset).all<MaintenanceLog>();

    return NextResponse.json({
      success: true,
      data: results.results,
      pagination: {
        page,
        limit,
        total: results.results?.length || 0
      }
    });

  } catch (error) {
    console.error('Error in maintenance log GET:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch maintenance logs' },
      { status: 500 }
    );
  }
}