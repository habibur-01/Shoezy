import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

import { OrdersHeader } from './orders/OrdersHeader';
import { OrdersFilterBar } from './orders/OrdersFilterBar';
import { OrdersTable } from './orders/OrdersTable';
import { OrderDetailModal } from './orders/OrderDetailModal';

export const OrdersView = () => {
  const { orders, updateOrderStatus, cancelAndRefundOrder, assertPermission } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Tracking modal inputs
  const [carrier, setCarrier] = useState('FedEx Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase());

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

  const handleAdvanceStatus = (newStatus) => {
    if (!selectedOrder) return;
    const success = updateOrderStatus(
      selectedOrder.id,
      newStatus,
      carrier,
      trackingNumber,
      updateNote || `Transitioned order status to ${newStatus}`
    );

    if (success) {
      setSelectedOrder((prev) =>
      prev ?
      {
        ...prev,
        status: newStatus,
        carrier,
        trackingNumber,
        timeline: [
        ...prev.timeline,
        {
          status: newStatus,
          timestamp: new Date().toISOString(),
          actor: 'Operations Admin',
          note: updateNote || `Status updated to ${newStatus}`
        }]

      } :
      null
      );
      setUpdateNote('');
    }
  };

  const handleProcessRefund = () => {
    if (!selectedOrder) return;
    const success = cancelAndRefundOrder(
      selectedOrder.id,
      refundReason || 'Customer requested return/cancellation'
    );
    if (success) {
      setSelectedOrder((prev) =>
      prev ?
      {
        ...prev,
        status: 'cancelled',
        paymentStatus: 'refunded',
        timeline: [
        ...prev.timeline,
        {
          status: 'cancelled',
          timestamp: new Date().toISOString(),
          actor: 'Operations Admin',
          note: `Refunded: ${refundReason || 'Order cancelled and refunded'}`
        }]

      } :
      null
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