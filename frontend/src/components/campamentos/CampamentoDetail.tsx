import {
  MapPin,
  Calendar,
  DollarSign,
  Church,
  ArrowLeft,
  UserCheck,
  Share2,
  X,
  Download,
} from "lucide-react";
import type { Campamento } from "../../types";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import RichTextDisplay from "../ui/RichTextDisplay";
import LocationMap from "../ui/LocationMap";
import { getThumbnailUrl, getLargeUrl } from "../../utils/imageUtils";

interface CampamentoDetailProps {
  campamento: Campamento;
  onInscribirse?: () => void;
  isAlreadyInscribed?: boolean;
}

export default function CampamentoDetail({
  campamento,
  onInscribirse,
  isAlreadyInscribed = false,
}: CampamentoDetailProps) {
  const startDate = parseISO(campamento.startDate);
  const endDate = parseISO(campamento.endDate);
  const now = new Date();
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const isUpcoming = startDate > now;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/c/${campamento.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const isPast = endDate < now;
  const isOngoing = startDate <= now && endDate >= now;

  const formatDateRange = (start: Date, end: Date) => {
    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      return `${start.getDate()} - ${end.getDate()} de ${format(end, "MMMM", {
        locale: es,
      })}, ${end.getFullYear()}`;
    }
    return `${format(start, "dd MMM", { locale: es })} - ${format(
      end,
      "dd MMM yyyy",
      { locale: es },
    )}`;
  };

  const getDuration = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} día${diffDays > 1 ? "s" : ""}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white p-8">
        <Link
          to="/campamentos"
          className="inline-flex items-center gap-2 text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Volver
        </Link>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 text-white transition-colors ml-4"
        >
          <Share2 className="h-5 w-5" />
          {copied ? "¡Copiado!" : "Compartir"}
        </button>

        <div className="flex items-start justify-between mb-4 mt-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              {isUpcoming && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
                  Próximamente
                </span>
              )}
              {isOngoing && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500 text-white">
                  En curso
                </span>
              )}
              {isPast && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-500 text-white">
                  Finalizado
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">{campamento.name}</h1>
          </div>
        </div>
      </div>

      <div className="p-8">
        {campamento.description && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              Descripción
            </h2>
            <RichTextDisplay html={campamento.description} />
          </div>
        )}

        {campamento.images && campamento.images.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              Imágenes
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {campamento.images.map((url, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedImage(url)}
                >
                  <img
                    src={getThumbnailUrl(url)}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg hover:opacity-90 transition-opacity"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x300?text=Imagen+no+disponible";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="shrink-0">
              <Church className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Organizador</p>
              <p className="text-slate-900">{campamento.church.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="shrink-0">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Fechas</p>
              <p className="text-slate-900">
                {formatDateRange(startDate, endDate)}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Duración: {getDuration(startDate, endDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="shrink-0">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Precio</p>
              <p className="text-2xl font-bold text-slate-900">
                ${campamento.price.toLocaleString("es-AR")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 mb-6">
          <div className="shrink-0">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500">Ubicación</p>
            <p className="text-slate-900">{campamento.location}</p>
          </div>
        </div>
        <div className="-mx-8 px-8 mb-8">
          <LocationMap address={campamento.location} />
        </div>

        {onInscribirse && (
          <div className="mt-8">
            {isAlreadyInscribed ? (
              <button
                onClick={() => (window.location.href = "/inscripciones")}
                className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck className="h-5 w-5" />
                Ya estás inscripto
              </button>
            ) : (
              <button
                onClick={onInscribirse}
                disabled={isPast || isOngoing}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isPast
                  ? "Campamento finalizado"
                  : isOngoing
                    ? "Campamento en curso"
                    : "Inscribirse ahora"}
              </button>
            )}
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-8 w-8" />
          </button>

          <img
            src={getLargeUrl(selectedImage)}
            alt="Imagen ampliada"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <a
            href={getLargeUrl(selectedImage)}
            download={`campamento-${campamento.id}-imagen`}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="h-5 w-5" />
            Descargar imagen
          </a>
        </div>
      )}
    </div>
  );
}
