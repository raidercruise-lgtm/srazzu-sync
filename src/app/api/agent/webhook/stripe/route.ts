import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';

// POST /api/agent/webhook/stripe - Stripe webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[Stripe Webhook] Received:', body.type);

    // Handle different Stripe events
    switch (body.type) {
      case 'checkout.session.completed':
        // Upgrade admin to Pro plan
        const session = body.data.object;
        const email = session.customer_email;

        if (email) {
          await db.update(schema.admin_users)
            .set({ plan: 'pro' })
            .where(eq(schema.admin_users.email, email));
        }
        break;

      case 'customer.subscription.deleted':
        // Downgrade admin to Free plan
        const subscription = body.data.object;
        // Handle subscription cancellation
        break;
    }

    // Log event
    await db.insert(schema.srazzu_events).values({
      event_type: 'stripe_webhook',
      data: { type: body.type },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('[Stripe Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
