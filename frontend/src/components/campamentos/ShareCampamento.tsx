import { useState, useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";
import logo from "../../assets/logo.svg";
import {
  shareOnWhatsApp,
  shareOnFacebook,
  copyShareUrl,
  getCampamentoShareUrl,
} from "../../utils/shareUtils";
import { Facebook, Clipboard, Link, Download, QrCode } from "lucide-react";

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

const QR_SIZE = 280;
const LOGO_SIZE = 85;
const LOGO_PADDING = 0;
const LOGO_RADIUS = 12;

export default function ShareCampamento({
  campamento,
  onClose,
}: ShareCampamentoProps) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const shareUrl = getCampamentoShareUrl(campamento.id);

  /** Dibuja el QR + logo en el canvas y devuelve el dataURL */
  const buildQrCanvas = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) return reject("No canvas");

      canvas.width = QR_SIZE;
      canvas.height = QR_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No ctx");

      // 1. Generar QR como dataURL
      QRCode.toDataURL(shareUrl, {
        width: QR_SIZE,
        margin: 2,
        color: { dark: "#0f172a", light: "#ffffff" },
        errorCorrectionLevel: "H", // nivel alto para tolerar el logo encima
      })
        .then((qrDataUrl) => {
          const qrImg = new Image();
          qrImg.onload = () => {
            // 2. Dibujar QR
            ctx.drawImage(qrImg, 0, 0, QR_SIZE, QR_SIZE);

            // 3. Cargar logo SVG
            const logoImg = new Image();
            logoImg.onload = () => {
              const x = (QR_SIZE - LOGO_SIZE) / 2;
              const y = (QR_SIZE - LOGO_SIZE) / 2;
              const boxSize = LOGO_SIZE + LOGO_PADDING * 2;
              const boxX = x - LOGO_PADDING;
              const boxY = y - LOGO_PADDING;

              // Fondo blanco redondeado detrás del logo
              ctx.beginPath();
              ctx.roundRect(boxX, boxY, boxSize, boxSize, LOGO_RADIUS + 2);
              ctx.fillStyle = "#ffffff";
              ctx.fill();

              // Dibujar logo
              const padding = 10;
              ctx.drawImage(
                logoImg,
                x + padding,
                y + padding,
                LOGO_SIZE - padding * 2,
                LOGO_SIZE - padding * 2,
              );

              const dataUrl = canvas.toDataURL("image/png");
              resolve(dataUrl);
            };
            logoImg.onerror = reject;
            // Forzar carga cross-origin del SVG como imagen
            logoImg.src = logo;
          };
          qrImg.onerror = reject;
          qrImg.src = qrDataUrl;
        })
        .catch(reject);
    });
  }, [shareUrl]);

  // Generar preview cuando se muestra la pestaña QR
  useEffect(() => {
    if (!showQr) return;
    setPreviewUrl("");
    buildQrCanvas()
      .then((url) => setPreviewUrl(url))
      .catch(console.error);
  }, [showQr, buildQrCanvas]);

  const handleDownloadQr = async () => {
    try {
      const url = await buildQrCanvas();
      const a = document.createElement("a");
      a.href = url;
      a.download = `buscampa-campamento-${campamento.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error("Error generando QR:", e);
    }
  };

  const handleCopyLink = async () => {
    const success = await copyShareUrl(campamento.id);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
      {/* Toggle tabs */}
      <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-1 gap-1">
        <button
          onClick={() => setShowQr(false)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
            !showQr
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Link className="w-4 h-4" />
          Compartir
        </button>
        <button
          onClick={() => setShowQr(true)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
            showQr
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <QrCode className="w-4 h-4" />
          Código QR
        </button>
      </div>

      {!showQr ? (
        /* ── Compartir en redes ── */
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleWhatsApp}
              className="px-3 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 active:scale-95 transition-all flex items-center justify-center gap-2 font-semibold text-sm"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-current shrink-0"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </button>
            <button
              onClick={handleFacebook}
              className="px-3 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 font-semibold text-sm"
            >
              <Facebook className="w-4 h-4 shrink-0" />
              Facebook
            </button>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
            <span className="text-xs text-slate-500 truncate flex-1 font-mono">
              {shareUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Clipboard className="w-3.5 h-3.5" />
              {copied ? "¡Copiado!" : "Copiar"}
            </button>
          </div>
        </div>
      ) : (
        /* ── Código QR ── */
        <div className="flex flex-col items-center gap-4">
          {/* Preview */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="QR del campamento"
                className="block rounded-lg"
              />
            ) : (
              <div className="w-52 h-52 bg-slate-100 rounded-lg flex items-center justify-center animate-pulse">
                <QrCode className="w-10 h-10 text-slate-300" />
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800">
              {campamento.name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Escaneá para ver el campamento
            </p>
          </div>

          <button
            onClick={handleDownloadQr}
            disabled={!previewUrl}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Descargar QR
          </button>
        </div>
      )}

      {/* Canvas oculto donde se compone el QR + logo */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
