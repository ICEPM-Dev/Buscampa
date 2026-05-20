import {
  Controller,
  Get,
  Param,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { MetadataService } from './metadata.service';

/**
 * Controller para servir metadata de campamentos a bots de redes sociales.
 * Sirve HTML con metadatos inyectados en rutas específicas de compartir.
 */
@Controller()
export class MetadataController {
  constructor(private metadataService: MetadataService) {}

  /**
   * GET /c/:id
   * Ruta corta para compartir campamentos
   */
  @Get('c/:id')
  async shareCampamentoViaShortLink(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    return this.handleMetadataRequest(id, res);
  }

  /**
   * GET /share/campamento/:id
   * Ruta para compartir campamentos en redes sociales
   */
  @Get('share/campamento/:id')
  async shareCampamento(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    return this.handleMetadataRequest(id, res);
  }

  private async handleMetadataRequest(
    id: string,
    res: Response,
  ): Promise<void> {
    try {
      const campamentoId = parseInt(id, 10);
      if (isNaN(campamentoId)) {
        throw new BadRequestException('ID de campamento inválido');
      }

      const metadata =
        await this.metadataService.getCampamentoMetadata(campamentoId);
      const html = this.metadataService.generateHTMLWithMetadata(metadata);

      res.type('text/html').send(html);
    } catch (error) {
      console.error('Error en shareCampamento:', error);
      // Devolver metadatos por defecto en caso de error
      const metadata = this.metadataService.getDefaultMetadata();
      const html = this.metadataService.generateHTMLWithMetadata(metadata);
      res.type('text/html').send(html);
    }
  }
}
