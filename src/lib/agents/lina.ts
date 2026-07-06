import { Agent, AgentContext, AgentResult } from './index';
import { db, schema } from '../db';
import { analyze_lead } from '../llm';

export const lina: Agent = {
  id: 'lina',
  name: 'Lina',
  role: 'Lead Qualification',
  description: 'Analyzes and scores leads based on their inquiries',
  languages: ['en', 'ar', 'ru'],

  async execute(context: AgentContext): Promise<AgentResult> {
    const { leadId, leadMessage, leadCompany, leadEmail } = context;

    if (!leadMessage) {
      return { success: false, action: 'qualification_failed', message: 'No message to analyze' };
    }

    try {
      // Analyze the lead message using AI
      const analysis = await analyze_lead(leadMessage);

      // Calculate lead score based on various factors
      let score = 50; // Base score

      // Intent scoring
      if (analysis.intent === 'demo_request') score += 30;
      if (analysis.intent === 'question') score += 15;

      // Sentiment scoring
      if (analysis.sentiment === 'positive') score += 10;
      if (analysis.sentiment === 'negative') score -= 10;

      // Company presence
      if (leadCompany) score += 10;

      // Determine lead status
      let status = 'new';
      if (score >= 80) status = 'qualified';
      else if (score >= 60) status = 'contacted';

      // Update lead in database
      if (leadId) {
        await db.update(schema.demo_requests)
          .set({
            status,
            updated_at: new Date(),
          })
          .where(eq(schema.demo_requests.id, leadId));
      }

      // Log event
      await db.insert(schema.srazzu_events).values({
        event_type: 'lead_qualified',
        entity_type: 'lead',
        entity_id: leadId,
        agent_id: 'lina',
        data: {
          score,
          status,
          intent: analysis.intent,
          sentiment: analysis.sentiment,
          language: analysis.language,
          summary: analysis.summary,
        },
      });

      return {
        success: true,
        action: 'lead_qualified',
        message: `Lead scored ${score}/100 (${status})`,
        data: {
          score,
          status,
          intent: analysis.intent,
          sentiment: analysis.sentiment,
          language: analysis.language,
          summary: analysis.summary,
        },
      };

    } catch (error) {
      console.error('[Lina] Qualification error:', error);
      return { success: false, action: 'qualification_failed', message: (error as Error).message };
    }
  },
};

// Import eq from drizzle-orm
import { eq } from 'drizzle-orm';
