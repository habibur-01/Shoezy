import { ChevronRight, Dot } from 'lucide-react';
import React from 'react';

const OrderCard = ({ item }) => {
    return (
        <div className='flex-1 bg-[var(--color-background)] shadow-all rounded-xl p-5 flex justify-between items-center'>
            <div className='space-y-5'>
                <div className='flex items-center gap-2'>
                    <div className='bg-[#FDEDD2] px-4 py-1 rounded-2xl max-w-max flex items-center gap-2'>
                        <div className='bg-amber-600 h-1.5 w-1.5 rounded-full' />
                        <p className='capitalize text-xs text-amber-600'> {item?.status}</p>
                    </div>
                    <p className='text-[var(--color-border)]'>|</p>
                    <p className='text-[var(--text-gray)] text-sm'>{item?.created_at.split("T")[0]}</p>
                </div>

                <div className=''>
                    {item?.items?.length > 0 && <div className='flex gap-5 '>
                        <img
                            src={item?.items[0]?.product?.images?.cover}
                            alt={item.product?.name}
                            className="w-20 object-contain rounded-md bg-[var(--color-search)]"
                        />
                        <div className='space-y-2'>
                            <p className='text-orange-700 text-sm font-medium'>Order ID: {item?._id}</p>
                            <p className='text-[var(--color-black)] text-sm'>{item?.items[0]?.product?.name}  {item?.items?.length > 1 && (
                                <span className="text-orange-700 font-medium">
                                    & {item?.items?.length - 1} more item{item?.items?.length - 1 > 1 ? "s" : ""}
                                </span>
                            )}</p>
                            <p className='text-[var(--color-black)] text-sm'> Tk {item?.items[0]?.price}</p>


                        </div>
                    </div>}
                </div>
            </div>
            <div>
                <ChevronRight className='text-[var(--text-gray)]'/>
            </div>

        </div>
    );
};

export default React.memo(OrderCard);