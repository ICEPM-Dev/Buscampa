/**
 * Módulo para la gestión de campamentos.
 * Proporciona funcionalidades para crear, listar, actualizar y gestionar campamentos.
 * Depende de Prisma para BD y del módulo de inscripciones.
 */
import { Module } from '@nestjs/common';
import { CampamentoService } from './campamento.service';
import { CampamentoController } from './campamento.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { InscriptionModule } from '../../src/inscription/inscription.module';

@Module({
  imports: [PrismaModule, InscriptionModule], // Dependencias necesarias
  controllers: [CampamentoController], // Controlador de campamentos
  providers: [CampamentoService], // Servicio de lógica de negocio
})
export class CampamentoModule {}
