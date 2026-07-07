import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { start_outbound_call } from '@/lib/voice';
import { eq } from 'drizzle-orm';

// POST /api/agent/voice/call - Initiate a voice call
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simple validation - just need phone and language
    const { phone, language = 'en', lead_id, agent_id } = body;

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Initiate voice call (no auth required for testing)
    const result = await start_outbound_call({
      phoneNumber: phone,
      leadId: lead_id || null,
      agentId: agent_id || 'rafi',
      language: language as 'en' | 'ar' | 'ru',
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        callId: (result as any).callId,
        voiceCallId: (result as any).voiceCallId,
        mock: (result as any).mock || false,
        message: (result as any).mock ? 'Mock call created (Vapi not configured)' : 'Voice call initiated',
      });
    } else {
      return NextResponse.json({
        error: 'Failed to initiate voice call',
        details: (result as any).error,
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[Voice API] Call initiation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}