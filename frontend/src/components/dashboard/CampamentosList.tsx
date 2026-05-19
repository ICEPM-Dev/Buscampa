import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  DollarSign,
  Edit2,
  Trash2,
  Plus,
  Search,
  Filter,
  Tent,
} from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { campamentoService } from "../../services/campamento.service";
import type { Campamento } from "../../types";
import {
  format,
  parseISO,
  isAfter,
  isBefore,
  isWithinInterval,
} from "date-fns";
import { es } from "date-fns/locale";
import Button from "../ui/Button";
import { useEffect, useState } from "react";

export function CampamentosList({ onCreateNew }: { onCreateNew: () => void }) {
  const navigate = useNavigate();
  const {
    data: campamentos,
    isLoading,
    error,
    execute,
    reset,
  } = useApi<Campamento[]>();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "upcoming" | "ongoing" | "past"
  >("all");
  const stripHtml = (html?: string) => html?.replace(/<[^>]*>/g, "");

  useEffect(() => {
    execute(() => campamentoService.getAll());
  }, [execute]);

  const now = new Date();

  const filtered =
    campamentos?.filter((c) => {
      const s = parseISO(c.startDate),
        e = parseISO(c.endDate);
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false);
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "upcoming" && isAfter(s, now)) ||
        (filterStatus === "ongoing" &&
          isWithinInterval(now, { start: s, end: e })) ||
        (filterStatus === "past" && isBefore(e, now));
      return matchSearch && matchStatus;
    }) || [];

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que querés eliminar este campamento?"))
      return;
    setDeletingId(id);
    try {
      await campamentoService.delete(id);
      reset();
      execute(() => campamentoService.getAll());
    } catch {
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-8 h-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mb-3" />
        <p className="text-sm text-slate-500">Cargando campamentos...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-sm mb-3">Error al cargar campamentos</p>
        <Button onClick={() => execute(() => campamentoService.getAll())}>
          Reintentar
        </Button>
      </div>
    );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-0.5">
            Mis Campamentos
          </h2>
          <p className="text-sm text-slate-500">
            {campamentos?.length || 0}{" "}
            {campamentos?.length === 1 ? "campamento" : "campamentos"}
          </p>
        </div>
        <Button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuevo
        </Button>
      </div>

      {/* Search + filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar campamentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white"
            >
              <option value="all">Todos</option>
              <option value="upcoming">Próximos</option>
              <option value="ongoing">En curso</option>
              <option value="past">Finalizados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Tent className="h-7 w-7 text-slate-400" />
          </div>
          <p className="font-semibold text-slate-800 text-sm mb-1">
            {searchQuery || filterStatus !== "all"
              ? "Sin resultados"
              : "No tenés campamentos"}
          </p>
          <p className="text-xs text-slate-400 mb-4">
            {searchQuery || filterStatus !== "all"
              ? "Intentá ajustar los filtros"
              : "Creá tu primer campamento para recibir inscripciones"}
          </p>
          {!searchQuery && filterStatus === "all" && (
            <Button
              onClick={onCreateNew}
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Crear Campamento
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const s = parseISO(c.startDate),
              e = parseISO(c.endDate);
            const isUpcoming = isAfter(s, now);
            const isOngoing = isWithinInterval(now, { start: s, end: e });
            const isPast = isBefore(e, now);

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all overflow-hidden group"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors flex-1 mr-2">
                      {c.name}
                    </h3>
                    {isUpcoming && (
                      <span className="shrink-0 px-2 py-0.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700">
                        Próximo
                      </span>
                    )}
                    {isOngoing && (
                      <span className="shrink-0 px-2 py-0.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700">
                        En curso
                      </span>
                    )}
                    {isPast && (
                      <span className="shrink-0 px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-500">
                        Finalizado
                      </span>
                    )}
                  </div>

                  {c.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                      {stripHtml(c.description)}
                    </p>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      {format(s, "dd MMM", { locale: es })} —{" "}
                      {format(e, "dd MMM yyyy", { locale: es })}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{c.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <DollarSign className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      <span className="font-bold text-slate-800">
                        ${c.price.toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      navigate(`/dashboard/campamentos/${c.id}/editar`)
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1.5"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(c.id)}
                    disabled={deletingId === c.id}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2.5"
                  >
                    {deletingId === c.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CampamentosList;
