/**
 * Módulo para la gestión de inscripciones a campamentos.
 * Maneja la creación y consulta de inscripciones de usuarios a campamentos.
 */
import { Module } from '@nestjs/common';
import { InscriptionService } from './inscription.service';
import { InscriptionController } from './inscription.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Para acceso a base de datos
  controllers: [InscriptionController], // Controlador de inscripciones
  providers: [InscriptionService], // Servicio de lógica de negocio
  exports: [InscriptionService], // Exportado para uso en otros módulos
})
export class InscriptionModule {}
