import FilterSection from "./FilterSection"

const ColorFilter = ({ colors, selectedColors, onToggle }) => (
  <FilterSection title="Filter By Color">
    <div className="flex flex-wrap gap-2">
      {colors.map(color => (
        <button
          key={color.name}
          onClick={() => onToggle('colors', color.name)}
          className={`w-10 h-10 rounded-full ${color.class} ${
            selectedColors.includes(color.name) ? 'ring-2 ring-offset-2 ring-black' : ''
          } hover:scale-110 transition-transform`}
          title={color.name}
        />
      ))}
    </div>
   </FilterSection>
)
export default ColorFilter