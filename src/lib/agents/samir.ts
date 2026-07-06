import { Agent, AgentContext, AgentResult } from './index';
import { db, schema } from '../db';
import { generate_email } from '../llm';
import { get_greeting, get_closing } from '../tools';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const samir: Agent = {
  id: 'samir',
  name: 'Samir',
  role: 'Customer Support',
  description: 'Handles support inquiries and troubleshooting',
  languages: ['en', 'ar', 'ru'],

  async execute(context: AgentContext): Promise<AgentResult> {
    const { leadId, leadName, leadEmail, leadMessage, locale = 'en' } = context;

    if (!leadEmail || !leadName) {
      return { success: false, action: 'support_failed', message: 'Missing email or name' };
    }

    try {
      // Generate AI response based on the inquiry
      const aiResponse = await generate_email(
        `The user ${leadName} has a support inquiry: "${leadMessage}". 
         Write a helpful, professional support response in ${locale === 'ar' ? 'Arabic' : locale === 'ru' ? 'Russian' : 'English'}.
         Address their specific question and offer additional help.`,
        locale
      );

      const emailTemplates: Record<string, { subject: string; greeting: string }> = {
        en: {
          subject: `Re: Your inquiry - Srazzu Sync Support`,
          greeting: `${get_greeting('en', leadName)}\n\nThank you for reaching out to Srazzu Sync support. `,
        },
        ar: {
          subject: `رد: استفسارك - دعم سرازو سينك`,
          greeting: `${get_greeting('ar', leadName)}\n\nشكراً لتواصلك مع دعم سرازو سينك. `,
        },
        ru: {
          subject: `Re: Ваш запрос - Поддержка Srazzu Sync`,
          greeting: `${get_greeting('ru', leadName)}\n\nСпасибо за обращение в поддержку Srazzu Sync. `,
        },
      };

      const template = emailTemplates[locale] || emailTemplates.en;

      // Send email via Resend (or mock if not configured)
      if (resend) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'Srazzu Support <support@srazzu.com>',
          to: leadEmail,
          subject: template.subject,
          text: `${template.greeting}${aiResponse}\n\n${get_closing(locale)}`,
        });
      } else {
        console.log('[Samir] Email not sent (Resend not configured):', template.subject);
      }

      // Log event
      await db.insert(schema.srazzu_events).values({
        event_type: 'support_response',
        entity_type: 'lead',
        entity_id: leadId,
        agent_id: 'samir',
        data: { locale, inquiry: leadMessage?.slice(0, 200) },
      });

      return {
        success: true,
        action: 'support_response_sent',
        message: `Support response sent to ${leadName}`,
        data: { email: leadEmail, locale },
      };

    } catch (error) {
      console.error('[Samir] Support error:', error);
      return { success: false, action: 'support_failed', message: (error as Error).message };
    }
  },
};
