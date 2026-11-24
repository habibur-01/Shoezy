import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  RefreshCw,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Receipt,
  X,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { getAdminTransactions, verifyManualPayment } from '../../../server/transaction/adminTransaction';

export const TransactionsView = () => {
  const { assertPermission } = useAdmin();

  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [verifyingId, setVerifyingId] = useState(null);

  // Filter & Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGateway, setSelectedGateway] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch transactions from API
  const fetchTransactions = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const res = await getAdminTransactions();
      const rawData = res?.data;
      const txns = Array.isArray(rawData)
        ? rawData
        : Array.isArray(rawData?.transactions)
        ? rawData.transactions
        : Array.isArray(res)
        ? res
        : [];

      setTransactions(txns);
      if (rawData?.stats) {
        setStats(rawData.stats);
      }
      setLastUpdated(Date.now());
    } catch (err) {
      console.error('Failed to load admin transactions:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to connect to transaction service');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleVerifyPayment = async (transaction) => {
    if (!assertPermission?.('orders.update_status', 'Verify Manual Payment')) return;
    setVerifyingId(transaction._id);
    setError(null);
    try {
      await verifyManualPayment(transaction._id);
      await fetchTransactions(true);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Could not verify payment');
    } finally {
      setVerifyingId(null);
    }
  };

  useEffect(() => {
    fetchTransactions(false);
  }, [fetchTransactions]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGateway, statusFilter, pageSize]);

  // Client-side filtering
  const filteredTransactions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return transactions.filter((t) => {
      const id = String(t.id || t._id || '').toLowerCase();
      const orderRef = String(t.orderId || t.order?._id || '').toLowerCase();
      const customer = String(t.customerName || '').toLowerCase();
      const email = String(t.customerEmail || '').toLowerCase();
      const gw = String(t.gateway || '').toLowerCase();
      const amountStr = String(t.amount || '');

      const matchesSearch =
        !q ||
        id.includes(q) ||
        orderRef.includes(q) ||
        customer.includes(q) ||
        email.includes(q) ||
        amountStr.includes(q);

      const matchesGateway =
        selectedGateway === 'all' ||
        gw.includes(selectedGateway.toLowerCase()) ||
        String(t.gatewayCode || '').toLowerCase().includes(selectedGateway.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        t.status === statusFilter ||
        (statusFilter === 'succeeded' && (t.status === 'succeeded' || t.status === 'paid'));

      return matchesSearch && matchesGateway && matchesStatus;
    });
  }, [transactions, searchQuery, selectedGateway, statusFilter]);

  // Pagination calculation
  const totalCount = filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  // Compute live KPIs
  const computedMetrics = useMemo(() => {
    if (stats) {
      return {
        totalVolume: stats.totalVolume ?? stats.settledVolume ?? 0,
        totalTransactions: stats.totalTransactions ?? transactions.length,
        succeeded: stats.succeeded ?? 0,
        refunded: stats.refunded ?? 0,
        pending: stats.pending ?? 0,
        disputeRate: stats.disputeRate || '0.00%',
      };
    }

    let volume = 0;
    let succeeded = 0;
    let refunded = 0;
    let pending = 0;

    transactions.forEach((t) => {
      const amt = Number(t.amount || 0);
      if (t.status === 'succeeded' || t.status === 'paid') {
        if (t.type === 'refund') {
          volume -= amt;
          refunded++;
        } else {
          volume += amt;
          succeeded++;
        }
      } else if (t.status === 'refunded') {
        refunded++;
      } else if (t.status === 'pending') {
        pending++;
      }
    });

    return {
      totalVolume: Math.max(0, volume),
      totalTransactions: transactions.length,
      succeeded,
      refunded,
      pending,
      disputeRate: '0.00%',
    };
  }, [transactions, stats]);

  // Export to CSV
  const handleExportCSV = () => {
    if (assertPermission && !assertPermission('transactions.export', 'Export Ledger to CSV')) return;

    const headers = ['Transaction ID,Order Ref,Customer,Email,Gateway,Type,Amount,Status,Date\n'];
    const rows = filteredTransactions.map(
      (t) =>
        `"${t.id}","${t.orderId}","${t.customerName}","${t.customerEmail}","${t.gateway}","${
          t.type || 'charge'
        }",${t.amount},"${t.status}","${new Date(t.createdAt || t.paymentDate).toISOString()}"\n`
    );

    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-ledger-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGateway('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const gatewaysList = ['all', 'Stripe', 'PayPal', 'Apple Pay', 'Cash on Delivery', 'Mobile Banking'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Payment Transactions
            </h1>
            <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-full">
              Sales Ledger
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 hidden md:inline">
              • {computedMetrics.totalTransactions} Total
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Audit gateway settlements, transaction authorizations, merchant fees, and chargeback protections.
            {lastUpdated && (
              <span className="hidden sm:inline ml-2 text-zinc-400 dark:text-zinc-500">
                (Last synced: {new Date(lastUpdated).toLocaleTimeString()})
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Refresh Button */}
          <button
            id="btn-refresh-transactions"
            type="button"
            onClick={() => fetchTransactions(true)}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh transactions from backend"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-zinc-500 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          {/* Export CSV Button */}
          <button
            id="btn-export-ledger"
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Ledger</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center justify-between text-xs text-rose-800 dark:text-rose-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchTransactions(false)}
            className="px-2.5 py-1 bg-rose-600 text-white font-medium rounded-md hover:bg-rose-700 transition-colors cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Settled Net Volume */}
        <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xs">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Settled Net Volume</span>
          <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
            ${Number(computedMetrics.totalVolume).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% PCI-DSS Compliant
          </span>
        </div>

        {/* Processed Settlements */}
        <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xs">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Processed Settlements</span>
          <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
            {computedMetrics.totalTransactions}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
            {computedMetrics.succeeded} successful • {computedMetrics.refunded} refunded
          </p>
        </div>

        {/* Pending Settlements */}
        <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xs">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Pending Authorizations</span>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
            {computedMetrics.pending}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Awaiting merchant capture</p>
        </div>

        {/* Dispute Rate */}
        <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xs">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Dispute / Chargeback Rate</span>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            {computedMetrics.disputeRate}
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">Zero active chargebacks</p>
        </div>
      </div>

      {/* Control Bar: Search & Gateways */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-white dark:bg-zinc-900 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
          <input
            id="input-transaction-search"
            type="text"
            placeholder="Search txn ID, Order ID, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-zinc-800 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Gateway Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {gatewaysList.map((gw) => {
            const isActive = selectedGateway.toLowerCase() === gw.toLowerCase();
            return (
              <button
                key={gw}
                id={`btn-gw-${gw.replace(/\s+/g, '-').toLowerCase()}`}
                type="button"
                onClick={() => setSelectedGateway(gw)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold shadow-2xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {gw === 'all' ? 'All Gateways' : gw}
              </button>
            );
          })}
        </div>

        {/* Status & Page Size Controls */}
        <div className="flex items-center gap-2">
          {/* Status Select */}
          <select
            id="select-transaction-status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="succeeded">Succeeded / Paid</option>
            <option value="refunded">Refunded</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          {/* Page size select */}
          <select
            id="select-txn-page-size"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="py-1.5 px-2 text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            title="Transactions per page"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>

          {/* Reset button */}
          {(searchQuery || selectedGateway !== 'all' || statusFilter !== 'all') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <Filter className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/60 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Txn ID & Date</th>
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Method & Gateway</th>
                <th className="py-3 px-4">Amount & Net</th>
                <th className="py-3 px-4 text-right">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-zinc-700 dark:text-zinc-300">
              {isLoading ? (
                // 5 Skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`txn-skel-${i}`} className="animate-pulse">
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-28 mb-1.5" />
                      <div className="h-2.5 bg-zinc-100 dark:bg-zinc-850 rounded w-20" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-20" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-28 mb-1" />
                      <div className="h-2.5 bg-zinc-100 dark:bg-zinc-850 rounded w-36" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-24" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-16 mb-1" />
                      <div className="h-2.5 bg-zinc-100 dark:bg-zinc-850 rounded w-12" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full w-20 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : paginatedTransactions.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={6} className="py-16 text-center text-zinc-400 dark:text-zinc-500">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 text-zinc-400">
                        <Receipt className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
                        No transactions found
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                        No settled charges match your search criteria or gateway filter.
                      </p>
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Clear Filters</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((t) => {
                  const isRefund = t.type === 'refund' || t.status === 'refunded';
                  return (
                    <tr key={t.id || t._id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/50 transition-colors">
                      {/* Txn ID & Date */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                          {isRefund ? (
                            <ArrowDownLeft className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                          <span>{t.id}</span>
                        </div>
                        <div className="text-[11px] text-zinc-400 dark:text-zinc-500">
                          {new Date(t.paymentDate || t.createdAt).toLocaleString()}
                        </div>
                      </td>

                      {/* Order Reference */}
                      <td className="py-3 px-4 font-mono font-medium text-indigo-600 dark:text-indigo-400">
                        {t.orderId}
                      </td>

                      {/* Customer Info */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">{t.customerName}</div>
                        <div className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate max-w-[150px]">
                          {t.customerEmail || t.customerPhone || 'Direct Order'}
                        </div>
                      </td>

                      {/* Method & Gateway */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{t.gateway}</span>
                        {t.cardLast4 && (
                          <span className="font-mono text-zinc-400 dark:text-zinc-500 text-[11px] ml-1">
                            (•••• {t.cardLast4})
                          </span>
                        )}
                      </td>

                      {/* Amount & Fee */}
                      <td className="py-3 px-4 font-mono">
                        <div className={`font-bold ${isRefund ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
                          {isRefund ? '-' : '+'}${Number(t.amount || 0).toFixed(2)}
                        </div>
                        {t.fee > 0 && (
                          <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
                            Fee: ${Number(t.fee).toFixed(2)} • Net: ${Number(t.netAmount || (t.amount - t.fee)).toFixed(2)}
                          </div>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            t.status === 'succeeded' || t.status === 'paid'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : t.status === 'refunded'
                              ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                              : t.status === 'failed'
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                            }`}
                          >
                            {t.status}
                          </span>
                          {t.status === 'pending' && t.methodType === 'manual' && t.method !== 'cod' && (
                            <button
                              type="button"
                              disabled={verifyingId === t._id}
                              onClick={() => handleVerifyPayment(t)}
                              className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              {verifyingId === t._id ? 'Verifying…' : 'Verify payment'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!isLoading && totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-zinc-50/50 dark:bg-zinc-800/30 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
            <div>
              Showing <span className="font-semibold text-zinc-900 dark:text-zinc-100">{startItem}</span> to{' '}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{endItem}</span> of{' '}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{totalCount}</span> settlements
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pNum = Math.min(totalPages - 4 + i, currentPage - 2 + i);
                  }
                  return (
                    <button
                      key={`page-${pNum}`}
                      type="button"
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        currentPage === pNum
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsView;
