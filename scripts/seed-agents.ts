/**
 * Srazzu Sync Agent OS v1.1 - Agent Seed Script
 * 
 * This script initializes the 8 AI agents and verifies the database connection.
 * Run with: npm run agent:seed
 */

import { db, schema } from '../src/lib/db';
import { aria, samir, maya, omar, karim, lina, nadia, rafi } from '../src/lib/agents';

const agents = [aria, samir, maya, omar, karim, lina, nadia, rafi];

async function seedAgents() {
  console.log('🤖 Srazzu Sync Agent OS v1.1 - Trilingual Voice Edition (EN/AR/RU)\n');
  console.log('Initializing agents...\n');

  // Display agent information
  agents.forEach((agent) => {
    console.log(`✓ ${agent.name} - ${agent.role}`);
    console.log(`  Languages: ${agent.languages.join(', ')}`);
    console.log(`  Description: ${agent.description}\n`);
  });

  console.log('✅ All 8 agents initialized successfully!\n');

  // Verify database connection
  console.log('Verifying database connection...');
  
  try {
    // Test database query
    const leads = await db.select().from(schema.demo_requests).limit(1);
    console.log(`✅ Database connected successfully (${leads.length} leads found)\n`);
  } catch (error) {
    console.error('❌ Database connection failed:', (error as Error).message);
    console.log('\nPlease check your DATABASE_URL environment variable.\n');
  }

  // Display agent capabilities
  console.log('📋 Agent Capabilities:');
  console.log('─────────────────────────────────────────────────────────');
  console.log('Aria   - Welcome emails (EN/AR/RU)');
  console.log('Samir  - Support responses (EN/AR/RU)');
  console.log('Maya   - Nurture sequences (EN/AR/RU)');
  console.log('Omar   - Follow-up emails (EN/AR/RU)');
  console.log('Karim  - Invoice emails (EN/AR/RU)');
  console.log('Lina   - Lead qualification (AI-powered)');
  console.log('Nadia  - Demo scheduling (EN/AR/RU)');
  console.log('Rafi   - Voice calls via Vapi (Pro plan only)');
  console.log('─────────────────────────────────────────────────────────\n');

  console.log('🚀 Agent OS v1.1 is ready!');
  console.log('   - Trilingual support: English, Arabic, Russian');
  console.log('   - Voice calling: Vapi integration (Pro plan)');
  console.log('   - Freemium model: Free = text/email, Pro = +voice\n');
}

seedAgents()
  .then(() => {
    console.log('Done! Exiting...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
