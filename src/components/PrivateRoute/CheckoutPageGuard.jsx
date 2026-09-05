import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const CheckoutPageGuard = ({ children, hasAddress }) => {
  const { isAuthenticated, isLoading, } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasAddress) {
    // Redirect to update address page if no saved address
    return <Navigate to="/address" state={{ from: location }} replace />;
  }

  // Address exists → render checkout
  return children;
};
export default CheckoutPageGuard;