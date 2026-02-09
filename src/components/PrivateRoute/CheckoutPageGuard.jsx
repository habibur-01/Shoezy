import { Navigate, useLocation } from "react-router-dom";

const CheckoutPageGuard = ({ children, hasAddress }) => {
     const { loggedIn } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!loggedIn) {
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
