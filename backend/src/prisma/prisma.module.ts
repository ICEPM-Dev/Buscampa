/**
 * Módulo de Prisma que proporciona el servicio de base de datos.
 * Hace disponible PrismaService para inyección en otros módulos.
 */
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService], // Proporciona el servicio
  exports: [PrismaService], // Exporta para uso en otros módulos
})
export class PrismaModule {}
