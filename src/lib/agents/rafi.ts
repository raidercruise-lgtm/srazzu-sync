import { Agent, AgentContext, AgentResult } from './index';
import { db, schema } from '../db';
import { eq, and, lt } from 'drizzle-orm';
import { start_outbound_call } from '../voice';
import { can_use_voice } from '../tools';

export const rafi: Agent = {
  id: 'rafi',
  name: 'Rafi',
  role: 'Voice Caller',
  description: 'Handles outbound voice calls for qualified leads (Pro plan only)',
  languages: ['en', 'ar', 'ru'],

  async execute(context: AgentContext): Promise<AgentResult> {
    const { leadId, leadName, leadEmail, leadPhone, locale = 'en', plan } = context;

    // Check if voice feature is available (Pro plan only)
    if (!can_use_voice(plan)) {
      return {
        success: false,
        action: 'voice_not_available',
        message: 'Voice calling requires Pro plan',
        data: { requiredPlan: 'pro' },
      };
    }

    if (!leadPhone) {
      return {
        success: false,
        action: 'no_phone',
        message: 'No phone number available for this lead',
      };
    }

    try {
      // Make outbound voice call via Vapi
      const callResult = await start_outbound_call({
        phoneNumber: leadPhone,
        leadId,
        agentId: 'rafi',
        language: locale,
        firstMessage: getFirstMessage(locale, leadName || 'there'),
        systemPrompt: getSystemPrompt(locale),
      });

      if (callResult.success) {
        // Update lead status
        if (leadId) {
          await db.update(schema.demo_requests)
            .set({
              status: 'contacted',
              updated_at: new Date(),
            })
            .where(eq(schema.demo_requests.id, leadId));
        }

        return {
          success: true,
          action: 'voice_call_initiated',
          message: `Voice call initiated to ${leadName}`,
          data: {
            callId: (callResult as any).callId,
            voiceCallId: (callResult as any).voiceCallId,
            mock: (callResult as any).mock || false,
          },
        };
      } else {
        return {
          success: false,
          action: 'voice_call_failed',
          message: (callResult as any).error || 'Failed to initiate voice call',
        };
      }

    } catch (error) {
      console.error('[Rafi] Voice call error:', error);
      return { success: false, action: 'voice_call_failed', message: (error as Error).message };
    }
  },
};

function getFirstMessage(locale: string, name: string): string {
  const messages: Record<string, string> = {
    en: `Hi ${name}! This is Rafi from Srazzu Sync. I'm calling because you showed interest in our AI meeting platform. Do you have a moment to chat?`,
    ar: `مرحباً ${name}! هذا رافي من سرازو سينك. أتصل لأنك أظهرت اهتماماً بمنصة الاجتماعات المدعومة بالذكاء الاصطناعي. هل لديك لحظة للتحدث؟`,
    ru: `Привет ${name}! Это Рафи из Srazzu Sync. Я звоню, потому что вы проявили интерес к нашей платформе для встреч на основе ИИ. Есть ли у вас минутка поговорить?`,
  };
  return messages[locale] || messages.en;
}

function getSystemPrompt(locale: string): string {
  const prompts: Record<string, string> = {
    en: `You are Rafi, a friendly and professional sales representative from Srazzu Sync. 
Your goal is to:
1. Understand the prospect's needs and pain points
2. Explain how Srazzu Sync can help their team
3. Offer to schedule a personalized demo
4. Answer any questions they have

Be conversational, listen actively, and be helpful. If they're not interested, thank them politely and end the call.
Keep responses concise (2-3 sentences max).`,

    ar: `أنت رافي، مندوب مبيعات ودود ومحترف من سرازو سينك.
هدفك هو:
1. فهم احتياجات العميل المحتمل ونقاط الألم
2. شرح كيف يمكن لسرازو سينك مساعدة فريقهم
3. عرض جدولة عرض توضيحي مخصص
4. الإجابة على أي أسئلة لديهم

كن محادثياً، استمع بنشاط، ومتعاوناً. إذا لم يكونوا مهتمين، اشكرهم بأدب وأنهِ المكالمة.
حافظ على الرponses مختصرة (2-3 جمل كحد أقصى).`,

    ru: `Вы Рафи, дружелюбный и профессиональный представитель отдела продаж от Srazzu Sync.
Ваша цель:
1. Понять потребности и болевые точки потенциального клиента
2. Объяснить, как Srazzu Sync может помочь их команде
3. Предложить запланировать персонализированное демо
4. Ответить на любые их вопросы

Будьте разговорчивым, слушайте активно и будьте полезны. Если они не заинтересованы, поблагодарите их вежливо и завершите звонок.
Сохраняйте ответы краткими (максимум 2-3 предложения).`,
  };
  return prompts[locale] || prompts.en;
}
