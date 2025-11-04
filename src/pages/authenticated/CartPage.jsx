import React, { useState } from "react";
import CartItem from "../../components/Cart/CartItem";
import OrderSummary from "../../components/Cart/OrderSummary";
import Container from "../../components/common/Container/Container";
import Breadcrumb from "../../components/common/Breadcrumb/Breadcrumb";


const CartPage = () => {
    const [items, setItems] = useState([
        { id: 1, image: "/img1.jpg", name: "Analog Magazine Rack", color: "Red", price: 120, quantity: 2 },
        { id: 2, image: "/img2.jpg", name: "Closca Helmet", color: "Black", price: 132, quantity: 1 },
        { id: 3, image: "/img3.jpg", name: "Sigg Water Bottle", color: "Gravel Black", price: 23, quantity: 2 },
    ]);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleIncrement = (id) => {
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
        );
    };

    const handleDecrement = (id) => {
        setItems((prev) =>
            prev.map((i) =>
                i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
            )
        );
    };

    const handleRemove = (id) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const handleApplyCoupon = (code) => {
        alert(`Coupon "${code}" applied!`);
    };

    return (
        <Container>
            <Breadcrumb />
            <div className="max-w-6xl mx-auto py-10 flex">
                <div className="w-2/3 pr-8">
                    <div className="grid grid-cols-5 text-sm text-[var(--text-gray)] border-b border-gray-200 pb-2">
                        <span className="col-span-2">PRODUCT</span>
                        <span>PRICE</span>
                        <span className="text-center">QUANTITY</span>
                        <span className="text-center">TOTAL</span>
                    </div>

                    {items.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onIncrement={handleIncrement}
                            onDecrement={handleDecrement}
                            onRemove={handleRemove}
                        />
                    ))}
                </div>

                <OrderSummary subtotal={subtotal} onApplyCoupon={handleApplyCoupon} />
            </div>
        </Container>
    );
};

export default CartPage;
