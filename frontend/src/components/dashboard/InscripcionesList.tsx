import { useState, useEffect } from "react";
import {
  Users,
  Mail,
  Phone,
  Calendar,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { campamentoService } from "../../services/campamento.service";
import { inscriptionService } from "../../services/inscription.service";
import type { Campamento, Registration } from "../../types";
import { format, parseISO, isAfter, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";

export function InscripcionesList() {
  const {
    data: campamentos,
    isLoading: loadingCampamentos,
    execute: loadCampamentos,
  } = useApi<Campamento[]>();
  const [selectedCampamento, setSelectedCampamento] = useState<number | null>(
    null,
  );
  const [inscripciones, setInscripciones] = useState<Registration[]>([]);
  const [loadingInscripciones, setLoadingInscripciones] = useState(false);

  useEffect(() => {
    loadCampamentos(() => campamentoService.getAll());
  }, [loadCampamentos]);
  useEffect(() => {
    if (selectedCampamento) loadInscripciones(selectedCampamento);
  }, [selectedCampamento]);

  const loadInscripciones = async (campamentoId: number) => {
    setLoadingInscripciones(true);
    try {
      const data = await inscriptionService.getByCampamento(campamentoId);
      setInscripciones(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInscripciones(false);
    }
  };

  const getStatus = (c: Campamento) => {
    const now = new Date(),
      s = parseISO(c.startDate),
      e = parseISO(c.endDate);
    if (isAfter(s, now)) return "Próximo";
    if (isWithinInterval(now, { start: s, end: e })) return "En curso";
    return "Finalizado";
  };

  if (loadingCampamentos)
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-blue-600 mb-3" />
        <p className="text-sm text-slate-500">Cargando campamentos...</p>
      </div>
    );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-0.5">
          Inscripciones
        </h2>
        <p className="text-sm text-slate-500">
          Revisá las inscripciones a tus campamentos
        </p>
      </div>

      {/* Campamento selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
          Seleccionar campamento
        </label>
        <div className="relative">
          <select
            value={selectedCampamento || ""}
            onChange={(e) =>
              setSelectedCampamento(
                e.target.value ? parseInt(e.target.value) : null,
              )
            }
            className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl border border-slate-200 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white"
          >
            <option value="">Elegí un campamento...</option>
            {campamentos?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} —{" "}
                {format(parseISO(c.startDate), "MMM yyyy", { locale: es })} (
                {getStatus(c)})
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Content */}
      {loadingInscripciones ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
        </div>
      ) : !selectedCampamento ? (
        <div className="bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Users className="h-7 w-7 text-slate-400" />
          </div>
          <p className="font-semibold text-slate-800 text-sm mb-1">
            Seleccioná un campamento
          </p>
          <p className="text-xs text-slate-400">
            Elegí uno de la lista para ver sus inscripciones
          </p>
        </div>
      ) : inscripciones.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Users className="h-7 w-7 text-slate-400" />
          </div>
          <p className="font-semibold text-slate-800 text-sm mb-1">
            Aún no hay inscripciones
          </p>
          <p className="text-xs text-slate-400">
            Compartí el campamento para empezar a recibir inscriptos
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Count bar */}
          <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Total de inscripciones
              </span>
            </div>
            <span className="text-xl font-bold text-blue-700">
              {inscripciones.length}
            </span>
          </div>

          {/* Cards */}
          {inscripciones.map((ins) => (
            <div
              key={ins.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all p-5"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm">
                  {ins.fullName.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm">
                    {ins.fullName}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-x-4 gap-y-1.5 mt-2.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{ins.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {ins.phone}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 sm:col-span-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      Inscripto el{" "}
                      {format(
                        new Date(ins.createdAt),
                        "dd 'de' MMMM, yyyy 'a las' HH:mm",
                        { locale: es },
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1">
                    <p className="text-xs text-slate-500">
                      <span className="font-medium text-slate-700">
                        Campamento:
                      </span>{" "}
                      {ins.campamento.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      <span className="font-medium text-slate-700">
                        Fechas:
                      </span>{" "}
                      {format(parseISO(ins.campamento.startDate), "dd MMM", {
                        locale: es,
                      })}{" "}
                      —{" "}
                      {format(parseISO(ins.campamento.endDate), "dd MMM yyyy", {
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InscripcionesList;
