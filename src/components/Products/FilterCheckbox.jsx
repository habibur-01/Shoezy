const FilterCheckbox = ({ label, checked, onChange }) => (
  <label className="flex items-center cursor-pointer group">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
    />
    <span className="ml-3 text-gray-700 group-hover:text-black">{label}</span>
  </label>
);

export default FilterCheckbox;