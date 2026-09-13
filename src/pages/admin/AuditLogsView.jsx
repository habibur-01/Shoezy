import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

import { AuditHeader } from './audit/AuditHeader';
import { AuditFilterBar } from './audit/AuditFilterBar';
import { AuditLogsTable } from './audit/AuditLogsTable';
import { AuditDetailModal } from './audit/AuditDetailModal';

export const AuditLogsView = () => {
  const { auditLogs, assertPermission } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);

  const categories = [
  'All',
  'Products',
  'Inventory',
  'Orders',
  'Coupons',
  'Roles',
  'Security',
  'System'];


  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.actorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || log.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const exportLogsCSV = () => {
    if (!assertPermission('audit.export', 'Export Audit Trail Logs to CSV')) return;

    const headers = ['Timestamp,Actor,Email,Role,Action,Category,Severity,Details\n'];
    const rows = filteredLogs.map(
      (l) =>
      `"${l.timestamp}","${l.actorName}","${l.actorEmail}","${l.actorRole}","${l.action}","${
      l.category}","${
      l.severity}","${l.details.replace(/"/g, '""')}"\n`
    );

    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <AuditHeader onExportLogs={exportLogsCSV} />

      {/* Control Bar: Search & Category / Severity filter */}
      <AuditFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSeverity={selectedSeverity}
        setSelectedSeverity={setSelectedSeverity}
        categories={categories}
        auditLogs={auditLogs} />
      

      {/* Audit Logs Table */}
      <AuditLogsTable logs={filteredLogs} onInspect={(log) => setSelectedLog(log)} />

      {/* Log Inspection Modal */}
      <AuditDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>);

};

export default AuditLogsView;