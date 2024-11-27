import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/app/utils/auth';
import { CloudflareEnv } from '@/app/types/cloudflare';

export const runtime = 'edge';

type EquipmentType = 'filter_media' | 'heater' | 'water_pump' | 'air_pump';

const MAINTENANCE_SCHEDULES: Record<EquipmentType, { interval_days: number; maintenance: string }> = {
  'filter_media': { 
    interval_days: 30,
    maintenance: 'Clean or replace filter media'
  },
  'heater': { 
    interval_days: 90,
    maintenance: 'Check temperature calibration'
  },
  'water_pump': { 
    interval_days: 90,
    maintenance: 'Clean impeller and check flow rate'
  },
  'air_pump': { 
    interval_days: 180,
    maintenance: 'Check air stone and tubing'
  }
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
      equipment_type,
      brand,
      model,
      purchase_date,
      last_maintenance,
      notes 
    } = await request.json() as {
      equipment_type: string;
      brand: string;
      model: string;
      purchase_date: string;
      last_maintenance: string;
      notes: string;
    };

    if (!MAINTENANCE_SCHEDULES[equipment_type as EquipmentType]) {
      return NextResponse.json(
        { success: false, error: 'Invalid equipment type' },
        { status: 400 }
      );
    }

    await env.DB.prepare(`
      INSERT INTO equipment 
      (equipment_type, brand, model, purchase_date, last_maintenance, notes) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      equipment_type,
      brand,
      model,
      purchase_date,
      last_maintenance,
      notes
    ).run();

    return NextResponse.json({ 
      maintenance_schedule: MAINTENANCE_SCHEDULES[equipment_type as EquipmentType],
      message: 'Equipment added successfully'
    });

  } catch (error) {
    console.error('Equipment error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add equipment' 
    }, { status: 500 });
  }
}

async function handleGet(request: NextRequest, env: CloudflareEnv): Promise<NextResponse> {
  try {
    const results = await env.DB.prepare(`
      SELECT 
        *, 
        datetime(last_maintenance, '+30 days') as next_maintenance_due
      FROM equipment 
      ORDER BY next_maintenance_due ASC
    `).all();

    return NextResponse.json({ 
      success: true,
      data: results.results,
      maintenance_schedules: MAINTENANCE_SCHEDULES
    });

  } catch (error) {
    console.error('Equipment fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch equipment' 
    }, { status: 500 });
  }
}

export const GET = authMiddleware(handler);
export const POST = authMiddleware(handler);