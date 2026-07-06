'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  totalCalls: number;
  activeAgents: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    totalCalls: 0,
    activeAgents: 8,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, fetch real stats from API
    // For now, using mock data
    setTimeout(() => {
      setStats({
        totalLeads: 42,
        newLeads: 7,
        qualifiedLeads: 15,
        totalCalls: 23,
        activeAgents: 8,
      });
      setLoading(false);
    }, 500);
  }, []);

  const statCards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: '👥',
      color: 'bg-blue-500',
      href: '/admin/leads',
    },
    {
      title: 'New Leads',
      value: stats.newLeads,
      icon: '✨',
      color: 'bg-green-500',
      href: '/admin/leads?status=new',
    },
    {
      title: 'Qualified',
      value: stats.qualifiedLeads,
      icon: '⭐',
      color: 'bg-yellow-500',
      href: '/admin/leads?status=qualified',
    },
    {
      title: 'Voice Calls',
      value: stats.totalCalls,
      icon: '📞',
      color: 'bg-purple-500',
      href: '/admin/calls',
    },
    {
      title: 'AI Agents',
      value: stats.activeAgents,
      icon: '🤖',
      color: 'bg-indigo-500',
      href: '/admin/agents',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to Srazzu Sync Agent OS v1.1 — Trilingual Voice Edition (EN/AR/RU)
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {loading ? '...' : stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg text-white text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 Agent Status</h3>
          <div className="space-y-3">
            {[
              { name: 'Aria', role: 'Sales Dev Rep', status: 'active' },
              { name: 'Samir', role: 'Support', status: 'active' },
              { name: 'Maya', role: 'Nurturing', status: 'active' },
              { name: 'Omar', role: 'Follow-up', status: 'active' },
              { name: 'Karim', role: 'Billing', status: 'active' },
              { name: 'Lina', role: 'Qualification', status: 'active' },
              { name: 'Nadia', role: 'Scheduler', status: 'active' },
              { name: 'Rafi', role: 'Voice Caller', status: 'active' },
            ].map((agent) => (
              <div key={agent.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-900">{agent.name}</span>
                  <span className="ml-2 text-sm text-gray-500">— {agent.role}</span>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  {agent.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/admin/leads"
              className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">👥</span>
                <div>
                  <p className="font-medium text-gray-900">View Leads</p>
                  <p className="text-sm text-gray-500">Manage and contact leads</p>
                </div>
              </div>
              <span className="text-blue-600">→</span>
            </Link>

            <Link
              href="/admin/calls"
              className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">📞</span>
                <div>
                  <p className="font-medium text-gray-900">Voice Calls</p>
                  <p className="text-sm text-gray-500">Monitor AI voice calls</p>
                </div>
              </div>
              <span className="text-purple-600">→</span>
            </Link>

            <a
              href="https://srazzu-sync.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">🌐</span>
                <div>
                  <p className="font-medium text-gray-900">View Live Site</p>
                  <p className="text-sm text-gray-500">Open public website</p>
                </div>
              </div>
              <span className="text-green-600">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
