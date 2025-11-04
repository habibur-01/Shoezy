// src/components/Breadcrumb.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaAngleRight, FaHome } from "react-icons/fa";

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <div className="text-sm text-gray-400 mb-10 flex items-center space-x-1">
      <FaHome className="text-gray-400" />
      <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        return (
          <span key={name} className="flex items-center space-x-1">
            <FaAngleRight className="text-gray-400" />
            {isLast ? (
              <span className="text-gray-500 font-medium">
                {name.replace(/-/g, " ")}
              </span>
            ) : (
              <Link to={routeTo} className="hover:text-red-500 transition-colors">
                {name.replace(/-/g, " ")}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
