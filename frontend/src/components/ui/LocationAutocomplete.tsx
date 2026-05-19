import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";
import { api } from "../../services/api";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
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

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setShowResults(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    onChange(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (v.length < 3) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get<SearchResult[]>("/geocode/search", {
          params: { q: v, limit: 5 },
        });
        setResults(res);
        if (res.length > 0) setShowResults(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
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
          className={[
            "w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2",
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-500/20"
              : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20",
            disabled ? "bg-slate-50 cursor-not-allowed" : "bg-white",
          ].join(" ")}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <ul className="absolute z-20 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg max-h-56 overflow-auto">
          {results.map((result, i) => (
            <li
              key={i}
              onClick={() => handleSelect(result)}
              className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-slate-50 cursor-pointer text-sm text-slate-700 border-b border-slate-100 last:border-0 transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{result.display_name}</span>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default LocationAutocomplete;
