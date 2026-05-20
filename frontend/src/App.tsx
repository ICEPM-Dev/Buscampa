/**
 * Componente principal de la aplicación.
 */
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
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
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { Analytics } from "@vercel/analytics/react";
import PhoneModal from "./components/ui/PhoneModal";

function ShareCampamentoRedirect() {
  const { id } = useParams();
  return <Navigate to={`/campamentos/${id}`} replace />;
}

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PhoneModal />
      {!isAuthPage && <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/campamentos" element={<Campamentos />} />
          <Route path="/campamentos/:id" element={<CampamentoDetail />} />
          <Route path="/share/campamento/:id" element={<ShareCampamentoRedirect />} />
          <Route path="/c/:id" element={<ShareCampamentoRedirect />} />
          <Route path="/auth/google/callback" element={<OAuthCallback />} />
          <Route
            path="/auth/facebook/callback"
            element={<OAuthCallback />}
          />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/campamentos/:id/inscribirse"
              element={<InscripcionForm />}
            />
            <Route path="/inscripciones" element={<MisInscripciones />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/profile/verify-church"
              element={<VerifyChurch />}
            />
            <Route path="/profile/delete" element={<DeleteAccount />} />
          </Route>

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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
