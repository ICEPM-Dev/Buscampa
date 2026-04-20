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
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Campamentos Cristianos
            </h1>
            <p className="text-slate-600">
              Descubre campamentos de iglesias de toda Argentina
            </p>
          </div>
          {!isChurch && (
            <Button
              onClick={() => navigate("/inscripciones")}
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              <List className="h-5 w-5" />
              Ver Mis Inscripciones
            </Button>
          )}
        </div>

        <CampamentoList
          campamentos={availableCampamentos}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
