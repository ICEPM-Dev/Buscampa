import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Tent } from "lucide-react";

export function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const token = searchParams.get("token");
        const errorParam = searchParams.get("error");
        const fbError = searchParams.get("error_reason");
        const errorCode = searchParams.get("error_code");
        const fbErrorDesc = searchParams.get("error_description");

        if (fbError === "user_denied" || errorCode === "200" || fbErrorDesc)
          throw new Error("Cancelaste la autenticación con Facebook");
        if (errorParam === "access_denied" || errorParam === "user_denied")
          throw new Error("Cancelaste la autenticación");
        if (errorParam)
          throw new Error(
            errorParam === "google_denied"
              ? "Cancelaste la autenticación con Google"
              : errorParam === "facebook_denied"
                ? "Cancelaste la autenticación con Facebook"
                : errorParam === "google_auth_failed"
                  ? "Error en la autenticación con Google"
                  : "Error inesperado durante la autenticación",
          );
        if (!token) throw new Error("No se recibió token de autenticación");

        await loginWithGoogle(token);
        navigate("/", { replace: true });
      } catch (err: any) {
        setError(err.message || "Error en la autenticación");
        setTimeout(() => navigate("/auth", { replace: true }), 3000);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [searchParams, navigate, loginWithGoogle]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        {/* Logo */}
        <div className="inline-flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <Tent className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            Busca<span className="text-blue-600">mpa</span>
          </span>
        </div>

        {loading ? (
          <>
            <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-slate-800 mb-1">
              Procesando autenticación...
            </h2>
            <p className="text-sm text-slate-500">Estableciendo tu sesión</p>
          </>
        ) : error ? (
          <>
            <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-red-500"
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
            <h2 className="text-lg font-semibold text-red-800 mb-1">
              Error en la autenticación
            </h2>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <p className="text-xs text-slate-400">
              Serás redirigido al login en 3 segundos...
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default OAuthCallback;
