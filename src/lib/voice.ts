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

  if (!vapiKey || !phoneNumberId) {
    return { success: true, callId: 'mock_' + Date.now(), voiceCallId: 'mock_' + Date.now(), mock: true };
  }

  try {
    const response = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + vapiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumberId: phoneNumberId,
        customer: { number: formattedPhone },
        assistant: { firstMessage: getDefaultFirstMessage(language) }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText };
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