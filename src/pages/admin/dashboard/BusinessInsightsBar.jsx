import React from 'react';
import { Lightbulb, Flame, Clock, Award } from 'lucide-react';

export const BusinessInsightsBar = ({ insights }) => {
  if (!insights) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-900/40 via-zinc-900/60 to-purple-900/30 border border-indigo-500/20 rounded-2xl p-4 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 shrink-0">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Smart Operations Insight
            </span>
            <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full font-mono">
              AI Analytics
            </span>
          </div>
          <p className="text-xs text-zinc-300 mt-0.5">
            {insights.motivationalTip || "Inventory throughput and revenue velocities are running optimally."}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-6 border-t sm:border-t-0 border-zinc-800 pt-3 sm:pt-0">
        {insights.bestSeller?.name && (
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div className="text-[11px]">
              <span className="text-zinc-400">Best Seller: </span>
              <strong className="text-zinc-100">{insights.bestSeller.name}</strong>
            </div>
          </div>
        )}

        {insights.peakHour?.window && (
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <div className="text-[11px]">
              <span className="text-zinc-400">Peak Velocity: </span>
              <strong className="text-zinc-100">{insights.peakHour.window}</strong>
            </div>
          </div>
        )}

        {insights.topItem?.name && (
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <div className="text-[11px]">
              <span className="text-zinc-400">Top Grossing: </span>
              <strong className="text-zinc-100">{insights.topItem.name}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
