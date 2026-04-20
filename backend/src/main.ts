/**
 * Punto de entrada principal de la aplicación backend.
 * Configura y inicia el servidor NestJS con CORS habilitado.
 * Escucha en el puerto definido en la variable de entorno PORT o 3000 por defecto.
 */
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';

async function bootstrap() {
  // Crea la instancia de la aplicación NestJS usando el módulo raíz
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  
  // Habilita CORS para permitir solicitudes desde el frontend
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Configuración de sesiones para OAuth (Twitter requiere sesiones)
  app.use(session({
    secret: process.env.SESSION_SECRET || 'session-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    }
  }));
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
