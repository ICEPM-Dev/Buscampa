import { MapPin, Calendar, DollarSign, Users, ArrowRight } from "lucide-react";
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

  const formatDateRange = (start: Date, end: Date) => {
    return `${format(start, "dd MMM", { locale: es })} - ${format(end, "dd MMM yyyy", { locale: es })}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 overflow-hidden flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {campamento.church.denomination}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-2 line-clamp-2">
          {campamento.name}
        </h3>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
          {campamento.description || "Sin descripción"}
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
            <span className="truncate">{campamento.location}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="h-4 w-4 text-blue-600 shrink-0" />
            <span>{formatDateRange(startDate, endDate)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <DollarSign className="h-4 w-4 text-blue-600 shrink-0" />
            <span className="font-semibold text-slate-900">
              ${campamento.price.toLocaleString("es-AR")}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="h-4 w-4 text-blue-600 shrink-0" />
            <span className="truncate">{campamento.church.name}</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
        <Link
          to={`/campamentos/${campamento.id}`}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Ver detalles
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
