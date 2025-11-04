import React, { useState } from "react";
import { FaHeart, FaTimes } from "react-icons/fa";
import Container from "../../components/common/Container/Container";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";

const WishlistPage = () => {
    // Mock data — you can later connect this to Redux or backend
    const [wishlist, setWishlist] = useState([
        {
            id: 1,
            name: "Analog Magazine Rack",
            color: "Red",
            price: 120,
            image:
                "https://cdn.pixabay.com/photo/2017/08/06/07/20/magazine-2583825_1280.jpg",
        },
        {
            id: 2,
            name: "Closca Helmet",
            color: "Black",
            price: 132,
            image:
                "https://cdn.pixabay.com/photo/2018/08/18/11/28/helmet-3619532_1280.jpg",
        },
        {
            id: 3,
            name: "Sigg Water Bottle",
            color: "Gray",
            price: 23,
            image:
                "https://cdn.pixabay.com/photo/2016/02/19/10/00/bottle-1209001_1280.jpg",
        },
    ]);

    const removeFromWishlist = (id) => {
        setWishlist((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <Container>
            <Breadcrumb />
            <div className="max-w-6xl mx-auto px-5 py-10 mb-5">
                <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-6 flex items-center gap-2">
                    <FaHeart className="text-[var(--color-red)]" /> My Wishlist
                </h2>

                {wishlist.length === 0 ? (
                    <p className="text-[var(--text-gray)] text-sm">
                        Your wishlist is empty. ❤️ Add some items you love!
                    </p>
                ) : (
                    <div className="bg-white rounded-md shadow-all divide-y divide-gray-100">
                        {wishlist.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition"
                            >
                                {/* Product Info */}
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-contain rounded-md bg-[var(--color-search)]"
                                    />
                                    <div>
                                        <h4 className="text-sm font-medium text-[var(--color-black)]">
                                            {item.name}
                                        </h4>
                                        <p className="text-xs text-[var(--text-gray)]">{item.color}</p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="text-sm text-[var(--color-black)] font-medium">
                                    ${item.price}
                                </div>

                                {/* Buttons */}
                                <div className="flex items-center space-x-3">
                                    <button className="btn-black text-sm px-4 py-1 rounded-sm">
                                        ADD TO CART
                                    </button>
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="text-gray-400 hover:text-gray-600 transition"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Container>
    );
};

export default WishlistPage;
