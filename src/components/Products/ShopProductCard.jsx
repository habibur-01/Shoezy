import { Link } from "react-router-dom";

// ProductCard Component
const ShopProductCard = ({ product, viewMode }) => {
  const category = product?.category?.slug
  const subCategory = product?.subcategory?.slug
  return (
    <div className={`flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row'} bg-white rounded-lg border border-gray-200 overflow-hidden group hover:shadow-lg transition-shadow`}>
      <div className="relative">
        {product.discount && (
          <span className="absolute top-4 left-4 bg-black text-white text-sm font-semibold px-3 py-1 rounded-full z-10">
            -{product.discount}%
          </span>
        )}
        <img
          src={product.images.cover}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product?.countdown && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-md p-2 shadow-lg">
            <div className="flex justify-around text-center text-xs">
              <div>
                <div className="font-bold text-red-600">{product.countdown.days}d</div>
              </div>
              <div>
                <div className="font-bold text-red-600">{product.countdown.hours}h</div>
              </div>
              <div>
                <div className="font-bold text-red-600">{product.countdown.minutes}m</div>
              </div>
              <div>
                <div className="font-bold text-red-600">{product.countdown.seconds}s</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={`p-4 flex ${viewMode === 'grid' ? "flex-col" : 'flex-row flex-1 justify-between'}`}>
        <div>

          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-black">
            {product.name}
          </h3>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < product.rating ? 'text-yellow-400' : 'text-gray-300'}>
                ★
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {product.discount_price && (
              <span className="text-gray-400 line-through text-sm">
                ${product.price}
              </span>
            )}
            <span className="text-xl font-bold text-gray-900">
              ${product.discount_price}

            </span>
          </div>
        </div>
        <Link to={`/products/${category}/${subCategory}/${product?.slug}`}>

          <button className="w-full mt-4 bg-black text-white py-2 px-5 rounded-md hover:bg-gray-800 transition-colors hover:cursor-pointer" >
            Add to Cart
          </button>
        </Link>
      </div>
    </div>)

};

export default ShopProductCard;