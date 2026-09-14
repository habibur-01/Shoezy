import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';

import { OrdersHeader } from './orders/OrdersHeader';
import { OrdersFilterBar } from './orders/OrdersFilterBar';
import { OrdersTable } from './orders/OrdersTable';
import { OrderDetailModal } from './orders/OrderDetailModal';

export const OrdersView = () => {
  const { orders, updateOrderStatus, cancelAndRefundOrder, assertPermission, currentUser, currentRole } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Sync selectedOrder when orders list updates in context
  useEffect(() => {
    if (selectedOrder) {
      const updated = orders.find(
        (o) => o.id === selectedOrder.id || o._id === selectedOrder.id || o.id === selectedOrder._id || o._id === selectedOrder._id
      );
      if (updated) {
        setSelectedOrder(updated);
      }
    }
  }, [orders]);

  // Tracking modal inputs
  const [carrier, setCarrier] = useState('FedEx Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase().trim();
    const orderId = String(order.id || order._id || order.orderNumber || '').toLowerCase();
    const customerName = String(order.customerName || '').toLowerCase();
    const customerEmail = String(order.customerEmail || '').toLowerCase();
    const tracking = String(order.trackingNumber || '').toLowerCase();

    const matchesSearch =
      !q ||
      orderId.includes(q) ||
      customerName.includes(q) ||
      customerEmail.includes(q) ||
      tracking.includes(q);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setCarrier(order.carrier || 'FedEx Express');
    setTrackingNumber(order.trackingNumber || `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setUpdateNote('');
    setShowRefundConfirm(false);
  };

  const handleAdvanceStatus = async (newStatus) => {
    if (!selectedOrder) return;
    const actorName = currentUser?.name || 'Administrator';
    const actorRole = currentRole?.name || currentUser?.role || 'Admin';

    const success = await updateOrderStatus(
      selectedOrder.id,
      newStatus,
      carrier,
      trackingNumber,
      updateNote || `Transitioned order status to ${newStatus}`
    );

    if (success) {
      const nowIso = new Date().toISOString();
      const newStep = {
        status: newStatus,
        timestamp: nowIso,
        actor: actorName,
        actorName,
        actorRole,
        carrier,
        trackingNumber,
        note: updateNote || `Status updated to ${newStatus}`,
      };

      const newAct = {
        id: `act-${Date.now()}`,
        _id: `act-${Date.now()}`,
        action: newStatus === 'processing' ? 'ORDER_CONFIRMED' : 'STATUS_UPDATED',
        previousStatus: selectedOrder.status,
        newStatus,
        carrier,
        trackingNumber,
        notes: updateNote || `Status updated to ${newStatus}`,
        timestamp: nowIso,
        actorName,
        actorRole,
      };

      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              carrier,
              trackingNumber,
              updatedByName: actorName,
              confirmedByName: (newStatus === 'processing' && !prev.confirmedByName) ? actorName : prev.confirmedByName,
              lastActivity: {
                actorName,
                actorRole,
                action: newStatus === 'processing' ? 'ORDER_CONFIRMED' : 'STATUS_UPDATED',
                previousStatus: prev.status,
                newStatus,
                carrier,
                trackingNumber,
                note: updateNote || `Status updated to ${newStatus}`,
                timestamp: nowIso,
              },
              activities: [newAct, ...(prev.activities || [])],
              timeline: [...(prev.timeline || []), newStep],
            }
          : null
      );
      setUpdateNote('');
    }
  };

  const handleProcessRefund = async () => {
    if (!selectedOrder) return;
    const actorName = currentUser?.name || 'Administrator';
    const actorRole = currentRole?.name || currentUser?.role || 'Admin';

    const success = await cancelAndRefundOrder(
      selectedOrder.id,
      refundReason || 'Customer requested return/cancellation'
    );
    if (success) {
      const nowIso = new Date().toISOString();
      const newAct = {
        id: `act-${Date.now()}`,
        _id: `act-${Date.now()}`,
        action: 'ORDER_CANCELLED',
        previousStatus: selectedOrder.status,
        newStatus: 'cancelled',
        notes: refundReason || 'Order cancelled and refunded',
        timestamp: nowIso,
        actorName,
        actorRole,
      };

      setSelectedOrder((prev) =>
        prev
          ? {
              ...prev,
              status: 'cancelled',
              paymentStatus: 'refunded',
              updatedByName: actorName,
              lastActivity: {
                actorName,
                actorRole,
                action: 'ORDER_CANCELLED',
                previousStatus: prev.status,
                newStatus: 'cancelled',
                note: refundReason || 'Order cancelled and refunded',
                timestamp: nowIso,
              },
              activities: [newAct, ...(prev.activities || [])],
              timeline: [
                ...(prev.timeline || []),
                {
                  status: 'cancelled',
                  timestamp: nowIso,
                  actor: actorName,
                  actorName,
                  actorRole,
                  note: `Refunded: ${refundReason || 'Order cancelled and refunded'}`,
                },
              ],
            }
          : null
      );
      setShowRefundConfirm(false);
      setRefundReason('');
    }
  };

  const exportOrdersCSV = () => {
    if (!assertPermission('orders.export', 'Export Orders Manifest to CSV')) return;

    const headers = ['Order ID,Customer,Email,Total,Status,Payment,Tracking,Created Date\n'];
    const rows = filteredOrders.map(
      (o) =>
      `"${o.id}","${o.customerName}","${o.customerEmail}",${o.total},"${o.status}","${
      o.paymentStatus}","${
      o.trackingNumber || ''}","${o.createdAt}"\n`
    );

    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <OrdersHeader onExportOrders={exportOrdersCSV} />

      {/* Control Bar: Filter Tabs & Search */}
      <OrdersFilterBar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        orders={orders} />
      

      {/* Orders Table */}
      <OrdersTable orders={filteredOrders} onOpenDetail={handleOpenDetail} />

      {/* Order Detail & Tracking Pipeline Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        carrier={carrier}
        setCarrier={setCarrier}
        trackingNumber={trackingNumber}
        setTrackingNumber={setTrackingNumber}
        updateNote={updateNote}
        setUpdateNote={setUpdateNote}
        onAdvanceStatus={handleAdvanceStatus}
        showRefundConfirm={showRefundConfirm}
        setShowRefundConfirm={setShowRefundConfirm}
        refundReason={refundReason}
        setRefundReason={setRefundReason}
        onProcessRefund={handleProcessRefund} />
      
    </div>);

};

export default OrdersView;