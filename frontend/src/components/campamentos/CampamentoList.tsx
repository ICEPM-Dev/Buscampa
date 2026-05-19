/**
 * Lista de campamentos con filtros — estilo consistente.
 */
import { useState, useMemo } from "react";
import CampamentoCard from "./CampamentoCard";
import CampamentoFilters from "./CampamentoFilters";
import type { Campamento } from "../../types";
import { Tent } from "lucide-react";

interface CampamentoListProps {
  campamentos: Campamento[];
  loading?: boolean;
}

export default function CampamentoList({
  campamentos,
  loading = false,
}: CampamentoListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState<{ min: number; max: number }>({
    min: 0,
    max: Infinity,
  });

  const filteredCampamentos = useMemo(() => {
    return campamentos.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false) ||
        c.church.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation =
        !locationFilter ||
        c.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesPrice =
        c.price >= priceFilter.min && c.price <= priceFilter.max;
      return matchesSearch && matchesLocation && matchesPrice;
    });
  }, [campamentos, searchQuery, locationFilter, priceFilter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mb-4" />
        <p className="text-sm text-slate-500">Cargando campamentos...</p>
      </div>
    );
  }

  const hasFilters =
    searchQuery ||
    locationFilter ||
    priceFilter.min > 0 ||
    priceFilter.max < Infinity;

  return (
    <div>
      <CampamentoFilters
        onSearch={setSearchQuery}
        onLocationFilter={setLocationFilter}
        onPriceFilter={setPriceFilter}
      />

      {filteredCampamentos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Tent className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-base font-semibold text-slate-700 mb-1">
            {hasFilters ? "Sin resultados" : "No hay campamentos"}
          </p>
          <p className="text-sm text-slate-400">
            {hasFilters
              ? "Intentá ajustar los filtros de búsqueda"
              : "Volvé pronto para ver nuevos eventos"}
          </p>
        </div>
      ) : (
        <>
          {/* Results summary */}
          <div className="flex items-center gap-2 mb-5">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-800">
                {filteredCampamentos.length}
              </span>{" "}
              {filteredCampamentos.length === 1 ? "campamento" : "campamentos"}
              {searchQuery && (
                <>
                  {" "}
                  para{" "}
                  <span className="font-medium text-blue-600">
                    "{searchQuery}"
                  </span>
                </>
              )}
              {locationFilter && (
                <>
                  {" "}
                  en{" "}
                  <span className="font-medium text-blue-600">
                    {locationFilter}
                  </span>
                </>
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCampamentos.map((campamento) => (
              <CampamentoCard key={campamento.id} campamento={campamento} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
