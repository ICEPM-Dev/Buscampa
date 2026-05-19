import { Search, X, SlidersHorizontal } from "lucide-react";
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
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    onLocationFilter(e.target.value);
  };

  const applyPriceFilter = (min: string, max: string) => {
    onPriceFilter({
      min: min ? parseFloat(min) : 0,
      max: max ? parseFloat(max) : Infinity,
    });
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

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-700">Filtros</span>
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold">
              {
                [searchQuery, location, priceMin, priceMax].filter(Boolean)
                  .length
              }
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Limpiar
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Nombre, iglesia..."
              value={searchQuery}
              onChange={handleSearchChange}
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
            Ubicación
          </label>
          <input
            type="text"
            placeholder="Ciudad, provincia..."
            value={location}
            onChange={handleLocationChange}
            className={inputClass}
          />
        </div>

        {/* Price min */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
            Precio mínimo
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
              $
            </span>
            <input
              type="number"
              placeholder="0"
              value={priceMin}
              onChange={(e) => {
                setPriceMin(e.target.value);
                applyPriceFilter(e.target.value, priceMax);
              }}
              min="0"
              className={`${inputClass} pl-7`}
            />
          </div>
        </div>

        {/* Price max */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">
            Precio máximo
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
              $
            </span>
            <input
              type="number"
              placeholder="Sin límite"
              value={priceMax}
              onChange={(e) => {
                setPriceMax(e.target.value);
                applyPriceFilter(priceMin, e.target.value);
              }}
              min="0"
              className={`${inputClass} pl-7`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
