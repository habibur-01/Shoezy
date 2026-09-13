import React from 'react';
import { Trophy, TrendingUp, ArrowRight, Package, Sparkles } from 'lucide-react';

export const TopSellingProductsCard = ({
  products = [],
  onNavigateProducts,
}) => {
  const displayed = products.slice(0, 5);

  const getRankBadgeStyle = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 2:
        return 'bg-zinc-300/20 text-zinc-300 border-zinc-400/30';
      case 3:
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Top Performing Footwear
              </h3>
              <p className="text-xs text-zinc-500">Live sales volume leaderboard</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/60">
            <Sparkles className="w-3 h-3" />
            Top 5
          </span>
        </div>

        {displayed.length === 0 ? (
          <div className="py-8 text-center text-zinc-400 text-xs flex flex-col items-center gap-2">
            <Package className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
            <span>No sales leaderboard data recorded yet.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map((item, idx) => {
              const rank = item.rank || idx + 1;
              const stock = item.stock ?? 0;
              const isLow = stock <= 8;

              return (
                <div
                  key={item.id || idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center border shrink-0 ${getRankBadgeStyle(
                        rank
                      )}`}
                    >
                      #{rank}
                    </span>

                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover bg-zinc-100 border border-zinc-200 dark:border-zinc-700 shrink-0 group-hover:scale-105 transition-transform"
                    />

                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-zinc-500 font-medium">
                          {item.brand || 'Shoezy'}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          • {item.orders || 0} sold
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-2">
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                      {item.formattedRevenue || `$${(item.revenue || 0).toLocaleString()}`}
                    </div>
                    <span
                      className={`text-[10px] font-mono ${
                        isLow
                          ? 'text-amber-600 dark:text-amber-400 font-semibold'
                          : 'text-zinc-400'
                      }`}
                    >
                      {stock} in stock
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button
        onClick={onNavigateProducts}
        className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
      >
        <span>View Complete Catalog</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
