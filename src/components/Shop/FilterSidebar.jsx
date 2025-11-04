import React from "react";

const FilterSidebar = ({
  selectedCategory,
  setSelectedCategory,
  selectedColor,
  setSelectedColor,
}) => {
  const categories = [
    "Our Store",
    "Clog Shoes",
    "Derby",
    "Hiking",
    "Loafers",
    "Moccasin",
    "Sneakers",
  ];

  const colors = [
    "black",
    "blue",
    "brown",
    "gray",
    "green",
    "lightgreen",
    "pink",
    "purple",
    "red",
    "white",
  ];

  return (
    <div className="w-1/4">
      {/* Categories */}
      <div className="border rounded-md mb-6 p-4 shadow-all">
        <h4 className="text-gray-800 font-medium mb-3">Shop By Categories</h4>
        {categories.map((cat) => (
          <label
            key={cat}
            className="flex items-center space-x-2 text-sm text-gray-700 mb-1 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedCategory === cat}
              onChange={() =>
                setSelectedCategory(selectedCategory === cat ? "" : cat)
              }
              className="accent-gray-800"
            />
            <span>{cat}</span>
          </label>
        ))}
      </div>

      {/* Colors */}
      <div className="border rounded-md p-4 shadow-all">
        <h4 className="text-gray-800 font-medium mb-3">Filter By Color</h4>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <div
              key={color}
              onClick={() =>
                setSelectedColor(selectedColor === color ? "" : color)
              }
              className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                selectedColor === color
                  ? "border-gray-800"
                  : "border-gray-200"
              }`}
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
