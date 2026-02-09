import FilterSection from "./FilterSection";

const PriceRangeFilter = ({ priceRange, onChange }) => (
  <FilterSection title="Price Range">
    <div className="space-y-4">
      <input
        type="range"
        min="0"
        max="1000"
        value={priceRange[1] || 1000}
        onChange={(e) => onChange([0, parseInt(e.target.value)])}
        className="w-full"
      />
      <div className="flex justify-between text-sm text-gray-600">
        <span>${priceRange[0]|| '0'}</span>
        <span>${priceRange[1] || '100'}</span>
      </div>
    </div>
  </FilterSection>
);

export default PriceRangeFilter;