import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { RealtimeStatusBadge } from './header/RealtimeStatusBadge';
import { NotificationsDropdown } from './header/NotificationsDropdown';
import { PersonaSwitcher } from './header/PersonaSwitcher';






export const Header = ({ setActiveTab }) => {
  const {
    currentUser,
    currentRole,
    teamMembers,
    roles,
    setCurrentUserId,
    isRealtimeActive,
    setIsRealtimeActive,
    realtimeAlerts,
    dismissAlert,
    metrics
  } = useAdmin();

  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);

  return (
    <div className="flex items-center justify-between h-16 px-3 sm:px-6 w-full text-zinc-900 dark:text-zinc-100">
      {/* Left side: store status & quick breadcrumb */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">CommerceHQ</span>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Operations Hub
          </span>
        </div>

        {/* Live inventory engine pill */}
        <RealtimeStatusBadge
          isRealtimeActive={isRealtimeActive}
          onToggle={() => setIsRealtimeActive(!isRealtimeActive)}
        />

        {metrics.lowStockCount > 0 && (
          <button
            id="badge-low-stock-header"
            onClick={() => setActiveTab('products')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/60 rounded-full transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{metrics.lowStockCount} Low Stock</span>
          </button>
        )}
      </div>

      {/* Right side: Alerts & Persona Switcher */}
      <div className="flex items-center gap-3">
        {/* Real-time Alerts Popover */}
        <NotificationsDropdown
          isOpen={isAlertsOpen}
          onToggle={() => setIsAlertsOpen(!isAlertsOpen)}
          onClose={() => setIsAlertsOpen(false)}
          alerts={realtimeAlerts}
          onDismissAlert={dismissAlert}
          onNavigateProducts={() => setActiveTab('products')}
        />

        {/* Persona Switcher Dropdown */}
        <PersonaSwitcher
          isOpen={isPersonaOpen}
          onToggle={() => setIsPersonaOpen(!isPersonaOpen)}
          onClose={() => setIsPersonaOpen(false)}
          currentUser={currentUser}
          currentRole={currentRole}
          teamMembers={teamMembers}
          roles={roles}
          onSelectPersona={(id) => setCurrentUserId(id)}
          onNavigateRoles={() => setActiveTab('roles')}
        />
      </div>
    </div>
  );
};