import { Link, NavLink } from "react-router-dom"; // fixed import
import Topbar from "./Topbar";
import { FaSearch, FaRegUser } from "react-icons/fa";
import { MdFavoriteBorder, MdOutlineShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { loggedOut } from "../../../redux/features/auth/authSlice";
import { CiLogout, CiUser } from "react-icons/ci";

const Navbar = () => {
  const hasUser = useSelector((state) => state.auth.loggedIn);
  const dispatch = useDispatch()
  console.log("🚀 ~ Navbar ~ user:", hasUser)
  const handleLogOut = () => {
    try {
      dispatch(loggedOut())
      localStorage.removeItem("authToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")

    } catch (error) {
      console.log("Logout error:", error)
    }
  }
  return (
    <div className="w-full h-28 bg-[var(--color-background)] py-3 px-20 flex justify-between items-center">
      {/* Left section */}
      <div>
        <ul className="flex items-center gap-x-8 py-3 font-medium">
          <li>
            <NavLink
              to="/"
              className="text-base text-[var(--color-text
                )] hover:text-[var(--color-red)] transition-colors duration-300"
            >
              Home
            </NavLink>
          </li>
          <li className="relative group">
            <NavLink
              to="/shop"
              className="text-base text-[var(--color-text
                )] hover:text-[var(--color-red)] transition-colors duration-300 "
            >
              Shop
            </NavLink>
          </li>
          <li className="relative group">
            <NavLink
              to="/shop/products"
              className="text-base text-[var(--color-text
                )] hover:text-[var(--color-red)] transition-colors duration-300 "
            >
              Categories
            </NavLink>
            <div className="absolute left-0 mt-2 min-w-[150px] bg-[var(--color-background)] z-50 rounded-md shadow-md  opacity-0 invisible translate-y-1/3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-in-out">
              <ul className="flex flex-col">
                <li className="px-4 py-3">
                  <NavLink
                    to={""}
                    className="text-sm flex items-center font-light text-[var(--color-text
                  )] hover:text-[var(--color-red)] transition-colors duration-300"
                  >
                    {/* <span className="hidden">
                      <MdKeyboardArrowRight size={18} color="gray" />
                    </span> */}
                    Apparel
                  </NavLink>
                </li>
                <li className="px-4 py-3">
                  <NavLink
                    to={""}
                    className="text-sm font-light text-[var(--color-text
                  )] hover:text-[var(--color-red)] transition-colors duration-300"
                  >
                    Casual
                  </NavLink>
                </li>
                <li className="px-4 py-3">
                  <NavLink
                    to={""}
                    className="text-sm font-light text-[var(--color-text
                  )] hover:text-[var(--color-red)] transition-colors duration-300"
                  >
                    Formal
                  </NavLink>
                </li>
                <li className="px-4 py-3">
                  <NavLink
                    to={""}
                    className="text-sm font-light text-[var(--color-text
                  )] hover:text-[var(--color-red)] transition-colors duration-300"
                  >
                    Sandal
                  </NavLink>
                </li>
                <li className="px-4 py-3">
                  <NavLink
                    to={""}
                    className="text-sm font-light text-[var(--color-text
                  )] hover:text-[var(--color-red)] transition-colors duration-300"
                  >
                    Sports
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>
          <li className="relative group">
            <NavLink
              to="/men_products"
              className="text-base text-[var(--color-text
                )] hover:text-[var(--color-red)] transition-colors duration-300"
            >
              Men
            </NavLink>
            <div className="absolute left-0 mt-2 min-w-[150px] bg-[var(--color-background)] z-50 rounded-md shadow-md  opacity-0 invisible translate-y-1/3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-in-out">
              <ul className="flex flex-col">
                <li className="px-4 py-3">
                  <NavLink
                    to={""}
                    className="text-sm flex items-center font-light text-[var(--color-text
                  )] hover:text-[var(--color-red)] transition-colors duration-300"
                  >
                    {/* <span className="hidden">
                      <MdKeyboardArrowRight size={18} color="gray" />
                    </span> */}
                    Apparel
                  </NavLink>
                </li>
                <li className="px-4 py-3">
                  <NavLink
                    to={""}
                    className="text-sm font-light text-[var(--color-text
                  )] hover:text-[var(--color-red)] transition-colors duration-300"
                  >
                    Casual
                  </NavLink>
                </li>
                <li className="px-4 py-3">
                  <NavLink
                    to={""}
                    className="text-sm font-light text-[var(--color-text
                  )] hover:text-[var(--color-red)] transition-colors duration-300"
                  >
                    Formal
                  </NavLink>
                </li>
                <li className="px-4 py-3">
                  <NavLink
                    to={""}
                    className="text-sm font-light text-[var(--color-text
                  )] hover:text-[var(--color-red)] transition-colors duration-300"
                  >
                    Sandal
                  </NavLink>
                </li>
                <li className="px-4 py-3">
                  <NavLink
                    to={""}
                    className="text-sm font-light text-[var(--color-text
                  )] hover:text-[var(--color-red)] transition-colors duration-300"
                  >
                    Sports
                  </NavLink>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <NavLink
              to="/women_products"
              className="text-base text-[var(--color-text
                )] hover:text-[var(--color-red)] transition-colors duration-300"
            >
              Women
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/women_products"
              className="text-base text-[var(--color-text
                )] hover:text-[var(--color-red)] transition-colors duration-300"
            >
              Children
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/women_products"
              className="text-base text-[var(--color-text
                )] hover:text-[var(--color-red)] transition-colors duration-300"
            >
              Top Deals
            </NavLink>
          </li>
        </ul>
      </div>
      {/* Logo section */}
      <div className="flex justify-center items-center gap-2">
        {/* <div className="h-10 w-10 overflow-hidden">
          <img src="/logo.png" alt="" className="w-full h-full object-fill"/>
        </div> */}
        <h1 className="text-3xl text-black font-bold">Shoezy</h1>
      </div>
      {/* Right Section */}
      <div className="flex items-center gap-x-8">
        <div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-[300px] h-12 pl-4 pr-10 rounded-md bg-[var(--color-search)] text-sm outline-none"
            />
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-500 hover:cursor-pointer" />
          </div>
        </div>
        <div className="hover:cursor-pointer relative group">
          {hasUser ? <div >
            <FaRegUser className="text-2xl" />
          </div> : <Link to={"/login"}>
            <FaRegUser className="text-2xl" />
          </Link>}
          {hasUser && <div className="absolute left-0 mt-2 min-w-[150px] bg-[var(--color-background)] z-50 rounded-md shadow-md  opacity-0 invisible translate-y-1/3 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-in-out">
            <ul className="flex flex-col">

              <li className="px-4 py-3">
                <NavLink
                  to={"/account/profile"}
                  className="text-sm font-light text-[var(--color-text
                  )] hover:text-[var(--color-red)] transition-colors duration-300 flex gap-2 items-center"
                >
                  <CiUser />
                  Profile
                </NavLink>
              </li>
              <li className="px-4 py-3">
                <div

                  className="text-sm font-light text-[var(--color-text
                  )] hover:text-[var(--color-red)] transition-colors duration-300 flex gap-2 items-center"
                  onClick={handleLogOut}
                >
                  <CiLogout />
                  Logout
                </div>
              </li>
            </ul>
          </div>}
        </div>
        <div className="relative hover:cursor-pointer">
          <Link to={"/account/wishlist"}>
            <MdFavoriteBorder className="text-3xl" />
            <div className="bg-[var(--color-black)] w-5 h-5 flex justify-center items-center aspect-square rounded-full absolute top-0 left-1/2 -translate-y-1/3 translate-x-1/12">
              <p className="text-white text-xs">0</p>
            </div>
          </Link>
        </div>
        <NavLink className="flex items-center gap-x-2 hover:cursor-pointer" to={hasUser ? '/account/mycart' : "#"}>
          <div className="relative">
            <MdOutlineShoppingCart className="text-3xl" />
            <div className="bg-[var(--color-black)] w-5 h-5 flex justify-center items-center aspect-square rounded-full absolute top-0 left-1/2 -translate-y-1/3 translate-x-1/12">
              <p className="text-white text-xs">0</p>
            </div>
          </div>
          <p>My Cart</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
