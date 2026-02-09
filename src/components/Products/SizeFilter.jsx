import FilterSection from "./FilterSection";

const SizeFilter = ({ sizes, selectedSizes, onToggle }) => (
  <FilterSection title="Size">
    <div className="flex flex-wrap gap-2">
      {sizes.map(size => (
        <button
          key={size}
          onClick={() => onToggle('sizes', size)}
          className={`px-4 py-2 border rounded-md ${
            selectedSizes.includes(size)
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-700 border-gray-300 hover:border-black'
          } transition-colors`}
        >
          {size}
        </button>
      ))}
    </div>
  </FilterSection>
);

export default SizeFilter;