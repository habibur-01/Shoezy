import FilterCheckbox from "./FilterCheckbox";
import FilterSection from "./FilterSection";

const BrandFilter = ({ brands, selectedBrands, onToggle }) => (
  <FilterSection title="Brands">
    <div className="space-y-2">
      {brands.map((brand) => (
        <FilterCheckbox
          key={brand}
          label={brand}
          checked={selectedBrands.includes(brand)}
          onChange={() => onToggle("brands", brand)}
        />
      ))}
    </div>
  </FilterSection>
);

export default BrandFilter;
