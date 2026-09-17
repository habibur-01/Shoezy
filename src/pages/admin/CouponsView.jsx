import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

import { CouponsHeader } from './coupons/CouponsHeader';
import { CouponsGrid } from './coupons/CouponsGrid';
import { CouponGeneratorModal } from './coupons/CouponGeneratorModal';






export const CouponsView = ({
  isNewModalOpen: externalModalOpen,
  setIsNewModalOpen: setExternalModalOpen
}) => {
  const { coupons, createCoupon, toggleCouponStatus, deleteCoupon, refreshCoupons } = useAdmin();

  const [internalModalOpen, setInternalModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const [usageLimitPerUser, setUsageLimitPerUser] = useState(1);
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

  const handleCreateCouponSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const created = await createCoupon({
        code: code.trim().toUpperCase(),
        description: description || `${discountValue}${discountType === 'percentage' ? '%' : '$'} promotional discount`,
        discountType,
        discountValue: Number(discountValue),
        minSpend: Number(minSpend),
        maxDiscount: discountType === 'percentage' && maxDiscount ? Number(maxDiscount) : 0,
        usageLimit: Number(usageLimit),
        usageLimitPerUser: Number(usageLimitPerUser || 1),
        customerTierLimit,
        validCategory,
        startDate,
        endDate,
        isActive: true
      });

      if (created) {
        setModalOpen(false);
        setCode('');
        setDescription('');
      }
    } finally {
      setIsSubmitting(false);
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
        onRefresh={refreshCoupons}
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
        maxDiscount={maxDiscount}
        setMaxDiscount={setMaxDiscount}
        usageLimit={usageLimit}
        setUsageLimit={setUsageLimit}
        usageLimitPerUser={usageLimitPerUser}
        setUsageLimitPerUser={setUsageLimitPerUser}
        customerTierLimit={customerTierLimit}
        setCustomerTierLimit={setCustomerTierLimit}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        onGenerateCode={() => generateRandomPromoCode('PROMO')}
        onSubmit={handleCreateCouponSubmit}
        isSubmitting={isSubmitting} />
    </div>);

};

export default CouponsView;