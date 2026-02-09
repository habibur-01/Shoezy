import { CircleDollarSign, CreditCard } from 'lucide-react';
import React, { useCallback } from 'react';
import { paymentType } from '../../data/enum';

const PaymentMethod = ({ paymentMethod, trxId, setPaymentMethod, setErrorMsg, setTrxId }) => {
    console.log("🚀 ~ PaymentMethod ~ paymentMethod:", paymentMethod)
    const handleMethod = useCallback((method) => {
        setPaymentMethod(method)
        setErrorMsg({ addressErr: null, paymentErr: null })
    }, [])

    const handleTrxId = useCallback((id) => {
        setTrxId(id)
    }, [])
    return (

        <div className="bg-white rounded-lg shadow-sm p-6 ">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>


            <div className="grid grid-cols-4 gap-3">

                {/* bKash • Nagad • Rocket */}
                {paymentType.map((item) => (
                    <div
                        key={item?.id}
                        onClick={() => handleMethod(item?.method)}
                        className={`cursor-pointer bg-gray-50 border rounded-lg p-4 flex flex-col items-center justify-center 
                          ${paymentMethod === item?.method
                                ? "border-green-600 text-green-600 shadow-sm"
                                : "border-gray-200"
                            }`}
                    >
                        {item?.method === 'cod' ? <span className="text-2xl"><CircleDollarSign /></span> : <div className='w-16 h-8 overflow-hidden'>
                            <img src={item?.icon} alt='method icon' className='h-full w-full object-contain' />
                        </div>}
                        <span
                            className={`mt-2 text-sm font-normal`}
                        >
                            {item?.method.toUpperCase()}
                        </span>
                    </div>
                ))}


            </div>

            {/* Wallet / Manual Payment Input Section */}
            {["bkash", "nagad", "rocket"].includes(paymentMethod) && (
                <div className="mt-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Payment Instruction</h3>

                    <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                        <li>
                            Send the payment to this number:
                            <span className="font-semibold text-green-600 ml-1">01799362609</span>
                        </li>
                        <li>
                            Make sure the amount matches your order total.
                        </li>
                        <li>
                            After payment, enter the Transaction ID below.
                        </li>
                    </ul>

                    {/* Transaction ID */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-800 mb-1">
                            Transaction ID
                        </label>
                        <input
                            type="text"
                            name='trxid'
                            value={trxId}
                            onChange={(e) => handleTrxId(e.target.value)}
                            placeholder="e.g., TXN4537KD"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                   focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                </div>
            )}
        </div>


    );
};

export default React.memo(PaymentMethod);