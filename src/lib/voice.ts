import { db, schema } from './db';
import { getVoiceConfig, can_use_voice, format_phone_e164 } from './tools';

const VAPI_BASE_URL = 'https://api.vapi.ai';

interface VapiCallOptions {
  phoneNumber: string;
  leadId?: string;
  agentId?: string;
  language?: 'en' | 'ar' | 'ru';
  firstMessage?: string;
  systemPrompt?: string;
}

// Start an outbound voice call via Vapi
export async function start_outbound_call(options: VapiCallOptions) {
  const { phoneNumber, leadId, agentId, language = 'en', firstMessage, systemPrompt } = options;

  // Format phone to E.164
  const formattedPhone = format_phone_e164(phoneNumber);

  // Get voice config for language
  const voiceConfig = getVoiceConfig(language);

  // Check if VAPI key is configured
  const vapiKey = process.env.VAPI_API_KEY;
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;

  if (!vapiKey || !phoneNumberId) {
    console.warn('[Voice] VAPI not configured, using mock mode');
    return mock_call({ ...options, phoneNumber: formattedPhone });
  }

  try {
    // Create call via Vapi REST API
    const response = await fetch(`${VAPI_BASE_URL}/call/phone`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vapiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumberId,
        customer: {
          number: formattedPhone,
        },
        assistant: {
          firstMessage: firstMessage || getDefaultFirstMessage(language),
          model: {
            provider: 'groq',
            model: 'llama3-70b-8192',
            systemMessage: systemPrompt || getDefaultSystemPrompt(language),
          },
          voice: {
            provider: 'vapi',
            voiceId: voiceConfig.voiceId,
          },
          language: voiceConfig.language,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vapi API error: ${response.status} - ${error}`);
    }

    const call = await response.json();

    // Log call to database
    const [voiceCall] = await db.insert(schema.voice_calls).values({
      lead_id: leadId,
      agent_id: agentId,
      vapi_call_id: call.id,
      phone_number: formattedPhone,
      direction: 'outbound',
      status: 'initiated',
      language,
    }).returning();

    // Log event
    await db.insert(schema.srazzu_events).values({
      event_type: 'call_started',
      entity_type: 'call',
      entity_id: voiceCall.id,
      agent_id: agentId,
      data: { vapi_call_id: call.id, phone: formattedPhone, language },
    });

    return { success: true, callId: call.id, voiceCallId: voiceCall.id };

  } catch (error) {
    console.error('[Voice] Failed to start call:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Mock call for development/testing
async function mock_call(options: VapiCallOptions) {
  const { phoneNumber, leadId, agentId, language = 'en' } = options;

  const mockCallId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Log mock call to database
  const [voiceCall] = await db.insert(schema.voice_calls).values({
    lead_id: leadId,
    agent_id: agentId,
    vapi_call_id: mockCallId,
    phone_number: phoneNumber,
    direction: 'outbound',
    status: 'completed',
    language,
    duration_seconds: '0',
    transcript: '[Mock call - Vapi not configured]',
    summary: 'Mock call for testing',
  }).returning();

  // Log event
  await db.insert(schema.srazzu_events).values({
    event_type: 'call_started',
    entity_type: 'call',
    entity_id: voiceCall.id,
    agent_id: agentId,
    data: { mock: true, phone: phoneNumber, language },
  });

  return { success: true, callId: mockCallId, voiceCallId: voiceCall.id, mock: true };
}

// Handle Vapi webhook events
export async function handle_vapi_webhook(payload: any) {
  const { message } = payload;

  if (!message || !message.call) {
    console.error('[Voice Webhook] Invalid payload:', payload);
    return { success: false, error: 'Invalid payload' };
  }

  const { call, event } = message;
  const vapiCallId = call.id;

  // Find the voice call in our database
  const [voiceCall] = await db.select()
    .from(schema.voice_calls)
    .where(eq(schema.voice_calls.vapi_call_id, vapiCallId))
    .limit(1);

  if (!voiceCall) {
    console.warn('[Voice Webhook] Call not found:', vapiCallId);
    return { success: false, error: 'Call not found' };
  }

  // Update call status based on event
  let status = voiceCall.status;
  let transcript = voiceCall.transcript;
  let summary = voiceCall.summary;
  let endedAt = voiceCall.ended_at;

  switch (event) {
    case 'call-started':
      status = 'in-progress';
      break;
    case 'call-ended':
      status = 'completed';
      endedAt = new Date();
      transcript = call.transcript || transcript;
      summary = call.summary || summary;
      break;
    case 'call-failed':
      status = 'failed';
      endedAt = new Date();
      break;
    default:
      console.log('[Voice Webhook] Unknown event:', event);
  }

  // Update database
  await db.update(schema.voice_calls)
    .set({
      status,
      transcript,
      summary,
      ended_at: endedAt,
      duration_seconds: call.duration?.toString() || voiceCall.duration_seconds,
      cost_cents: call.cost?.toString() || voiceCall.cost_cents,
    })
    .where(eq(schema.voice_calls.id, voiceCall.id));

  // Log event
  await db.insert(schema.srazzu_events).values({
    event_type: `call_${event}`,
    entity_type: 'call',
    entity_id: voiceCall.id,
    agent_id: voiceCall.agent_id,
    data: { vapi_call_id: vapiCallId, status, event },
  });

  return { success: true, status };
}

// Default first messages by language
function getDefaultFirstMessage(language: string): string {
  const messages: Record<string, string> = {
    en: 'Hello! This is Srazzu Sync calling. How can I help you today?',
    ar: 'مرحباً! هذه مكالمة من سرازو سينك. كيف يمكنني مساعدتك اليوم؟',
    ru: 'Здравствуйте! Это звонок от Srazzu Sync. Чем я могу вам помочь сегодня?',
  };
  return messages[language] || messages.en;
}

// Default system prompts by language
function getDefaultSystemPrompt(language: string): string {
  const prompts: Record<string, string> = {
    en: `You are a helpful AI assistant from Srazzu Sync. Be polite, professional, and concise. 
If the user is interested, offer to schedule a demo. If they have questions, answer them clearly.
Always end by asking if there's anything else you can help with.`,
    ar: `أنت مساعد ذكاء اصطناعي من سرازو سينك. كن مهذباً ومحترفاً ومختصراً.
إذا كان المستخدم مهتماً، اعرض عليه جدولة عرض توضيحي. إذا كان لديه أسئلة، أجب عليها بوضوح.
اختم دائماً بسؤال ما إذا كان هناك شيء آخر يمكنك المساعدة به.`,
    ru: `Вы - полезный ИИ-ассистент от Srazzu Sync. Будьте вежливы, профессиональны и лаконичны.
Если пользователь заинтересован, предложите запланировать демо. Если у него есть вопросы, ответьте на них ясно.
Всегда заканчивайте вопросом, можете ли вы еще чем-то помочь.`,
  };
  return prompts[language] || prompts.en;
}

// Import eq from drizzle-orm
import { eq } from 'drizzle-orm';
