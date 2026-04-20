/**
 * Componente principal de la aplicación.
 * Configura el enrutamiento, proveedores de contexto y estructura general.
 * Incluye rutas públicas y protegidas con diferentes niveles de acceso.
 */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Campamentos from "./pages/Campamentos";
import CampamentoDetail from "./pages/CampamentoDetail";
import Dashboard from "./pages/Dashboard";
import MisInscripciones from "./pages/MisInscripciones";
import InscripcionForm from "./components/campamentos/InscripcionForm";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import CampamentoForm from "./components/dashboard/CampamentoForm";
import Profile from "./pages/Profile";
import DeleteAccount from "./pages/DeleteAccount";
import VerifyChurch from "./pages/VerifyChurch";
import OAuthCallback from "./pages/OAuthCallback";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <BrowserRouter>
      <Analytics /> {/* Proveedor de enrutamiento */}
      <AuthProvider>
        {" "}
        {/* Proveedor de contexto de autenticación */}
        <div className="min-h-screen bg-slate-50">
          <Header /> {/* Barra de navegación */}
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />

            <Route path="/campamentos" element={<Campamentos />} />
            <Route path="/campamentos/:id" element={<CampamentoDetail />} />
            <Route path="/auth/google/callback" element={<OAuthCallback />} />

            {/* Rutas protegidas (requieren autenticación) */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/campamentos/:id/inscribirse"
                element={<InscripcionForm />}
              />
              <Route path="/inscripciones" element={<MisInscripciones />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/verify-church" element={<VerifyChurch />} />
              <Route path="/profile/delete" element={<DeleteAccount />} />
            </Route>

            {/* Rutas protegidas para iglesias (requieren tipo IGLESIA) */}
            <Route element={<ProtectedRoute requiredType="IGLESIA" />}>
              <Route
                path="/dashboard/campamentos/nuevo"
                element={<CampamentoForm />}
              />
              <Route
                path="/dashboard/campamentos/:id/editar"
                element={<CampamentoForm />}
              />
              <Route path="/dashboard/*" element={<Dashboard />} />
            </Route>

            {/* Ruta catch-all que redirige al home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
