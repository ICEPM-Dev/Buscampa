import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { useAuth } from "../hooks/useAuth";
import { campamentoService } from "../services/campamento.service";
import { inscriptionService } from "../services/inscription.service";
import CampamentoDetail from "../components/campamentos/CampamentoDetail";
import type { Registration } from "../types";

export default function CampamentoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const {
    data: campamento,
    isLoading: isLoadingCampamento,
    execute,
  } = useApi<any>();
  const [inscripciones, setInscripciones] = useState<Registration[]>([]);

  useEffect(() => {
    if (id) {
      execute(() => campamentoService.getById(parseInt(id)));
    }

    if (isAuthenticated) {
      inscriptionService
        .getMyInscriptions()
        .then(setInscripciones)
        .catch(console.error);
    }
  }, [id, isAuthenticated, execute]);

  const handleInscribirse = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    const alreadyInscribed = inscripciones.some(
      (insc) => insc.campamentoId === parseInt(id || "0")
    );

    if (alreadyInscribed) {
      navigate("/inscripciones");
      return;
    }

    navigate(`/campamentos/${id}/inscribirse`);
  };

  const isOrganizer = isAuthenticated && user?.churchId && 
    campamento?.churchId === user.churchId;

  const isAlreadyInscribed = inscripciones.some(
    (insc) => insc.campamentoId === parseInt(id || "0")
  );

  if (isLoadingCampamento) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Cargando campamento...</p>
        </div>
      </div>
    );
  }

  if (!campamento) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 text-lg mb-4">
            Campamento no encontrado
          </p>
          <button
            onClick={() => navigate("/campamentos")}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Volver a campamentos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CampamentoDetail
          campamento={campamento}
          onInscribirse={isOrganizer ? undefined : handleInscribirse}
          isAlreadyInscribed={isAlreadyInscribed}
        />
      </div>
    </div>
  );
}
