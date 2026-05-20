import { useState } from "react";
import {
  shareOnWhatsApp,
  shareOnFacebook,
  copyShareUrl,
} from "../../utils/shareUtils";
import { Facebook, Clipboard, Phone } from "lucide-react";

interface ShareCampamentoProps {
  campamento: {
    id: number;
    name: string;
    location?: string;
    church?: { name?: string };
    price?: number;
    images?: string[];
  };
  onClose?: () => void;
}

export default function ShareCampamento({
  campamento,
  onClose,
}: ShareCampamentoProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const success = await copyShareUrl(campamento.id);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onClose) onClose();
    }
  };

  const handleWhatsApp = () => {
    window.open(
      shareOnWhatsApp({
        id: campamento.id,
        name: campamento.name,
        location: campamento.location ?? "",
        church: campamento.church?.name ?? "",
        price: campamento.price ?? 0,
      }),
      "_blank",
    );
    if (onClose) onClose();
  };

  const handleFacebook = () => {
    window.open(
      shareOnFacebook({
        id: campamento.id,
        name: campamento.name,
        location: campamento.location ?? "",
        church: campamento.church?.name ?? "",
        price: campamento.price ?? 0,
      }),
      "_blank",
    );
    if (onClose) onClose();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleWhatsApp}
          className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-medium text-sm whitespace-nowrap min-h-10"
          title="Compartir en WhatsApp"
        >
          {/* WhatsApp SVG */}
          <Phone className="w-4 h-4 shrink-0" />
          <span className="truncate">WhatsApp</span>
        </button>

        <button
          onClick={handleFacebook}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm whitespace-nowrap min-h-10"
          title="Compartir en Facebook"
        >
          <Facebook className="w-4 h-4 shrink-0" />
          <span className="truncate">Facebook</span>
        </button>
      </div>

      <button
        onClick={handleCopyLink}
        className={`w-full px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium ${
          copied
            ? "bg-green-500 text-white"
            : "bg-slate-200 text-slate-900 hover:bg-slate-300"
        }`}
      >
        <Clipboard className="w-5 h-5" />
        {copied ? "¡Copiado!" : "Copiar enlace"}
      </button>
    </div>
  );
}
