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
} from '@nestjs/common';
import { CampamentoService } from './campamento.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';
import { CreateCampamentoDto } from './dto/create-campamento.dto.ts';
import { UpdateCampamentoDto } from './dto/update-campamento.dto';
import { InscriptionService } from '../inscription/inscription.service';
import { CreateInscriptionDto } from '../inscription/dto/create-inscription.dto';

@Controller('campamentos')
@UseGuards(JwtAuthGuard) // Todas las rutas requieren autenticación
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
   * Obtiene todos los campamentos de la iglesia del usuario autenticado
   */
  @Get()
  findAll(@GetUser() user: any) {
    return this.campamentoService.findAll(user.churchId);
  }

  /**
   * GET /campamentos/:id
   * Obtiene un campamento específico por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campamentoService.findOne(Number(id));
  }

  /**
   * POST /campamentos
   * Crea un nuevo campamento para la iglesia del usuario
   */
  @Post()
  create(@Body() dto: CreateCampamentoDto, @GetUser() user: any) {
    return this.campamentoService.create(dto, user.id);
  }

  /**
   * PUT /campamentos/:id
   * Actualiza un campamento existente (solo iglesia propietaria)
   */
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCampamentoDto,
    @GetUser() user: any,
  ) {
    return this.campamentoService.update(Number(id), dto, user.id);
  }

  /**
   * DELETE /campamentos/:id
   * Elimina un campamento (solo iglesia propietaria)
   */
  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.campamentoService.remove(Number(id), user.id);
  }

  /**
   * POST /campamentos/:id/inscribirse
   * Crea una nueva inscripción para el campamento
   */
  @Post(':id/inscribirse')
  async inscribe(
    @Param('id') id: string,
    @Body() dto: CreateInscriptionDto,
    @GetUser() user: any,
  ) {
    return this.inscriptionService.create(dto, user.id, Number(id));
  }

  /**
   * GET /campamentos/:id/inscripciones
   * Obtiene todas las inscripciones de un campamento
   */
  @Get(':id/inscripciones')
  async findByCampamento(@Param('id') id: string) {
    return this.inscriptionService.findByCampamento(Number(id));
  }
}
