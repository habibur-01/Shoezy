import React, { memo } from 'react';

const CheckoutSummary = memo(({finalPrice, totalPrice, vat, serviceFee, deliveryFee, products}) => {
    
    return (
        <div className="bg-white rounded-lg shadow-sm p-6  top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Order Summary
            </h2>
            <p className="text-sm text-gray-600 mb-6">
                Total Item - {products?.length}
            </p>

            <div className="space-y-4 mb-6 overflow-y-auto ">
                {products.length > 0 && products?.map((item) => (
                    <div
                        key={item._id}
                        className="flex justify-between items-start"
                    >
                        <div className="flex items-start gap-2">
                            <span className="text-sm text-gray-600">
                                {item.quantity}
                            </span>
                            <span className="text-sm text-gray-600">x</span>
                            <span className="text-sm text-gray-900">{item?.product?.name.slice(0, 24)}...</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                            Tk {item.price}
                        </span>
                    </div>
                ))}
            </div>

            <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">Tk {totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Standard delivery</span>
                    <span className="text-gray-900">Tk {deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service fee</span>
                    <span className="text-gray-900">Tk {serviceFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">VAT</span>
                    <span className="text-gray-900">Tk {vat}</span>
                </div>
            </div>

            <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Total</h3>
                        <p className="text-xs text-gray-500">
                            (Incl. fees and tax)
                        </p>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">
                        Tk {finalPrice}
                    </span>
                </div>
            </div>
        </div>
    );
});

export default CheckoutSummary;