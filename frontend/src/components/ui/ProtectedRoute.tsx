import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Tent } from "lucide-react";

interface ProtectedRouteProps {
  requiredType?: "USER" | "IGLESIA";
}

export function ProtectedRoute({ requiredType }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <Tent className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            Busca<span className="text-blue-600">mpa</span>
          </span>
        </div>
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
