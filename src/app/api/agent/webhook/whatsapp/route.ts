import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';

// POST /api/agent/webhook/whatsapp - WhatsApp webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[WhatsApp Webhook] Received:', body);

    // Log event
    await db.insert(schema.srazzu_events).values({
      event_type: 'whatsapp_message',
      data: body,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[WhatsApp Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
