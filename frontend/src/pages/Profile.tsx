import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Trash2, ChevronRight, Building2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/auth.service";
import type { UpdateProfileDto } from "../types";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import DeleteAccount from "./DeleteAccount";

type TabType = "info" | "church" | "security" | "danger";

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("info");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const tabs = [
    {
      id: "info" as TabType,
      label: "Información",
      icon: User,
    },
    {
      id: "church" as TabType,
      label: "Iglesia",
      icon: Building2,
    },
    {
      id: "security" as TabType,
      label: "Seguridad",
      icon: Lock,
    },
    {
      id: "danger" as TabType,
      label: "Zona de peligro",
      icon: Trash2,
    },
  ];

  const validateProfile = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validatePassword = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!currentPassword) {
      newErrors.currentPassword = "Debes ingresar tu contraseña actual";
      isValid = false;
    }

    if (newPassword && newPassword.length < 6) {
      newErrors.newPassword = "La nueva contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfile()) return;

    setLoading(true);

    try {
      const updateData: UpdateProfileDto = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      const updatedUser = await authService.updateProfile(updateData);
      updateUser(updatedUser);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al actualizar perfil";

      if (errorMessage.includes("ya registrado")) {
        setErrors({ email: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) return;

    setLoading(true);

    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al cambiar contraseña";

      if (errorMessage.includes("actual")) {
        setErrors({ currentPassword: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 sm:mb-6 transition-colors"
        >
          <ChevronRight className="h-5 w-5 rotate-180" />
          Volver
        </button>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <nav className="flex lg:block space-y-1 overflow-x-auto lg:overflow-visible">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <tab.icon className="h-5 w-5 shrink-0" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <main className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-8">
              {activeTab === "info" && (
                <>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                    Información Personal
                  </h2>
                  <p className="text-slate-600 mb-6 text-sm sm:text-base">
                    Actualiza tu información de contacto y perfil
                  </p>

                  <form onSubmit={handleSaveProfile} className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nombre completo
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        disabled={loading}
                        required
                        placeholder="Juan Pérez"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        disabled={loading}
                        required
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Teléfono (opcional)
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        disabled={loading}
                        placeholder="+54 11 1234 5678"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
                        onClick={() =>
                          setFormData({
                            name: user?.name || "",
                            email: user?.email || "",
                            phone: user?.phone || "",
                          })
                        }
                        disabled={loading}
                        className="flex-1 sm:flex-none"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </>
              )}

              {activeTab === "church" && (
                <>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                    Iglesia
                  </h2>
                  <p className="text-slate-600 mb-6 text-sm sm:text-base">
                    Gestiona tu cuenta de iglesia
                  </p>

                  {user?.type === "IGLESIA" ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Building2 className="h-8 w-8 text-green-600" />
                        <div>
                          <h3 className="font-semibold text-green-900">
                            Cuenta de iglesia verificada
                          </h3>
                          <p className="text-sm text-green-700">
                            Tu cuenta está verificada como iglesia
                          </p>
                        </div>
                      </div>
                      <p className="text-green-800">
                        Ahora puedes crear y gestionar campamentos.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-start gap-3">
                          <Building2 className="h-6 w-6 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-blue-900 mb-1">
                              Convierte tu cuenta en iglesia
                            </h3>
                            <p className="text-sm text-blue-700">
                              Al verificarte como iglesia podrás crear campamentos, gestionar inscripciones y más.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => navigate("/profile/verify-church")}
                        className="w-full"
                      >
                        <Building2 className="h-5 w-5 mr-2" />
                        Verificar como iglesia
                      </Button>
                    </div>
                  )}
                </>
              )}

              {activeTab === "security" && (
                <>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                    Seguridad
                  </h2>
                  <p className="text-slate-600 mb-6 text-sm sm:text-base">
                    Cambia tu contraseña para mantener tu cuenta segura
                  </p>

                  <form onSubmit={handleChangePassword} className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Contraseña actual
                      </label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        error={errors.currentPassword}
                        disabled={loading}
                        placeholder="Ingresa tu contraseña actual"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nueva contraseña (opcional)
                      </label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        error={errors.newPassword}
                        disabled={loading}
                        placeholder="Déjalo vacío si no quieres cambiarla"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Mínimo 6 caracteres
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
                        }}
                        disabled={loading}
                        className="flex-1 sm:flex-none"
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
  );
}