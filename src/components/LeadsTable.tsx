'use client';

import { useState } from 'react';

interface Lead {
  id: string;
  full_name: string;
  email: string;
  company: string | null;
  phone: string | null;
  team_size: string | null;
  message: string | null;
  status: string;
  source: string;
  locale: string;
  created_at: string;
  updated_at: string;
}

interface LeadsTableProps {
  leads: Lead[];
  onRefresh: () => void;
}

export default function LeadsTable({ leads, onRefresh }: LeadsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [callingId, setCallingId] = useState<string | null>(null);

  const handleCall = async (lead: Lead) => {
    if (!lead.phone) {
      alert('No phone number available for this lead');
      return;
    }

    setCallingId(lead.id);
    try {
      const response = await fetch('/api/agent/voice/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_id: lead.id,
          phone: lead.phone,
          language: lead.locale,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.mock ? 'Mock call created (Vapi not configured)' : 'Call initiated!');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Failed to initiate call');
    } finally {
      setCallingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'qualified': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocaleFlag = (locale: string) => {
    switch (locale) {
      case 'en': return '🇺🇸';
      case 'ar': return '🇸🇦';
      case 'ru': return '🇷🇺';
      default: return '🌐';
    }
  };

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <span className="text-6xl mb-4 block">👥</span>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads found</h3>
        <p className="text-gray-600">
          Leads will appear here when they submit demo requests on your website.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lang
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <>
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{lead.full_name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{lead.email}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lead.phone ? (
                      <span className="font-mono text-sm text-gray-900">{lead.phone}</span>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{lead.company || '—'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg">{getLocaleFlag(lead.locale)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {lead.phone && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(lead);
                        }}
                        disabled={callingId === lead.id}
                        className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {callingId === lead.id ? '...' : '📞 Call'}
                      </button>
                    )}
                  </td>
                </tr>
                {expandedId === lead.id && (
                  <tr key={`${lead.id}-expanded`}>
                    <td colSpan={8} className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Message</p>
                          <p className="mt-1 text-sm text-gray-900">{lead.message || 'No message'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Team Size</p>
                          <p className="mt-1 text-sm text-gray-900">{lead.team_size || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Source</p>
                          <p className="mt-1 text-sm text-gray-900">{lead.source}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Last Updated</p>
                          <p className="mt-1 text-sm text-gray-900">
                            {new Date(lead.updated_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
