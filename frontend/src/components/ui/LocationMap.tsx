import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin } from "lucide-react";

interface LocationMapProps {
  address: string;
}

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

function UpdateMapCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
}

/** Geocodifica una dirección usando Photon (OSM) directamente desde el frontend */
async function geocodeAddress(
  address: string,
): Promise<[number, number] | null> {
  try {
    const params = new URLSearchParams({
      q: address,
      limit: "1",
      lang: "default",
      bbox: "-73.6,-55.1,-53.6,-21.8",
    });
    const res = await fetch(`https://photon.komoot.io/api/?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    const feature = data.features?.[0];
    if (!feature) return null;
    const [lon, lat] = feature.geometry.coordinates;
    return [lat, lon];
  } catch {
    return null;
  }
}

export function LocationMap({ address }: LocationMapProps) {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    geocodeAddress(address)
      .then((result) => {
        if (result) setCoords(result);
        else setError("Ubicación no encontrada");
      })
      .catch(() => setError("Error al cargar el mapa"))
      .finally(() => setLoading(false));
  }, [address]);

  if (loading)
    return (
      <div className="w-full h-48 bg-slate-100 rounded-xl animate-pulse flex flex-col items-center justify-center gap-2 text-slate-400">
        <div className="w-5 h-5 rounded-full border-2 border-slate-300 border-t-slate-500 animate-spin" />
        <span className="text-xs">Cargando mapa...</span>
      </div>
    );

  if (error || !coords)
    return (
      <div className="w-full h-48 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400">
        <MapPin className="h-6 w-6" />
        <span className="text-xs">{error || "Ubicación no disponible"}</span>
      </div>
    );

  return (
    <div
      className="w-full h-52 rounded-xl overflow-hidden border border-slate-200 shadow-sm"
      style={{ isolation: "isolate", position: "relative", zIndex: 0 }}
    >
      <MapContainer
        center={coords}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coords} />
        <UpdateMapCenter center={coords} />
      </MapContainer>
    </div>
  );
}

export default LocationMap;
