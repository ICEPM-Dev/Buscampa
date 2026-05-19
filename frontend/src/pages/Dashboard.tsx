/**
 * Dashboard principal para iglesias — estilo consistente.
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
  Loader2,
  LayoutDashboard,
  Tent,
  ClipboardList,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import CampamentosList from "../components/dashboard/CampamentosList";
import InscripcionesList from "../components/dashboard/InscripcionesList";

type Tab = "dashboard" | "campamentos" | "inscripciones";

const NAV: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Resumen", icon: LayoutDashboard },
  { id: "campamentos", label: "Campamentos", icon: Tent },
  { id: "inscripciones", label: "Inscripciones", icon: ClipboardList },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { isChurch } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const stripHtml = (html?: string) => html?.replace(/<[^>]*>/g, "");

  const {
    data: campamentos,
    isLoading,
    execute: loadCampamentos,
  } = useApi<Campamento[]>();
  const [, setInscripciones] = useState<Registration[]>([]);

  useEffect(() => {
    if (!isChurch) {
      navigate("/");
      return;
    }
    loadCampamentos(() => campamentoService.getAll());
    inscriptionService
      .getMyInscriptions()
      .then(setInscripciones)
      .catch(console.error);
  }, [isChurch, navigate]);

  const go = (tab: Tab, path: string) => {
    setActiveTab(tab);
    navigate(path);
  };

  const stats = (() => {
    if (!campamentos) return { total: 0, upcoming: 0, ongoing: 0, past: 0 };
    const now = new Date();
    return {
      total: campamentos.length,
      upcoming: campamentos.filter((c) => isAfter(parseISO(c.startDate), now))
        .length,
      ongoing: campamentos.filter((c) =>
        isWithinInterval(now, {
          start: parseISO(c.startDate),
          end: parseISO(c.endDate),
        }),
      ).length,
      past: campamentos.filter((c) => isBefore(parseISO(c.endDate), now))
        .length,
    };
  })();

  const STAT_CARDS = [
    {
      label: "Total",
      value: stats.total,
      sub: "Campamentos creados",
      icon: Tent,
      color: "blue",
    },
    {
      label: "Próximos",
      value: stats.upcoming,
      sub: "Por comenzar",
      icon: Calendar,
      color: "green",
    },
    {
      label: "En curso",
      value: stats.ongoing,
      sub: "Activos ahora",
      icon: TrendingUp,
      color: "amber",
    },
    {
      label: "Finalizados",
      value: stats.past,
      sub: "Completados",
      icon: ClipboardList,
      color: "slate",
    },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    slate: "bg-slate-100 text-slate-500",
  };

  const statusBadge = (c: Campamento) => {
    const now = new Date();
    const s = parseISO(c.startDate),
      e = parseISO(c.endDate);
    if (isAfter(s, now))
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700">
          Próximo
        </span>
      );
    if (isWithinInterval(now, { start: s, end: e }))
      return (
        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-700">
          En curso
        </span>
      );
    return (
      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">
        Finalizado
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Cargando campamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .dash-page { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

        .dash-sidebar {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1rem;
          height: fit-content;
          position: sticky;
          top: 5.5rem;
        }

        .dash-nav-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 0.875rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          transition: background 0.15s, color 0.15s;
          text-align: left;
        }
        .dash-nav-btn.active {
          background: #eff6ff;
          color: #1d4ed8;
        }
        .dash-nav-btn:not(.active) {
          color: #475569;
        }
        .dash-nav-btn:not(.active):hover {
          background: #f8fafc;
          color: #1e293b;
        }

        .stat-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          transition: box-shadow 0.2s;
        }
        .stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

        .camp-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .camp-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          border-color: #bfdbfe;
        }
      `}</style>

      <div className="dash-page min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <aside className="w-full md:w-56 shrink-0">
              <div className="dash-sidebar">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-2 mb-3">
                  Panel
                </p>
                <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
                  {NAV.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() =>
                        go(
                          id,
                          id === "dashboard"
                            ? "/dashboard"
                            : `/dashboard/${id}`,
                        )
                      }
                      className={`dash-nav-btn whitespace-nowrap ${activeTab === id ? "active" : ""}`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main */}
            <main className="flex-1 min-w-0">
              {/* ── RESUMEN ── */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {STAT_CARDS.map(
                      ({ label, value, sub, icon: Icon, color }) => (
                        <div className="stat-card" key={label}>
                          <div className="flex items-center justify-between mb-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <span className="text-xs text-slate-400 font-medium">
                              {label}
                            </span>
                          </div>
                          <p className="text-2xl font-bold text-slate-900 tracking-tight">
                            {value}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
                        </div>
                      ),
                    )}
                  </div>

                  {campamentos && campamentos.length > 0 ? (
                    <>
                      {/* Recent camps */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-lg font-bold text-slate-900">
                            Campamentos recientes
                          </h2>
                          <button
                            onClick={() =>
                              go("campamentos", "/dashboard/campamentos")
                            }
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
                          >
                            Ver todos <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          {campamentos.slice(0, 4).map((c) => (
                            <div
                              key={c.id}
                              className="camp-card"
                              onClick={() =>
                                navigate(
                                  `/dashboard/campamentos/${c.id}/editar`,
                                )
                              }
                            >
                              <div className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                  <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 flex-1 mr-2">
                                    {c.name}
                                  </h3>
                                  {statusBadge(c)}
                                </div>
                                {c.description && (
                                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                                    {stripHtml(c.description) ||
                                      "Sin descripción"}
                                  </p>
                                )}
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                    {format(parseISO(c.startDate), "dd MMM", {
                                      locale: es,
                                    })}{" "}
                                    —{" "}
                                    {format(
                                      parseISO(c.endDate),
                                      "dd MMM yyyy",
                                      { locale: es },
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                    <span className="truncate">
                                      {c.location}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <DollarSign className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                    <span className="font-semibold text-slate-800">
                                      ${c.price.toLocaleString("es-AR")}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
                        <Tent className="h-8 w-8 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        No tenés campamentos
                      </h3>
                      <p className="text-sm text-slate-500 mb-5">
                        Creá tu primer campamento para empezar a recibir
                        inscripciones
                      </p>
                      <button
                        onClick={() => navigate("/dashboard/campamentos/nuevo")}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        <Plus className="h-4 w-4" />
                        Crear Campamento
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "campamentos" && (
                <CampamentosList
                  onCreateNew={() => navigate("/dashboard/campamentos/nuevo")}
                />
              )}

              {activeTab === "inscripciones" && <InscripcionesList />}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
