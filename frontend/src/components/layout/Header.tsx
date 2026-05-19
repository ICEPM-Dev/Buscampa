/**
 * Header/navbar rediseñado — estética glass moderna con paleta azul/slate original
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

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth");
    setIsMenuOpen(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .bc-header {
          position: sticky;
          top: 0;
          z-index: 50;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.3s ease;
        }

        .bc-header.scrolled {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          background: rgba(255, 255, 255, 0.92);
          box-shadow: 0 1px 0 rgba(0,0,0,0.06), 0 4px 24px rgba(37, 99, 235, 0.07);
        }

        .bc-header.top {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 1px 0 #e2e8f0;
        }

        .bc-nav {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }

        /* Logo */
        .bc-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .bc-logo-img {
          height: 32px;
          width: 32px;
        }

        .bc-logo-text {
          font-size: 1.2rem;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.03em;
        }

        .bc-logo-text span {
          color: #2563eb;
        }

        /* Desktop nav links */
        .bc-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        @media (max-width: 767px) {
          .bc-links { display: none; }
        }

        .bc-link {
          position: relative;
          padding: 0.4rem 0.85rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #475569;
          text-decoration: none;
          transition: color 0.15s, background 0.15s;
        }

        .bc-link:hover {
          color: #1d4ed8;
          background: #eff6ff;
        }

        .bc-link.active {
          color: #2563eb;
          background: #eff6ff;
          font-weight: 600;
        }

        .bc-link.active::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 2px;
          background: #2563eb;
          border-radius: 9999px;
        }

        .bc-link-icon {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        /* Divider */
        .bc-divider {
          width: 1px;
          height: 20px;
          background: #e2e8f0;
          margin: 0 0.5rem;
        }

        /* Auth button */
        .bc-auth-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #2563eb;
          color: white;
          padding: 0.45rem 1.1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 1px 2px rgba(37, 99, 235, 0.3), 0 0 0 0 rgba(37,99,235,0);
        }

        .bc-auth-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
        }

        /* Logout button */
        .bc-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          transition: color 0.15s, background 0.15s;
        }

        .bc-logout:hover {
          color: #ef4444;
          background: #fff1f2;
        }

        /* Hamburger */
        .bc-hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: none;
          border: 1px solid #e2e8f0;
          cursor: pointer;
          color: #475569;
          transition: background 0.15s, border-color 0.15s;
        }

        .bc-hamburger:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        @media (max-width: 767px) {
          .bc-hamburger { display: flex; }
        }

        /* Mobile menu */
        .bc-mobile-menu {
          display: none;
        }

        @media (max-width: 767px) {
          .bc-mobile-menu {
            display: block;
            background: white;
            border-top: 1px solid #f1f5f9;
            padding: 0.75rem 1rem 1rem;
            animation: slideDown 0.2s ease;
          }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .bc-mobile-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 0.875rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #475569;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }

        .bc-mobile-link:hover {
          background: #f8fafc;
          color: #1d4ed8;
        }

        .bc-mobile-link.active {
          background: #eff6ff;
          color: #2563eb;
          font-weight: 600;
        }

        .bc-mobile-sep {
          height: 1px;
          background: #f1f5f9;
          margin: 0.5rem 0;
        }

        .bc-mobile-logout {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.65rem 0.875rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #ef4444;
          background: none;
          border: none;
          cursor: pointer;
          transition: background 0.15s;
          text-align: left;
        }

        .bc-mobile-logout:hover {
          background: #fff1f2;
        }

        .bc-mobile-auth {
          display: block;
          padding: 0.7rem 0.875rem;
          background: #2563eb;
          color: white;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          text-decoration: none;
          text-align: center;
          transition: background 0.15s;
        }

        .bc-mobile-auth:hover {
          background: #1d4ed8;
        }
      `}</style>

      <header className={`bc-header ${scrolled ? "scrolled" : "top"}`}>
        <nav className="bc-nav">
          {/* Logo */}
          <Link to="/" className="bc-logo">
            <img src={logo} alt="Buscampa" className="bc-logo-img" />
            <span className="bc-logo-text">
              Bus<span>campa</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="bc-links">
            <Link to="/" className={`bc-link ${isActive("/") ? "active" : ""}`}>
              Inicio
            </Link>
            <Link
              to="/campamentos"
              className={`bc-link ${
                isActive("/campamentos") || location.pathname.startsWith("/campamentos/")
                  ? "active"
                  : ""
              }`}
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

            {isAuthenticated && (
              <>
                <div className="bc-divider" />
                <UserMenu />
                <button onClick={handleLogout} className="bc-logout" title="Cerrar sesión">
                  <LogOut size={16} />
                </button>
              </>
            )}

            {!isAuthenticated && (
              <>
                <div className="bc-divider" />
                <Link to="/auth" className="bc-auth-btn">
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button className="bc-hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
              className={`bc-mobile-link ${
                isActive("/campamentos") || location.pathname.startsWith("/campamentos/")
                  ? "active"
                  : ""
              }`}
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

            {isAuthenticated && (
              <>
                <div className="bc-mobile-sep" />
                <UserMenu />
                <button onClick={handleLogout} className="bc-mobile-logout">
                  <LogOut size={15} />
                  Cerrar Sesión
                </button>
              </>
            )}

            {!isAuthenticated && (
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