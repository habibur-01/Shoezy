import { ChevronRight, Truck } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const OrderCard = ({ item }) => {
    return (
        <div className='flex-1 bg-[var(--color-background)] shadow-all rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition'>
            <div className='space-y-4 flex-1'>
                <div className='flex items-center gap-2 flex-wrap'>
                    <div className='bg-[#FDEDD2] px-3 py-1 rounded-2xl max-w-max flex items-center gap-2'>
                        <div className='bg-amber-600 h-1.5 w-1.5 rounded-full' />
                        <p className='capitalize text-xs font-bold text-amber-700'> {item?.status}</p>
                    </div>
                    <p className='text-[var(--color-border)]'>|</p>
                    <p className='text-[var(--text-gray)] text-xs font-semibold'>{item?.created_at ? item.created_at.split("T")[0] : ""}</p>
                </div>

                <div className=''>
                    {item?.items?.length > 0 && <div className='flex gap-4 items-center'>
                        <img
                            src={item?.items[0]?.product?.images?.cover || (typeof item?.items[0]?.product?.images === 'string' ? item.items[0].product.images : '/placeholder.jpg')}
                            alt={item?.items[0]?.product?.name || "Product"}
                            className="w-16 h-16 object-cover rounded-xl bg-[var(--color-search)] border border-stone-200"
                            onError={(e) => { e.target.src = "/placeholder.jpg"; }}
                        />
                        <div className='space-y-1'>
                            <p className='text-stone-900 text-xs font-mono font-bold'>Order ID: {item?._id}</p>
                            <p className='text-stone-800 text-xs font-bold'>{item?.items[0]?.product?.name || item?.items[0]?.name} {item?.items?.length > 1 && (
                                <span className="text-amber-700 font-medium">
                                    & {item?.items?.length - 1} more item{item?.items?.length - 1 > 1 ? "s" : ""}
                                </span>
                            )}</p>
                            <p className='text-stone-900 text-xs font-extrabold'> Total: Tk {item?.total_amount || item?.items[0]?.price}</p>
                        </div>
                    </div>}
                </div>
            </div>

            <div className='flex items-center gap-3 self-end sm:self-center'>
                <Link
                    to={`/account/track-order/${item?._id}`}
                    className='px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer'
                >
                    <Truck className='w-3.5 h-3.5' />
                    <span>Track Order</span>
                    <ChevronRight className='w-3.5 h-3.5' />
                </Link>
            </div>
        </div>
    );
};

export default React.memo(OrderCard);