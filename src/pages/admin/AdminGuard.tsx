import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../auth/AdminAuthContext";

export default function AdminGuard() {
  const { loading, session, isAdmin } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-auth-screen">
        <span className="page-spinner" />
        <p>Validando acesso...</p>
      </div>
    );
  }

  if (!session || !isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
