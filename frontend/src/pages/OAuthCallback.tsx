/**
 * Página de callback para Google OAuth.
 * Maneja la respuesta de Google OAuth y establece la sesión del usuario.
 */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get("token");
        const errorParam = searchParams.get("error");

        if (errorParam) {
          throw new Error(
            errorParam === "google_denied" 
              ? "Cancelaste la autenticación con Google" 
              : errorParam === "facebook_denied"
              ? "Cancelaste la autenticación con Facebook"
              : errorParam === "x_denied"
              ? "Cancelaste la autenticación con X"
              : errorParam === "google_auth_failed" 
              ? "Error en la autenticación con Google" 
              : "Error inesperado durante la autenticación"
          );
        }

        if (!token) {
          throw new Error("No se recibió token de autenticación");
        }

        // Iniciar sesión con el token de Google
        await loginWithGoogle(token);
        
        // Redirigir al dashboard después del login exitoso
        navigate("/", { replace: true });
        
      } catch (error: any) {
        console.error("Error en OAuth callback:", error);
        setError(error.message || "Error en la autenticación con Google");
        
        // Redirigir al login después de un delay
        setTimeout(() => {
          navigate("/auth", { replace: true });
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, loginWithGoogle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-800">
              Procesando autenticación...
            </h2>
            <p className="text-slate-600">
              Estableciendo tu sesión con Google
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-red-800">
              Error en la autenticación
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
          
          <div className="space-y-2 pt-2">
            <p className="text-sm text-slate-600">
              Serás redirigido a la página de login en 3 segundos...
            </p>
            <div className="animate-pulse">
              <div className="h-2 w-32 bg-blue-200 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null; // No debería mostrar nada si todo va bien
}