import { useState, useRef, useEffect, useCallback } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

interface PhotonFeature {
  geometry: { coordinates: [number, number] }; // [lon, lat]
  properties: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    street?: string;
    housenumber?: string;
  };
}

/** Formatea un feature de Photon en una string legible */
function formatPlace(f: PhotonFeature): string {
  const p = f.properties;
  const parts: string[] = [];

  if (p.name && p.name !== p.city) parts.push(p.name);
  if (p.street) {
    const street = p.housenumber ? `${p.street} ${p.housenumber}` : p.street;
    if (!parts.includes(street)) parts.push(street);
  }
  if (p.city) parts.push(p.city);
  if (p.state && p.state !== p.city) parts.push(p.state);
  if (p.country) parts.push(p.country);

  return parts.filter(Boolean).join(", ");
}

interface SearchResult {
  display_name: string;
  lat: number;
  lon: number;
}

export function LocationAutocomplete({
  value,
  onChange,
  error,
  disabled,
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setShowResults(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = useCallback(async (q: string) => {
    // Cancelar request anterior
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    try {
      // Photon: geocoder open source basado en OSM, mejor cobertura que Nominatim
      // Bias hacia Argentina con bbox aproximado
      const params = new URLSearchParams({
        q,
        limit: "6",
        // Photon solo soporta: default, de, en, fr
        lang: "default",
        bbox: "-73.6,-55.1,-53.6,-21.8",
      });

      const res = await fetch(`https://photon.komoot.io/api/?${params}`, {
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error("Error en geocoding");

      const data = await res.json();
      const features: PhotonFeature[] = data.features || [];

      const mapped: SearchResult[] = features
        .map((f) => ({
          display_name: formatPlace(f),
          lat: f.geometry.coordinates[1],
          lon: f.geometry.coordinates[0],
        }))
        .filter((r) => r.display_name.length > 0);

      // Deduplicar por display_name
      const seen = new Set<string>();
      const unique = mapped.filter((r) => {
        if (seen.has(r.display_name)) return false;
        seen.add(r.display_name);
        return true;
      });

      setResults(unique);
      if (unique.length > 0) setShowResults(true);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Geocoding error:", err);
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    onChange(v);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (v.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(() => search(v), 350);
  };

  const handleSelect = (result: SearchResult) => {
    setQuery(result.display_name);
    onChange(result.display_name);
    setShowResults(false);
    setResults([]);
  };

  return (
    <div className="w-full relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Ubicación
      </label>

      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setShowResults(true)}
          disabled={disabled}
          placeholder="Ej: Mar del Plata, Buenos Aires"
          autoComplete="off"
          className={[
            "w-full pl-9 pr-9 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2",
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-500/20"
              : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20",
            disabled ? "bg-slate-50 cursor-not-allowed" : "bg-white",
          ].join(" ")}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown de resultados */}
      {showResults && results.length > 0 && (
        <ul className="absolute z-20 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {results.map((result, i) => (
            <li
              key={i}
              onMouseDown={(e) => {
                // mouseDown en vez de click para que no se cierre antes de registrar
                e.preventDefault();
                handleSelect(result);
              }}
              className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm text-slate-700 border-b border-slate-100 last:border-0 transition-colors group"
            >
              <MapPin className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-500 shrink-0 mt-0.5 transition-colors" />
              <span className="line-clamp-2">{result.display_name}</span>
            </li>
          ))}
          {/* Crédito requerido por Photon/OSM */}
          <li className="px-4 py-1.5 text-[10px] text-slate-400 text-right bg-slate-50 rounded-b-xl">
            © OpenStreetMap contributors
          </li>
        </ul>
      )}

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default LocationAutocomplete;
