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
              <Link href="/demo" className="text-sm text-gray-600 hover:text-gray-900">Demo</Link>
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">AI-Powered Sales Automation</span>
          <h1 className="mt-6 text-5xl font-bold text-gray-900">
            8 AI Agents That Close Deals<br />
            <span className="text-blue-600">While You Sleep</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Srazzu Sync automates your entire sales process with 8 intelligent agents that qualify leads, send emails, make voice calls, and close deals — in English, Arabic, and Russian.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/login" className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700">
              Start Free Trial
            </Link>
            <Link href="/demo" className="px-8 py-4 border border-gray-300 text-gray-700 rounded-lg text-lg font-medium hover:bg-gray-50">
              Watch Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-8 text-center">
            {[
              { value: '8', label: 'AI Agents' },
              { value: '3', label: 'Languages' },
              { value: '24/7', label: 'Automation' },
              { value: '10x', label: 'Faster Response' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold text-blue-600">{stat.value}</p>
                <p className="mt-2 text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Meet Your AI Sales Team</h2>
            <p className="mt-4 text-xl text-gray-600">8 specialized agents working together to grow your business</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Aria', role: 'Sales Dev Rep', icon: '👩‍💼' },
              { name: 'Samir', role: 'Support Agent', icon: '🧑‍💻' },
              { name: 'Maya', role: 'Nurture Expert', icon: '👩‍🔬' },
              { name: 'Rafi', role: 'Voice Caller', icon: '🧑‍✈️' },
              { name: 'Karim', role: 'Billing Agent', icon: '👨‍💼' },
              { name: 'Lina', role: 'Lead Qualifier', icon: '👩‍⚖️' },
              { name: 'Nadia', role: 'Scheduler', icon: '👩‍🏫' },
              { name: 'Omar', role: 'Follow-up', icon: '🧑‍🔧' },
            ].map((agent) => (
              <div key={agent.name} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <span className="text-4xl">{agent.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{agent.name}</h3>
                <p className="text-sm text-gray-500">{agent.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Speak Your Customer's Language
          </h2>
          <p className="text-xl text-blue-100 mb-12">
            All agents communicate fluently in 3 languages
          </p>
          <div className="flex justify-center gap-16">
            {[
              { flag: '🇺🇸', name: 'English' },
              { flag: '🇸🇦', name: 'Arabic' },
              { flag: '🇷🇺', name: 'Russian' },
            ].map((lang) => (
              <div key={lang.name} className="text-center">
                <span className="text-6xl">{lang.flag}</span>
                <p className="mt-4 text-lg font-medium text-white">{lang.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to 10x Your Sales?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Start free today. No credit card required.
          </p>
          <Link href="/login" className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xl font-bold text-blue-600">Srazzu</span>
              <span className="text-xl font-bold text-gray-900 ml-1">Sync</span>
              <p className="mt-2 text-sm text-gray-500">AI-Powered Sales Automation</p>
            </div>
            <div className="flex gap-8">
              <Link href="/demo" className="text-gray-600 hover:text-gray-900">Demo</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            © 2024 Srazzu Sync. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}