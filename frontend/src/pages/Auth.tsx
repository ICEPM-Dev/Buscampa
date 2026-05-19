/**
 * Página de autenticación — estilo consistente con la app.
 */
import SocialButton from "../components/auth/SocialButtons";
import { Link } from "react-router-dom";

export default function Auth() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .auth-page { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

        .auth-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04);
          padding: 2.5rem;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin: 0.25rem 0;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #f1f5f9;
        }
        .auth-divider span {
          font-size: 0.75rem;
          color: #94a3b8;
          letter-spacing: 0.05em;
        }
      `}</style>

      <div className="auth-page w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            ¡Bienvenido!
          </h1>
          <p className="text-sm text-slate-500">
            Conectate con tu red social para continuar
          </p>
        </div>

        {/* Card */}
        <div className="auth-card space-y-3">
          <SocialButton provider="google" />
          <div className="auth-divider">
            <span>o</span>
          </div>
          <SocialButton provider="facebook" />
        </div>

        <p className="text-center mt-5 text-xs text-slate-400 leading-relaxed">
          Al continuar, aceptás nuestros{" "}
          <Link
            to="/terms-conditions"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Términos y Condiciones
          </Link>{" "}
          y{" "}
          <Link
            to="/privacy-policy"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Política de Privacidad
          </Link>
        </p>
      </div>
    </div>
  );
}
