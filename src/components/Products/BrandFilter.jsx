import React from "react";
import FilterCheckbox from "./FilterCheckbox";
import FilterSection from "./FilterSection";

const BrandFilter = ({ brands = [], selectedBrands = [], onToggle }) => (
  <FilterSection title="Brands">
    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
      {brands.map((brand) => {
        const isChecked = selectedBrands.some(
          (b) => b.toLowerCase() === brand.toLowerCase()
        );
        return (
          <FilterCheckbox
            key={brand}
            label={brand}
            checked={isChecked}
            onChange={() => onToggle(brand)}
          />
        );
      })}
    </div>
  </FilterSection>
);

export default BrandFilter;
