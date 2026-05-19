/**
 * Página de listado de campamentos — estilo consistente.
 */
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../hooks/useAuth";
import { List } from "lucide-react";
import { campamentoService } from "../services/campamento.service";
import CampamentoList from "../components/campamentos/CampamentoList";
import { parseISO } from "date-fns";
import SEO from "../components/SEO";

export default function Campamentos() {
  const navigate = useNavigate();
  const { isChurch } = useAuth();
  const { data: campamentos, isLoading, execute } = useApi<any>();

  useEffect(() => {
    execute(() => campamentoService.getAllPublic());
  }, [execute]);

  const availableCampamentos = useMemo(() => {
    if (!campamentos) return [];
    const now = new Date();
    return campamentos.filter((campamento: any) => {
      const startDate = parseISO(campamento.startDate);
      const endDate = parseISO(campamento.endDate);
      return !(now >= startDate && now <= endDate);
    });
  }, [campamentos]);

  return (
    <>
      <SEO
        title="Campamentos"
        description="Explora campamentos cristianos en Argentina. Encuentra retiros espirituales, campamentos juveniles y eventos de tu iglesia."
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .camps-page { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }

        .page-header {
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          padding: 2rem 0 1.75rem;
          margin-bottom: 2rem;
        }
      `}</style>

      <div className="camps-page min-h-screen bg-slate-50">
        {/* Page header */}
        <div className="page-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  Campamentos
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Descubrí todos los eventos disponibles en Argentina
                </p>
              </div>

              {!isChurch && (
                <button
                  onClick={() => navigate("/inscripciones")}
                  className="hidden sm:inline-flex items-center gap-2 border border-blue-200 rounded-xl p-2.5 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <List className="h-4 w-4" />
                  Mis inscripciones
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile "mis inscripciones" */}
        {!isChurch && (
          <div className="sm:hidden max-w-7xl mx-auto px-4 mb-4">
            <button
              onClick={() => navigate("/inscripciones")}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-blue-600 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <List className="h-4 w-4" />
              Ver mis inscripciones
            </button>
          </div>
        )}

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <CampamentoList
            campamentos={availableCampamentos}
            loading={isLoading}
          />
        </div>
      </div>
    </>
  );
}
