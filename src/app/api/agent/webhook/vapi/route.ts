import { NextRequest, NextResponse } from 'next/server';

// POST /api/agent/webhook/vapi - Vapi webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[Vapi Webhook] Received event:', body);

    // Log the webhook event
    // In production, you would process the event and update call status
    
    return NextResponse.json({
      success: true,
      message: 'Webhook received',
    });

  } catch (error) {
    console.error('[Vapi Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}