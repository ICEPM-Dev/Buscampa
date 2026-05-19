/**
 * Página de autenticación — panel izquierdo con imagen real.
 */
import SocialButton from "../components/auth/SocialButtons";
import bannerBg from "../assets/banner6.jpg";
import logo from "../assets/logo.svg";
import { Link, useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,600&display=swap');

        .auth-root { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

        .auth-bg {
          position: relative;
          overflow: hidden;
          background-color: #0f172a;
        }

        .auth-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .auth-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(15, 23, 42, 0.88) 0%,
            rgba(15, 23, 42, 0.60) 50%,
            rgba(37, 99, 235, 0.35) 100%
          );
        }

        .auth-bg-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
        }
        .orb-1 { width: 280px; height: 280px; background: rgba(59,130,246,0.18); top: -5%; left: -5%; }
        .orb-2 { width: 180px; height: 180px; background: rgba(14,165,233,0.14); bottom: 15%; right: 10%; }

        .auth-bg-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          padding: 3rem;
        }

        .stat-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 100px;
          padding: 0.4rem 0.9rem;
          font-size: 0.78rem;
          color: rgba(255,255,255,0.8);
          backdrop-filter: blur(10px);
        }

        .stat-card {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 16px;
          padding: 0.875rem 1rem;
          backdrop-filter: blur(12px);
          min-width: 90px;
        }

        .auth-card {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04);
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
          font-size: 0.7rem;
          color: #94a3b8;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }



        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 10px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          color: #334155;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .back-button:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateX(-2px);
        }
      `}</style>

      {/* Panel izquierdo — imagen + branding */}
      <div className="auth-root auth-bg hidden lg:flex lg:w-1/2 flex-col">
        <img src={bannerBg} alt="" className="auth-bg-img" />
        <div className="auth-bg-overlay" />
        <div className="auth-bg-dots" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        <div className="auth-bg-content">
          <div className="flex items-center gap-3"></div>

          {/* Copy */}
          <div>
            <div className="flex items-center justify-center">
              <img src={logo} alt="" className="h-30 w-30" />
            </div>
            <h2 className="text-center text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
              Aventura con
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-sky-300">
                propósito
              </span>
            </h2>
          </div>

          <p className="text-white/25 text-xs"></p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="auth-root w-full lg:w-1/2 flex items-center justify-center py-12 px-6 sm:px-12 bg-slate-50 relative">
        <button 
          onClick={() => navigate("/")}
          className="back-button absolute top-6 left-6"
          aria-label="Volver a inicio"
        >
          ← Home
        </button>
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-1.5">
              Iniciar sesión en Buscampa
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Conecta tu cuenta con:
            </p>
          </div>

          <div className="auth-card space-y-3">
            <SocialButton provider="google" />
            <div className="auth-divider">
              <span>o</span>
            </div>
            <SocialButton provider="facebook" />
          </div>

          <p className="text-center mt-6 text-xs text-slate-400 leading-relaxed">
            Al continuar, aceptás nuestros{" "}
            <Link
              to="/terms-conditions"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Términos y Condiciones
            </Link>{" "}
            y la{" "}
            <Link
              to="/privacy-policy"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Política de Privacidad
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
