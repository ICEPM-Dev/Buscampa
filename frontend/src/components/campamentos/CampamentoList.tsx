import { useState, useMemo } from "react";
import CampamentoCard from "./CampamentoCard";
import CampamentoFilters from "./CampamentoFilters";
import type { Campamento } from "../../types";

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
    return campamentos.filter((campamento) => {
      const matchesSearch =
        !searchQuery ||
        campamento.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (campamento.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ??
          false) ||
        campamento.church.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesLocation =
        !locationFilter ||
        campamento.location
          .toLowerCase()
          .includes(locationFilter.toLowerCase());

      const matchesPrice =
        campamento.price >= priceFilter.min &&
        campamento.price <= priceFilter.max;

      return matchesSearch && matchesLocation && matchesPrice;
    });
  }, [campamentos, searchQuery, locationFilter, priceFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Cargando campamentos...</p>
        </div>
      </div>
    );
  }

  if (filteredCampamentos.length === 0) {
    return (
      <div>
        <CampamentoFilters
          onSearch={setSearchQuery}
          onLocationFilter={setLocationFilter}
          onPriceFilter={setPriceFilter}
        />
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg">
            No se encontraron campamentos
          </p>
          <p className="text-slate-500 mt-2">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CampamentoFilters
        onSearch={setSearchQuery}
        onLocationFilter={setLocationFilter}
        onPriceFilter={setPriceFilter}
      />

      <div className="mb-4 text-sm text-slate-600">
        Mostrando{" "}
        <span className="font-semibold">{filteredCampamentos.length}</span>{" "}
        {filteredCampamentos.length === 1 ? "campamento" : "campamentos"}
        {searchQuery && (
          <>
            {" "}
            para "<span className="font-medium">{searchQuery}</span>"
          </>
        )}
        {locationFilter && (
          <>
            {" "}
            en <span className="font-medium">{locationFilter}</span>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampamentos.map((campamento) => (
          <CampamentoCard key={campamento.id} campamento={campamento} />
        ))}
      </div>
    </div>
  );
}
