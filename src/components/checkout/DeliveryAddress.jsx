import React from 'react';

const DeliveryAddress = ({address,city,state,zip,country,hasAddress,addressType}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 ">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Delivery Address
            </h2>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                {/* Home / Office Tabs */}
                <div className="flex items-center gap-2 mb-3">
                    <button
                        onClick={() => setAddressType('home')}
                        className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-bold ${addressType === "home"
                            ? "bg-yellow-400 text-gray-900"
                            : "bg-white border border-gray-300 text-gray-700"
                            }`}
                    >
                        Home
                    </button>

                    <button
                        onClick={() => setAddressType('office')}
                        className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-bold ${addressType === "office"
                            ? "bg-yellow-400 text-gray-900"
                            : "bg-white border border-gray-300 text-gray-700"
                            }`}
                    >
                        Office
                    </button>
                </div>

                {/* STATIC ADDRESS (your design) */}
                <div className="mb-2 space-y-2">
                    <p className="text-sm text-gray-800 leading-relaxed">
                        {address}, {state}, {city}

                    </p>
                    <p className="text-sm text-gray-800">
                        {country}, {state}, {zip}
                    </p>
                </div>

                <button className="text-sm text-pink-600 font-medium hover:text-pink-700 hover:underline">
                    {hasAddress ? "CHANGE ADDRESS" : " ADD ADDRESS"}
                </button>
            </div>
        </div>
    );
};

export default React.memo(DeliveryAddress);