/**
 * Página de listado de campamentos disponibles.
 * Muestra campamentos que no están en curso, con opción de ver inscripciones.
 */
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../hooks/useAuth";
import { List } from "lucide-react";
import { campamentoService } from "../services/campamento.service";
import CampamentoList from "../components/campamentos/CampamentoList";
import Button from "../components/ui/Button";
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
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Campamentos
              </h1>
              <p className="text-slate-600">
                Descubre todos los eventos disponibles
              </p>
            </div>
            {!isChurch && (
              <Button
                onClick={() => navigate("/inscripciones")}
                variant="outline"
                className="inline-flex items-center gap-2 cursor-pointer"
              >
                <List className="h-5 w-5" />
                Ver mis inscripciones
              </Button>
            )}
          </div>

          <CampamentoList
            campamentos={availableCampamentos}
            loading={isLoading}
          />
        </div>
      </div>
    </>
  );
}