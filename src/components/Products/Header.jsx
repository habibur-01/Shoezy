import { ArrowDown, ChevronDown, Grid, List, SlidersHorizontal } from "lucide-react";

// Header Component with Connected Sorting & Dynamic Results Count
const Header = ({
  viewMode,
  onViewModeChange,
  onShowFilters,
  sortBy,
  onSortChange,
  totalResults = 0,
  currentCount = 0,
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <p className="text-gray-600 text-sm font-medium">
        Showing {currentCount} {totalResults > 0 ? `of ${totalResults}` : ""} results
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={onShowFilters}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
        <div className="relative">

          <select
            value={sortBy || "default"}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium cursor-pointer appearance-none"
          >
            <option value="default">Default sorting</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="top_rated">Top Rated</option>
          </select>
         <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-2 rounded-md cursor-pointer ${viewMode === "grid" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
              }`}
            title="Grid View"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-2 rounded-md cursor-pointer ${viewMode === "list" ? "bg-black text-white" : "bg-gray-100 text-gray-700"
              }`}
            title="List View"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default Header;