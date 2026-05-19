// ─────────────────────────────────────────────
// MisInscripciones.tsx
// ─────────────────────────────────────────────
import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { inscriptionService } from "../services/inscription.service";
import type { Registration } from "../types";
import {
  Calendar,
  MapPin,
  DollarSign,
  Church,
  ArrowRight,
  AlertTriangle,
  Tent,
} from "lucide-react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function MisInscripciones() {
  const {
    data: inscripciones,
    isLoading,
    execute,
    setData,
  } = useApi<Registration[]>();
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState<number | null>(null);

  useEffect(() => {
    execute(() => inscriptionService.getMyInscriptions());
  }, [execute]);

  const handleCancel = async (id: number) => {
    setCancellingId(id);
    try {
      await inscriptionService.cancel(id);
      setShowConfirm(null);
      setData(await inscriptionService.getMyInscriptions());
    } catch (e) {
      console.error(e);
    } finally {
      setCancellingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Cargando inscripciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-1">
            <Tent className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
              Mi cuenta
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Mis Inscripciones
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Revisá tus inscripciones a campamentos
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!inscripciones || inscripciones.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
              <Tent className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              Aún no tenés inscripciones
            </h3>
            <p className="text-sm text-slate-500 mb-5">
              Explorá los campamentos disponibles y registrate
            </p>
            <Link
              to="/campamentos"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Ver Campamentos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Tenés {inscripciones.length}{" "}
              {inscripciones.length === 1 ? "inscripción" : "inscripciones"}
            </p>

            {inscripciones.map((ins) => (
              <div
                key={ins.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg leading-tight">
                        {ins.campamento.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {ins.campamento.church.name}
                      </p>
                    </div>
                    <span className="ml-3 shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
                      Inscripto
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2.5">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
                      {format(parseISO(ins.campamento.startDate), "dd MMM", {
                        locale: es,
                      })}{" "}
                      —{" "}
                      {format(parseISO(ins.campamento.endDate), "dd MMM yyyy", {
                        locale: es,
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                      <span className="truncate">
                        {ins.campamento.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <DollarSign className="h-4 w-4 text-blue-500 shrink-0" />
                      <span className="font-semibold text-slate-800">
                        ${ins.campamento.price.toLocaleString("es-AR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Church className="h-4 w-4 text-blue-500 shrink-0" />
                      <span className="truncate">
                        {ins.campamento.church.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 px-5 sm:px-6 py-3 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    Inscripto el{" "}
                    {format(new Date(ins.createdAt), "dd 'de' MMMM, yyyy", {
                      locale: es,
                    })}
                  </p>
                  <button
                    onClick={() => setShowConfirm(ins.id)}
                    className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                  >
                    Cancelar inscripción
                  </button>
                </div>

                {showConfirm === ins.id && (
                  <div className="bg-red-50 px-5 sm:px-6 py-4 border-t border-red-100">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-red-900 text-sm mb-1">
                          ¿Cancelar esta inscripción?
                        </p>
                        <p className="text-xs text-red-700 mb-3">
                          Perderás tu lugar en el campamento.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCancel(ins.id)}
                            disabled={cancellingId === ins.id}
                            className="px-3.5 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {cancellingId === ins.id
                              ? "Cancelando..."
                              : "Sí, cancelar"}
                          </button>
                          <button
                            onClick={() => setShowConfirm(null)}
                            className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
                          >
                            No, mantener
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MisInscripciones;
