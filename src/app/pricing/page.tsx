'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: 'Starter',
      price: annual ? '0' : '0',
      period: 'forever',
      description: 'Perfect for small teams getting started',
      features: [
        '3 AI Agents',
        '100 leads/month',
        'Email support',
        'English language',
        'Basic analytics',
        'Community support',
      ],
      cta: 'Start Free',
      ctaLink: '/login',
      popular: false,
      color: 'border-gray-200',
    },
    {
      name: 'Professional',
      price: annual ? '29' : '39',
      period: '/month',
      description: 'For growing businesses that need more',
      features: [
        '8 AI Agents',
        'Unlimited leads',
        'Voice calling (BYOK)',
        '3 languages (EN/AR/RU)',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'API access',
      ],
      cta: 'Start Free Trial',
      ctaLink: '/login',
      popular: true,
      color: 'border-blue-500',
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations with custom needs',
      features: [
        'Everything in Professional',
        'Unlimited agents',
        'Dedicated support',
        'Custom deployment',
        'SLA guarantee',
        'White-label options',
        'Training & onboarding',
        'Account manager',
      ],
      cta: 'Contact Sales',
      ctaLink: 'mailto:enterprise@srazzu.com',
      popular: false,
      color: 'border-gray-200',
    },
  ];

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
              <Link href="/demo" className="text-sm text-gray-600 hover:text-gray-900">Demo</Link>
              <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Login</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Annual/Monthly Toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`text-sm ${!annual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${annual ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${annual ? 'translate-x-8' : 'translate-x-1'}`}></div>
            </button>
            <span className={`text-sm ${annual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Annual <span className="text-green-600 font-medium">Save 25%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border-2 ${plan.color} p-8 ${plan.popular ? 'shadow-xl scale-105' : 'shadow-sm'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-2 text-gray-500">{plan.description}</p>
                  
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.price === 'Custom' ? '' : '$'}{plan.price}
                    </span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link
                    href={plan.ctaLink}
                    className={`block w-full text-center px-6 py-3 rounded-lg font-medium transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            {[
              {
                q: 'What does "BYOK" mean for voice calling?',
                a: 'BYOK stands for "Bring Your Own Key". For voice calling, you connect your own Vapi account and API key. You pay Vapi directly for call minutes, and we don\'t charge extra for voice features in the Professional plan.',
              },
              {
                q: 'Can I upgrade or downgrade anytime?',
                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing differences.',
              },
              {
                q: 'What languages are supported?',
                a: 'Currently we support English, Arabic, and Russian. All 8 AI agents can communicate fluently in all three languages. We\'re adding more languages soon!',
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes! The Starter plan is completely free forever. The Professional plan comes with a 14-day free trial, no credit card required.',
              },
              {
                q: 'What happens if I exceed my lead limit?',
                a: 'On the Starter plan, we\'ll notify you when you\'re close to your limit. You can upgrade to Professional for unlimited leads at any time.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">{faq.q}</h3>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of businesses using Srazzu Sync to automate their sales process.
          </p>
          <Link
            href="/login"
            className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-medium hover:bg-gray-100"
          >
            Start Free Today
          </Link>
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