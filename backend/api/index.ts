// backend/api/index.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { RequestMethod } from '@nestjs/common';
import express from 'express';

const server = express();

// Redirigir /campamentos/:id a /share/campamento/:id para asegurar que la ruta
// de Open Graph sea servida correctamente por el backend en plataformas
// donde las rutas pueden llegar a este handler (ej. Vercel).
server.get('/campamentos/:id', (req, res) => {
  const { id } = req.params;
  return res.redirect(302, `/share/campamento/${id}`);
});

export const createNestServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'robots.txt', method: RequestMethod.GET },
      { path: 'sitemap.xml', method: RequestMethod.GET },
      { path: 'c/*', method: RequestMethod.ALL },
      { path: 'campamentos/*', method: RequestMethod.ALL },
      { path: 'share/campamento/*', method: RequestMethod.ALL },
    ],
  });
  app.enableCors();

  await app.init();
  return app;
};

let isInitialized = false;

export default async function handler(req: any, res: any) {
  if (!isInitialized) {
    await createNestServer(server);
    isInitialized = true;
  }
  server(req, res);
}
