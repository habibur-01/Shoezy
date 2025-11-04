import React, { useState, useEffect } from "react";
import { FaList, FaThLarge } from "react-icons/fa";
import ShopProductCard from "../components/Shop/ShopProductCard";
import FilterSidebar from "../components/Shop/FilterSidebar";

const mockProducts = [
  {
    id: 1,
    name: "Adidas Cream & White Forum Low Cl Sports Shoes",
    price: 29,
    oldPrice: 34,
    discount: 15,
    color: "green",
    category: "Clog Shoes",
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1606813902734-00c9c376b7b2?w=500&q=80",
  },
  {
    id: 2,
    name: "Adidas Men Trainers Sterlinn Sports Shoes",
    price: 35,
    oldPrice: 36,
    discount: 0,
    color: "blue",
    category: "Sneakers",
    rating: 4,
    image:
      "https://images.unsplash.com/photo-1600180758890-6d57bd5bb9f4?w=500&q=80",
  },
  {
    id: 3,
    name: "ASIAN Men's INNOVA-01 Sports Shoes For Men",
    price: 37,
    color: "white",
    category: "Sneakers",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1600180758890-6d57bd5bb9f4?w=500&q=80",
  },
];

const ShopPage = () => {
  const [products, setProducts] = useState(mockProducts);
  const [filtered, setFiltered] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [gridView, setGridView] = useState(true);

  // Filter + Sort logic
  useEffect(() => {
    let result = [...products];

    if (searchTerm)
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (selectedCategory)
      result = result.filter((p) => p.category === selectedCategory);

    if (selectedColor) result = result.filter((p) => p.color === selectedColor);

    if (sortOption === "lowToHigh")
      result.sort((a, b) => a.price - b.price);
    else if (sortOption === "highToLow")
      result.sort((a, b) => b.price - a.price);

    setFiltered(result);
  }, [searchTerm, selectedCategory, selectedColor, sortOption]);

  return (
    <div className="max-w-7xl mx-auto px-5 py-10">
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Clog Shoes</h2>
        <p className="text-sm text-gray-500 mt-1">Home / Shop / Clog Shoes</p>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <FilterSidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
        />

        {/* Product Grid */}
        <div className="flex-1 ml-8">
          {/* Top Controls */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 text-sm">
              Showing all {filtered.length} results
            </p>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring focus:ring-gray-200"
              />

              {/* Sort */}
              <select
                className="border border-gray-300 rounded-md px-2 py-1.5 text-sm text-gray-700 focus:outline-none"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">Default sorting</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>

              {/* View Toggle */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setGridView(true)}
                  className={`p-2 border ${
                    gridView ? "bg-gray-900 text-white" : "bg-white text-gray-700"
                  } rounded`}
                >
                  <FaThLarge />
                </button>
                <button
                  onClick={() => setGridView(false)}
                  className={`p-2 border ${
                    !gridView ? "bg-gray-900 text-white" : "bg-white text-gray-700"
                  } rounded`}
                >
                  <FaList />
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          <div
            className={`grid ${
              gridView ? "grid-cols-3 gap-6" : "grid-cols-1 gap-4"
            }`}
          >
            {filtered.map((product) => (
              <ShopProductCard key={product.id} product={product} grid={gridView} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
