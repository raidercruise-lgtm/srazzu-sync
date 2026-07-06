import Groq from 'groq-sdk';

// Initialize Groq only if API key is available
const groq = process.env.GROQ_API_KEY ? new Groq({
  apiKey: process.env.GROQ_API_KEY,
}) : null;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export async function chat_completion(
  messages: ChatMessage[],
  options: ChatOptions = {}
): Promise<string> {
  const { model = 'llama3-70b-8192', temperature = 0.7, max_tokens = 1024 } = options;

  // If Groq is not configured, return a mock response
  if (!groq) {
    console.log('[LLM] Groq not configured, returning mock response');
    return '[AI response not available - Groq API not configured]';
  }

  try {
    const completion = await groq.chat.completions.create({
      messages,
      model,
      temperature,
      max_tokens,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('[LLM] Groq API error:', error);
    throw new Error(`LLM API error: ${(error as Error).message}`);
  }
}

export async function generate_email(
  prompt: string,
  locale: 'en' | 'ar' | 'ru' = 'en'
): Promise<string> {
  const systemPrompts: Record<string, string> = {
    en: 'You are a professional email writer. Write clear, concise, and engaging emails. Return only the email body, no subject line.',
    ar: 'أنت كاتب بريد إلكتروني محترف. اكتب رسائل واضحة ومختصرة وجذابة. أعد فقط نص البريد الإلكتروني، بدون سطر الموضوع.',
    ru: 'Вы профессиональный автор электронных писем. Пишите четкие, краткие и привлекательные письма. Верните только текст письма, без темы.',
  };

  return chat_completion([
    { role: 'system', content: systemPrompts[locale] || systemPrompts.en },
    { role: 'user', content: prompt },
  ]);
}

export async function analyze_lead(message: string): Promise<{
  intent: string;
  sentiment: string;
  language: string;
  summary: string;
}> {
  const result = await chat_completion([
    {
      role: 'system',
      content: `Analyze this lead message and return a JSON object with:
- intent: "demo_request", "question", "complaint", "general"
- sentiment: "positive", "neutral", "negative"
- language: "en", "ar", "ru"
- summary: brief summary of the message

Return ONLY valid JSON, no other text.`,
    },
    { role: 'user', content: message },
  ]);

  try {
    return JSON.parse(result);
  } catch {
    return {
      intent: 'general',
      sentiment: 'neutral',
      language: 'en',
      summary: message.slice(0, 100),
    };
  }
}
