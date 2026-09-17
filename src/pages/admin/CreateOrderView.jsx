import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  ShieldAlert,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import {
  CreateOrderInput,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  SocialOrderSource,
  Order,
} from '../types';
import { SourceChannelSelector } from './create-order/SourceChannelSelector';
import { CustomerInfoForm } from './create-order/CustomerInfoForm';
import { ProductCatalogSelector } from './create-order/ProductCatalogSelector';
import { OrderLineItems } from './create-order/OrderLineItems';
import { GiftWrappingSection } from './create-order/GiftWrappingSection';
import { ShippingCarrierSection } from './create-order/ShippingCarrierSection';
import { CouponAndDiscountSection } from './create-order/CouponAndDiscountSection';
import { OrderPaymentSection } from './create-order/OrderPaymentSection';
import { OrderFinancialSummary } from './create-order/OrderFinancialSummary';
import { OrderSuccessModal } from './create-order/OrderSuccessModal';



export const CreateOrderView = ({
  onBack,
  onViewOrders,
}) => {
  const { hasPermission, createOrder, shippingCarriers, orders } = useAdmin();

  // 1. Channel state
  const [source, setSource] = useState<SocialOrderSource | string>('facebook');
  const [sourceHandle, setSourceHandle] = useState<string>('');

  // 2. Customer state
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [country, setCountry] = useState<string>('United States');
  const [internalNotes, setInternalNotes] = useState<string>('');

  // 3. Line Items state
  const [items, setItems] = useState<OrderItem[]>([]);

  // 4. Gift options state
  const [isGiftOrder, setIsGiftOrder] = useState<boolean>(false);
  const [giftMessage, setGiftMessage] = useState<string>('');
  const [giftWrapping, setGiftWrapping] = useState<boolean>(false);
  const [hideInvoicePrices, setHideInvoicePrices] = useState<boolean>(false);

  // 5. Logistics / Carrier state
  const initialCarrier = shippingCarriers[0] || {
    name: 'FedEx Express',
    baseRate: 24.5,
  };
  const [carrier, setCarrier] = useState<string>(initialCarrier.name);
  const [shippingRate, setShippingRate] = useState<number>(initialCarrier.baseRate);
  const [trackingNumber, setTrackingNumber] = useState<string>('');

  // 6. Discounts state
  const [couponCode, setCouponCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [manualDiscount, setManualDiscount] = useState<number>(0);

  // 7. Payment state
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('paid');
  const [paymentMethod, setPaymentMethod] = useState<string>('Facebook Pay');
  const [fulfillmentStatus, setFulfillmentStatus] = useState<OrderStatus>('processing');

  // Submission & Modal state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);

  // Permission verification
  const canCreate = hasPermission('orders.create');

  // Math calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalDiscount = discount + manualDiscount;
  const grandTotal = Math.max(0, subtotal - totalDiscount + shippingRate);

  // Line item handlers
  const handleAddItem = (item) => {
    setValidationError(null);
    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.productId === item.productId && i.isGift === item.isGift
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + item.quantity,
        };
        return updated;
      }
      return [...prev, item];
    });

    if (item.isGift && !isGiftOrder) {
      setIsGiftOrder(true);
    }
  };

  const handleUpdateQuantity = (index, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: newQty };
      return updated;
    });
  };

  const handleUpdatePrice = (index, newPrice) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], price: newPrice };
      return updated;
    });
  };

  const handleToggleGift = (index) => {
    setItems((prev) => {
      const updated = [...prev];
      const target = updated[index];
      const nextIsGift = !target.isGift;

      updated[index] = {
        ...target,
        isGift: nextIsGift,
        price: nextIsGift ? 0 : target.originalPrice || target.price,
        giftMessage: nextIsGift ? 'Complimentary Promotional Gift' : undefined,
      };

      // If at least one item is gift, activate order-level gift badge
      if (nextIsGift) setIsGiftOrder(true);

      return updated;
    });
  };

  const handleUpdateGiftMessage = (index, message) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], giftMessage: message };
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleResetForm = () => {
    setSource('facebook');
    setSourceHandle('');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setStreet('');
    setCity('');
    setState('');
    setPostalCode('');
    setCountry('United States');
    setInternalNotes('');
    setItems([]);
    setIsGiftOrder(false);
    setGiftMessage('');
    setGiftWrapping(false);
    setHideInvoicePrices(false);
    setCouponCode('');
    setDiscount(0);
    setManualDiscount(0);
    setPaymentStatus('paid');
    setPaymentMethod('Facebook Pay');
    setFulfillmentStatus('processing');
    setValidationError(null);
  };

  const handleSubmitOrder = () => {
    setValidationError(null);

    if (items.length === 0) {
      setValidationError('Please add at least one product to the order.');
      return;
    }

    if (!customerName.trim()) {
      setValidationError('Please provide the recipient / customer full name.');
      return;
    }

    if (!customerEmail.trim()) {
      setValidationError('Please provide the customer contact email address.');
      return;
    }

    setIsSubmitting(true);

    const fullAddress = [
      street.trim(),
      city.trim(),
      state.trim() ? `${state.trim()} ${postalCode.trim()}` : postalCode.trim(),
      country.trim(),
    ]
      .filter(Boolean)
      .join(', ');

    const payload = {
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim() || undefined,
      items: items,
      subtotal: subtotal,
      discount: totalDiscount,
      couponCode: couponCode || undefined,
      total: grandTotal,
      status: fulfillmentStatus,
      paymentStatus: paymentStatus,
      paymentMethod: paymentMethod,
      shippingAddress: {
        street: street.trim() || 'Direct Social / Storefront Pickup',
        city: city.trim() || 'Local City',
        state: state.trim() || 'CA',
        postalCode: postalCode.trim() || '90210',
        country: country.trim() || 'United States',
      },
      carrier: carrier,
      shippingRate: shippingRate,
      trackingNumber: trackingNumber.trim() || undefined,
      source: source,
      sourceHandle: sourceHandle.trim() || undefined,
      isGiftOrder: isGiftOrder || items.some((i) => i.isGift),
      giftMessage: giftMessage.trim() || undefined,
      giftWrapping: giftWrapping,
      internalNotes: internalNotes.trim() || undefined,
    };

    const res = createOrder(payload);
    setIsSubmitting(false);

    if (res.success && res.orderId) {
      // Find the newly inserted order from state or construct display order
      const newOrderObj = {
        id: res.orderId,
        customerName: payload.customerName,
        customerEmail: payload.customerEmail,
        customerPhone: payload.customerPhone,
        items: payload.items,
        subtotal: payload.subtotal,
        discount: payload.discount,
        couponCode: payload.couponCode,
        total: payload.total,
        status: payload.status || 'processing',
        paymentStatus: payload.paymentStatus || 'paid',
        paymentMethod: payload.paymentMethod,
        shippingAddress: payload.shippingAddress,
        carrier: payload.carrier,
        shippingRate: payload.shippingRate,
        trackingNumber: payload.trackingNumber,
        timeline: [],
        createdAt: new Date().toISOString(),
        source: payload.source,
        sourceHandle: payload.sourceHandle,
        isGiftOrder: payload.isGiftOrder,
        giftMessage: payload.giftMessage,
        giftWrapping: payload.giftWrapping,
        internalNotes: payload.internalNotes,
      };

      setCreatedOrder(newOrderObj);
      setIsSuccessModalOpen(true);
    } else {
      setValidationError(res.error || 'Failed to record order. Please verify input data.');
    }
  };

  // If role is unauthorized
  if (!canCreate) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-zinc-900">Access Restricted</h2>
        <p className="text-xs text-zinc-600 mt-1 max-w-md mx-auto">
          Your current assigned role does not have the{' '}
          <code className="px-1.5 py-0.5 bg-zinc-100 rounded font-mono text-zinc-800">
            orders.create
          </code>{' '}
          permission to manually intake social orders. Please switch to Store Manager or Super Admin via the persona selector above.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="btn-back-to-orders"
            onClick={onBack}
            className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
            title="Back to Order Tracking"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
                Create Social / Manual Order
              </h1>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" /> Omnichannel POS
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Intake orders originating from Facebook, Instagram, WhatsApp, TikTok, phone calls, or walk-ins.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleResetForm}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            Reset
          </button>
        </div>
      </div>

      {/* Main Grid: Form Sections (Left 8 cols) vs Financial Summary (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Intake Steps */}
        <div className="lg:col-span-8 space-y-5">
          {/* Step 1: Origin / Social Channel */}
          <SourceChannelSelector
            source={source}
            setSource={setSource}
            sourceHandle={sourceHandle}
            setSourceHandle={setSourceHandle}
          />

          {/* Step 2: Customer & Shipping Address */}
          <CustomerInfoForm
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerEmail={customerEmail}
            setCustomerEmail={setCustomerEmail}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            street={street}
            setStreet={setStreet}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            postalCode={postalCode}
            setPostalCode={setPostalCode}
            country={country}
            setCountry={setCountry}
            internalNotes={internalNotes}
            setInternalNotes={setInternalNotes}
          />

          {/* Step 3: Product Catalog Search & Add */}
          <ProductCatalogSelector
            onAddItem={handleAddItem}
            selectedItems={items}
          />

          {/* Step 4: Line Items Table & Custom Items */}
          <OrderLineItems
            items={items}
            onUpdateQuantity={handleUpdateQuantity}
            onUpdatePrice={handleUpdatePrice}
            onToggleGift={handleToggleGift}
            onUpdateGiftMessage={handleUpdateGiftMessage}
            onRemoveItem={handleRemoveItem}
            onAddCustomItem={handleAddItem}
          />

          {/* Step 5: Gift Options & Personal Card */}
          <GiftWrappingSection
            isGiftOrder={isGiftOrder}
            setIsGiftOrder={setIsGiftOrder}
            giftMessage={giftMessage}
            setGiftMessage={setGiftMessage}
            giftWrapping={giftWrapping}
            setGiftWrapping={setGiftWrapping}
            hideInvoicePrices={hideInvoicePrices}
            setHideInvoicePrices={setHideInvoicePrices}
          />

          {/* Step 6: Shipping Carrier & Logistics */}
          <ShippingCarrierSection
            carrier={carrier}
            setCarrier={setCarrier}
            shippingRate={shippingRate}
            setShippingRate={setShippingRate}
            trackingNumber={trackingNumber}
            setTrackingNumber={setTrackingNumber}
          />

          {/* Step 7: Coupons & Discounts */}
          <CouponAndDiscountSection
            subtotal={subtotal}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discount={discount}
            setDiscount={setDiscount}
            manualDiscount={manualDiscount}
            setManualDiscount={setManualDiscount}
          />

          {/* Step 8: Payment Settlement & Fulfillment State */}
          <OrderPaymentSection
            paymentStatus={paymentStatus}
            setPaymentStatus={setPaymentStatus}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            fulfillmentStatus={fulfillmentStatus}
            setFulfillmentStatus={setFulfillmentStatus}
          />
        </div>

        {/* Right Column: Sticky Calculation Summary & Submit */}
        <div className="lg:col-span-4">
          <OrderFinancialSummary
            items={items}
            subtotal={subtotal}
            discount={discount}
            manualDiscount={manualDiscount}
            couponCode={couponCode}
            shippingRate={shippingRate}
            carrier={carrier}
            source={source}
            sourceHandle={sourceHandle}
            isGiftOrder={isGiftOrder}
            total={grandTotal}
            customerName={customerName}
            customerEmail={customerEmail}
            isSubmitting={isSubmitting}
            validationError={validationError}
            onSubmit={handleSubmitOrder}
            onReset={handleResetForm}
            onCancel={onBack}
          />
        </div>
      </div>

      {/* Success Modal */}
      <OrderSuccessModal
        order={createdOrder}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onViewOrderTracking={() => {
          setIsSuccessModalOpen(false);
          onViewOrders();
        }}
        onCreateAnother={() => {
          setIsSuccessModalOpen(false);
          handleResetForm();
        }}
      />
    </div>
  );
};
