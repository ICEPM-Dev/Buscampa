import { Search, X } from "lucide-react";
import { useState } from "react";

interface CampamentoFiltersProps {
  onSearch: (query: string) => void;
  onLocationFilter: (location: string) => void;
  onPriceFilter: (priceRange: { min: number; max: number }) => void;
}

export default function CampamentoFilters({
  onSearch,
  onLocationFilter,
  onPriceFilter,
}: CampamentoFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    onLocationFilter(value);
  };

  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPriceMin(value);
    priceFilter();
  };

  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPriceMax(value);
    priceFilter();
  };

  const priceFilter = () => {
    const min = priceMin ? parseFloat(priceMin) : 0;
    const max = priceMax ? parseFloat(priceMax) : Infinity;
    onPriceFilter({ min, max });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocation("");
    setPriceMin("");
    setPriceMax("");
    onSearch("");
    onLocationFilter("");
    onPriceFilter({ min: 0, max: Infinity });
  };

  const hasActiveFilters = searchQuery || location || priceMin || priceMax;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Filtros</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Nombre, descripción..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Ubicación
          </label>
          <input
            type="text"
            placeholder="Ciudad, provincia..."
            value={location}
            onChange={handleLocationChange}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Precio mínimo
          </label>
          <input
            type="number"
            placeholder="0"
            value={priceMin}
            onChange={handlePriceMinChange}
            min="0"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Precio máximo
          </label>
          <input
            type="number"
            placeholder="Sin límite"
            value={priceMax}
            onChange={handlePriceMaxChange}
            min="0"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}
