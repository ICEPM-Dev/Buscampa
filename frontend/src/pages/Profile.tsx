/**
 * Página de perfil de usuario — estilo consistente.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Trash2, ChevronLeft, Building2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/auth.service";
import type { UpdateProfileDto } from "../types";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import DeleteAccount from "./DeleteAccount";

type TabType = "info" | "church" | "security" | "danger";

const TABS: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "info", label: "Información", icon: User },
  { id: "church", label: "Iglesia", icon: Building2 },
  { id: "security", label: "Seguridad", icon: Lock },
  { id: "danger", label: "Zona de peligro", icon: Trash2 },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user)
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
  }, [user]);

  const validateProfile = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 3)
      e.name = "Mínimo 3 caracteres";
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    )
      e.email = "Email inválido";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validatePassword = () => {
    const e: Record<string, string> = {};
    if (!currentPassword) e.currentPassword = "Ingresá tu contraseña actual";
    if (newPassword && newPassword.length < 6)
      e.newPassword = "Mínimo 6 caracteres";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfile()) return;
    setLoading(true);
    try {
      const updated = await authService.updateProfile(
        formData as UpdateProfileDto,
      );
      updateUser(updated);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al actualizar";
      if (msg.includes("ya registrado")) setErrors({ email: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setLoading(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al cambiar";
      if (msg.includes("actual")) setErrors({ currentPassword: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .profile-page { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .profile-sidebar {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1rem;
          height: fit-content;
          position: sticky;
          top: 5.5rem;
        }
        .profile-nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.875rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          transition: background 0.15s, color 0.15s;
          text-align: left;
        }
        .profile-nav-btn.active { background: #eff6ff; color: #1d4ed8; }
        .profile-nav-btn:not(.active) { color: #475569; }
        .profile-nav-btn:not(.active):hover { background: #f8fafc; color: #1e293b; }
        .profile-nav-btn.danger:not(.active):hover { background: #fff5f5; color: #dc2626; }
      `}</style>

      <div className="profile-page min-h-screen bg-slate-50">
        {/* Page header */}
        <div className="bg-white border-b border-slate-200 py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4"
            >
              <ChevronLeft className="h-4 w-4" />
              Volver
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Gestioná tu cuenta y preferencias
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Sidebar */}
            <aside className="w-full lg:w-52 shrink-0">
              <div className="profile-sidebar">
                {/* Avatar */}
                <div className="flex items-center gap-3 px-2 py-2 mb-3 border-b border-slate-100 pb-4">
                  {user?.photoUrl ? (
                    <img
                      src={user.photoUrl}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-0.5">
                  {TABS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`profile-nav-btn ${activeTab === id ? "active" : ""} ${id === "danger" ? "danger" : ""}`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Content */}
            <main className="flex-1">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
                {activeTab === "info" && (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 mb-0.5">
                      Información Personal
                    </h2>
                    <p className="text-sm text-slate-500 mb-6">
                      Actualizá tus datos de contacto
                    </p>
                    <form onSubmit={handleSaveProfile} className="space-y-5">
                      <Input
                        label="Nombre completo"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        disabled={loading}
                        required
                        placeholder="Juan Pérez"
                      />
                      <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        disabled={loading}
                        required
                        placeholder="tu@email.com"
                      />
                      <Input
                        label="Teléfono"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        disabled={loading}
                        placeholder="+54 11 1234 5678"
                      />
                      <div className="flex gap-3 pt-1">
                        <Button
                          type="submit"
                          loading={loading}
                          className="flex-1"
                        >
                          Guardar cambios
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => window.history.back()}
                          disabled={loading}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </>
                )}

                {activeTab === "church" && (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 mb-0.5">
                      Iglesia
                    </h2>
                    <p className="text-sm text-slate-500 mb-6">
                      Gestioná tu cuenta de iglesia
                    </p>
                    {user?.type === "IGLESIA" ? (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-green-900 text-sm">
                              Cuenta verificada como iglesia
                            </p>
                            <p className="text-xs text-green-700 mt-0.5">
                              Podés crear y gestionar campamentos
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                          <div className="flex items-start gap-3">
                            <Building2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-blue-900 text-sm mb-1">
                                Convertí tu cuenta en iglesia
                              </p>
                              <p className="text-xs text-blue-700">
                                Podrás crear campamentos, gestionar
                                inscripciones y más.
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => navigate("/profile/verify-church")}
                          className="w-full"
                        >
                          <Building2 className="h-4 w-4 mr-2" />
                          Verificar como iglesia
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {activeTab === "security" && (
                  <>
                    <h2 className="text-xl font-bold text-slate-900 mb-0.5">
                      Seguridad
                    </h2>
                    <p className="text-sm text-slate-500 mb-6">
                      Cambiá tu contraseña
                    </p>
                    <form onSubmit={handleChangePassword} className="space-y-5">
                      <Input
                        label="Contraseña actual"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        error={errors.currentPassword}
                        disabled={loading}
                        placeholder="Tu contraseña actual"
                      />
                      <div>
                        <Input
                          label="Nueva contraseña (opcional)"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          error={errors.newPassword}
                          disabled={loading}
                          placeholder="Dejá vacío si no querés cambiarla"
                        />
                        <p className="text-xs text-slate-400 mt-1">
                          Mínimo 6 caracteres
                        </p>
                      </div>
                      <div className="flex gap-3 pt-1">
                        <Button
                          type="submit"
                          loading={loading}
                          className="flex-1"
                        >
                          Actualizar contraseña
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setCurrentPassword("");
                            setNewPassword("");
                            setErrors({});
                            window.history.back();
                          }}
                          disabled={loading}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </>
                )}

                {activeTab === "danger" && <DeleteAccount />}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
