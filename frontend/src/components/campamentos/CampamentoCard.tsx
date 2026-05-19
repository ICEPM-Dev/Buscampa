import { MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import type { Campamento } from "../../types";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface CampamentoCardProps {
  campamento: Campamento;
}

export default function CampamentoCard({ campamento }: CampamentoCardProps) {
  const startDate = parseISO(campamento.startDate);
  const endDate = parseISO(campamento.endDate);
  const stripHtml = (html?: string) => html?.replace(/<[^>]*>/g, "");

  const now = new Date();
  const isUpcoming = startDate > now;
  const isOngoing = startDate <= now && endDate >= now;
  const isPast = endDate < now;

  const formatDateRange = (start: Date, end: Date) =>
    `${format(start, "dd MMM", { locale: es })} — ${format(end, "dd MMM yyyy", { locale: es })}`;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5">
      {/* Thumbnail / color band */}
      {campamento.images && campamento.images.length > 0 ? (
        <div className="relative h-40 overflow-hidden bg-slate-100">
          <img
            src={campamento.images[0]}
            alt={campamento.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
          {/* Status badge on top of image */}
          <div className="absolute top-3 left-3">
            {isUpcoming && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-500 text-white shadow-sm">
                Próximo
              </span>
            )}
            {isOngoing && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500 text-white shadow-sm">
                En curso
              </span>
            )}
            {isPast && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-500 text-white shadow-sm">
                Finalizado
              </span>
            )}
          </div>
        </div>
      ) : (
        /* No image: thin color accent bar + inline badge */
        <div className="h-1.5 bg-linear-to-r from-blue-500 to-blue-600" />
      )}

      <div className="p-5 flex-1 flex flex-col">
        {/* Badge when no image */}
        {!(campamento.images && campamento.images.length > 0) && (
          <div className="mb-3">
            {isUpcoming && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-700">
                Próximo
              </span>
            )}
            {isOngoing && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700">
                En curso
              </span>
            )}
            {isPast && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-500">
                Finalizado
              </span>
            )}
          </div>
        )}

        <h3 className="text-base font-bold text-slate-900 mb-1.5 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
          {campamento.name}
        </h3>

        {campamento.description && (
          <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed flex-1">
            {stripHtml(campamento.description) || "Sin descripción"}
          </p>
        )}

        <div className="space-y-2 mt-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span>{formatDateRange(startDate, endDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span className="truncate">{campamento.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Users className="h-3.5 w-3.5 text-blue-500 shrink-0" />
              <span className="truncate">{campamento.church.name}</span>
            </div>
            <span className="text-sm font-bold text-slate-900">
              ${campamento.price.toLocaleString("es-AR")}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/70">
        <Link
          to={`/campamentos/${campamento.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group/link"
        >
          Ver detalles
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
