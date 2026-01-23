import { useState } from "react";
import { Trash2, AlertTriangle, ShieldCheck } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/auth.service";
import Button from "../components/ui/Button";
import { showToast } from "../components/ui/Toast";

export default function DeleteAccount() {
  const { user, logout } = useAuth();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Debes ingresar tu contraseña");
      return;
    }

    setLoading(true);

    try {
      await authService.deleteAccount(password);
      showToast.success("Cuenta eliminada correctamente");
      logout();
      window.location.href = "/";
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al eliminar cuenta";
      setError(errorMessage);

      if (errorMessage.includes("actual")) {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-red-900 mb-2">
              Eliminación de cuenta
            </h3>
            <p className="text-sm text-red-700">
              Esta acción es <span className="font-semibold">irreversible</span>
              . Todos tus datos serán eliminados permanentemente, incluyendo:
            </p>
            <ul className="mt-3 ml-6 list-disc text-sm text-red-700 space-y-1">
              <li>Tu perfil y datos personales</li>
              <li>Todos tus campamentos (si eres una iglesia)</li>
              <li>Todas tus inscripciones</li>
              <li>Historial de actividad</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="h-6 w-6 text-slate-400" />
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Confirmación</h3>
            <p className="text-sm text-slate-600">
              Para eliminar tu cuenta, debes confirmar tu identidad ingresando
              tu contraseña
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
            <Trash2 className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {user?.name}
            </h2>
            <p className="text-sm text-slate-600">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
              placeholder="Ingresa tu contraseña para confirmar"
              disabled={loading}
              required
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPassword("")}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-5 w-5" />
              {loading ? "Eliminando..." : "Eliminar cuenta"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
