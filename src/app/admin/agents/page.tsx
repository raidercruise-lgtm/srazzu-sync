'use client';

import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  languages: string[];
  status: string;
  stats: {
    processed: number;
    errors: number;
  };
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock agent data - in production, fetch from API
    const mockAgents: Agent[] = [
      {
        id: 'aria',
        name: 'Aria',
        role: 'Sales Development Rep',
        description: 'Handles initial outreach and demo scheduling for new leads',
        languages: ['en', 'ar', 'ru'],
        status: 'active',
        stats: { processed: 42, errors: 0 },
      },
      {
        id: 'samir',
        name: 'Samir',
        role: 'Customer Support',
        description: 'Handles support inquiries and troubleshooting',
        languages: ['en', 'ar', 'ru'],
        status: 'active',
        stats: { processed: 28, errors: 1 },
      },
      {
        id: 'maya',
        name: 'Maya',
        role: 'Lead Nurturing',
        description: 'Sends nurture sequences to keep leads engaged',
        languages: ['en', 'ar', 'ru'],
        status: 'active',
        stats: { processed: 35, errors: 0 },
      },
      {
        id: 'omar',
        name: 'Omar',
        role: 'Follow-up Specialist',
        description: 'Handles follow-up sequences for unresponsive leads',
        languages: ['en', 'ar', 'ru'],
        status: 'active',
        stats: { processed: 19, errors: 2 },
      },
      {
        id: 'karim',
        name: 'Karim',
        role: 'Billing & Invoicing',
        description: 'Handles invoice generation and payment follow-ups',
        languages: ['en', 'ar', 'ru'],
        status: 'active',
        stats: { processed: 12, errors: 0 },
      },
      {
        id: 'lina',
        name: 'Lina',
        role: 'Lead Qualification',
        description: 'Analyzes and scores leads based on their inquiries',
        languages: ['en', 'ar', 'ru'],
        status: 'active',
        stats: { processed: 42, errors: 0 },
      },
      {
        id: 'nadia',
        name: 'Nadia',
        role: 'Meeting Scheduler',
        description: 'Handles demo scheduling and calendar management',
        languages: ['en', 'ar', 'ru'],
        status: 'active',
        stats: { processed: 15, errors: 0 },
      },
      {
        id: 'rafi',
        name: 'Rafi',
        role: 'Voice Caller',
        description: 'Handles outbound voice calls for qualified leads (Pro plan only)',
        languages: ['en', 'ar', 'ru'],
        status: 'active',
        stats: { processed: 8, errors: 1 },
      },
    ];

    setTimeout(() => {
      setAgents(mockAgents);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
        <p className="mt-2 text-gray-600">
          8 AI agents powering your sales, support, and communication — trilingual (EN/AR/RU)
        </p>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                <p className="text-sm text-gray-500">{agent.role}</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                {agent.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">{agent.description}</p>

            {/* Languages */}
            <div className="flex flex-wrap gap-1 mb-4">
              {agent.languages.map((lang) => (
                <span
                  key={lang}
                  className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
                >
                  {lang.toUpperCase()}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-2xl font-bold text-gray-900">{agent.stats.processed}</p>
                <p className="text-xs text-gray-500">Processed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{agent.stats.errors}</p>
                <p className="text-xs text-gray-500">Errors</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
