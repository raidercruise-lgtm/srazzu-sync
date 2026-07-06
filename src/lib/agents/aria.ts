import { Agent, AgentContext, AgentResult } from './index';
import { db, schema } from '../db';
import { generate_email } from '../llm';
import { get_greeting, get_closing } from '../tools';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const aria: Agent = {
  id: 'aria',
  name: 'Aria',
  role: 'Sales Development Rep',
  description: 'Handles initial outreach and demo scheduling for new leads',
  languages: ['en', 'ar', 'ru'],

  async execute(context: AgentContext): Promise<AgentResult> {
    const { leadId, leadName, leadEmail, locale = 'en', leadCompany } = context;

    if (!leadEmail || !leadName) {
      return { success: false, action: 'email_failed', message: 'Missing email or name' };
    }

    try {
      // Generate trilingual email content
      const emailTemplates: Record<string, { subject: string; body: string }> = {
        en: {
          subject: `Welcome to Srazzu Sync, ${leadName}!`,
          body: `${get_greeting('en', leadName)}

Thank you for your interest in Srazzu Sync! We're excited to show you how our AI-powered meeting platform can transform your team's communication.

${leadCompany ? `I noticed you're from ${leadCompany} — we work with many similar companies and I'd love to share some relevant use cases.` : ''}

Would you be available for a quick 15-minute demo this week? I can show you:
• Live AI transcription and translation (40+ languages)
• Smart meeting notes and action items
• Omnichannel inbox (WhatsApp, Instagram, Telegram, email)

Just reply to this email or click here to book a time that works for you.

${get_closing('en')}`,
        },
        ar: {
          subject: `مرحباً بك في سرازو سينك، ${leadName}!`,
          body: `${get_greeting('ar', leadName)}

شكراً لاهتمامك بسرازو سينك! نحن متحمسون لإظهار كيف يمكن لمنصتنا المدعومة بالذكاء الاصطناعي أن تحول comunicación فريقك.

${leadCompany ? `لاحظت أنك من ${leadCompany} — نعمل مع العديد من الشركات المشابهة وأحب أن أشاركك بعض حالات الاستخدام ذات الصلة.` : ''}

هل تكون متاحاً لعرض توضيحي سريع لمدة 15 دقيقة هذا الأسبوع؟ يمكنني أن أريك:
• النسخ والترجمة الفورية بالذكاء الاصطناعي (أكثر من 40 لغة)
• الملاحظات الذكية وإجراءات الاجتماع
• صندوق الوصل الموحد (واتساب، إنستغرام، تيليغرام، بريد إلكتروني)

${get_closing('ar')}`,
        },
        ru: {
          subject: `Добро пожаловать в Srazzu Sync, ${leadName}!`,
          body: `${get_greeting('ru', leadName)}

Спасибо за ваш интерес к Srazzu Sync! Мы рады показать вам, как наша платформа на основе ИИ может изменить коммуникацию вашей команды.

${leadCompany ? `Я заметил, что вы из ${leadCompany} — мы работаем со многими похожими компаниями и хотел бы поделиться релевантными кейсами.` : ''}

Будете ли вы доступны для короткой 15-минутной демо на этой неделе? Я могу показать вам:
• Живая транскрипция и перевод с помощью ИИ (40+ языков)
• Умные заметки встреч и задачи
• Единый почтовый ящик (WhatsApp, Instagram, Telegram, электронная почта)

Просто ответьте на это письмо или нажмите здесь, чтобы забронировать удобное время.

${get_closing('ru')}`,
        },
      };

      const template = emailTemplates[locale] || emailTemplates.en;

      // Send email via Resend (or mock if not configured)
      if (resend) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'Srazzu Sync <noreply@srazzu.com>',
          to: leadEmail,
          subject: template.subject,
          text: template.body,
        });
      } else {
        console.log('[Aria] Email not sent (Resend not configured):', template.subject);
      }

      // Log event
      await db.insert(schema.srazzu_events).values({
        event_type: 'email_sent',
        entity_type: 'lead',
        entity_id: leadId,
        agent_id: 'aria',
        data: { type: 'welcome', locale, email: leadEmail },
      });

      return {
        success: true,
        action: 'welcome_email_sent',
        message: `Welcome email sent to ${leadName} (${locale})`,
        data: { email: leadEmail, locale },
      };

    } catch (error) {
      console.error('[Aria] Email error:', error);
      return { success: false, action: 'email_failed', message: (error as Error).message };
    }
  },
};
