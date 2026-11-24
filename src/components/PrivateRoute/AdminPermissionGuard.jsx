import { Navigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

const AdminPermissionGuard = ({ permission, children }) => {
  const { hasPermission, isLoadingPermissions } = useAdmin();

  if (isLoadingPermissions) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!hasPermission(permission)) {
    return <Navigate to="/admin/dashboard" replace state={{ accessDenied: true }} />;
  }

  return children;
};

export default AdminPermissionGuard;
