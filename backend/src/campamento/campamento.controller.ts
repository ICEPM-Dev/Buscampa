/**
 * Controlador para la gestión de campamentos.
 * Proporciona endpoints CRUD para campamentos y gestión de inscripciones.
 * Todas las rutas están protegidas por autenticación JWT.
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CampamentoService } from './campamento.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';
import { CreateCampamentoDto } from './dto/create-campamento.dto.ts';
import { UpdateCampamentoDto } from './dto/update-campamento.dto';
import { InscriptionService } from '../inscription/inscription.service';
import { CreateInscriptionDto } from '../inscription/dto/create-inscription.dto';

@Controller('campamentos')
export class CampamentoController {
  /**
   * Constructor que inyecta los servicios necesarios
   */
  constructor(
    private readonly campamentoService: CampamentoService,
    private readonly inscriptionService: InscriptionService,
  ) {}

  /**
   * GET /campamentos
   * Obtiene todos los campamentos públicos (para usuarios no autenticados)
   */
  @Get('public')
  findAllPublic() {
    return this.campamentoService.findAllPublic();
  }

  /**
   * GET /campamentos
   * Obtiene todos los campamentos de la iglesia del usuario autenticado
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@GetUser() user: any) {
    return this.campamentoService.findAll(user.churchId);
  }

  /**
   * POST /campamentos
   * Crea un nuevo campamento para la iglesia del usuario (REQUIERE AUTH)
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateCampamentoDto, @GetUser() user: any) {
    return this.campamentoService.create(dto, user.id);
  }

  /**
   * PUT /campamentos/:id
   * Actualiza un campamento existente (solo iglesia propietaria) (REQUIERE AUTH)
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCampamentoDto,
    @GetUser() user: any,
  ) {
    return this.campamentoService.update(Number(id), dto, user.id);
  }

  /**
   * DELETE /campamentos/:id
   * Elimina un campamento (solo iglesia propietaria) (REQUIERE AUTH)
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.campamentoService.remove(Number(id), user.id);
  }

  /**
   * POST /campamentos/:id/inscribirse
   * Crea una nueva inscripción para el campamento (REQUIERE AUTH)
   */
  @Post(':id/inscribirse')
  @UseGuards(JwtAuthGuard)
  async inscribe(
    @Param('id') id: string,
    @Body() dto: CreateInscriptionDto,
    @GetUser() user: any,
  ) {
    return this.inscriptionService.create(dto, user.id, Number(id));
  }

  /**
   * GET /campamentos/:id/inscripciones
   * Obtiene todas las inscripciones de un campamento (REQUIERE AUTH)
   */
  @Get(':id/inscripciones')
  @UseGuards(JwtAuthGuard)
  async findByCampamento(@Param('id') id: string) {
    return this.inscriptionService.findByCampamento(Number(id));
  }

  @Get('c/:id')
  async campamentoOg(@Param('id') id: string, @Res() res: Response) {
    try {
      const campamento = await this.campamentoService.findOne(parseInt(id));
      const description = campamento.description
        ? campamento.description.replace(/<[^>]*>/g, '').slice(0, 200)
        : `${campamento.church.name} - ${campamento.location}`;

      const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${campamento.name} - Buscampa</title>
  <meta property="og:title" content="${campamento.name}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="https://www.buscampa.com.ar/og-image.png" />
  <meta property="og:url" content="https://www.buscampa.com.ar/c/${id}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Buscampa" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${campamento.name}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="https://www.buscampa.com.ar/og-image.png" />
  <meta http-equiv="refresh" content="0;url=https://www.buscampa.com.ar/campamentos/${id}" />
</head>
<body>Redirigiendo...</body>
</html>`;
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch {
      res.redirect('https://www.buscampa.com.ar');
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campamentoService.findOne(Number(id));
  }
}
