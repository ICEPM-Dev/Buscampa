/**
 * Componente de header/barra de navegación.
 * Muestra logo, enlaces de navegación y menú de usuario.
 * Adaptable para móvil con menú hamburguesa.
 */
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import UserMenu from "./UserMenu";
import logo from "../../assets/logo.svg";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, isChurch } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/auth");
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Buscampa" className="h-8 w-8" />
            <span className="text-xl font-bold text-slate-900">Buscampa</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition-colors font-medium ${
                isActive("/")
                  ? "text-blue-600 font-semibold"
                  : "text-slate-700 hover:text-blue-600"
              }`}
            >
              Inicio
            </Link>

            <Link
              to="/campamentos"
              className={`transition-colors font-medium ${
                isActive("/campamentos") ||
                isActive("/c/") ||
                location.pathname.startsWith("/campamentos/")
                  ? "text-blue-600 font-semibold"
                  : "text-slate-700 hover:text-blue-600"
              }`}
            >
              Campamentos
            </Link>

            {isAuthenticated && isChurch && (
              <Link
                to="/dashboard"
                className={`transition-colors font-medium ${
                  location.pathname.startsWith("/dashboard")
                    ? "text-blue-600 font-semibold"
                    : "text-slate-700 hover:text-blue-600"
                }`}
              >
                <span className="flex items-center gap-1">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </span>
              </Link>
            )}

            {isAuthenticated && (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-300">
                <UserMenu />
                <button
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-red-600 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}

            {!isAuthenticated && (
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-slate-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-slate-200">
            <Link
              to="/"
              className={`block px-4 py-2 rounded-lg ${
                isActive("/")
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>

            <Link
              to="/campamentos"
              className={`block px-4 py-2 rounded-lg ${
                isActive("/campamentos") ||
                isActive("/c/") ||
                location.pathname.startsWith("/campamentos/")
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Campamentos
            </Link>

            {isAuthenticated && isChurch && (
              <Link
                to="/dashboard"
                className={`block px-4 py-2 rounded-lg ${
                  location.pathname.startsWith("/dashboard")
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {isAuthenticated && (
              <div className="px-4 py-2 border-t border-slate-200">
                <UserMenu />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </button>
              </div>
            )}

            {!isAuthenticated && (
              <Link
                to="/auth"
                className="block px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
