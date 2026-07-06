import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { validateDemoRequest } from '@/lib/validation';
import { isAdmin } from '@/lib/auth';

// POST /api/admin/leads - Admin create lead
export async function POST(request: NextRequest) {
  try {
    // Check admin auth
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body
    const validation = validateDemoRequest(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { full_name, email, company, phone, team_size, message, locale } = validation.data;

    // Insert lead into database
    const [lead] = await db.insert(schema.demo_requests).values({
      full_name,
      email,
      company,
      phone,
      team_size,
      message,
      locale: locale || 'en',
      status: 'new',
      source: 'admin',
    }).returning();

    // Log event
    await db.insert(schema.srazzu_events).values({
      event_type: 'lead_created',
      entity_type: 'lead',
      entity_id: lead.id,
      data: { email, source: 'admin' },
    });

    return NextResponse.json({
      success: true,
      lead,
    }, { status: 201 });

  } catch (error) {
    console.error('[Admin API] Lead creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/admin/leads - Admin list leads
export async function GET(request: NextRequest) {
  try {
    // Check admin auth
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query with optional status filter
    const leads = await db.select()
      .from(schema.demo_requests)
      .where(status ? eq(schema.demo_requests.status, status) : undefined)
      .orderBy(schema.demo_requests.created_at)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      success: true,
      leads,
    });

  } catch (error) {
    console.error('[Admin API] Lead fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Import eq from drizzle-orm
import { eq } from 'drizzle-orm';
