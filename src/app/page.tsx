import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Srazzu</span>
              <span className="text-2xl font-bold text-gray-900 ml-1">Sync</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Admin
              </Link>
              <a
                href="#demo"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Book Demo
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Meetings will never<br />be the same again.
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Srazzu Sync unifies every conversation. Srazzu Flash brings AI that listens, 
            learns, and talks live — in your language, in real time. The world's No. 1 meeting platform.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#demo"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700"
            >
              Launch Srazzu Flash
            </a>
            <a
              href="#features"
              className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg text-lg font-medium hover:bg-gray-50"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600">99.9%</p>
              <p className="mt-2 text-gray-600">Live uptime</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">40+</p>
              <p className="mt-2 text-gray-600">Languages understood</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600">3×</p>
              <p className="mt-2 text-gray-600">Faster follow-ups</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Everything your team needs to run world-class meetings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '💬', title: 'Omnichannel Inbox', desc: 'WhatsApp, Instagram, Telegram, email, and web chat in one shared view.' },
              { icon: '⚡', title: 'Live AI Copilot', desc: 'Flash suggests replies, summarizes threads, and detects intent instantly.' },
              { icon: '🌐', title: 'Real-time Translation', desc: 'Speak and write in any language — Flash bridges every conversation.' },
              { icon: '🤖', title: 'Smart Automations', desc: 'No-code flows that route, tag, and reply while you sleep.' },
              { icon: '🧠', title: 'Meeting Intelligence', desc: 'Auto notes, action items, and searchable transcripts for every call.' },
              { icon: '🚀', title: 'One-click Launch', desc: 'Go live in minutes — no engineers, no friction, no manuals.' },
            ].map((feature) => (
              <div key={feature.title} className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="demo" className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to launch Srazzu Flash?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            The best platform in the world.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="mailto:demo@srazzu.com"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-medium hover:bg-gray-100"
            >
              Book a Demo
            </a>
            <a
              href="/admin"
              className="px-8 py-4 border border-white text-white rounded-lg text-lg font-medium hover:bg-blue-700"
            >
              Admin Panel
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2024 Srazzu Sync. All rights reserved.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Agent OS v1.1 — Trilingual Voice Edition (EN/AR/RU)
          </p>
        </div>
      </footer>
    </div>
  );
}
