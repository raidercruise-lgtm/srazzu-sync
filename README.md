# Srazzu Sync Agent OS v1.1

## Trilingual Voice Edition (EN/AR/RU)

AI-powered meeting platform with 8 autonomous agents, live voice calling via Vapi, and trilingual support (English, Arabic, Russian).

---

## 🚀 Features

### 8 AI Agents
1. **Aria** - Sales Development Rep (welcome emails)
2. **Samir** - Customer Support (inquiry responses)
3. **Maya** - Lead Nurturing (engagement sequences)
4. **Omar** - Follow-up Specialist (re-engagement)
5. **Karim** - Billing & Invoicing (payment emails)
6. **Lina** - Lead Qualification (AI scoring)
7. **Nadia** - Meeting Scheduler (demo booking)
8. **Rafi** - Voice Caller (outbound calls via Vapi)

### Trilingual Support
- 🇺🇸 English
- 🇸🇦 Arabic (with RTL support)
- 🇷🇺 Russian

### Voice Calling (Pro Plan)
- Outbound voice calls via Vapi
- AI-powered conversations
- Real-time transcription
- Multi-language support

### Freemium Model
- **Free**: Text/email/WhatsApp agents
- **Pro**: + AI voice calling

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Groq API key
- Resend API key (for emails)
- Vapi API key (for voice calls)

### Setup

1. **Clone and install dependencies:**
```bash
cd srazzu-agent-os
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. **Setup database:**
```bash
npm run db:push
```

4. **Seed agents:**
```bash
npm run agent:seed
```

5. **Start development server:**
```bash
npm run dev
```

6. **Open in browser:**
- Homepage: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- Login: admin@srazzu.com / password

---

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14.1
- **Language**: TypeScript 5.3
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **AI**: Groq SDK (llama3-70b-8192)
- **Voice**: Vapi
- **Email**: Resend
- **Styling**: Tailwind CSS 3.4

### Project Structure
```
srazzu-agent-os/
├── src/
│   ├── app/
│   │   ├── admin/          # Admin pages
│   │   ├── api/            # API routes
│   │   ├── login/          # Login page
│   │   └── page.tsx        # Homepage
│   ├── components/
│   │   └── LeadsTable.tsx  # Leads table component
│   └── lib/
│       ├── agents/         # 8 AI agents
│       ├── auth.ts         # Authentication
│       ├── db.ts           # Database connection
│       ├── llm.ts          # Groq LLM integration
│       ├── schema.ts       # Database schema
│       ├── tools.ts        # Utility functions
│       ├── validation.ts   # Zod validation
│       └── voice.ts        # Vapi integration
├── scripts/
│   └── seed-agents.ts      # Agent initialization
├── package.json
├── vercel.json
└── .env.example
```

---

## 🔧 API Endpoints

### Public
- `POST /api/leads` - Submit demo request

### Admin (Authentication required)
- `GET /api/admin/leads` - List leads
- `POST /api/admin/leads` - Create lead
- `GET /api/admin/leads/[id]` - Get lead
- `PATCH /api/admin/leads/[id]` - Update lead
- `DELETE /api/admin/leads/[id]` - Delete lead

### Agent System
- `GET /api/agent/tick` - Cron job (every minute)
- `POST /api/agent/voice/call` - Initiate voice call

### Webhooks
- `POST /api/agent/webhook/vapi` - Vapi events
- `POST /api/agent/webhook/whatsapp` - WhatsApp messages
- `POST /api/agent/webhook/stripe` - Stripe payments

---

## 📊 Admin Dashboard

### Pages
- `/admin` - Dashboard overview
- `/admin/leads` - Lead management
- `/admin/agents` - Agent status
- `/admin/calls` - Voice call logs

### Features
- Real-time lead tracking
- Agent performance monitoring
- Voice call dialer
- Multi-language filtering

---

## 🌍 Trilingual Support

All agent emails and voice calls support three languages:
- **English** (en)
- **Arabic** (ar) - with RTL support
- **Russian** (ru)

Language is auto-detected from lead messages or can be set manually.

---

## 📞 Voice Calling

### Setup
1. Sign up at [vapi.ai](https://vapi.ai)
2. Get your API key and phone number ID
3. Add to `.env`:
```
VAPI_API_KEY=your-api-key
VAPI_PHONE_NUMBER_ID=your-phone-number-id
```

### Usage
- Admins can initiate calls from `/admin/calls`
- Leads with phone numbers show a "Call" button
- Calls are transcribed and summarized automatically

---

## 🚀 Deployment

### Vercel
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Environment Variables
See `.env.example` for all required variables.

---

## 📝 License

MIT License - Srazzu Sync

---

## 🤝 Support

For support, email support@srazzu.com or visit srazzu-sync.vercel.app
