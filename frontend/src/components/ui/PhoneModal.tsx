import { useState } from "react";
import { Phone, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/auth.service";

export function PhoneModal() {
  const { needsPhone, dismissPhoneModal, updateUser } = useAuth();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setError("");
    setLoading(true);
    try {
      const updated = await authService.updateProfile({ phone });
      updateUser(updated);
      dismissPhoneModal();
    } catch {
      setError("Error al guardar el teléfono. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!needsPhone) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-7 w-full max-w-sm">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                ¡Casi listo!
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Necesitamos tu número para inscribirte
              </p>
            </div>
          </div>
          <button
            onClick={dismissPhoneModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="tel"
              placeholder="+54 11 1234 5678"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError("");
              }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
              required
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={dismissPhoneModal}
              disabled={loading}
              className="flex-1 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Omitir
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PhoneModal;
