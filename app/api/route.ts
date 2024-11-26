import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(_request: NextRequest) {
  try {
    const responseText = 'Hello World';

    return NextResponse.json({ 
      message: responseText,
      success: true,
      timestamp: new Date().toISOString()
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });

  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error'
    }, { 
      status: 500 
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({ 
      message: 'POST request received',
      data: body,
      success: true 
    });

  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error' 
    }, { 
      status: 500 
    });
  }
}

// If you need Cloudflare bindings later, you can add this:
/*
import { getRequestContext } from '@cloudflare/next-on-pages';

// Inside your function:
const ctx = getRequestContext();
const myKv = ctx.env.MY_KV_NAMESPACE;
*/