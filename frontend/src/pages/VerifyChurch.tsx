import { Mail, Clock } from "lucide-react";

export function VerifyChurch() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Verificación de iglesia
          </h1>
          <p className="text-sm text-slate-500">
            Convertí tu cuenta en una cuenta de iglesia
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-0.5">
                  Temporariamente deshabilitado
                </p>
                <p className="text-xs text-amber-700">
                  La verificación está suspendida. Estamos trabajando para
                  habilitarlo pronto.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center py-2">
            <p className="text-sm text-slate-600 mb-4">
              Para verificar tu iglesia y publicar campamentos, contactanos:
            </p>
            <a
              href="mailto:contacto@buscampa.com.ar"
              className="inline-flex items-center justify-center gap-2 py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              <Mail className="h-4 w-4" />
              contacto@buscampa.com.ar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyChurch;
