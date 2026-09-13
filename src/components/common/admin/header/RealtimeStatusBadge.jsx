import React from 'react';
import { Radio } from 'lucide-react';






export const RealtimeStatusBadge = ({
  isRealtimeActive,
  onToggle
}) => {
  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-zinc-50 border border-zinc-200 rounded-full">
      <button
        id="toggle-realtime-engine"
        onClick={onToggle}
        className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer"
        title="Toggle simulated real-time inventory feed">
        
        <span
          className={`w-2 h-2 rounded-full ${
          isRealtimeActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`
          } />
        
        <Radio className="w-3.5 h-3.5 text-zinc-400" />
        <span>Inventory Stream: {isRealtimeActive ? 'Live Sync' : 'Paused'}</span>
      </button>
    </div>);

};