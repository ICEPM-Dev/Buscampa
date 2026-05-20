/**
 * Utilidades para compartir campamentos en redes sociales
 * Genera URLs con metadatos embebidos para que funcionen correctamente en redes sociales
 */

const BASE_URL = "https://buscampa.com.ar";
const SHARE_BASE_URL = `${BASE_URL}/c`;

interface CampamentoShareData {
  id: number;
  name: string;
  location: string;
  church: string;
  price: number;
  image?: string;
}

/**
 * Genera la URL de compartir para un campamento
 * Esta URL usa el endpoint /c/:id del backend para servir metadatos a bots
 */
export function getCampamentoShareUrl(campamentoId: number): string {
  return `${SHARE_BASE_URL}/${campamentoId}`;
}

/**
 * Genera la URL para compartir en WhatsApp
 */
export function shareOnWhatsApp(campamento: CampamentoShareData): string {
  const shareUrl = getCampamentoShareUrl(campamento.id);
  const message = `¡Mira este campamento! ${campamento.name} en ${campamento.location}`;
  return `https://wa.me/?text=${encodeURIComponent(`${message}\n${shareUrl}`)}`;
}

/**
 * Genera la URL para compartir en Facebook
 */
export function shareOnFacebook(campamento: CampamentoShareData): string {
  const shareUrl = getCampamentoShareUrl(campamento.id);
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
}

/**
 * Genera la URL para compartir en Twitter
 */
export function shareOnTwitter(campamento: CampamentoShareData): string {
  const shareUrl = getCampamentoShareUrl(campamento.id);
  const text = `¡Mira este campamento! ${campamento.name} en ${campamento.location} 🏕️`;
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
}

/**
 * Genera la URL para compartir en Telegram
 */
export function shareOnTelegram(campamento: CampamentoShareData): string {
  const shareUrl = getCampamentoShareUrl(campamento.id);
  const text = `${campamento.name} - ${campamento.location}`;
  return `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
}

/**
 * Copia la URL de compartir al portapapeles
 */
export async function copyShareUrl(campamentoId: number): Promise<boolean> {
  try {
    const shareUrl = getCampamentoShareUrl(campamentoId);
    await navigator.clipboard.writeText(shareUrl);
    return true;
  } catch (error) {
    console.error("Error copiando URL:", error);
    return false;
  }
}

/**
 * Utiliza la Web Share API si está disponible (móviles)
 */
export async function useNativeShare(campamento: CampamentoShareData): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }

  try {
    const shareUrl = getCampamentoShareUrl(campamento.id);
    await navigator.share({
      title: campamento.name,
      text: `${campamento.name} en ${campamento.location} - $${campamento.price}`,
      url: shareUrl,
    });
    return true;
  } catch (error) {
    if ((error as Error).name !== "AbortError") {
      console.error("Error compartiendo:", error);
    }
    return false;
  }
}
