import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { validateDemoRequest } from '@/lib/validation';
import { detect_language } from '@/lib/tools';
import { eq } from 'drizzle-orm';

// POST /api/leads - Public lead capture
export async function POST(request: NextRequest) {
  try {
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

    // Detect language from message if not provided
    const detectedLocale = locale || (message ? detect_language(message) : 'en');

    // Insert lead into database
    const [lead] = await db.insert(schema.demo_requests).values({
      full_name,
      email,
      company,
      phone,
      team_size,
      message,
      locale: detectedLocale,
      status: 'new',
      source: 'website',
    }).returning();

    // Log event
    await db.insert(schema.srazzu_events).values({
      event_type: 'lead_created',
      entity_type: 'lead',
      entity_id: lead.id,
      data: { email, locale: detectedLocale, source: 'website' },
    });

    return NextResponse.json({
      success: true,
      message: 'Demo request submitted successfully',
      lead: {
        id: lead.id,
        full_name: lead.full_name,
        email: lead.email,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('[API] Lead creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/leads - List leads (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
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
      pagination: {
        limit,
        offset,
        count: leads.length,
      },
    });

  } catch (error) {
    console.error('[API] Lead fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
