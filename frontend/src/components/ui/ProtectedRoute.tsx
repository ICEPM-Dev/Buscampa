import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  requiredType?: "USER" | "IGLESIA";
}

export function ProtectedRoute({ requiredType }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        <p className="text-sm text-slate-500">Cargando...</p>
      </div>
    );

  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (requiredType && user?.type !== requiredType)
    return <Navigate to="/" replace />;
  return <Outlet />;
}

export default ProtectedRoute;
