import { useState } from "react";
import { Trash2, AlertTriangle, ShieldCheck } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/auth.service";
import Button from "../components/ui/Button";

export function DeleteAccount() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.deleteAccount();
      logout();
      window.location.href = "/";
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al eliminar cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-0.5">
          Zona de peligro
        </h2>
        <p className="text-sm text-slate-500">
          Estas acciones son irreversibles
        </p>
      </div>

      {/* Warning */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 text-sm mb-1.5">
              Eliminación permanente de cuenta
            </p>
            <p className="text-xs text-red-700 mb-2">
              Esta acción es <strong>irreversible</strong>. Se eliminarán todos
              tus datos:
            </p>
            <ul className="text-xs text-red-700 space-y-0.5 ml-3 list-disc">
              <li>Tu perfil y datos personales</li>
              <li>Todos tus campamentos (si sos una iglesia)</li>
              <li>Todas tus inscripciones</li>
              <li>Historial de actividad</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirm */}
      <div className="border border-slate-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <ShieldCheck className="h-5 w-5 text-slate-400" />
          <div>
            <p className="font-semibold text-slate-900 text-sm">Confirmación</p>
            <p className="text-xs text-slate-500">
              ¿Estás seguro de que querés eliminar tu cuenta?
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5 bg-slate-50 rounded-xl p-3.5">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center shrink-0">
            <Trash2 className="h-4 w-4 text-slate-500" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-sm">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              <Trash2 className="h-4 w-4" />
              {loading ? "Eliminando..." : "Eliminar cuenta"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteAccount;
