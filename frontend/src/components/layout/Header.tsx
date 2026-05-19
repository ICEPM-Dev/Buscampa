/**
 * Header sticky en todas las páginas.
 * En Home (pathname "/") arranca transparente con texto blanco y transiciona
 * a glass blanco al hacer scroll. En el resto siempre es blanco sólido.
 */
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import UserMenu from "./UserMenu";
import logo from "../../assets/logo.svg";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout, isChurch } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    // Reiniciar estado de scroll al cambiar de ruta
    setScrolled(window.scrollY > 40);
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth");
    setIsMenuOpen(false);
  };

  // Transparente solo en Home antes de scrollear
  const isTransparent = isHome && !scrolled;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .bc-header {
          position: sticky;
          top: 0;
          z-index: 50;
          font-family: 'Plus Jakarta Sans', sans-serif;
          width: 100%;
          transition: background 0.35s ease, box-shadow 0.35s ease, backdrop-filter 0.35s ease;
        }

        /* Blanco sólido — todas las páginas excepto Home sin scroll */
        .bc-header.solid {
          background: rgba(255,255,255,0.97);
          box-shadow: 0 1px 0 #e2e8f0;
        }

        /* Glass — Home con scroll */
        .bc-header.glass {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: rgba(255,255,255,0.93);
          box-shadow: 0 1px 0 rgba(0,0,0,0.06), 0 4px 24px rgba(37,99,235,0.07);
        }

        /* Transparente — Home sin scroll */
        .bc-header.transparent {
          background: transparent;
          box-shadow: none;
        }

        .bc-nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          position: relative;
        }

        /* ── Logo ── */
        .bc-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          flex-shrink: 0;
        }
        .bc-logo-img { height: 32px; width: 32px; }
        .bc-logo-text {
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          transition: color 0.3s;
          white-space: nowrap;
        }
        @media (max-width: 640px) {
          .bc-logo-text {
            font-size: 1rem;
          }
        }
        .bc-header.transparent .bc-logo-text { color: #ffffff; }
        .bc-header:not(.transparent) .bc-logo-text { color: #0f172a; }
        .bc-header.transparent .bc-logo-text .accent { color: #93c5fd; }
        .bc-header:not(.transparent) .bc-logo-text .accent { color: #2563eb; }

        /* ── Desktop links ── */
        .bc-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        @media (max-width: 767px) { .bc-links { display: none; } }

        .bc-link {
          position: relative;
          padding: 0.4rem 0.85rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.15s, background 0.15s;
        }

        /* Links opacos */
        .bc-header:not(.transparent) .bc-link { color: #475569; }
        .bc-header:not(.transparent) .bc-link:hover { color: #1d4ed8; background: #eff6ff; }
        .bc-header:not(.transparent) .bc-link.active { color: #2563eb; background: #eff6ff; font-weight: 600; }

        /* Links transparentes (Home top) */
        .bc-header.transparent .bc-link { color: rgba(255,255,255,0.8); }
        .bc-header.transparent .bc-link:hover { color: #fff; background: rgba(255,255,255,0.1); }
        .bc-header.transparent .bc-link.active { color: #fff; background: rgba(255,255,255,0.15); font-weight: 600; }

        .bc-link.active::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 2px;
          background: currentColor;
          border-radius: 9999px;
        }

        .bc-link-icon { display: flex; align-items: center; gap: 0.35rem; }

        /* Divider */
        .bc-divider { width: 1px; height: 20px; margin: 0 0.5rem; transition: background 0.3s; }
        .bc-header:not(.transparent) .bc-divider { background: #e2e8f0; }
        .bc-header.transparent .bc-divider { background: rgba(255,255,255,0.2); }

        /* Auth button */
        .bc-auth-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 1.1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
        }
        .bc-header:not(.transparent) .bc-auth-btn {
          background: #2563eb; color: white;
          box-shadow: 0 1px 2px rgba(37,99,235,0.3);
        }
        .bc-header:not(.transparent) .bc-auth-btn:hover {
          background: #1d4ed8; transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37,99,235,0.35);
        }
        .bc-header.transparent .bc-auth-btn {
          background: rgba(255,255,255,0.12); color: white;
          border: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(8px);
        }
        .bc-header.transparent .bc-auth-btn:hover {
          background: rgba(255,255,255,0.22); transform: translateY(-1px);
        }

        /* Logout */
        .bc-logout {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 8px;
          background: none; border: none; cursor: pointer;
          transition: color 0.15s, background 0.15s;
        }
        .bc-header:not(.transparent) .bc-logout { color: #94a3b8; }
        .bc-header:not(.transparent) .bc-logout:hover { color: #ef4444; background: #fff1f2; }
        .bc-header.transparent .bc-logout { color: rgba(255,255,255,0.55); }
        .bc-header.transparent .bc-logout:hover { color: #fca5a5; background: rgba(239,68,68,0.15); }

        /* Hamburger */
        .bc-hamburger {
          display: none; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 8px;
          background: none; cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
        }
        .bc-header:not(.transparent) .bc-hamburger { border: 1px solid #e2e8f0; color: #475569; }
        .bc-header:not(.transparent) .bc-hamburger:hover { background: #f8fafc; border-color: #cbd5e1; }
        .bc-header.transparent .bc-hamburger { border: 1px solid rgba(255,255,255,0.3); color: white; }
        .bc-header.transparent .bc-hamburger:hover { background: rgba(255,255,255,0.12); }
        @media (max-width: 767px) { .bc-hamburger { display: flex; } }

        /* Mobile menu — siempre blanco */
        .bc-mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          display: none;
          background: white;
          border-top: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
          padding: 0.75rem 1rem 1rem;
          animation: slideDown 0.2s ease;
          z-index: 40;
          max-height: 70vh;
          overflow-y: auto;
        }
        @media (max-width: 767px) { .bc-mobile-menu { display: block; } }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .bc-mobile-link {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.65rem 0.875rem; border-radius: 8px;
          font-size: 0.9rem; font-weight: 500; color: #475569;
          text-decoration: none; transition: background 0.15s, color 0.15s;
        }
        .bc-mobile-link:hover { background: #f8fafc; color: #1d4ed8; }
        .bc-mobile-link.active { background: #eff6ff; color: #2563eb; font-weight: 600; }

        .bc-mobile-sep { height: 1px; background: #f1f5f9; margin: 0.5rem 0; }

        .bc-mobile-logout {
          display: flex; align-items: center; gap: 0.5rem; width: 100%;
          padding: 0.65rem 0.875rem; border-radius: 8px;
          font-size: 0.9rem; font-weight: 500; color: #ef4444;
          background: none; border: none; cursor: pointer;
          transition: background 0.15s; text-align: left;
        }
        .bc-mobile-logout:hover { background: #fff1f2; }

        .bc-mobile-auth {
          display: block; padding: 0.7rem 0.875rem;
          background: #2563eb; color: white; border-radius: 8px;
          font-size: 0.9rem; font-weight: 600; text-decoration: none;
          text-align: center; transition: background 0.15s;
        }
        .bc-mobile-auth:hover { background: #1d4ed8; }
      `}</style>

      <header
        className={`bc-header ${isTransparent && !isMenuOpen ? "transparent" : scrolled ? "glass" : "solid"}`}
      >
        <nav className="bc-nav">
          {/* Logo */}
          <Link to="/" className="bc-logo">
            <img src={logo} alt="Buscampa" className="bc-logo-img" />
            <span className="bc-logo-text">
              Bus<span className="accent">campa</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="bc-links">
            <Link to="/" className={`bc-link ${isActive("/") ? "active" : ""}`}>
              Inicio
            </Link>
            <Link
              to="/campamentos"
              className={`bc-link ${isActive("/campamentos") || location.pathname.startsWith("/campamentos/") ? "active" : ""}`}
            >
              Campamentos
            </Link>

            {isAuthenticated && isChurch && (
              <Link
                to="/dashboard"
                className={`bc-link ${location.pathname.startsWith("/dashboard") ? "active" : ""}`}
              >
                <span className="bc-link-icon">
                  <LayoutDashboard size={15} />
                  Dashboard
                </span>
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <div className="bc-divider" />
                <UserMenu isTransparent={isTransparent} />
                <button
                  onClick={handleLogout}
                  className="bc-logout"
                  title="Cerrar sesión"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <div className="bc-divider" />
                <Link to="/auth" className="bc-auth-btn">
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="bc-hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="bc-mobile-menu">
            <Link
              to="/"
              className={`bc-mobile-link ${isActive("/") ? "active" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/campamentos"
              className={`bc-mobile-link ${isActive("/campamentos") || location.pathname.startsWith("/campamentos/") ? "active" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Campamentos
            </Link>

            {isAuthenticated && isChurch && (
              <Link
                to="/dashboard"
                className={`bc-mobile-link ${location.pathname.startsWith("/dashboard") ? "active" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <div className="bc-mobile-sep" />
                <UserMenu />
                <button onClick={handleLogout} className="bc-mobile-logout">
                  <LogOut size={15} />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <div className="bc-mobile-sep" />
                <Link
                  to="/auth"
                  className="bc-mobile-auth"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
}
