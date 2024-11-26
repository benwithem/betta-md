import { NextRequest, NextResponse } from 'next/server';
import { CloudflareEnv } from '@/app/types/cloudflare';
import { mockAuthMiddleware } from '@/app/utils/mockAuth';

async function handler(request: NextRequest, env: CloudflareEnv): Promise<NextResponse> {
  const userId = request.headers.get('X-User-Id');

  if (request.method === 'POST') {
    return handlePost(request, env, userId);
  } else if (request.method === 'GET') {
    return handleGet(request, env, userId);
  } else if (request.method === 'DELETE') {
    return handleDelete(request, env, userId);
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
}

async function handlePost(request: NextRequest, env: CloudflareEnv, userId: string | null): Promise<NextResponse> {
  try {
    interface MaintenanceLog {
        ph: number;
        ammonia: number;
        nitrite: number;
        nitrate: number;
    }

    const { ph, ammonia, nitrite, nitrate }: MaintenanceLog = await request.json();

    await env.DB.prepare(
      'INSERT INTO maintenance_logs (user_id, ph, ammonia, nitrite, nitrate) VALUES (?, ?, ?, ?, ?)'
    ).bind(userId, ph, ammonia, nitrite, nitrate).run();

    return NextResponse.json({ message: 'Maintenance log created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating maintenance log:', error);
    return NextResponse.json({ error: 'Failed to create maintenance log' }, { status: 500 });
  }
}

async function handleGet(request: NextRequest, env: CloudflareEnv, userId: string | null): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'DESC';
    const offset = (page - 1) * limit;

    const logs = await env.DB.prepare(`
      SELECT * FROM maintenance_logs 
      WHERE user_id = ? 
      ORDER BY ${sort} ${order} 
      LIMIT ? OFFSET ?
    `).bind(userId, limit, offset).all();

    return NextResponse.json({ logs: logs.results, page, limit });
  } catch (error) {
    console.error('Error fetching maintenance logs:', error);
    return NextResponse.json({ error: 'Failed to fetch maintenance logs' }, { status: 500 });
  }
}

async function handleDelete(request: NextRequest, env: CloudflareEnv, userId: string | null): Promise<NextResponse> {
  try {
    const { id } = await request.json() as { id: string };

    await env.DB.prepare(
      'DELETE FROM maintenance_logs WHERE id = ? AND user_id = ?'
    ).bind(id, userId).run();

    return NextResponse.json({ message: 'Maintenance log deleted successfully' });
  } catch (error) {
    console.error('Error deleting maintenance log:', error);
    return NextResponse.json({ error: 'Failed to delete maintenance log' }, { status: 500 });
  }
}

export const GET = mockAuthMiddleware(handler);
export const POST = mockAuthMiddleware(handler);
export const DELETE = mockAuthMiddleware(handler);
