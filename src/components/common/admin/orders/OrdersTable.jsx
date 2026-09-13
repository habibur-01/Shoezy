import React from 'react';
import { ShoppingCart } from 'lucide-react';

import { OrderTableRow } from './OrderTableRow';






export const OrdersTable = ({ orders, onOpenDetail }) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50/75 text-zinc-500 border-b border-zinc-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Order ID & Date</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Purchased Items</th>
              <th className="py-3 px-4">Financials</th>
              <th className="py-3 px-4">Fulfillment Status</th>
              <th className="py-3 px-4">Carrier Tracking</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700">
            {orders.length === 0 ?
            <tr>
                <td colSpan={7} className="py-12 text-center text-zinc-400">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                  No orders match your filter criteria.
                </td>
              </tr> :

            orders.map((order) =>
            <OrderTableRow key={order.id} order={order} onOpenDetail={onOpenDetail} />
            )
            }
          </tbody>
        </table>
      </div>
    </div>);

};