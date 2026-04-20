/**
 * Módulo de autenticación y autorización.
 * Proporciona funcionalidades para registro, login, y protección de rutas usando JWT.
 * Incluye estrategias de Passport para JWT y guards para proteger endpoints.
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAuthGuard } from './guards/auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { XStrategy } from './strategies/x.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(), // Para variables de entorno
    PrismaModule, // Para acceso a la base de datos
    PassportModule, // Para estrategias de autenticación
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Clave secreta para JWT
      signOptions: { expiresIn: '7d' }, // Tokens expiran en 7 días
    }),
  ],
  controllers: [AuthController], // Controlador para endpoints de auth
  providers: [AuthService, JwtAuthGuard, JwtStrategy, GoogleStrategy, FacebookStrategy, XStrategy], // Servicios y estrategias
  exports: [AuthService], // Exporta el servicio para uso en otros módulos
})
export class AuthModule {}
