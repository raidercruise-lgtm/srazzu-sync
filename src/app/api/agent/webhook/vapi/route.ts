import { NextRequest, NextResponse } from 'next/server';
import { handle_vapi_webhook } from '@/lib/voice';

// POST /api/agent/webhook/vapi - Vapi webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[Vapi Webhook] Received event:', body);

    // Handle the webhook
    const result = await handle_vapi_webhook(body);

    if (result.success) {
      return NextResponse.json({
        success: true,
        status: result.status,
      });
    } else {
      return NextResponse.json({
        error: result.error,
      }, { status: 400 });
    }

  } catch (error) {
    console.error('[Vapi Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
