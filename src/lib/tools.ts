// Trilingual language detection: EN / AR / RU
export function detect_language(text: string): 'en' | 'ar' | 'ru' {
  // Arabic detection: Arabic Unicode range
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  if (arabicPattern.test(text)) return 'ar';

  // Russian detection: Cyrillic Unicode range
  const cyrillicPattern = /[\u0400-\u04FF]/;
  if (cyrillicPattern.test(text)) return 'ru';

  // Default to English
  return 'en';
}

// Voice configuration by language
export function getVoiceConfig(locale: 'en' | 'ar' | 'ru') {
  const voices = {
    en: {
      voiceId: 'jennifer', // Vapi voice ID for English
      language: 'en-US',
      speed: 1.0,
    },
    ar: {
      voiceId: 'arabic-female', // Vapi voice ID for Arabic
      language: 'ar-SA',
      speed: 0.95,
    },
    ru: {
      voiceId: 'russian-female', // Vapi voice ID for Russian
      language: 'ru-RU',
      speed: 0.95,
    },
  };
  return voices[locale] || voices.en;
}

// Freemium gate: check if user can use voice features
export function can_use_voice(plan: string | null | undefined): boolean {
  return plan === 'pro';
}

// Format phone number to E.164
export function format_phone_e164(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If starts with 00, replace with +
  if (digits.startsWith('00')) {
    return '+' + digits.slice(2);
  }
  
  // If doesn't start with +, add + 
  if (!phone.startsWith('+')) {
    return '+' + digits;
  }
  
  return '+' + digits;
}

// Validate E.164 phone format
export function is_valid_phone(phone: string): boolean {
  const e164Pattern = /^\+[1-9]\d{1,14}$/;
  return e164Pattern.test(phone);
}

// Get localized greeting
export function get_greeting(locale: 'en' | 'ar' | 'ru', name: string): string {
  const greetings = {
    en: `Hello ${name},`,
    ar: `مرحباً ${name}،`,
    ru: `Здравствуйте ${name},`,
  };
  return greetings[locale] || greetings.en;
}

// Get localized closing
export function get_closing(locale: 'en' | 'ar' | 'ru'): string {
  const closings = {
    en: 'Best regards,\nSrazzu Sync Team',
    ar: 'مع أطيب التحيات،\nفريق سرازو سينك',
    ru: 'С уважением,\nКоманда Srazzu Sync',
  };
  return closings[locale] || closings.en;
}
