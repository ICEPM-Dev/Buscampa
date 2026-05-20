import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface MetadataDTO {
  title: string;
  description: string;
  image: string;
  url: string;
  type: string;
}

@Injectable()
export class MetadataService {
  constructor(private prisma: PrismaService) {}

  /**
   * Obtiene los metadatos de un campamento específico
   * @param campamentoId ID del campamento
   * @returns Objeto con metadatos del campamento
   */
  async getCampamentoMetadata(campamentoId: number): Promise<MetadataDTO> {
    const campamento = await this.prisma.campamento.findUnique({
      where: { id: campamentoId },
      include: {
        church: true,
      },
    });

    if (!campamento) {
      return this.getDefaultMetadata();
    }

    const baseUrl = process.env.FRONTEND_URL || 'https://buscampa.com.ar';
    const image =
      campamento.images && campamento.images.length > 0
        ? campamento.images[0]
        : `${baseUrl}/og-image.png`;

    // Formatar fechas
    const startDate = new Date(campamento.startDate).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
    });
    const endDate = new Date(campamento.endDate).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const title = `${campamento.name} - ${campamento.location}`;
    const description = `${campamento.church.name} organiza este campamento en ${campamento.location}. ${startDate} - ${endDate}. Precio: $${campamento.price.toLocaleString('es-AR')}. ¡Inscríbete ahora en Buscampa!`;

    return {
      title,
      description,
      image,
      url: `${baseUrl}/campamentos/${campamento.id}`,
      type: 'article',
    };
  }

  /**
   * Obtiene metadatos por defecto
   */
  getDefaultMetadata(): MetadataDTO {
    const baseUrl = process.env.FRONTEND_URL || 'https://buscampa.com.ar';
    return {
      title: 'Buscampa - Aventura con Propósito',
      description:
        'Encuentra y participa en campamentos cristianos. Conecta con iglesias, inscríbete fácilmente y vive experiencias de fe y comunidad.',
      image: `${baseUrl}/og-image.png`,
      url: baseUrl,
      type: 'website',
    };
  }

  /**
   * Genera HTML con metadatos inyectados para bots
   * @param metadata Metadatos a inyectar
   * @returns HTML como string
   */
  generateHTMLWithMetadata(metadata: MetadataDTO): string {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>${this.escapeHtml(metadata.title)}</title>
    <meta name="title" content="${this.escapeHtml(metadata.title)}">
    <meta name="description" content="${this.escapeHtml(metadata.description)}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${metadata.type}">
    <meta property="og:url" content="${metadata.url}">
    <meta property="og:title" content="${this.escapeHtml(metadata.title)}">
    <meta property="og:description" content="${this.escapeHtml(metadata.description)}">
    <meta property="og:image" content="${metadata.image}">
    <meta property="og:site_name" content="Buscampa">
    <meta property="og:locale" content="es_AR">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${metadata.url}">
    <meta name="twitter:title" content="${this.escapeHtml(metadata.title)}">
    <meta name="twitter:description" content="${this.escapeHtml(metadata.description)}">
    <meta name="twitter:image" content="${metadata.image}">
    
    <!-- Canonical -->
    <link rel="canonical" href="${metadata.url}">
    
    <!-- Redirect to actual page -->
    <script>
        window.location.href = "${metadata.url}";
    </script>
</head>
<body>
    <p>Redirigiendo a <a href="${metadata.url}">${this.escapeHtml(metadata.title)}</a>...</p>
</body>
</html>`;
  }

  /**
   * Escapa caracteres especiales HTML
   */
  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
  }
}
