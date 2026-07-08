// Vapi voice integration for Srazzu Sync

interface VapiCallOptions {
  phoneNumber: string;
  language?: 'en' | 'ar' | 'ru';
}

function format_phone_e164(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('00')) return '+' + digits.slice(2);
  if (!phone.startsWith('+')) return '+' + digits;
  return '+' + digits;
}

export async function start_outbound_call(options: VapiCallOptions) {
  const { phoneNumber, language = 'en' } = options;
  const formattedPhone = format_phone_e164(phoneNumber);
  const vapiKey = process.env.VAPI_API_KEY;
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;

  if (!vapiKey || !phoneNumberId || vapiKey === 'your_vapi_key_here') {
    return { success: true, callId: 'mock_' + Date.now(), voiceCallId: 'mock_' + Date.now(), mock: true };
  }

  try {
    const response = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + vapiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumberId: phoneNumberId,
        customer: { number: formattedPhone },
        assistant: {
          firstMessage: getDefaultFirstMessage(language),
          model: { provider: 'openai', model: 'gpt-4o' },
          systemPrompt: getDefaultSystemPrompt(language)
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: 'Vapi API error: ' + response.status + ' - ' + errorText };
    }

    const call = await response.json();
    return { success: true, callId: call.id, voiceCallId: call.id, mock: false };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

function getDefaultFirstMessage(language: string): string {
  const messages: Record<string, string> = {
    en: 'Hello! This is Srazzu Sync calling. How can I help you today?',
    ar: 'مرحباً! هذه مكالمة من سرازو سينك. كيف يمكنني مساعدتك اليوم؟',
    ru: 'Здравствуйте! Это звонок от Srazzu Sync. Чем я могу вам помочь сегодня?'
  };
  return messages[language] || messages.en;
}

function getDefaultSystemPrompt(language: string): string {
  const prompts: Record<string, string> = {
    en: 'You are a helpful AI assistant from Srazzu Sync. Be polite, professional, and concise. If the user is interested, offer to schedule a demo. If they have questions, answer them clearly. Always end by asking if there is anything else you can help with.',
    ar: 'أنت مساعد ذكاء اصطناعي من سرازو سينك. كن مهذباً ومحترفاً ومختصراً. إذا كان المستخدم مهتماً، اعرض عليه جدولة عرض توضيحي. إذا كان لديه أسئلة، أجب عليها بوضوح. اختم دائماً بسؤال ما إذا كان هناك شيء آخر يمكنك المساعدة به.',
    ru: 'Вы полезный ИИ-ассистент от Srazzu Sync. Будьте вежливы, профессиональны и лаконичны. Если пользователь заинтересован, предложите запланировать демо. Если у него есть вопросы, ответьте на них ясно. Всегда заканчивайте вопросом, можете ли вы еще чем-то помочь.'
  };
  return prompts[language] || prompts.en;
}