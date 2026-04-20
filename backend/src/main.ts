/**
 * Punto de entrada principal de la aplicación backend.
 * Configura y inicia el servidor NestJS con CORS habilitado.
 * Escucha en el puerto definido en la variable de entorno PORT o 3000 por defecto.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';

async function bootstrap() {
  // Crea la instancia de la aplicación NestJS usando el módulo raíz
  const app = await NestFactory.create(AppModule);
  
  // Habilita CORS para permitir solicitudes desde el frontend
  app.enableCors();
  
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
  
  // Inicia el servidor en el puerto especificado
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
