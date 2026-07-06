import { Agent, AgentContext, AgentResult } from './index';
import { db, schema } from '../db';
import { get_greeting, get_closing } from '../tools';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const karim: Agent = {
  id: 'karim',
  name: 'Karim',
  role: 'Billing & Invoicing',
  description: 'Handles invoice generation and payment follow-ups',
  languages: ['en', 'ar', 'ru'],

  async execute(context: AgentContext): Promise<AgentResult> {
    const { leadId, leadName, leadEmail, locale = 'en', data } = context;

    if (!leadEmail || !leadName) {
      return { success: false, action: 'invoice_failed', message: 'Missing email or name' };
    }

    const invoiceType = data?.type || 'invoice'; // invoice, payment_reminder, receipt
    const amount = data?.amount || '0';
    const invoiceNumber = data?.invoiceNumber || `INV-${Date.now()}`;

    try {
      const emailTemplates: Record<string, Record<string, { subject: string; body: string }>> = {
        en: {
          invoice: {
            subject: `Invoice ${invoiceNumber} - Srazzu Sync`,
            body: `${get_greeting('en', leadName)}

Please find your invoice details below:

📋 **Invoice Number:** ${invoiceNumber}
💰 **Amount:** $${amount}
📅 **Due Date:** ${data?.dueDate || 'Upon receipt'}

**Services:**
${data?.items || '• Srazzu Sync Pro Plan - Monthly Subscription'}

To make a payment, please use the following link:
${data?.paymentLink || '[Payment Link]'}

If you have any questions about this invoice, please don't hesitate to reach out.

${get_closing('en')}`,
          },
          payment_reminder: {
            subject: `Payment Reminder: Invoice ${invoiceNumber}`,
            body: `${get_greeting('en', leadName)}

This is a friendly reminder that Invoice ${invoiceNumber} for $${amount} is due soon.

To avoid any interruption to your service, please submit payment at your earliest convenience.

${get_closing('en')}`,
          },
          receipt: {
            subject: `Payment Received - Thank You! ${invoiceNumber}`,
            body: `${get_greeting('en', leadName)}

Thank you for your payment of $${amount} for Invoice ${invoiceNumber}.

Your payment has been processed successfully. You'll find your receipt attached to this email.

Your Srazzu Sync Pro features are fully active. Enjoy!

${get_closing('en')}`,
          },
        },
        ar: {
          invoice: {
            subject: `فاتورة ${invoiceNumber} - سرازو سينك`,
            body: `${get_greeting('ar', leadName)}

يرجى العثور على تفاصيل فاتورتك أدناه:

📋 **رقم الفاتورة:** ${invoiceNumber}
💰 **المبلغ:** $${amount}
📅 **تاريخ الاستحقاق:** ${data?.dueDate || 'عند الاستلام'}

**الخدمات:**
${data?.items || '• خطة سرازو سينك برو - اشتراك شهري'}

لإجراء الدفع، يرجى استخدام الرابط التالي:
${data?.paymentLink || '[رابط الدفع]'}

${get_closing('ar')}`,
          },
          payment_reminder: {
            subject: `تذكير بالدفع: فاتورة ${invoiceNumber}`,
            body: `${get_greeting('ar', leadName)}

هذا تذكير ودي بأن الفاتورة ${invoiceNumber} بقيمة $${amount} مستحقة قريباً.

لتجنب أي انقطاع في خدمتك، يرجى تقديم الدفع في أقرب وقت ممكن.

${get_closing('ar')}`,
          },
          receipt: {
            subject: `تم استلام الدفع - شكراً لك! ${invoiceNumber}`,
            body: `${get_greeting('ar', leadName)}

شكراً لدفعك $${amount} للفاتورة ${invoiceNumber}.

تمت معالجة دفعتك بنجاح. ستجد إيصالك مرفقاً بهذا البريد الإلكتروني.

${get_closing('ar')}`,
          },
        },
        ru: {
          invoice: {
            subject: `Счет ${invoiceNumber} - Srazzu Sync`,
            body: `${get_greeting('ru', leadName)}

Пожалуйста, ознакомьтесь с деталями вашего счета ниже:

📋 **Номер счета:** ${invoiceNumber}
💰 **Сумма:** $${amount}
📅 **Срок оплаты:** ${data?.dueDate || 'По получении'}

**Услуги:**
${data?.items || '• Srazzu Sync Pro Plan - Ежемесячная подписка'}

Для оплаты, пожалуйста, используйте следующую ссылку:
${data?.paymentLink || '[Ссылка на оплату]'}

${get_closing('ru')}`,
          },
          payment_reminder: {
            subject: `Напоминание об оплате: Счет ${invoiceNumber}`,
            body: `${get_greeting('ru', leadName)}

Это дружеское напоминание о том, что счет ${invoiceNumber} на сумму $${amount} скоро истекает.

Чтобы избежать перерыва в обслуживании, пожалуйста, произведите оплату в ближайшее время.

${get_closing('ru')}`,
          },
          receipt: {
            subject: `Оплата получена - Спасибо! ${invoiceNumber}`,
            body: `${get_greeting('ru', leadName)}

Спасибо за оплату $${amount} по счету ${invoiceNumber}.

Ваш платеж успешно обработан. Вы найдете чек в приложении к этому письму.

${get_closing('ru')}`,
          },
        },
      };

      const localeTemplates = emailTemplates[locale] || emailTemplates.en;
      const template = localeTemplates[invoiceType] || localeTemplates.invoice;

      // Send email via Resend (or mock if not configured)
      if (resend) {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'Srazzu Billing <billing@srazzu.com>',
          to: leadEmail,
          subject: template.subject,
          text: template.body,
        });
      } else {
        console.log('[Karim] Email not sent (Resend not configured):', template.subject);
      }

      // Log event
      await db.insert(schema.srazzu_events).values({
        event_type: 'invoice_sent',
        entity_type: 'lead',
        entity_id: leadId,
        agent_id: 'karim',
        data: { type: invoiceType, locale, amount, invoiceNumber },
      });

      return {
        success: true,
        action: 'invoice_email_sent',
        message: `Invoice email (${invoiceType}) sent to ${leadName}`,
        data: { email: leadEmail, locale, invoiceType, amount },
      };

    } catch (error) {
      console.error('[Karim] Invoice error:', error);
      return { success: false, action: 'invoice_failed', message: (error as Error).message };
    }
  },
};
