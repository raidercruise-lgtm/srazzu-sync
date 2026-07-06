import { Agent, AgentContext, AgentResult } from './index';
import { db, schema } from '../db';
import { get_greeting, get_closing } from '../tools';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const omar: Agent = {
  id: 'omar',
  name: 'Omar',
  role: 'Follow-up Specialist',
  description: 'Handles follow-up sequences for unresponsive leads',
  languages: ['en', 'ar', 'ru'],

  async execute(context: AgentContext): Promise<AgentResult> {
    const { leadId, leadName, leadEmail, locale = 'en', data } = context;

    if (!leadEmail || !leadName) {
      return { success: false, action: 'followup_failed', message: 'Missing email or name' };
    }

    const followupType = data?.type || 'gentle_reminder'; // gentle_reminder, final_offer, breakup

    try {
      const emailTemplates: Record<string, Record<string, { subject: string; body: string }>> = {
        en: {
          gentle_reminder: {
            subject: `Still interested in Srazzu Sync, ${leadName}?`,
            body: `${get_greeting('en', leadName)}

I wanted to follow up on my previous message about Srazzu Sync.

I understand you're busy — that's exactly why we built this platform. Teams using Srazzu Sync save an average of 3 hours per week on meeting follow-ups alone.

Would a quick 10-minute call work better for your schedule? I can show you the key features that are most relevant to your needs.

Just reply "yes" and I'll send you a calendar link.

${get_closing('en')}`,
          },
          final_offer: {
            subject: `Last chance: Free extended trial for ${leadName}`,
            body: `${get_greeting('en', leadName)}

I don't want to be a bother, so this will be my last follow-up.

As a special offer, I'd like to give you an extended 30-day free trial (normally 14 days) to experience Srazzu Sync firsthand.

No commitment, no credit card required. Just reply "trial" and I'll set it up for you.

${get_closing('en')}`,
          },
          breakup: {
            subject: `Closing the loop, ${leadName}`,
            body: `${get_greeting('en', leadName)}

I haven't heard back from you, so I'll assume now isn't the right time.

I'll close your inquiry for now, but please don't hesitate to reach out if you'd like to explore Srazzu Sync in the future. We're always here to help.

Wishing you and your team all the best!

${get_closing('en')}`,
          },
        },
        ar: {
          gentle_reminder: {
            subject: `لا تزال مهتماً بسرازو سينك، ${leadName}؟`,
            body: `${get_greeting('ar', leadName)}

أردت المتابعة على رسالتي السابقة حول سرازو سينك.

أنا أدرك أنك مشغول — هذا بالضبط لماذا بنينا هذه المنصة. الفرق التي تستخدم سرازو سينك توفر في المتوسط 3 ساعات أسبوعياً على متابعات الاجتماعات وحدها.

${get_closing('ar')}`,
          },
          final_offer: {
            subject: `فرصة أخيرة: تجربة مجانية ممتدة لـ ${leadName}`,
            body: `${get_greeting('ar', leadName)}

لا أريد أن أزعجك، لذا ستكون هذه متابعتي الأخيرة.

كمعرض خاص، أريد أن أقدم لك تجربة مجانية لمدة 30 يوماً (عادةً 14 يوماً) لتجربة سرازو سينك بنفسك.

${get_closing('ar')}`,
          },
          breakup: {
            subject: `إغلاق الحلقة، ${leadName}`,
            body: `${get_greeting('ar', leadName)}

لم أسمع منك، لذا سأفترض أن الوقت ليس مناسباً الآن.

سأغلق استفسارك في الوقت الحالي، لكن لا تتردد في التواصل إذا أردت استكشاف سرازو سينك في المستقبل.

${get_closing('ar')}`,
          },
        },
        ru: {
          gentle_reminder: {
            subject: `Все еще интересуетесь Srazzu Sync, ${leadName}?`,
            body: `${get_greeting('ru', leadName)}

Я хотел напомнить о моем предыдущем сообщении о Srazzu Sync.

Я понимаю, что вы заняты — именно поэтому мы создали эту платформу. Команды, использующие Srazzu Sync, экономят в среднем 3 часа в неделю только на последующих действиях после встреч.

${get_closing('ru')}`,
          },
          final_offer: {
            subject: `Последний шанс: Бесплатный расширенный пробный период для ${leadName}`,
            body: `${get_greeting('ru', leadName)}

Я не хочу надоедать, поэтому это будет мое последнее напоминание.

В качестве специального предложения я хотел бы дать вам расширенный 30-дневный бесплатный пробный период (обычно 14 дней), чтобы вы могли лично оценить Srazzu Sync.

${get_closing('ru')}`,
          },
          breakup: {
            subject: `Замыкаем круг, ${leadName}`,
            body: `${get_greeting('ru', leadName)}

Я не получил от вас ответа, поэтому предположу, что сейчас не подходящее время.

Я закрою ваш запрос на данный момент, но пожалуйста, не стесняйтесь обращаться, если вы захотите изучить Srazzu Sync в будущем.

${get_closing('ru')}`,
          },
        },
      };

      const localeTemplates = emailTemplates[locale] || emailTemplates.en;
      const template = localeTemplates[followupType] || localeTemplates.gentle_reminder;

      // Send email via Resend (or mock if not configured)
      if (resend) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'Srazzu Sync <hello@srazzu.com>',
          to: leadEmail,
          subject: template.subject,
          text: template.body,
        });
      } else {
        console.log('[Omar] Email not sent (Resend not configured):', template.subject);
      }

      // Log event
      await db.insert(schema.srazzu_events).values({
        event_type: 'followup_email',
        entity_type: 'lead',
        entity_id: leadId,
        agent_id: 'omar',
        data: { type: followupType, locale },
      });

      return {
        success: true,
        action: 'followup_email_sent',
        message: `Follow-up email (${followupType}) sent to ${leadName}`,
        data: { email: leadEmail, locale, followupType },
      };

    } catch (error) {
      console.error('[Omar] Follow-up error:', error);
      return { success: false, action: 'followup_failed', message: (error as Error).message };
    }
  },
};
