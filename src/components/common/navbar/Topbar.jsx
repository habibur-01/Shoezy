import {
  FaSearch,
  FaGift,
  FaHeart,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";

const Topbar = () => {
  return (
    <div className="w-full bg-[#FFFFFF] py-3 px-20">
      <div className="w-full flex items-center justify-between">
        {/* Right Section */}
        <div className="flex gap-5 text-white text-sm">
          <div className="flex items-center gap-2 hover:cursor-pointer">
            <FaGift className="text-red-500 text-xl" />
            <div>
              <p className="text-white text-[15px]">Offers</p>
              <p className="text-gray-400 text-[11px]">Latest Offers</p>
            </div>
          </div>

          <div className="flex items-center gap-2 hover:cursor-pointer">
            <FaHeart className="text-red-500 text-xl" />
            <div>
              <p className="text-white text-[15px]">Wishlist</p>
              <p className="text-gray-400 text-[11px]">Desired Products</p>
            </div>
          </div>

          <div className="flex items-center gap-2 hover:cursor-pointer">
            <FaShoppingCart className="text-red-500 text-xl" />
            <div>
              <p className="text-white text-[15px]">Cart</p>
              <p className="text-gray-400 text-[11px]">Make Order</p>
            </div>
          </div>

          <div className="flex items-center gap-2 hover:cursor-pointer">
            <FaUser className="text-red-500 text-xl" />
            <div>
              <p className="text-white text-[15px]">Account</p>
              <p className="text-gray-400 text-[11px]">Register or Login</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
