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
 * Detecta si la solicitud es de un bot y sirve HTML con metadatos inyectados.
 */
@Controller()
export class MetadataController {
  constructor(private metadataService: MetadataService) {}

  /**
   * Endpoint para compartir campamentos en redes sociales
   * GET /campamentos/:id
   * GET /c/:id
   * GET /share/campamento/:id
   * Devuelve HTML con metadatos del campamento inyectados
   */
  @Get('campamentos/:id')
  @Get('c/:id')
  @Get('share/campamento/:id')
  async shareCampamento(
    @Param('id') id: string,
    @Res() res: Response,
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
