/**
 * Página de verificación de iglesia.
 * Permite a un usuario solicitar verificación como iglesia.
 * Hardcoded: approval automático (para desarrollo).
 */
import { useState } from "react";
import { Church, CheckCircle, Loader2 } from "lucide-react";
import { api } from "../services/api";


export default function VerifyChurch() {
  const [loading, setLoading] = useState(false);
  const [denomination, setDenomination] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!denomination) {
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/verify-church", { denomination });
      window.location.href = "/";
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Church className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Verifica tu iglesia
          </h1>
          <p className="text-slate-600">
            Convierte tu cuenta en una cuenta de iglesia
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Cuenta verificada</p>
                <p>Una vez verificada, podrás crear campamentos y gestionar inscripciones.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Denominación religiosa
              </label>
              <input
                type="text"
                value={denomination}
                onChange={(e) => setDenomination(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Ej: Iglesia Cristiana, Iglesia Bautista, etc."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Verificar iglesia
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}