import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { getMyOrders } from '../../server/user/user';
import CartItem from '../Cart/CartItem';
import OrderCard from '../Order/OrderCard';
import Pagination from '../Products/Pagination';
import LoadingSpinner from '../common/loader/Loader';

const MyOrders = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(5)

    const { data: orders, isLoading, isError, refetch } = useQuery({
        queryKey: ["orders", page, limit], 
        queryFn: async () => {
            const result = await getMyOrders({ page, limit });
            return result?.data?.data; 
        },
        keepPreviousData: true, 
    });

    return (
        <div >
            <h1 className='text-lg font-medium mb-4'>My Orders <span>({orders?.totalOrders})</span></h1>
            {isLoading && <LoadingSpinner/>}
            <div className='space-y-5'>
                {
                    orders?.data?.length > 0 && orders?.data?.map(item => (
                        <OrderCard key={item?._id} item={item} />
                    ))
                }
            </div>

            <Pagination currentPage={orders?.page} totalPages={orders?.totalPages} onPageChange={setPage} />

        </div>
    );
};

export default MyOrders;