// Vapi voice integration for Srazzu Sync

interface VapiCallOptions {
  phoneNumber: string;
  language?: 'en' | 'ar' | 'ru';
}

// Format phone to E.164
function format_phone_e164(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('00')) return '+' + digits.slice(2);
  if (!phone.startsWith('+')) return '+' + digits;
  return '+' + digits;
}

// Start an outbound voice call via Vapi
export async function start_outbound_call(options: VapiCallOptions) {
  const { phoneNumber, language = 'en' } = options;

  // Format phone to E.164
  const formattedPhone = format_phone_e164(phoneNumber);

  // Check if VAPI key is configured
  const vapiKey = process.env.VAPI_API_KEY;
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;

  // If Vapi is not configured, return mock response
  if (!vapiKey || !phoneNumberId || vapiKey === 'your_vapi_key_here') {
    console.log('[Voice] VAPI not configured, returning mock response');
    return {
      success: true,
      callId: `mock_${Date.now()}`,
      voiceCallId: `mock_${Date.now()}`,
      mock: true,
    };
  }

  try {
    // Create call via Vapi REST API
    const response = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vapiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumberId: phoneNumberId,
        customer: {
          number: formattedPhone,
        },
        assistant: {
          firstMessage: getDefaultFirstMessage(language),
          model: {
            provider: 'openai',
            model: 'gpt-4o',
          },
          systemPrompt: getDefaultSystemPrompt(language),
        },

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Voice] Vapi API error:', response.status, errorText);
      return {
        success: false,
        error: `Vapi API error: ${response.status} - ${errorText}`,
      };
    }

    const call = await response.json();
    console.log('[Voice] Call initiated:', call.id);

    return {
      success: true,
      callId: call.id,
      voiceCallId: call.id,
      mock: false,
    };

  } catch (error) {
    console.error('[Voice] Failed to start call:', error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
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