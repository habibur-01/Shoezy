import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { loggedIn } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!loggedIn) {
    // Redirect to login but remember where user was going
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
