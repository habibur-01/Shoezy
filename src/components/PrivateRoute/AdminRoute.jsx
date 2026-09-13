import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const localAdminToken = typeof window !== 'undefined' ? localStorage.getItem('shoezy_admin_token') : null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white gap-4">
        <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-zinc-400 font-mono tracking-wider uppercase">
          Verifying Clearance Credentials...
        </span>
      </div>
    );
  }

  // Allow access if either:
  // 1) user has active shoezy_admin_token in localStorage, or
  // 2) user is authenticated with admin or manager role
  const hasAdminPrivilege =
    Boolean(localAdminToken) ||
    (isAuthenticated && (user?.role === 'admin' || user?.role === 'manager' || user?.roleId));

  if (!hasAdminPrivilege) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default AdminRoute;
