/**
 * Módulo raíz de la aplicación NestJS.
 * Este módulo importa y configura todos los módulos principales de la aplicación:
 * - AuthModule: Maneja la autenticación y autorización de usuarios e iglesias
 * - CampamentoModule: Gestiona las operaciones relacionadas con campamentos
 * - InscriptionModule: Maneja las inscripciones a campamentos
 */
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CampamentoModule } from './campamento/campamento.module';
import { InscriptionModule } from './inscription/inscription.module';

@Module({
  imports: [AuthModule, CampamentoModule, InscriptionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
