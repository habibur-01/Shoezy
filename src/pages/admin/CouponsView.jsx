import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

import { CouponsHeader } from './coupons/CouponsHeader';
import { CouponsGrid } from './coupons/CouponsGrid';
import { CouponGeneratorModal } from './coupons/CouponGeneratorModal';






export const CouponsView = ({
  isNewModalOpen: externalModalOpen,
  setIsNewModalOpen: setExternalModalOpen
}) => {
  const { coupons, createCoupon, toggleCouponStatus, deleteCoupon } = useAdmin();

  const [internalModalOpen, setInternalModalOpen] = useState(false);

  const isModalOpen = externalModalOpen !== undefined ? externalModalOpen : internalModalOpen;
  const setModalOpen = (open) => {
    if (setExternalModalOpen) {
      setExternalModalOpen(open);
    } else {
      setInternalModalOpen(open);
    }
  };

  // Generator form state
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(20);
  const [minSpend, setMinSpend] = useState(50);
  const [maxDiscount, setMaxDiscount] = useState(100);
  const [usageLimit, setUsageLimit] = useState(200);
  const [customerTierLimit, setCustomerTierLimit] = useState('all');
  const [validCategory, setValidCategory] = useState('All');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const generateRandomPromoCode = (prefix = 'SAVE') => {
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generated = `${prefix}${discountValue || 20}-${randomChars}`;
    setCode(generated);
  };

  const handleCreateCouponSubmit = (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    const success = createCoupon({
      code: code.trim().toUpperCase(),
      description: description || `${discountValue}% promotional discount`,
      discountType,
      discountValue: Number(discountValue),
      minSpend: Number(minSpend),
      maxDiscount: discountType === 'percentage' && maxDiscount ? Number(maxDiscount) : undefined,
      usageLimit: Number(usageLimit),
      customerTierLimit,
      validCategory,
      startDate,
      endDate,
      isActive: true
    });

    if (success) {
      setModalOpen(false);
      setCode('');
      setDescription('');
    }
  };

  const handleDeleteCoupon = (couponId, couponCode) => {
    if (confirm(`Are you sure you want to revoke and delete coupon "${couponCode}"?`)) {
      deleteCoupon(couponId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <CouponsHeader
        onOpenGenerator={() => {
          generateRandomPromoCode('FLASH');
          setModalOpen(true);
        }} />
      

      {/* Coupons List Cards */}
      <CouponsGrid
        coupons={coupons}
        onToggleStatus={toggleCouponStatus}
        onDeleteCoupon={handleDeleteCoupon} />
      

      {/* Custom Coupon Generator Modal */}
      <CouponGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        code={code}
        setCode={setCode}
        description={description}
        setDescription={setDescription}
        discountType={discountType}
        setDiscountType={setDiscountType}
        discountValue={discountValue}
        setDiscountValue={setDiscountValue}
        minSpend={minSpend}
        setMinSpend={setMinSpend}
        usageLimit={usageLimit}
        setUsageLimit={setUsageLimit}
        customerTierLimit={customerTierLimit}
        setCustomerTierLimit={setCustomerTierLimit}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onGenerateCode={() => generateRandomPromoCode('PROMO')}
        onSubmit={handleCreateCouponSubmit} />
      
    </div>);

};

export default CouponsView;