// ./app/api/equipment/route.ts
import { NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { CloudflareEnv } from '@/app/types/cloudflare';

export const runtime = 'edge';

type EquipmentType = 'filter_media' | 'heater' | 'water_pump' | 'air_pump';

// Define the maintenance schedules for different equipment types
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

export async function POST(request: Request) {
  try {
    // Define the expected structure of the request body
    interface NewEquipmentData {
      equipment_type: string;
      brand: string;
      model: string;
      purchase_date: string;
      last_maintenance: string;
      notes: string;
    }

    // Retrieve the equipment data from the request body
    const { 
      equipment_type,
      brand,
      model,
      purchase_date,
      last_maintenance,
      notes 
    } = await request.json() as NewEquipmentData;

    // Get the necessary environment variables and database connection
    const ctx = getRequestContext();
    const env = ctx.env as CloudflareEnv;
    const db = env.DB;

    // Validate the equipment type
    if (!MAINTENANCE_SCHEDULES[equipment_type as EquipmentType]) {
      return NextResponse.json(
        { success: false, error: 'Invalid equipment type' },
        { status: 400 }
      );
    }

    // Insert the new equipment record into the database
    await db.prepare(`
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

    // Return the maintenance schedule for the new equipment
    return NextResponse.json({ 
      maintenance_schedule: MAINTENANCE_SCHEDULES[equipment_type as EquipmentType],
      message: 'Equipment added successfully'
    });

  } catch (error) {
    // Log the error and return a server error response
    console.error('Equipment error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add equipment' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get the necessary environment variables and database connection
    const ctx = getRequestContext();
    const env = ctx.env as CloudflareEnv;
    const db = env.DB;

    // Fetch all the equipment records from the database
    const results = await db.prepare(`
      SELECT 
        *, 
        datetime(last_maintenance, '+30 days') as next_maintenance_due
      FROM equipment 
      ORDER BY next_maintenance_due ASC
    `).all();

    // Return the equipment data and maintenance schedules
    return NextResponse.json({ 
      success: true,
      data: results.results,
      maintenance_schedules: MAINTENANCE_SCHEDULES
    });

  } catch (error) {
    // Log the error and return a server error response
    console.error('Equipment fetch error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch equipment' 
    }, { status: 500 });
  }
}