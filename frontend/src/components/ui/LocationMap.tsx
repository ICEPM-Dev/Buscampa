import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface LocationMapProps {
  address: string;
}

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
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

export default function LocationMap({ address }: LocationMapProps) {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;

    const geocodeAddress = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
          {
            headers: {
              "User-Agent": "Buscampa/1.0",
            },
          }
        );

        const data = await response.json();

        if (data && data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setError("Ubicación no encontrada");
        }
      } catch (err) {
        setError("Error al cargar el mapa");
      } finally {
        setLoading(false);
      }
    };

    geocodeAddress();
  }, [address]);

  if (loading) {
    return (
      <div className="w-full h-48 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center text-slate-400 text-sm">
        Cargando mapa...
      </div>
    );
  }

  if (error || !coords) {
    return (
      <div className="w-full h-48 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-sm">
        {error || "Ubicación no disponible"}
      </div>
    );
  }

  return (
    <div className="w-full h-48 rounded-xl overflow-hidden border border-slate-200">
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