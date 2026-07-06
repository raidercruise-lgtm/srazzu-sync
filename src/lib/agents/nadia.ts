import { Agent, AgentContext, AgentResult } from './index';
import { db, schema } from '../db';
import { generate_email } from '../llm';
import { get_greeting, get_closing, detect_language } from '../tools';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const nadia: Agent = {
  id: 'nadia',
  name: 'Nadia',
  role: 'Meeting Scheduler',
  description: 'Handles demo scheduling and calendar management',
  languages: ['en', 'ar', 'ru'],

  async execute(context: AgentContext): Promise<AgentResult> {
    const { leadId, leadName, leadEmail, locale = 'en', data } = context;

    if (!leadEmail || !leadName) {
      return { success: false, action: 'scheduling_failed', message: 'Missing email or name' };
    }

    const scheduleType = data?.type || 'demo_invite'; // demo_invite, reminder, confirmation

    try {
      const emailTemplates: Record<string, Record<string, { subject: string; body: string }>> = {
        en: {
          demo_invite: {
            subject: `Book Your Srazzu Sync Demo, ${leadName}`,
            body: `${get_greeting('en', leadName)}

I'd love to show you Srazzu Sync in action! 

📅 **Book a 15-minute demo** at a time that works for you:
${data?.calendarLink || '[Calendar Link]'}

During the demo, you'll see:
✅ Live AI transcription and translation
✅ Smart meeting notes and action items
✅ Omnichannel inbox setup
✅ Voice AI integration

No preparation needed — just bring your questions!

${get_closing('en')}`,
          },
          reminder: {
            subject: `Reminder: Your Srazzu Sync Demo Tomorrow`,
            body: `${get_greeting('en', leadName)}

Just a friendly reminder that your Srazzu Sync demo is scheduled for tomorrow.

📅 **Time:** ${data?.meetingTime || '[Time]'}
🔗 **Join Link:** ${data?.meetingLink || '[Meeting Link]'}

If you need to reschedule, just reply to this email.

${get_closing('en')}`,
          },
          confirmation: {
            subject: `Demo Confirmed! See You Soon, ${leadName}`,
            body: `${get_greeting('en', leadName)}

Your Srazzu Sync demo is confirmed!

📅 **Date:** ${data?.meetingDate || '[Date]'}
⏰ **Time:** ${data?.meetingTime || '[Time]'}
🔗 **Join Link:** ${data?.meetingLink || '[Meeting Link]'}

I'll send you a reminder 24 hours before. Looking forward to showing you the platform!

${get_closing('en')}`,
          },
        },
        ar: {
          demo_invite: {
            subject: `احجز عرض سرازو سينك، ${leadName}`,
            body: `${get_greeting('ar', leadName)}

أحب أن أريك سرازو سينك عملياً!

📅 **احجز عرضاً توضيحياً لمدة 15 دقيقة** في الوقت الذي يناسبك:
${data?.calendarLink || '[رابط التقويم]'}

${get_closing('ar')}`,
          },
          reminder: {
            subject: `تذكير: عرض سرازو سينك غداً`,
            body: `${get_greeting('ar', leadName)}

مذكرة ودية بأن عرض سرازو سينك مقرر غداً.

📅 **الوقت:** ${data?.meetingTime || '[الوقت]'}

${get_closing('ar')}`,
          },
          confirmation: {
            subject: `تم تأكيد العرض! نراك قريباً، ${leadName}`,
            body: `${get_greeting('ar', leadName)}

تم تأكيد عرض سرازو سينك الخاص بك!

📅 **التاريخ:** ${data?.meetingDate || '[التاريخ]'}
⏰ **الوقت:** ${data?.meetingTime || '[الوقت]'}

${get_closing('ar')}`,
          },
        },
        ru: {
          demo_invite: {
            subject: `Забронируйте демо Srazzu Sync, ${leadName}`,
            body: `${get_greeting('ru', leadName)}

Я бы хотел показать вам Srazzu Sync в действии!

📅 **Забронируйте 15-минутное демо** в удобное для вас время:
${data?.calendarLink || '[Ссылка на календарь]'}

${get_closing('ru')}`,
          },
          reminder: {
            subject: `Напоминание: Ваше демо Srazzu Sync завтра`,
            body: `${get_greeting('ru', leadName)}

Дружеское напоминание о том, что ваше демо Srazzu Sync запланировано на завтра.

📅 **Время:** ${data?.meetingTime || '[Время]'}

${get_closing('ru')}`,
          },
          confirmation: {
            subject: `Демо подтверждено! До встречи, ${leadName}`,
            body: `${get_greeting('ru', leadName)}

Ваше демо Srazzu Sync подтверждено!

📅 **Дата:** ${data?.meetingDate || '[Дата]'}
⏰ **Время:** ${data?.meetingTime || '[Время]'}

${get_closing('ru')}`,
          },
        },
      };

      const localeTemplates = emailTemplates[locale] || emailTemplates.en;
      const template = localeTemplates[scheduleType] || localeTemplates.demo_invite;

      // Send email via Resend (or mock if not configured)
      if (resend) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'Srazzu Sync <demo@srazzu.com>',
          to: leadEmail,
          subject: template.subject,
          text: template.body,
        });
      } else {
        console.log('[Nadia] Email not sent (Resend not configured):', template.subject);
      }

      // Log event
      await db.insert(schema.srazzu_events).values({
        event_type: 'schedule_email',
        entity_type: 'lead',
        entity_id: leadId,
        agent_id: 'nadia',
        data: { type: scheduleType, locale },
      });

      return {
        success: true,
        action: 'schedule_email_sent',
        message: `Scheduling email (${scheduleType}) sent to ${leadName}`,
        data: { email: leadEmail, locale, scheduleType },
      };

    } catch (error) {
      console.error('[Nadia] Scheduling error:', error);
      return { success: false, action: 'scheduling_failed', message: (error as Error).message };
    }
  },
};
