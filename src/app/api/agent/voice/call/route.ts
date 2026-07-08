import { NextRequest, NextResponse } from 'next/server';
import { start_outbound_call } from '@/lib/voice';

// POST /api/agent/voice/call - Initiate a voice call
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, language = 'en' } = body;

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Format phone number
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone.replace(/\D/g, '')}`;

    // Initiate voice call
    const result = await start_outbound_call({
      phoneNumber: formattedPhone,
      language: language as 'en' | 'ar' | 'ru',
    });

    return NextResponse.json({
      success: result.success,
      callId: result.callId,
      voiceCallId: result.voiceCallId,
      mock: result.mock || false,
      message: result.mock 
        ? 'Mock call created - Vapi not configured. Add VAPI_API_KEY and VAPI_PHONE_NUMBER_ID to enable real calls.' 
        : result.success 
          ? 'Voice call initiated successfully!' 
          : `Failed: ${result.error}`,
      error: result.error || null,
    });

  } catch (error) {
    console.error('[Voice API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    );
  }
}