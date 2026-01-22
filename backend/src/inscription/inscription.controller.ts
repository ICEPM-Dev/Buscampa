/**
 * Controlador para consultas de inscripciones del usuario autenticado.
 * Proporciona endpoints para obtener las inscripciones personales.
 */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { InscriptionService } from './inscription.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';

@Controller('inscription')
@UseGuards(JwtAuthGuard) // Requiere autenticación
export class InscriptionController {
  /**
   * Constructor que inyecta el servicio de inscripciones
   */
  constructor(private readonly inscriptionService: InscriptionService) {}

  /**
   * GET /inscription/me
   * Obtiene todas las inscripciones del usuario autenticado
   */
  @Get('me')
  findMyInscriptions(@GetUser() user: any) {
    return this.inscriptionService.findByUser(user.id);
  }
}
