/**
 * Dashboard principal para iglesias.
 * Muestra estadísticas de campamentos, navegación lateral y vistas detalladas.
 * Incluye resumen, gestión de campamentos e inscripciones.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";
import { campamentoService } from "../services/campamento.service";
import { inscriptionService } from "../services/inscription.service";
import type { Campamento, Registration } from "../types";
import {
  format,
  parseISO,
  isAfter,
  isWithinInterval,
  isBefore,
} from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  MapPin,
  DollarSign,
  Plus,
  Users,
  Loader2,
} from "lucide-react";
import CampamentosList from "../components/dashboard/CampamentosList";
import InscripcionesList from "../components/dashboard/InscripcionesList";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isChurch } = useAuth();
  const [, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  const {
    data: campamentos,
    isLoading: isLoadingCampamentos,
    execute: loadCampamentos,
  } = useApi<Campamento[]>();

  const [, setInscripciones] = useState<Registration[]>([]);

  useEffect(() => {
    if (!isChurch) {
      navigate("/");
      return;
    }
    setIsLoading(false);
    loadCampamentos(() => campamentoService.getAll());
    loadInscripciones();
  }, [isChurch, navigate]);

  const loadInscripciones = async () => {
    try {
      const data = await inscriptionService.getMyInscriptions();
      setInscripciones(data);
    } catch (error) {
      console.error("Error loading inscripciones:", error);
    }
  };

  const calculateStats = () => {
    if (!campamentos) return { total: 0, upcoming: 0, ongoing: 0, past: 0 };

    const now = new Date();

    const upcoming = campamentos.filter((c) =>
      isAfter(parseISO(c.startDate), now)
    ).length;
    const ongoing = campamentos.filter((c) =>
      isWithinInterval(now, {
        start: parseISO(c.startDate),
        end: parseISO(c.endDate),
      })
    ).length;
    const past = campamentos.filter((c) =>
      isBefore(parseISO(c.endDate), now)
    ).length;

    return {
      total: campamentos.length,
      upcoming,
      ongoing,
      past,
    };
  };

  const stats = calculateStats();

  if (isLoadingCampamentos) {
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-72 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  navigate("/dashboard");
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Resumen
              </button>
              <button
                onClick={() => {
                  setActiveTab("campamentos");
                  navigate("/dashboard/campamentos");
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === "campamentos"
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Campamentos
              </button>
              <button
                onClick={() => {
                  setActiveTab("inscripciones");
                  navigate("/dashboard/inscripciones");
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === "inscripciones"
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Inscripciones
              </button>
            </div>
          </aside>

          <main className="flex-1">
            {activeTab === "dashboard" && (
              <>
                {isLoadingCampamentos ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                      <p className="text-slate-600">Cargando campamentos...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <span className="text-sm text-slate-500">Total</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">
                          {stats.total}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          Campamentos creados
                        </p>
                      </div>

                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <Plus className="h-5 w-5 text-green-600" />
                          <span className="text-sm text-slate-500">
                            Próximos
                          </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">
                          {stats.upcoming}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          Por comenzar
                        </p>
                      </div>

                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <Users className="h-5 w-5 text-amber-600" />
                          <span className="text-sm text-slate-500">
                            En curso
                          </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">
                          {stats.ongoing}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          Activos ahora
                        </p>
                      </div>

                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <Calendar className="h-5 w-5 text-slate-600" />
                          <span className="text-sm text-slate-500">
                            Finalizados
                          </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">
                          {stats.past}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          Completados
                        </p>
                      </div>
                    </div>

                    {campamentos && campamentos.length > 0 ? (
                      <>
                        <div className="mb-8">
                          <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">
                              Campamentos Recientes
                            </h2>
                            <p className="text-slate-600">
                              Gestiona tus campamentos más recientes
                            </p>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            {campamentos.slice(0, 4).map((campamento) => {
                              const startDate = parseISO(campamento.startDate);
                              const endDate = parseISO(campamento.endDate);
                              const isUpcoming = isAfter(startDate, new Date());
                              const isOngoing = isWithinInterval(new Date(), {
                                start: startDate,
                                end: endDate,
                              });
                              const isPast = isBefore(endDate, new Date());

                              return (
                                <div
                                  key={campamento.id}
                                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden group cursor-pointer"
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/campamentos/${campamento.id}/editar`
                                    )
                                  }
                                >
                                  <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                      <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                                          {campamento.name}
                                        </h3>
                                        {campamento.description && (
                                          <p className="text-sm text-slate-600 line-clamp-2">
                                            {campamento.description}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex gap-2 ml-2">
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

                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Calendar className="h-4 w-4 text-blue-600 shrink-0" />
                                        <span>
                                          {format(startDate, "dd MMM", {
                                            locale: es,
                                          })}{" "}
                                          -{" "}
                                          {format(endDate, "dd MMM yyyy", {
                                            locale: es,
                                          })}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                                        <span className="truncate">
                                          {campamento.location}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <DollarSign className="h-4 w-4 text-blue-600 shrink-0" />
                                        <span className="font-semibold text-slate-900">
                                          $
                                          {campamento.price.toLocaleString(
                                            "es-AR"
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                              Ver Todos los Campamentos
                            </h2>
                            <p className="text-slate-600">
                              Gestiona todos tus campamentos
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              setActiveTab("campamentos");
                              navigate("/dashboard/campamentos");
                            }}
                            className="inline-flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-xl font-medium border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
                          >
                            Ver Todo
                            <Calendar className="h-5 w-5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="bg-white rounded-2xl shadow-sm border-slate-100 p-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
                          <Calendar className="h-10 w-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                          No tienes campamentos
                        </h3>
                        <p className="text-slate-600 mb-6">
                          Crea tu primer campamento para empezar a recibir
                          inscripciones
                        </p>
                        <button
                          onClick={() =>
                            navigate("/dashboard/campamentos/nuevo")
                          }
                          className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105"
                        >
                          <Plus className="h-5 w-5" />
                          Crear Campamento
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {activeTab === "campamentos" && (
              <>
                <CampamentosList
                  onCreateNew={() => navigate("/dashboard/campamentos/nuevo")}
                />
              </>
            )}

            {activeTab === "inscripciones" && <InscripcionesList />}
          </main>
        </div>
      </div>
    </div>
  );
}
