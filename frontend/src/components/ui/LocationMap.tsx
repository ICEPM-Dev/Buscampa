import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useState, useEffect } from "react";

interface LocationMapProps {
  address: string;
}

export default function LocationMap({ address }: LocationMapProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  useEffect(() => {
    if (!isLoaded || !address) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const loc = results[0].geometry.location;
        setCoords({ lat: loc.lat(), lng: loc.lng() });
      }
    });
  }, [address, isLoaded]);

  if (!isLoaded || !coords)
    return (
      <div className="w-full h-48 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center text-slate-400 text-sm">
        Cargando mapa...
      </div>
    );

  return (
    <GoogleMap
      mapContainerClassName="w-full h-48 rounded-xl overflow-hidden"
      center={coords}
      zoom={14}
      options={{ disableDefaultUI: true, zoomControl: true }}
    >
      <Marker position={coords} />
    </GoogleMap>
  );
}
