import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const OrderConfirmation = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            {/* Modal Card */}
            <div className="bg-[var(--color-white)] rounded-xl shadow-lg p-6 w-[90%] md:w-[420px] animate-fadeIn">

                {/* Success Icon */}
                <div className="flex justify-center mb-4">
                    <CheckCircle className="text-[var(--color-success)]" size={60} />
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-center text-[var(--color-black)]">
                    Thank You for Your Order!
                </h2>

                {/* Message */}
                <p className="text-center mt-2 text-[var(--text-gray)] text-sm leading-relaxed">
                    Your order has been successfully placed. We will notify you once it is processed.
                </p>

                {/* Buttons */}
                <div className="mt-6 flex flex-col gap-3">
                    {/* Track Order */}
                    <Link to={"/order"}>
                        <button className="btn-black w-full rounded-lg">
                            Track Order
                        </button>
                    </Link>
                    {/* Continue Shopping */}
                    <Link to={""}>
                        <button className="btn-red w-full uppercase">
                            Continue Shopping
                        </button>
                    </Link>

                    {/* Home */}
                    <Link to={"/products"}>
                        <button
                            className="w-full text-sm font-medium text-[var(--color-black)] underline hover:cursor-pointer"
                            onClick={onClose}
                        >
                            Go to Home
                        </button>
                    </Link>
                </div>
            </div>
        </div >
    );
};

export default OrderConfirmation;
