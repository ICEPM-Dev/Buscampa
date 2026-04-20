/**
 * Componente de ruta protegida.
 * Verifica autenticación y opcionalmente el tipo de usuario requerido.
 * Redirige a login si no autenticado o a home si tipo incorrecto.
 */
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  requiredType?: "USER" | "IGLESIA";
}

export default function ProtectedRoute({ requiredType }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredType && user?.type !== requiredType) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
