import { useState, useEffect } from "react";
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
import { showToast } from "../ui/Toast";
import Button from "../ui/Button";

export default function CampamentosList({
  onCreateNew,
}: {
  onCreateNew: () => void;
}) {
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

  useEffect(() => {
    execute(() => campamentoService.getAll());
  }, [execute]);

  const now = new Date();

  const filteredCampamentos =
    campamentos?.filter((campamento) => {
      const matchesSearch =
        campamento.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campamento.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (campamento.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ??
          false);

      const startDate = parseISO(campamento.startDate);
      const endDate = parseISO(campamento.endDate);

      const isUpcoming = isAfter(startDate, now);
      const isOngoing = isWithinInterval(now, {
        start: startDate,
        end: endDate,
      });
      const isPast = isBefore(endDate, now);

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "upcoming" && isUpcoming) ||
        (filterStatus === "ongoing" && isOngoing) ||
        (filterStatus === "past" && isPast);

      return matchesSearch && matchesStatus;
    }) || [];

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este campamento?")) {
      return;
    }

    setDeletingId(id);
    try {
      await campamentoService.delete(id);
      showToast.success("Campamento eliminado exitosamente");
      reset();
      execute(() => campamentoService.getAll());
    } catch (error: any) {
      showToast.error(
        error.response?.data?.message || "Error al eliminar campamento"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Cargando campamentos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error al cargar campamentos</p>
        <Button onClick={() => execute(() => campamentoService.getAll())}>
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Mis Campamentos
          </h2>
          <p className="text-slate-600">
            {campamentos?.length || 0}{" "}
            {campamentos?.length === 1 ? "campamento" : "campamentos"}
          </p>
        </div>

        <Button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:shadow-lg transition-all"
        >
          <Plus className="h-5 w-5" />
          Nuevo Campamento
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar campamentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="upcoming">Próximos</option>
              <option value="ongoing">En curso</option>
              <option value="past">Finalizados</option>
            </select>
          </div>
        </div>
      </div>

      {filteredCampamentos.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
            <Calendar className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No se encontraron campamentos
          </h3>
          <p className="text-slate-600 mb-6">
            {searchQuery || filterStatus !== "all"
              ? "Intenta ajustar los filtros de búsqueda"
              : "Crea tu primer campamento para empezar a recibir inscripciones"}
          </p>
          {!searchQuery && filterStatus === "all" && (
            <Button
              onClick={onCreateNew}
              className="inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Crear Campamento
            </Button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampamentos.map((campamento) => {
            const startDate = parseISO(campamento.startDate);
            const endDate = parseISO(campamento.endDate);
            const isUpcoming = isAfter(startDate, now);
            const isOngoing = isWithinInterval(now, {
              start: startDate,
              end: endDate,
            });
            const isPast = isBefore(endDate, now);

            return (
              <div
                key={campamento.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {campamento.name}
                      </h3>
                      {campamento.description && (
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {campamento.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>
                        {format(startDate, "dd MMM", { locale: es })} -{" "}
                        {format(endDate, "dd MMM yyyy", { locale: es })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                      <span className="truncate">{campamento.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <DollarSign className="h-4 w-4 text-blue-600 shrink-0" />
                      <span className="font-semibold text-slate-900">
                        ${campamento.price.toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {isUpcoming && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
                        Próximo
                      </span>
                    )}
                    {isOngoing && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-700">
                        En curso
                      </span>
                    )}
                    {isPast && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                        Finalizado
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      navigate(`/dashboard/campamentos/${campamento.id}/editar`)
                    }
                    className="flex-1 inline-flex items-center justify-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(campamento.id)}
                    disabled={deletingId === campamento.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    {deletingId === campamento.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
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
