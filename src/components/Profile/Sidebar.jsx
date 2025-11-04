// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const links = [
        { title: "My Profile", path: "/account/profile" },
        { title: "Address Book", path: "/account/address" },
        { title: "My Payment Options", path: "/account/payment" },
    ];
    const orders = [
        { title: "My Returns", path: "/account/returns" },
        { title: "My Cancellations", path: "/account/cancellations" },
    ];

    const wish = [{ title: "My Wishlist", path: "/account/wishlist" }];

    const renderLinks = (items) =>
        items.map((item) => (
            <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                    `block text-sm px-1 py-2 ${isActive
                        ? "text-[var(--color-red)] font-normal"
                        : "text-[var(--text-gray)] hover:text-[var(--color-red)] transition"
                    }`
                }
            >
                {item.title}
            </NavLink>
        ));

    return (
        <div className="w-1/3 pr-6 text-gray-600">
            <div className="mb-6">
                <h3 className="font-semibold text-sm text-gray-900 mb-1">Manage My Account</h3>
                <div className="ml-6">
                    {renderLinks(links)}
                </div>
            </div>
            <div className="mb-6">
                <h3 className="font-semibold text-sm text-gray-900 mb-1">My Orders</h3>
                <div className="ml-6">
                    {renderLinks(orders)}
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-sm text-gray-900 mb-1">My Wishlist</h3>
                <div className="ml-6">
                    {renderLinks(wish)}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
