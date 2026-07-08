'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Srazzu</span>
              <span className="text-2xl font-bold text-gray-900 ml-1">Sync</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
              <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Login</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Live Demo</span>
          <h1 className="mt-6 text-5xl font-bold text-gray-900">
            See Srazzu Sync in Action
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Watch how 8 AI agents handle your leads, schedule meetings, and close deals — automatically, 24/7, in 3 languages.
          </p>
        </div>
      </section>

      {/* Demo Video/Simulation */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            {/* Mock Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-800">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="ml-4 flex-1 bg-gray-700 rounded-lg px-4 py-1 text-sm text-gray-400">
                srazzu-sync.vercel.app/admin
              </div>
            </div>
            
            {/* Dashboard Preview */}
            <div className="p-8 bg-gray-50 min-h-[400px]">
              <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Leads', value: '1,247', icon: '👥', change: '+23%' },
                  { label: 'Qualified', value: '486', icon: '⭐', change: '+18%' },
                  { label: 'Voice Calls', value: '89', icon: '📞', change: '+45%' },
                  { label: 'Conversions', value: '127', icon: '🎯', change: '+31%' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{stat.icon}</span>
                      <span className="text-sm font-medium text-green-600">{stat.change}</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { agent: 'Aria', action: 'sent welcome email', lead: 'John Smith', time: '2 min ago', lang: '🇺🇸' },
                    { agent: 'Rafi', action: 'initiated voice call', lead: 'Ahmed Al-Rashid', time: '5 min ago', lang: '🇸🇦' },
                    { agent: 'Maya', action: 'sent nurture email', lead: 'Maria Garcia', time: '12 min ago', lang: '🇺🇸' },
                    { agent: 'Lina', action: 'qualified lead (Score: 92)', lead: 'Ivan Petrov', time: '18 min ago', lang: '🇷🇺' },
                    { agent: 'Nadia', action: 'scheduled demo', lead: 'Sarah Johnson', time: '25 min ago', lang: '🇺🇸' },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <span className="text-xl">{activity.lang}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium text-blue-600">{activity.agent}</span>{' '}
                          {activity.action} for{' '}
                          <span className="font-medium">{activity.lead}</span>
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            8 AI Agents Working for You
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Aria', role: 'Sales Dev Rep', desc: 'Sends personalized welcome emails in 3 languages', icon: '👩‍💼', color: 'bg-pink-50' },
              { name: 'Samir', role: 'Support Agent', desc: 'Handles customer inquiries and troubleshooting', icon: '🧑‍💻', color: 'bg-blue-50' },
              { name: 'Maya', role: 'Nurture Expert', desc: 'Keeps leads engaged with follow-up sequences', icon: '👩‍🔬', color: 'bg-purple-50' },
              { name: 'Rafi', role: 'Voice Caller', desc: 'Makes AI-powered voice calls to qualified leads', icon: '🧑‍✈️', color: 'bg-green-50' },
              { name: 'Karim', role: 'Billing Agent', desc: 'Handles invoices and payment follow-ups', icon: '👨‍💼', color: 'bg-yellow-50' },
              { name: 'Lina', role: 'Qualifier', desc: 'Scores and qualifies leads using AI analysis', icon: '👩‍⚖️', color: 'bg-indigo-50' },
              { name: 'Nadia', role: 'Scheduler', desc: 'Books demos and manages calendar', icon: '👩‍🏫', color: 'bg-cyan-50' },
              { name: 'Omar', role: 'Follow-up', desc: 'Re-engages unresponsive leads', icon: '🧑‍🔧', color: 'bg-orange-50' },
            ].map((agent) => (
              <div key={agent.name} className={`${agent.color} rounded-xl p-6 hover:shadow-lg transition-shadow`}>
                <span className="text-4xl">{agent.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{agent.name}</h3>
                <p className="text-sm text-blue-600 font-medium">{agent.role}</p>
                <p className="mt-2 text-sm text-gray-600">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Language Support */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Speak Your Customer's Language
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            All 8 agents communicate fluently in English, Arabic, and Russian
          </p>
          
          <div className="flex justify-center gap-12">
            {[
              { flag: '🇺🇸', name: 'English', market: 'Global' },
              { flag: '🇸🇦', name: 'Arabic', market: 'Gulf & MENA' },
              { flag: '🇷🇺', name: 'Russian', market: 'CIS & Eastern Europe' },
            ].map((lang) => (
              <div key={lang.name} className="text-center">
                <span className="text-6xl">{lang.flag}</span>
                <p className="mt-4 text-xl font-semibold text-gray-900">{lang.name}</p>
                <p className="text-gray-500">{lang.market}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Sales Process?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Start free today. No credit card required.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-medium hover:bg-gray-100"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 border border-white text-white rounded-lg text-lg font-medium hover:bg-blue-700"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">© 2024 Srazzu Sync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}