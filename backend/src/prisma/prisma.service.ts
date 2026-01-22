/**
 * Servicio de Prisma que gestiona la conexión a la base de datos.
 * Extiende PrismaClient y establece la conexión al inicializar el módulo.
 */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * Método llamado al inicializar el módulo.
   * Establece la conexión con la base de datos.
   */
  async onModuleInit() {
    await this.$connect();
  }
}
