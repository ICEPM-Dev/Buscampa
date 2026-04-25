import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { authService } from "../../services/auth.service";

export default function PhoneModal() {
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
    } catch (err) {
      setError("Error al guardar el teléfono. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!needsPhone) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-xl font-bold text-slate-900 mb-2">¡Casi listo!</h2>
        <p className="text-slate-600 mb-6">
          Para inscribirte en campamentos necesitamos tu número de teléfono.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="tel"
            placeholder="+54 11 1234 5678"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError("");
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={dismissPhoneModal}
              disabled={loading}
              className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Omitir por ahora
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
