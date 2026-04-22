import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { inscriptionService } from "../services/inscription.service";
import type { Registration } from "../types";
import { Calendar, MapPin, DollarSign, Church, ArrowRight, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export default function MisInscripciones() {
  const { data: inscripciones, isLoading, execute, setData } = useApi<Registration[]>();
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
      const updated = await inscriptionService.getMyInscriptions();
      setData(updated);
    } catch (error) {
      console.error("Error al cancelar:", error);
    } finally {
      setCancellingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Cargando inscripciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Mis Inscripciones
          </h1>
          <p className="text-slate-600">
            Revisa tus inscripciones a eventos
          </p>
        </div>

        {!inscripciones || inscripciones.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
              <Calendar className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Aún no tienes inscripciones
            </h3>
            <p className="text-slate-600 mb-6">
              Explora los campamentos disponibles y regístrate
            </p>
            <Link
              to="/campamentos"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ver Campamentos
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Tienes {inscripciones.length}{" "}
              {inscripciones.length === 1 ? "inscripción" : "inscripciones"}
            </p>

            {inscripciones.map((inscripcion) => (
              <div
                key={inscripcion.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-1">
                        {inscripcion.campamento.name}
                      </h3>
                      <p className="text-slate-600">
                        {inscripcion.campamento.church.name}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Inscripto
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4 text-blue-600 shrink-0" />
                        <span>
                          {format(
                            parseISO(inscripcion.campamento.startDate),
                            "dd MMM",
                            { locale: es }
                          )}{" "}
                          -{" "}
                          {format(
                            parseISO(inscripcion.campamento.endDate),
                            "dd MMM yyyy",
                            { locale: es }
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                        <span className="truncate">
                          {inscripcion.campamento.location}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <DollarSign className="h-4 w-4 text-blue-600 shrink-0" />
                        <span className="font-semibold text-slate-900">
                          $
                          {inscripcion.campamento.price.toLocaleString("es-AR")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Church className="h-4 w-4 text-blue-600 shrink-0" />
                        <span className="truncate">
                          {inscripcion.campamento.church.denomination}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-sm text-slate-600">
                    Inscripto el{" "}
                    {format(
                      new Date(inscripcion.createdAt),
                      "dd 'de' MMMM, yyyy",
                      { locale: es }
                    )}
                  </p>
                  
                  <button
                    onClick={() => setShowConfirm(inscripcion.id)}
                    className="text-sm text-red-600 hover:text-red-700 cursor-pointer font-medium transition-colors"
                  >
                    Cancelar inscripción
                  </button>
                </div>

                {showConfirm === inscripcion.id && (
                  <div className="bg-red-50 px-6 py-4 border-t border-red-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-red-900 mb-2">
                          ¿Estás seguro que quieres cancelar esta inscripción?
                        </p>
                        <p className="text-sm text-red-700 mb-3">
                          Perderás tu lugar en el campamento y tendrás que inscribirte de nuevo si deseas participar.
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleCancel(inscripcion.id)}
                            disabled={cancellingId === inscripcion.id}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            {cancellingId === inscripcion.id
                              ? "Cancelando..."
                              : "Sí, cancelar"}
                          </button>
                          <button
                            onClick={() => setShowConfirm(null)}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
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