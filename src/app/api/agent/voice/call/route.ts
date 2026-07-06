import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { validateVoiceCall } from '@/lib/validation';
import { start_outbound_call } from '@/lib/voice';
import { can_use_voice } from '@/lib/tools';
import { isAdmin, getAdminPlan } from '@/lib/auth';
import { eq } from 'drizzle-orm';

// POST /api/agent/voice/call - Initiate a voice call
export async function POST(request: NextRequest) {
  try {
    // Check admin auth
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if admin has Pro plan
    const plan = await getAdminPlan();
    if (!can_use_voice(plan)) {
      return NextResponse.json({
        error: 'Voice calling requires Pro plan',
        requiredPlan: 'pro',
      }, { status: 403 });
    }

    const body = await request.json();
    const validation = validateVoiceCall(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { lead_id, phone, language, agent_id } = validation.data;

    // Get lead details
    const [lead] = await db.select()
      .from(schema.demo_requests)
      .where(eq(schema.demo_requests.id, lead_id))
      .limit(1);

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Initiate voice call
    const result = await start_outbound_call({
      phoneNumber: phone,
      leadId: lead_id,
      agentId: agent_id || 'rafi',
      language: language || (lead.locale as 'en' | 'ar' | 'ru') || 'en',
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
