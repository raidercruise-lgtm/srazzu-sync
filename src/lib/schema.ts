import { pgTable, text, timestamp, uuid, varchar, boolean, jsonb } from 'drizzle-orm/pg-core';

// Leads / Demo Requests
export const demo_requests = pgTable('demo_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  full_name: text('full_name').notNull(),
  email: text('email').notNull(),
  company: text('company'),
  phone: varchar('phone', { length: 20 }), // E.164 format for voice calls
  team_size: text('team_size'),
  message: text('message'),
  status: text('status').default('new'), // new, contacted, qualified, closed
  source: text('source').default('website'),
  locale: varchar('locale', { length: 5 }).default('en'), // en, ar, ru
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Admin Users
export const admin_users = pgTable('admin_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  name: text('name'),
  plan: text('plan').default('free'), // free, pro
  created_at: timestamp('created_at').defaultNow(),
});

// Voice Calls (Vapi integration)
export const voice_calls = pgTable('voice_calls', {
  id: uuid('id').defaultRandom().primaryKey(),
  lead_id: uuid('lead_id').references(() => demo_requests.id),
  agent_id: text('agent_id'), // which AI agent made the call
  vapi_call_id: text('vapi_call_id'),
  phone_number: varchar('phone_number', { length: 20 }).notNull(),
  direction: text('direction').default('outbound'), // inbound, outbound
  status: text('status').default('initiated'), // initiated, ringing, in-progress, completed, failed
  duration_seconds: text('duration_seconds'),
  transcript: text('transcript'),
  summary: text('summary'),
  language: varchar('language', { length: 5 }).default('en'),
  cost_cents: text('cost_cents'),
  metadata: jsonb('metadata'),
  created_at: timestamp('created_at').defaultNow(),
  ended_at: timestamp('ended_at'),
});

// Srazzu Events (activity log)
export const srazzu_events = pgTable('srazzu_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  event_type: text('event_type').notNull(), // lead_created, call_started, email_sent, etc.
  entity_type: text('entity_type'), // lead, call, agent
  entity_id: uuid('entity_id'),
  agent_id: text('agent_id'),
  data: jsonb('data'),
  created_at: timestamp('created_at').defaultNow(),
});
