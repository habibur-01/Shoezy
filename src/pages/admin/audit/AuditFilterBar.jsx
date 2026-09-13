import React from 'react';
import { Search, Filter } from 'lucide-react';













export const AuditFilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedSeverity,
  setSelectedSeverity,
  categories,
  auditLogs
}) => {
  return (
    <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <input
            id="input-audit-search"
            type="text"
            placeholder="Search by action, actor, email, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all" />
          
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-zinc-400" />
          <select
            id="select-audit-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 cursor-pointer">
            
            {categories.map((c) =>
            <option key={c} value={c}>
                Category: {c}
              </option>
            )}
          </select>
        </div>

        {/* Severity Pills */}
        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-lg text-xs self-stretch md:self-auto justify-center">
          <button
            id="severity-filter-all"
            onClick={() => setSelectedSeverity('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
            selectedSeverity === 'all' ?
            'bg-white text-zinc-900 shadow-xs' :
            'text-zinc-500 hover:text-zinc-900'}`
            }>
            
            All ({auditLogs.length})
          </button>
          <button
            id="severity-filter-critical"
            onClick={() => setSelectedSeverity('critical')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
            selectedSeverity === 'critical' ?
            'bg-white text-rose-900 shadow-xs' :
            'text-zinc-500 hover:text-rose-700'}`
            }>
            
            Critical ({auditLogs.filter((l) => l.severity === 'critical').length})
          </button>
          <button
            id="severity-filter-warning"
            onClick={() => setSelectedSeverity('warning')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
            selectedSeverity === 'warning' ?
            'bg-white text-amber-900 shadow-xs' :
            'text-zinc-500 hover:text-amber-700'}`
            }>
            
            Warnings ({auditLogs.filter((l) => l.severity === 'warning').length})
          </button>
        </div>
      </div>
    </div>);

};