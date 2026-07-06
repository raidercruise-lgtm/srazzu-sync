import { Agent, AgentContext, AgentResult } from './index';
import { db, schema } from '../db';
import { generate_email } from '../llm';
import { get_greeting, get_closing } from '../tools';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const maya: Agent = {
  id: 'maya',
  name: 'Maya',
  role: 'Lead Nurturing',
  description: 'Sends nurture sequences to keep leads engaged',
  languages: ['en', 'ar', 'ru'],

  async execute(context: AgentContext): Promise<AgentResult> {
    const { leadId, leadName, leadEmail, leadCompany, locale = 'en', data } = context;

    if (!leadEmail || !leadName) {
      return { success: false, action: 'nurture_failed', message: 'Missing email or name' };
    }

    const nurtureType = data?.type || 'value_add'; // value_add, case_study, feature_highlight

    try {
      const emailTemplates: Record<string, Record<string, { subject: string; body: string }>> = {
        en: {
          value_add: {
            subject: `${leadName}, quick tip for better meetings`,
            body: `${get_greeting('en', leadName)}

Here's a quick tip that our most successful customers use:

💡 **Start meetings with AI-generated agendas**

Before your next team call, try typing your meeting topic into Srazzu Flash. It'll generate a structured agenda, suggest time allocations, and even identify potential talking points.

Teams that use AI agendas report 3x faster decision-making.

Want to see it in action? Reply "demo" and I'll set up a personalized walkthrough.

${get_closing('en')}`,
          },
          case_study: {
            subject: `How ${leadCompany || 'companies like yours'} saved 10hrs/week`,
            body: `${get_greeting('en', leadName)}

I wanted to share how teams similar to ${leadCompany || 'yours'} are saving significant time with Srazzu Sync:

📊 **Real results:**
• 70% reduction in meeting follow-up time
• 3x faster action item tracking
• 40+ languages translated in real-time

The best part? Setup takes under 5 minutes.

${get_closing('en')}`,
          },
        },
        ar: {
          value_add: {
            subject: `${leadName}، نصيحة سريعة لاجتماعات أفضل`,
            body: `${get_greeting('ar', leadName)}

إليك نصيحة سريعة يستخدمها أكثر عملاءنا نجاحاً:

💡 **ابدأ الاجتماعات بأجندة مولدة بالذكاء الاصطناعي**

قبل مكالمتك الجماعية القادمة، جرب كتابة موضوع اجتماعك في سرازو فلاش. سيقوم بإنشاء أجندة منظمة واقتراح تخصيصات الوقت وحتى تحديد نقاط النقاش المحتملة.

${get_closing('ar')}`,
          },
          case_study: {
            subject: `كيف وفرت الشركات المشابهة لـ ${leadCompany || 'شركتك'} 10 ساعات أسبوعياً`,
            body: `${get_greeting('ar', leadName)}

أردت مشاركة كيف توفر الفرق المشابهة لـ ${leadCompany || 'فريقك'} وقتاً كبيراً مع سرازو سينك:

📊 **نتائج حقيقية:**
• تقليل 70% في وقت متابعة الاجتماعات
• تتبع أجراءات أسرع بـ 3 مرات
• ترجمة أكثر من 40 لغة في الوقت الفعلي

${get_closing('ar')}`,
          },
        },
        ru: {
          value_add: {
            subject: `${leadName}, быстрый совет для лучших встреч`,
            body: `${get_greeting('ru', leadName)}

Вот быстрый совет, который используют наши самые успешные клиенты:

💡 **Начинайте встречи с повестками, сгенерированными ИИ**

Перед следующим групповым звонком попробуйте ввести тему встречи в Srazzu Flash. Он создаст структурированную повестку, предложит распределение времени и даже определит потенциальные темы для обсуждения.

${get_closing('ru')}`,
          },
          case_study: {
            subject: `Как компании, похожие на ${leadCompany || 'вашу'}, экономят 10 часов в неделю`,
            body: `${get_greeting('ru', leadName)}

Я хотел поделиться, как команды, похожие на ${leadCompany || 'вашу'}, значительно экономят время с Srazzu Sync:

📊 **Реальные результаты:**
• Сокращение времени на последующие действия после встреч на 70%
• Отслеживание задач в 3 раза быстрее
• Перевод 40+ языков в реальном времени

${get_closing('ru')}`,
          },
        },
      };

      const localeTemplates = emailTemplates[locale] || emailTemplates.en;
      const template = localeTemplates[nurtureType] || localeTemplates.value_add;

      // Send email via Resend (or mock if not configured)
      if (resend) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'Srazzu Sync <hello@srazzu.com>',
          to: leadEmail,
          subject: template.subject,
          text: template.body,
        });
      } else {
        console.log('[Maya] Email not sent (Resend not configured):', template.subject);
      }

      // Log event
      await db.insert(schema.srazzu_events).values({
        event_type: 'nurture_email',
        entity_type: 'lead',
        entity_id: leadId,
        agent_id: 'maya',
        data: { type: nurtureType, locale },
      });

      return {
        success: true,
        action: 'nurture_email_sent',
        message: `Nurture email (${nurtureType}) sent to ${leadName}`,
        data: { email: leadEmail, locale, nurtureType },
      };

    } catch (error) {
      console.error('[Maya] Nurture error:', error);
      return { success: false, action: 'nurture_failed', message: (error as Error).message };
    }
  },
};
