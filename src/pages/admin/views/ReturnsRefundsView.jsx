import React, { useState, useMemo } from 'react';
import {
  Search,
  RotateCcw,
  Truck,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Banknote,
  PackageCheck,
  PackageX,
  ArrowUpRight,
  Filter,
  Clock,
  DollarSign,
  Check,
  Building2,
  RefreshCw,
  Eye,
  X,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

// Comprehensive mock data representing all 3 real-world scenarios:
// 1. Customer Return (RMA) - customer received product & requested return/exchange
// 2. Courier RTO (Return to Origin) - customer didn't receive/unreachable, courier returned parcel
// 3. Order Cancellation - cancelled before or during transit
const INITIAL_RETURNS = [
  {
    id: 'RMA-2026-101',
    orderId: 'ORD-9845',
    type: 'customer_return', // 'customer_return' | 'courier_rto' | 'cancellation'
    customerName: 'Marcus Wright',
    customerEmail: 'm.wright@summit.org',
    customerPhone: '+1 (555) 234-5678',
    items: '1x Nike Air Zoom Pegasus 40 (Size 42)',
    reason: 'Size too tight, requested return & refund for size exchange',
    paymentMethod: 'Card (Stripe)',
    isPrepaid: true,
    totalAmount: 130.0,
    refundAmount: 130.0,
    restockingFee: 0,
    carrier: 'FedEx Express',
    trackingNumber: 'FDX-982341-US',
    requestedAt: '2026-09-18T10:30:00Z',
    status: 'pending', // 'pending' | 'approved' | 'refunded' | 'restocked' | 'rejected'
  },
  {
    id: 'RTO-2026-202',
    orderId: 'ORD-9840',
    type: 'courier_rto',
    customerName: 'David Okafor',
    customerEmail: 'david.o@commercehq.io',
    customerPhone: '+1 (555) 890-1234',
    items: '1x Puma Velocity Nitro 2 (Size 43)',
    reason: 'Courier reported customer unreachable after 3 phone attempts; parcel returned',
    paymentMethod: 'Cash on Delivery (COD)',
    isPrepaid: false,
    totalAmount: 115.0,
    refundAmount: 0.0,
    restockingFee: 0,
    carrier: 'SteadFast Courier',
    trackingNumber: 'STF-441209-BD',
    requestedAt: '2026-09-19T14:15:00Z',
    status: 'pending',
  },
  {
    id: 'RTO-2026-203',
    orderId: 'ORD-9839',
    type: 'courier_rto',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.r@nordicstyle.se',
    customerPhone: '+1 (555) 456-7890',
    items: '1x New Balance 574 Core (Size 39)',
    reason: 'Customer refused delivery due to transit delay; returned by courier',
    paymentMethod: 'Online (bKash / SSL)',
    isPrepaid: true,
    totalAmount: 95.0,
    refundAmount: 95.0,
    restockingFee: 5.0,
    carrier: 'DHL Express',
    trackingNumber: 'DHL-883102-INT',
    requestedAt: '2026-09-17T09:00:00Z',
    status: 'approved',
  },
  {
    id: 'CAN-2026-301',
    orderId: 'ORD-9835',
    type: 'cancellation',
    customerName: 'Liam Zhang',
    customerEmail: 'liam.zhang@commercehq.io',
    customerPhone: '+1 (555) 678-9012',
    items: '1x Shoezy Signature Oxford Leather (Size 41)',
    reason: 'Customer cancelled order 1 hour after placement prior to shipping',
    paymentMethod: 'Credit Card',
    isPrepaid: true,
    totalAmount: 150.0,
    refundAmount: 150.0,
    restockingFee: 0,
    carrier: 'N/A (Pre-dispatch)',
    trackingNumber: 'N/A',
    requestedAt: '2026-09-19T16:20:00Z',
    status: 'pending',
  },
  {
    id: 'CAN-2026-302',
    orderId: 'ORD-9832',
    type: 'cancellation',
    customerName: 'Sophie Martinez',
    customerEmail: 'sophie.m@craftwear.co',
    customerPhone: '+1 (555) 345-6789',
    items: '1x Reebok Club C 85 Vintage (Size 38)',
    reason: 'Customer cancelled duplicate accidental order',
    paymentMethod: 'Cash on Delivery (COD)',
    isPrepaid: false,
    totalAmount: 85.0,
    refundAmount: 0.0,
    restockingFee: 0,
    carrier: 'N/A (Pre-dispatch)',
    trackingNumber: 'N/A',
    requestedAt: '2026-09-16T11:45:00Z',
    status: 'restocked',
  },
  {
    id: 'RMA-2026-102',
    orderId: 'ORD-9828',
    type: 'customer_return',
    customerName: 'Alexander Hayes',
    customerEmail: 'a.hayes@apexfit.com',
    customerPhone: '+1 (555) 901-2345',
    items: '1x Adidas Ultraboost Light (Size 44)',
    reason: 'Sole cushioning defect discovered after 2 days of use',
    paymentMethod: 'Card (Stripe)',
    isPrepaid: true,
    totalAmount: 190.0,
    refundAmount: 190.0,
    restockingFee: 0,
    carrier: 'UPS Ground',
    trackingNumber: '1Z999AA10123456784',
    requestedAt: '2026-09-15T13:10:00Z',
    status: 'refunded',
  },
];

export const ReturnsRefundsView = () => {
  const { hasPermission, logActivity } = useAdmin();
  const [returns, setReturns] = useState(INITIAL_RETURNS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTypeTab, setActiveTypeTab] = useState('all'); // 'all', 'customer_return', 'courier_rto', 'cancellation'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'approved', 'refunded', 'restocked', 'rejected'
  const [selectedItem, setSelectedItem] = useState(null);

  const canRefund = hasPermission('orders.cancel_refund');

  // Counts for each category
  const counts = useMemo(() => {
    return {
      all: returns.length,
      customer_return: returns.filter((r) => r.type === 'customer_return').length,
      courier_rto: returns.filter((r) => r.type === 'courier_rto').length,
      cancellation: returns.filter((r) => r.type === 'cancellation').length,
      pendingRefunds: returns.filter((r) => r.isPrepaid && ['pending', 'approved'].includes(r.status))
        .reduce((sum, r) => sum + r.refundAmount, 0),
    };
  }, [returns]);

  // Handle status transitions
  const handleUpdateStatus = (id, newStatus) => {
    if (!canRefund) return;
    setReturns((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          logActivity(
            'RETURN_STATUS_UPDATED',
            'Orders',
            `Updated ${r.id} (${r.type}) status to '${newStatus.toUpperCase()}'. Refund: $${r.refundAmount}`,
            'info'
          );
          return { ...r, status: newStatus };
        }
        return r;
      })
    );
  };

  // Filtered list
  const filteredReturns = useMemo(() => {
    return returns.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.orderId.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.items.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q);

      const matchesType = activeTypeTab === 'all' || r.type === activeTypeTab;
      const matchesStatus = filterStatus === 'all' || r.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [returns, searchQuery, activeTypeTab, filterStatus]);

  // Helper to render type badge
  const renderTypeBadge = (type) => {
    switch (type) {
      case 'customer_return':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <RotateCcw className="w-3 h-3" />
            Customer Return
          </span>
        );
      case 'courier_rto':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Truck className="w-3 h-3" />
            Courier RTO / Undelivered
          </span>
        );
      case 'cancellation':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            Order Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Returns, RTO & Refunds</h1>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
              Post-Fulfillment
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage customer-initiated returns, undelivered courier parcels (RTO), and prepaid cancellation refunds.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium">Customer Returns</span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900">{counts.customer_return}</span>
            <span className="text-[11px] text-zinc-400">RMA Requests</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">Defects, exchanges, or customer returns</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium">Courier RTO (Undelivered)</span>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900">{counts.courier_rto}</span>
            <span className="text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
              Returned by Courier
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">Customer unreachable or delivery rejected</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium">Order Cancellations</span>
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-900">{counts.cancellation}</span>
            <span className="text-[11px] text-zinc-400">Cancelled Orders</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">Cancelled prior to or during dispatch</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium">Pending Refunds</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-700">${counts.pendingRefunds.toFixed(2)}</span>
            <span className="text-[11px] text-zinc-400">Prepaid Due</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-1">Excludes COD (no refund required for COD)</p>
        </div>
      </div>

      {/* Primary Category / Type Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto text-xs">
        {[
          { id: 'all', label: 'All Requests', count: counts.all, icon: Filter },
          { id: 'customer_return', label: 'Customer Returns (RMA)', count: counts.customer_return, icon: RotateCcw },
          { id: 'courier_rto', label: 'Courier RTO / Undelivered', count: counts.courier_rto, icon: Truck },
          { id: 'cancellation', label: 'Order Cancellations', count: counts.cancellation, icon: XCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTypeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTypeTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Status Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search RMA ID, Order #, customer, reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-[11px] font-medium text-zinc-400 mr-1 hidden sm:inline">Status:</span>
          {['all', 'pending', 'approved', 'refunded', 'restocked', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer capitalize ${
                filterStatus === st
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {st === 'restocked' ? 'Restocked (No Refund)' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                <th className="py-3 px-4">Identifier & Type</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Item & Cause</th>
                <th className="py-3 px-4">Payment & Refund</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-zinc-400 text-xs">
                    No records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredReturns.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-50/60 transition-colors">
                    {/* Column 1: ID, Order #, and Type Badge */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-zinc-900">{r.id}</div>
                      <div className="font-mono text-[11px] text-zinc-400">Order: #{r.orderId}</div>
                      <div className="mt-1">{renderTypeBadge(r.type)}</div>
                    </td>

                    {/* Column 2: Customer Contact */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-900">{r.customerName}</div>
                      <div className="text-[11px] text-zinc-400">{r.customerEmail}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{r.customerPhone}</div>
                    </td>

                    {/* Column 3: Items and Reason / Logistics info */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-zinc-800">{r.items}</div>
                      <div className="text-[11px] text-zinc-500 italic mt-0.5">"{r.reason}"</div>
                      {r.carrier && r.carrier !== 'N/A' && (
                        <div className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1 font-mono">
                          <Truck className="w-3 h-3 text-zinc-400" />
                          {r.carrier}: {r.trackingNumber}
                        </div>
                      )}
                    </td>

                    {/* Column 4: Payment Method & Refund Obligation */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-800">
                        {r.isPrepaid ? (
                          <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                        ) : (
                          <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span>{r.paymentMethod}</span>
                      </div>

                      {/* Explicit indicator of whether money is owed */}
                      {r.isPrepaid ? (
                        <div className="mt-1">
                          <span className="font-mono font-bold text-zinc-900 text-xs">
                            ${r.refundAmount.toFixed(2)}
                          </span>
                          <span className="block text-[10px] text-indigo-700 font-semibold">
                            Refund Required
                          </span>
                        </div>
                      ) : (
                        <div className="mt-1">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            COD (No Money Owed)
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Column 5: Status Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          r.status === 'refunded'
                            ? 'bg-purple-100 text-purple-800 border border-purple-200'
                            : r.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : r.status === 'restocked'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : r.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {r.status === 'restocked' ? 'Restocked' : r.status}
                      </span>
                    </td>

                    {/* Column 6: Action Button tailored to scenario */}
                    <td className="py-3 px-4 text-right">
                      {canRefund ? (
                        <div className="inline-flex items-center justify-end gap-1.5">
                          {/* Case 1: Pending Customer Return */}
                          {r.status === 'pending' && r.type === 'customer_return' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(r.id, 'approved')}
                                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-semibold hover:bg-emerald-100 transition-colors cursor-pointer text-[11px]"
                                title="Approve Return Request"
                              >
                                Approve RMA
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(r.id, 'rejected')}
                                className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded font-semibold hover:bg-rose-100 transition-colors cursor-pointer text-[11px]"
                                title="Reject Return Request"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {/* Case 2: Courier RTO (COD) - No money owed, just restock inventory */}
                          {r.status === 'pending' && r.type === 'courier_rto' && !r.isPrepaid && (
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'restocked')}
                              className="px-2.5 py-1 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer text-[11px]"
                              title="Restock returned items back to active warehouse inventory"
                            >
                              Restock to Inventory
                            </button>
                          )}

                          {/* Case 3: Courier RTO (Prepaid) - Parcel received, approve refund */}
                          {r.status === 'pending' && r.type === 'courier_rto' && r.isPrepaid && (
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'approved')}
                              className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded font-semibold hover:bg-amber-100 transition-colors cursor-pointer text-[11px]"
                              title="Confirm parcel returned to warehouse and approve refund"
                            >
                              Confirm & Approve
                            </button>
                          )}

                          {/* Case 4: Order Cancellation (Prepaid) - Direct refund */}
                          {r.status === 'pending' && r.type === 'cancellation' && r.isPrepaid && (
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'approved')}
                              className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded font-semibold hover:bg-indigo-100 transition-colors cursor-pointer text-[11px]"
                            >
                              Approve Refund
                            </button>
                          )}

                          {/* Case 5: Approved with Prepaid - Disburse Funds */}
                          {r.status === 'approved' && r.isPrepaid && (
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'refunded')}
                              className="px-2.5 py-1 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer text-[11px]"
                            >
                              Disburse ${r.refundAmount.toFixed(2)}
                            </button>
                          )}

                          {/* Settled States */}
                          {r.status === 'refunded' && (
                            <span className="text-[11px] text-purple-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Refunded
                            </span>
                          )}

                          {r.status === 'restocked' && (
                            <span className="text-[11px] text-blue-700 font-semibold flex items-center gap-1">
                              <PackageCheck className="w-3.5 h-3.5" />
                              Restocked
                            </span>
                          )}

                          {/* Quick View Details */}
                          <button
                            onClick={() => setSelectedItem(r)}
                            className="p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded cursor-pointer"
                            title="View Full Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-zinc-400 italic text-[11px]">View only</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">{selectedItem.id} Details</h3>
                <p className="text-[11px] text-zinc-500">Order #{selectedItem.orderId}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <span className="text-zinc-400 block text-[10px]">Type / Category:</span>
                <div className="mt-0.5">{renderTypeBadge(selectedItem.type)}</div>
              </div>

              <div>
                <span className="text-zinc-400 block text-[10px]">Customer:</span>
                <div className="font-semibold text-zinc-900 mt-0.5">{selectedItem.customerName}</div>
                <div className="text-zinc-500">{selectedItem.customerEmail} | {selectedItem.customerPhone}</div>
              </div>

              <div>
                <span className="text-zinc-400 block text-[10px]">Items & Reason:</span>
                <div className="font-medium text-zinc-800 mt-0.5">{selectedItem.items}</div>
                <div className="text-zinc-600 bg-zinc-50 p-2 rounded-lg mt-1 italic">
                  "{selectedItem.reason}"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100">
                <div>
                  <span className="text-zinc-400 block text-[10px]">Payment Method:</span>
                  <div className="font-semibold text-zinc-800">{selectedItem.paymentMethod}</div>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px]">Refund Status:</span>
                  <div className="font-semibold text-zinc-800">
                    {selectedItem.isPrepaid ? `$${selectedItem.refundAmount.toFixed(2)} (Owed)` : 'COD (No Refund)'}
                  </div>
                </div>
              </div>

              {selectedItem.carrier && (
                <div className="pt-2 border-t border-zinc-100">
                  <span className="text-zinc-400 block text-[10px]">Courier Tracking:</span>
                  <div className="font-mono text-zinc-700 mt-0.5">
                    {selectedItem.carrier} - {selectedItem.trackingNumber}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-1.5 bg-zinc-900 text-white rounded-lg font-semibold hover:bg-zinc-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
