
import { X } from "lucide-react";
import FilterSidebar from "./FilterSidebar";

const MobileFilterDrawer = ({ show, onClose, filters, onFilterChange, onClearFilters, categories, brands, colors, sizes }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button onClick={onClose}>
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-4">
                    <FilterSidebar
                        filters={filters}
                        onFilterChange={onFilterChange}
                        onClearFilters={onClearFilters}
                        categories={categories}
                        brands={brands}
                        colors={colors}
                        sizes={sizes}
                    />
                </div>
            </div>
        </div>
    );
};
export default MobileFilterDrawer;