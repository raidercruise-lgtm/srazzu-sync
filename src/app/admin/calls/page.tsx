'use client';

import { useState, useEffect } from 'react';

interface VoiceCall {
  id: string;
  lead_id: string | null;
  agent_id: string | null;
  vapi_call_id: string | null;
  phone_number: string;
  direction: string;
  status: string;
  duration_seconds: string | null;
  transcript: string | null;
  summary: string | null;
  language: string;
  cost_cents: string | null;
  created_at: string;
  ended_at: string | null;
}

export default function CallsPage() {
  const [calls, setCalls] = useState<VoiceCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialerOpen, setDialerOpen] = useState(false);
  const [dialerPhone, setDialerPhone] = useState('');
  const [dialerLanguage, setDialerLanguage] = useState<'en' | 'ar' | 'ru'>('en');
  const [calling, setCalling] = useState(false);

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    setLoading(true);
    try {
      // In production, fetch from API
      // Mock data for now
      const mockCalls: VoiceCall[] = [
        {
          id: '1',
          lead_id: 'lead-1',
          agent_id: 'rafi',
          vapi_call_id: 'vapi-123',
          phone_number: '+971501234567',
          direction: 'outbound',
          status: 'completed',
          duration_seconds: '180',
          transcript: 'User: Hello\nAgent: Hi, this is Rafi from Srazzu Sync...',
          summary: 'Interested in demo, scheduled for Thursday',
          language: 'en',
          cost_cents: '15',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          ended_at: new Date(Date.now() - 3420000).toISOString(),
        },
        {
          id: '2',
          lead_id: 'lead-2',
          agent_id: 'rafi',
          vapi_call_id: 'vapi-124',
          phone_number: '+79001234567',
          direction: 'outbound',
          status: 'completed',
          duration_seconds: '120',
          transcript: 'User: Алло\nAgent: Здравствуйте, это Рафи из Srazzu Sync...',
          summary: 'Requested pricing information',
          language: 'ru',
          cost_cents: '10',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          ended_at: new Date(Date.now() - 7080000).toISOString(),
        },
        {
          id: '3',
          lead_id: 'lead-3',
          agent_id: 'rafi',
          vapi_call_id: 'vapi-125',
          phone_number: '+966501234567',
          direction: 'outbound',
          status: 'completed',
          duration_seconds: '240',
          transcript: 'User: مرحبا\nAgent: مرحباً، هذا رافي من سرازو سينك...',
          summary: 'Very interested, wants to see Arabic translation feature',
          language: 'ar',
          cost_cents: '20',
          created_at: new Date(Date.now() - 10800000).toISOString(),
          ended_at: new Date(Date.now() - 10560000).toISOString(),
        },
      ];

      setTimeout(() => {
        setCalls(mockCalls);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch calls:', error);
      setLoading(false);
    }
  };

  const handleCall = async () => {
    if (!dialerPhone) return;

    setCalling(true);
    try {
      const response = await fetch('/api/agent/voice/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: dialerPhone,
          language: dialerLanguage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.mock ? 'Mock call created (Vapi not configured)' : 'Call initiated!');
        setDialerOpen(false);
        setDialerPhone('');
        fetchCalls();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to initiate call');
    } finally {
      setCalling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'initiated': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case 'en': return '🇺🇸';
      case 'ar': return '🇸🇦';
      case 'ru': return '🇷🇺';
      default: return '🌐';
    }
  };

  const formatDuration = (seconds: string | null) => {
    if (!seconds) return '-';
    const mins = Math.floor(parseInt(seconds) / 60);
    const secs = parseInt(seconds) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Voice Calls</h1>
          <p className="mt-2 text-gray-600">
            AI-powered voice calls via Vapi — trilingual support (EN/AR/RU)
          </p>
        </div>
        <button
          onClick={() => setDialerOpen(true)}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          📞 New Call
        </button>
      </div>

      {/* Dialer Modal */}
      {dialerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📞 Make a Call</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (E.164 format)
                </label>
                <input
                  type="tel"
                  value={dialerPhone}
                  onChange={(e) => setDialerPhone(e.target.value)}
                  placeholder="+971501234567"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={dialerLanguage}
                  onChange={(e) => setDialerLanguage(e.target.value as 'en' | 'ar' | 'ru')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="ar">🇸🇦 Arabic</option>
                  <option value="ru">🇷🇺 Russian</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDialerOpen(false)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCall}
                disabled={calling || !dialerPhone}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {calling ? 'Calling...' : '📞 Call'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calls Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calls...</p>
        </div>
      ) : calls.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <span className="text-6xl mb-4 block">📞</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No calls yet</h3>
          <p className="text-gray-600 mb-6">
            Voice calls will appear here once you start calling leads.
          </p>
          <button
            onClick={() => setDialerOpen(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
          >
            Make Your First Call
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Summary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {calls.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm text-gray-900">{call.phone_number}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 capitalize">{call.agent_id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg">{getLanguageFlag(call.language)}</span>
                      <span className="ml-2 text-sm text-gray-600 uppercase">{call.language}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(call.status)}`}>
                        {call.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(call.duration_seconds)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {call.summary || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(call.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
