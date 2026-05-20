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
  Clock,
} from "lucide-react";
import type { Campamento } from "../../types";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useState, useEffect } from "react";
import RichTextDisplay from "../ui/RichTextDisplay";
import LocationMap from "../ui/LocationMap";
import ShareCampamento from "./ShareCampamento";
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
  const [showShare, setShowShare] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const isUpcoming = startDate > now;
  const isPast = endDate < now;
  const isOngoing = startDate <= now && endDate >= now;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedImage || downloading) return;
    setDownloading(true);
    fetch(selectedImage)
      .then((r) => r.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `campamento-${campamento.id}-imagen.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch(console.error)
      .finally(() => setDownloading(false));
  };

  useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  const handleCopyLink = () => {
    setShowShare(true);
  };

  const formatDateRange = (start: Date, end: Date) => {
    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      return `${start.getDate()} al ${end.getDate()} de ${format(end, "MMMM", { locale: es })}, ${end.getFullYear()}`;
    }
    return `${format(start, "dd MMM", { locale: es })} — ${format(end, "dd MMM yyyy", { locale: es })}`;
  };

  const getDuration = (start: Date, end: Date) => {
    const days = Math.ceil(
      Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return `${days} día${days > 1 ? "s" : ""}`;
  };

  const statusBadge = isUpcoming
    ? {
        label: "Próximamente",
        bg: "bg-green-100 text-green-700 border-green-200",
      }
    : isOngoing
      ? {
          label: "En curso",
          bg: "bg-amber-100 text-amber-700 border-amber-200",
        }
      : {
          label: "Finalizado",
          bg: "bg-slate-100 text-slate-500 border-slate-200",
        };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* ── HEADER ── */}
      <div className="relative bg-linear-to-br from-blue-700 to-blue-900 text-white">
        {/* Noise overlay for depth */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative px-6 pt-5 pb-7 sm:px-8 sm:pt-6 sm:pb-8">
          {/* Nav row */}
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/campamentos"
              className="inline-flex items-center gap-1.5 text-sm text-blue-200 hover:text-white transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Campamentos
            </Link>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-sm text-blue-200 hover:text-white transition-colors font-medium px-3 py-1.5 rounded-lg hover:bg-white/10"
            >
              <Share2 className="h-4 w-4" />
              {copied ? "¡Copiado!" : "Compartir"}
            </button>
          </div>

          {/* Status + title */}
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border mb-3 ${statusBadge.bg}`}
          >
            {statusBadge.label}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            {campamento.name}
          </h1>
          <p className="mt-1.5 text-sm text-blue-200">
            {campamento.church.name}
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* ── INFO CHIPS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Church */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-100">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <Church className="h-4.5 w-4.5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium">Organizador</p>
              <p className="text-sm font-semibold text-slate-900 truncate">
                {campamento.church.name}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-100">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <Calendar className="h-4.5 w-4.5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-medium">Fechas</p>
              <p className="text-sm font-semibold text-slate-900">
                {formatDateRange(startDate, endDate)}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock className="h-3 w-3" /> {getDuration(startDate, endDate)}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-100">
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
              <DollarSign className="h-4.5 w-4.5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Precio</p>
              <p className="text-xl font-bold text-slate-900">
                ${campamento.price.toLocaleString("es-AR")}
              </p>
            </div>
          </div>
        </div>

        {/* ── DESCRIPTION ── */}
        {campamento.description && (
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3">
              Descripción
            </h2>
            <div className="text-slate-600 leading-relaxed">
              <RichTextDisplay html={campamento.description} />
            </div>
          </div>
        )}

        {/* Share UI is shown when user clicks the header share button */}

        {/* ── IMAGES ── */}
        {campamento.images && campamento.images.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3">
              Imágenes
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {campamento.images.map((url, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer rounded-xl overflow-hidden bg-slate-100 aspect-square"
                  onClick={() => setSelectedImage(url)}
                >
                  <img
                    src={getThumbnailUrl(url)}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x300?text=No+disponible";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LOCATION ── */}
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-3">Ubicación</h2>
          <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
            <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
            {campamento.location}
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-200">
            <LocationMap address={campamento.location} />
          </div>
        </div>

        {/* ── CTA ── */}
        {onInscribirse && (
          <div className="pt-2">
            {isAlreadyInscribed ? (
              <button
                onClick={() => (window.location.href = "/inscripciones")}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm shadow-green-200"
              >
                <UserCheck className="h-5 w-5" />
                Ya estás inscripto — ver mis inscripciones
              </button>
            ) : (
              <button
                onClick={onInscribirse}
                disabled={isPast || isOngoing}
                className="w-full py-3.5 rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:cursor-not-allowed
                  bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200
                  disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
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

      {/* ── LIGHTBOX ── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-9999 bg-black/92 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors disabled:opacity-50"
              title="Descargar imagen"
            >
              <Download
                className={`h-5 w-5 ${downloading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              title="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <img
            src={getLargeUrl(selectedImage)}
            alt="Imagen ampliada"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ touchAction: "pan-y pinch-zoom" }}
          />
        </div>
      )}

      {/* ── SHARE MODAL ── */}
      {showShare && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowShare(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Compartir campamento</h3>
              <button
                onClick={() => setShowShare(false)}
                className="p-2 rounded-full hover:bg-slate-100"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ShareCampamento campamento={campamento} />
          </div>
        </div>
      )}
    </div>
  );
}
