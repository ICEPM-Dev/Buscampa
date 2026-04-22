import { Church, Mail, Clock } from "lucide-react";

export default function VerifyChurch() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-slate-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Church className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Verificación de iglesia
          </h1>
          <p className="text-slate-600">
            Convierte tu cuenta en una cuenta de iglesia
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Temporariamente deshabilitado</p>
                <p>La verificación de iglesia está temporalmente suspendida. Estamos trabajando para habilitarlo pronto.</p>
              </div>
            </div>
          </div>

          <div className="text-center py-4">
            <p className="text-slate-600 mb-4">
              Si deseas verificar tu iglesia y publicar campamentos, contactanos:
            </p>
            <a
              href="mailto:contacto@buscampa.com.ar"
              className="inline-flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Mail className="h-5 w-5" />
              Contactar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}