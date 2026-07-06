import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { eq, and, lt, isNull } from 'drizzle-orm';
import { aria, samir, maya, omar, karim, lina, nadia, rafi } from '@/lib/agents';

// This endpoint is called every minute by Vercel cron
// It processes pending agent tasks

export async function GET(request: NextRequest) {
  try {
    console.log('[Agent Tick] Starting agent tick...');

    const results = {
      aria: { processed: 0, errors: 0 },
      samir: { processed: 0, errors: 0 },
      maya: { processed: 0, errors: 0 },
      omar: { processed: 0, errors: 0 },
      karim: { processed: 0, errors: 0 },
      lina: { processed: 0, errors: 0 },
      nadia: { processed: 0, errors: 0 },
      rafi: { processed: 0, errors: 0 },
    };

    // Get new leads that haven't been contacted
    const newLeads = await db.select()
      .from(schema.demo_requests)
      .where(eq(schema.demo_requests.status, 'new'))
      .limit(10);

    console.log(`[Agent Tick] Found ${newLeads.length} new leads`);

    // Process each new lead with Aria (welcome email) and Lina (qualification)
    for (const lead of newLeads) {
      try {
        // Lina qualifies the lead
        const qualResult = await lina.execute({
          leadId: lead.id,
          leadMessage: lead.message || '',
          leadCompany: lead.company || undefined,
          leadEmail: lead.email,
        });

        if (qualResult.success) {
          results.lina.processed++;
        } else {
          results.lina.errors++;
        }

        // Aria sends welcome email
        const ariaResult = await aria.execute({
          leadId: lead.id,
          leadName: lead.full_name,
          leadEmail: lead.email,
          leadCompany: lead.company || undefined,
          locale: (lead.locale as 'en' | 'ar' | 'ru') || 'en',
        });

        if (ariaResult.success) {
          results.aria.processed++;
        } else {
          results.aria.errors++;
        }

      } catch (error) {
        console.error(`[Agent Tick] Error processing lead ${lead.id}:`, error);
        results.aria.errors++;
        results.lina.errors++;
      }
    }

    // Get leads that need follow-up (created > 3 days ago, still 'new' or 'contacted')
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const followupLeads = await db.select()
      .from(schema.demo_requests)
      .where(
        and(
          eq(schema.demo_requests.status, 'contacted'),
          lt(schema.demo_requests.created_at, threeDaysAgo)
        )
      )
      .limit(5);

    console.log(`[Agent Tick] Found ${followupLeads.length} leads needing follow-up`);

    // Process follow-ups with Omar
    for (const lead of followupLeads) {
      try {
        const result = await omar.execute({
          leadId: lead.id,
          leadName: lead.full_name,
          leadEmail: lead.email,
          locale: (lead.locale as 'en' | 'ar' | 'ru') || 'en',
          data: { type: 'gentle_reminder' },
        });

        if (result.success) {
          results.omar.processed++;
        } else {
          results.omar.errors++;
        }

        // Update status to prevent multiple follow-ups
        await db.update(schema.demo_requests)
          .set({ status: 'qualified', updated_at: new Date() })
          .where(eq(schema.demo_requests.id, lead.id));

      } catch (error) {
        console.error(`[Agent Tick] Follow-up error for lead ${lead.id}:`, error);
        results.omar.errors++;
      }
    }

    // Get qualified leads for voice calls (Pro plan only)
    const qualifiedLeads = await db.select()
      .from(schema.demo_requests)
      .where(
        and(
          eq(schema.demo_requests.status, 'qualified'),
          isNull(schema.demo_requests.phone) // Only call if phone exists
        )
      )
      .limit(3);

    // Process voice calls with Rafi (only if admin has Pro plan)
    for (const lead of qualifiedLeads) {
      if (lead.phone) {
        try {
          const result = await rafi.execute({
            leadId: lead.id,
            leadName: lead.full_name,
            leadEmail: lead.email,
            leadPhone: lead.phone,
            locale: (lead.locale as 'en' | 'ar' | 'ru') || 'en',
            plan: 'pro', // Admin always has pro
          });

          if (result.success) {
            results.rafi.processed++;
          } else {
            results.rafi.errors++;
          }

        } catch (error) {
          console.error(`[Agent Tick] Voice call error for lead ${lead.id}:`, error);
          results.rafi.errors++;
        }
      }
    }

    console.log('[Agent Tick] Completed:', results);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });

  } catch (error) {
    console.error('[Agent Tick] Fatal error:', error);
    return NextResponse.json(
      { error: 'Agent tick failed', details: (error as Error).message },
      { status: 500 }
    );
  }
}
