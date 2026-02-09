import FilterCheckbox from "./FilterCheckbox";
import FilterSection from "./FilterSection";

const CategoryFilter = ({ categories, selectedCategory, onToggle }) => {
  console.log("🚀 ~ CategoryFilter ~ selectedCategory:", selectedCategory)
  return <FilterSection title="Shop By Categories">
    <div className="space-y-2">
      {categories.map(category => (
        <FilterCheckbox
          key={category.name}
          label={category.name}
          checked={selectedCategory === category.slug} // only one can be selected
          onChange={() => onToggle(category.slug)}
        />
      ))}
    </div>
  </FilterSection>;
};
export default CategoryFilter;
