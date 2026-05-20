import { useState } from "react";
import {
  shareOnWhatsApp,
  shareOnFacebook,
  shareOnTwitter,
  shareOnTelegram,
  copyShareUrl,
  useNativeShare,
} from "../../utils/shareUtils";

interface ShareCampamentoProps {
  campamento: {
    id: number;
    name: string;
    location: string;
    church: { name: string };
    price: number;
    images?: string[];
  };
}

export default function ShareCampamento({ campamento }: ShareCampamentoProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const success = await copyShareUrl(campamento.id);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    await useNativeShare({
      id: campamento.id,
      name: campamento.name,
      location: campamento.location,
      church: campamento.church.name,
      price: campamento.price,
      image: campamento.images?.[0],
    });
  };

  const handleWhatsApp = () => {
    window.open(
      shareOnWhatsApp({
        id: campamento.id,
        name: campamento.name,
        location: campamento.location,
        church: campamento.church.name,
        price: campamento.price,
      }),
      "_blank"
    );
  };

  const handleFacebook = () => {
    window.open(
      shareOnFacebook({
        id: campamento.id,
        name: campamento.name,
        location: campamento.location,
        church: campamento.church.name,
        price: campamento.price,
      }),
      "_blank"
    );
  };

  const handleTwitter = () => {
    window.open(
      shareOnTwitter({
        id: campamento.id,
        name: campamento.name,
        location: campamento.location,
        church: campamento.church.name,
        price: campamento.price,
      }),
      "_blank"
    );
  };

  const handleTelegram = () => {
    window.open(
      shareOnTelegram({
        id: campamento.id,
        name: campamento.name,
        location: campamento.location,
        church: campamento.church.name,
        price: campamento.price,
      }),
      "_blank"
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">Compartir</h3>

      {/* Botón de compartir nativo (solo en móviles) */}
      <button
        onClick={handleNativeShare}
        className="hidden sm:hidden lg:hidden w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Compartir
      </button>

      {/* Grid de botones para redes sociales */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleWhatsApp}
          className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
          title="Compartir en WhatsApp"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-9.746 9.798c0 5.441 4.426 9.846 9.846 9.846a9.885 9.885 0 009.846-9.846c0-5.441-4.426-9.846-9.846-9.846" />
          </svg>
          WhatsApp
        </button>

        <button
          onClick={handleFacebook}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
          title="Compartir en Facebook"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </button>

        <button
          onClick={handleTwitter}
          className="px-4 py-3 bg-black text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
          title="Compartir en Twitter"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M23.953 4.57a10 10 0 002.856-10.02 10.058 10.058 0 01-2.997.15 10.408 10.408 0 00-5.993 3.03 6.647 6.647 0 00-.67-.025c-5.335 0-9.678 3.76-9.678 8.4 0 .34.023.68.068 1.015a14.89 14.89 0 01-11.042-5.653c-.51.935-.857 2.006-.857 3.15 0 2.929 1.484 5.5 3.742 7.005-.974-.032-1.897-.329-2.687-.824v.128c0 4.072 2.920 7.478 6.767 8.245a6.71 6.71 0 01-2.556.48c-.616 0-1.224-.058-1.82-.18 1.310 4.015 5.106 6.922 9.630 7.004-2.905 2.275-6.565 3.631-10.551 3.631-.686 0-1.363-.04-2.023-.12 2.953 1.89 6.452 2.990 10.207 2.990 12.249 0 18.93-10.144 18.93-18.93 0-.288-.01-.577-.025-.865 1.305-.995 2.433-2.241 3.325-3.663a10.04 10.04 0 01-2.835.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.177a4.947 4.947 0 00-8.514 4.507 14.025 14.025 0 01-10.175-5.116 4.934 4.934 0 001.525 6.573 4.924 4.924 0 01-2.24-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.068a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
          Twitter
        </button>

        <button
          onClick={handleTelegram}
          className="px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
          title="Compartir en Telegram"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.365-1.337.175-.437-.148-1.33-.514-1.98-.942-.798-.529-1.432-1.493-.666-2.159.38-.34 1.053-.882 2.296-1.755 1.578-1.117 2.084-1.857 2.232-2.489.057-.333-.396-.966-.742-1.554-.168-.29-.368-.705-.须.1-.107.264-.36.845-.518 1.51-.218 1.003-.73 3.298-.839 3.802-.108.504-.235 1.21-.214 1.787.02.577.215 1.198.339 1.487.124.29.258.495.258.495z" />
          </svg>
          Telegram
        </button>
      </div>

      {/* Botón para copiar enlace */}
      <button
        onClick={handleCopyLink}
        className={`w-full px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium ${
          copied
            ? "bg-green-500 text-white"
            : "bg-slate-200 text-slate-900 hover:bg-slate-300"
        }`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {copied ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          )}
        </svg>
        {copied ? "¡Copiado!" : "Copiar enlace"}
      </button>
    </div>
  );
}
