import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { DashboardView } from './DashboardView';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const context = useOutletContext() || {};

  const handleTabChange = (tabId) => {
    if (context.setActiveTab) {
      context.setActiveTab(tabId);
    } else {
      navigate(`/admin/${tabId}`);
    }
  };

  return (
    <DashboardView
      setActiveTab={handleTabChange}
      openNewProductModal={() => navigate('/admin/add_product')}
      openNewCouponModal={() => navigate('/admin/coupons')}
    />
  );
};

export default AdminDashboard;