import { useState, useEffect } from "react";
import { Users, Mail, Phone, Calendar, Filter, Loader2 } from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { campamentoService } from "../../services/campamento.service";
import type { Campamento, Registration } from "../../types";
import { format, parseISO, isAfter, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";

export default function InscripcionesList() {
  const {
    data: campamentos,
    isLoading: loadingCampamentos,
    execute: loadCampamentos,
  } = useApi<Campamento[]>();
  const [selectedCampamento, setSelectedCampamento] = useState<number | null>(
    null
  );
  const [inscripciones, setInscripciones] = useState<Registration[]>([]);
  const [loadingInscripciones, setLoadingInscripciones] = useState(false);

  useEffect(() => {
    loadCampamentos(() => campamentoService.getAll());
  }, [loadCampamentos]);

  useEffect(() => {
    if (selectedCampamento) {
      loadInscripciones(selectedCampamento);
    }
  }, [selectedCampamento]);

  const loadInscripciones = async (campamentoId: number) => {
    setLoadingInscripciones(true);
    try {
      const token = localStorage.getItem("token");
      const data = await fetch(
        `http://localhost:3000/campamentos/${campamentoId}/inscripciones`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json());
      setInscripciones(data);
    } catch (error) {
      console.error("Error loading inscripciones:", error);
    } finally {
      setLoadingInscripciones(false);
    }
  };

  const calculateCampamentoStats = (campamento: Campamento) => {
    const now = new Date();
    const startDate = parseISO(campamento.startDate);
    const endDate = parseISO(campamento.endDate);

    if (isAfter(startDate, now))
      return { status: "upcoming", label: "Próximo", color: "green" };
    if (isWithinInterval(now, { start: startDate, end: endDate })) {
      return { status: "ongoing", label: "En curso", color: "amber" };
    }
    return { status: "past", label: "Finalizado", color: "slate" };
  };

  if (loadingCampamentos) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Cargando campamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Inscripciones
          </h2>
          <p className="text-slate-600">
            Revisa las inscripciones a tus campamentos
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <Filter className="h-5 w-5 text-slate-500 mt-1 md:mt-0" />
          <div className="flex-1">
            <label className="text-sm font-medium text-slate-700 block mb-2">
              Seleccionar campamento
            </label>
            <select
              value={selectedCampamento || ""}
              onChange={(e) =>
                setSelectedCampamento(
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white disabled:bg-slate-50 disabled:cursor-not-allowed"
            >
              <option value="">Selecciona un campamento</option>
              {campamentos?.map((campamento) => {
                const stats = calculateCampamentoStats(campamento);
                return (
                  <option key={campamento.id} value={campamento.id}>
                    {campamento.name} -{" "}
                    {format(parseISO(campamento.startDate), "MMMM yyyy", {
                      locale: es,
                    })}{" "}
                    ({stats.label})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {loadingInscripciones ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : !selectedCampamento ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-6">
              <Filter className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Selecciona un campamento
            </h3>
            <p className="text-slate-600">
              Elige un campamento de la lista para ver sus inscripciones
            </p>
          </div>
        ) : inscripciones.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-6">
              <Users className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Aún no hay inscripciones
            </h3>
            <p className="text-slate-600 mb-6">
              Comparte el campamento para empezar a recibir inscripciones
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-slate-600">
                  Total de inscripciones
                </span>
              </div>
              <span className="text-2xl font-bold text-slate-900">
                {inscripciones.length}
              </span>
            </div>

            <div className="space-y-4">
              {inscripciones.map((inscripcion, index) => (
                <div
                  key={inscripcion.id}
                  className="bg-linear-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200 hover:shadow-md transition-all"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">
                      <div className="w-14 h-14 bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                        <Users className="h-7 w-7 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {inscripcion.fullName}
                      </h3>

                      <div className="grid md:grid-cols-2 gap-3 mt-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="truncate">{inscripcion.email}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span>{inscripcion.phone}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-600 md:col-span-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>
                            Inscripto el{" "}
                            {format(
                              new Date(inscripcion.createdAt),
                              "dd 'de' MMMM, yyyy 'a las' HH:mm",
                              { locale: es }
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-200/50">
                        <div className="text-sm text-slate-600">
                          <span className="font-medium text-slate-900">
                            Campamento:
                          </span>{" "}
                          {inscripcion.campamento.name}
                        </div>
                        <div className="text-sm text-slate-600">
                          <span className="font-medium text-slate-900">
                            Fechas:
                          </span>{" "}
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
