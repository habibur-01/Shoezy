import { Grid, List, SlidersHorizontal } from "lucide-react";

// Header Component
const Header = ({ viewMode, onViewModeChange, onShowFilters }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <p className="text-gray-600">Showing 1-12 of 24 results</p>
      <div className="flex items-center gap-4">
        <button
          onClick={onShowFilters}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
        <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black">
          <option>Default sorting</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest First</option>
          <option>Top Rated</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-md cursor-pointer ${
              viewMode === 'grid' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-md hover:cursor-pointer ${
              viewMode === 'list' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);
export default Header;