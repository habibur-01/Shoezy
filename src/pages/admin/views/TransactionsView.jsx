import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  Filter,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const INITIAL_TRANSACTIONS = [
  {
    id: 'txn_9821034',
    orderId: 'ORD-2026-9841',
    customerName: 'Claire Beauchamp',
    amount: 363.59,
    type: 'charge',
    gateway: 'Stripe',
    cardLast4: '4242',
    status: 'succeeded',
    createdAt: '2026-09-05T14:32:00Z',
  },
  {
    id: 'txn_9821035',
    orderId: 'ORD-2026-9840',
    customerName: 'David Okafor',
    amount: 198.5,
    type: 'charge',
    gateway: 'Apple Pay',
    cardLast4: '8821',
    status: 'succeeded',
    createdAt: '2026-09-04T16:15:00Z',
  },
  {
    id: 'txn_9821036',
    orderId: 'ORD-2026-9837',
    customerName: 'Marcus Wright',
    amount: 144.0,
    type: 'refund',
    gateway: 'Stripe',
    cardLast4: '1092',
    status: 'refunded',
    createdAt: '2026-09-04T11:00:10Z',
  },
  {
    id: 'txn_9821037',
    orderId: 'ORD-2026-9839',
    customerName: 'Liam Zhang',
    amount: 42.0,
    type: 'charge',
    gateway: 'PayPal',
    status: 'succeeded',
    createdAt: '2026-09-03T18:22:00Z',
  },
  {
    id: 'txn_9821038',
    orderId: 'ORD-2026-9838',
    customerName: 'Amina Al-Mansoor',
    amount: 512.0,
    type: 'charge',
    gateway: 'Facebook Pay',
    status: 'succeeded',
    createdAt: '2026-09-03T09:10:00Z',
  },
];

export const TransactionsView = () => {
  const [transactions] = useState(INITIAL_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGateway, setSelectedGateway] = useState('all');

  const totalVolume = transactions
    .filter((t) => t.status === 'succeeded')
    .reduce((sum, t) => sum + (t.type === 'refund' ? -t.amount : t.amount), 0);

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGateway = selectedGateway === 'all' || t.gateway === selectedGateway;
    return matchesSearch && matchesGateway;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Payment Transactions</h1>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
              Sales Ledger
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Audit gateway settlements, transaction authorizations, merchant fees, and chargeback protections.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting ledger CSV with encrypted auth tokens...')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Export Ledger
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-zinc-400 font-medium">Settled Net Volume</span>
          <div className="text-2xl font-bold font-mono text-zinc-900 mt-1">
            ${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% PCI-DSS Compliant
          </span>
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-zinc-400 font-medium">Processed Settlements</span>
          <div className="text-2xl font-bold font-mono text-indigo-600 mt-1">
            {transactions.length}
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">All merchant streams linked</p>
        </div>

        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-2xs">
          <span className="text-[11px] text-zinc-400 font-medium">Dispute Rate</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">0.00%</div>
          <p className="text-[11px] text-zinc-500 mt-0.5">Zero active chargebacks</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search txn ID, Order ID, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'Stripe', 'PayPal', 'Apple Pay', 'Facebook Pay'].map((gw) => (
            <button
              key={gw}
              onClick={() => setSelectedGateway(gw)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedGateway === gw
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {gw === 'all' ? 'All Gateways' : gw}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Txn ID & Date</th>
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Method & Gateway</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-zinc-900 flex items-center gap-1.5">
                      {t.type === 'refund' ? (
                        <ArrowDownLeft className="w-3.5 h-3.5 text-rose-600" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      <span>{t.id}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono font-medium text-indigo-600">
                    #{t.orderId}
                  </td>

                  <td className="py-3 px-4 font-medium text-zinc-800">{t.customerName}</td>

                  <td className="py-3 px-4">
                    <span className="font-semibold text-zinc-900">{t.gateway}</span>
                    {t.cardLast4 && (
                      <span className="font-mono text-zinc-400 text-[11px] ml-1">
                        (•••• {t.cardLast4})
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono font-bold">
                    <span
                      className={t.type === 'refund' ? 'text-rose-600' : 'text-zinc-900'}
                    >
                      {t.type === 'refund' ? '-' : '+'}${t.amount.toFixed(2)}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        t.status === 'succeeded'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : t.status === 'refunded'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {t.status}
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
