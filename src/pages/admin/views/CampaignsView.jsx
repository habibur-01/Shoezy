import React, { useState } from 'react';
import {
  Send,
  Plus,
  Search,
  Mail,
  MessageSquare,
  Share2,
  TrendingUp,
  BarChart2,
  Users,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';

const INITIAL_CAMPAIGNS = [
  {
    id: 'camp_01',
    name: 'VIP Fall Catalog Launch',
    channel: 'Email Newsletter',
    audienceSegment: 'VIP Tier (> $3,000 LTV)',
    sentCount: 1420,
    openRate: '48.2%',
    clickRate: '19.4%',
    attributedRevenue: 12450.0,
    status: 'active',
    launchDate: '2026-09-02',
  },
  {
    id: 'camp_02',
    name: 'Flash Restock WhatsApp Alert',
    channel: 'WhatsApp Broadcast',
    audienceSegment: 'Waitlist Subscribers',
    sentCount: 890,
    openRate: '92.1%',
    clickRate: '34.8%',
    attributedRevenue: 7890.0,
    status: 'completed',
    launchDate: '2026-08-28',
  },
  {
    id: 'camp_03',
    name: 'Studio Audio Audiophile Push',
    channel: 'Instagram Ad',
    audienceSegment: 'Electronics Affinity Lookalikes',
    sentCount: 18500,
    openRate: 'N/A',
    clickRate: '4.8%',
    attributedRevenue: 19800.0,
    status: 'active',
    launchDate: '2026-09-01',
  },
  {
    id: 'camp_04',
    name: 'Abandoned Cart SMS Recovery',
    channel: 'SMS Alert',
    audienceSegment: 'High-intent Cart Abandoners',
    sentCount: 412,
    openRate: '98.0%',
    clickRate: '41.2%',
    attributedRevenue: 4320.0,
    status: 'active',
    launchDate: '2026-09-04',
  },
];

export const CampaignsView = () => {
  const [campaigns] = useState(INITIAL_CAMPAIGNS);
  const [searchQuery, setSearchQuery] = useState('');

  const totalAttributed = campaigns.reduce((sum, c) => sum + c.attributedRevenue, 0);

  const filtered = campaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.channel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.audienceSegment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Marketing Campaigns & Omnichannel</h1>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
              Growth Engine
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Broadcast promotional newsletters, track conversion click-through rates, and measure multi-channel ROI.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-zinc-400 font-medium">Attributed Campaign Sales</span>
          <div className="text-2xl font-bold font-mono text-zinc-900 mt-1">
            ${totalAttributed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            +24.6% vs previous period
          </p>
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-zinc-400 font-medium">Active Broadcasts</span>
          <div className="text-2xl font-bold font-mono text-indigo-600 mt-1">
            {campaigns.filter((c) => c.status === 'active').length} Channels
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">Running automations</p>
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-zinc-400 font-medium">Average SMS / WhatsApp CTR</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">38.0%</div>
          <p className="text-[11px] text-zinc-500 mt-0.5">Direct response engagement</p>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Channel & Segment</th>
                <th className="py-3 px-4">Audience Reach</th>
                <th className="py-3 px-4">Open / CTR</th>
                <th className="py-3 px-4">Attributed Sales</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-zinc-900">{c.name}</div>
                    <div className="text-[11px] text-zinc-400">Launched: {c.launchDate}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 text-[10px] font-semibold">
                      {c.channel}
                    </span>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{c.audienceSegment}</div>
                  </td>

                  <td className="py-3 px-4 font-mono font-medium text-zinc-800">
                    {c.sentCount.toLocaleString()} recipients
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-mono text-zinc-900 font-semibold">{c.clickRate} CTR</div>
                    {c.openRate !== 'N/A' && (
                      <div className="text-[10px] text-zinc-400">Open: {c.openRate}</div>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-emerald-600">
                    ${c.attributedRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
