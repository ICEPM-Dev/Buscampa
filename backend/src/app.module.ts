/**
 * Módulo raíz de la aplicación NestJS.
 * Este módulo importa y configura todos los módulos principales de la aplicación:
 * - AuthModule: Maneja la autenticación y autorización de usuarios e iglesias
 * - CampamentoModule: Gestiona las operaciones relacionadas con campamentos
 * - InscriptionModule: Maneja las inscripciones a campamentos
 */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CampamentoModule } from './campamento/campamento.module';
import { InscriptionModule } from './inscription/inscription.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { GeocodeController } from './geocode/geocode.controller';
import { UploadModule } from './upload/upload.module';
import { MetadataModule } from './metadata/metadata.module';
import { BotDetectorMiddleware } from './middleware/bot-detector.middleware';

@Module({
  imports: [AuthModule, CampamentoModule, InscriptionModule, SitemapModule, UploadModule, MetadataModule],
  controllers: [GeocodeController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BotDetectorMiddleware).forRoutes('*');
  }
}
