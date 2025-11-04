import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
           
            <img
                src="/assets/images/icon/error.png"
                alt="Page Not Found"
                className="w-80 mb-6"
            />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Oops! Page not found</h1>
            <p className="text-gray-600 mb-6">
                The page you’re looking for doesn’t exist or has been moved.
            </p>
            <Link
                to="/"
                className="px-6 py-3 bg-[var(--color-red)] text-white rounded-lg hover:bg-red-600 transition-all "
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default ErrorPage;
