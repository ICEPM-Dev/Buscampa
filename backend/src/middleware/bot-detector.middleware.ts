import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware que detecta bots de redes sociales y redirecciona a endpoints de compartir.
 * Esto permite que los bots vean los metadatos correctos (OpenGraph) del contenido.
 */
@Injectable()
export class BotDetectorMiddleware implements NestMiddleware {
  // User-Agents de bots de redes sociales y crawlers
  private botPatterns = [
    'facebookexternalhit', // Facebook
    'twitterbot', // Twitter
    'linkedinbot', // LinkedIn
    'whatsapp', // WhatsApp
    'discord', // Discord
    'slack', // Slack
    'telegrambot', // Telegram
    'viber', // Viber
    'pinterest', // Pinterest
    'googlebot', // Google Bot
    'bingbot', // Bing Bot
    'slurp', // Yahoo Bot
    'duckduckbot', // DuckDuckGo
    'baiduspider', // Baidu
    'yandexbot', // Yandex
    'facebot', // Facebook
    'ogp.me', // OGP crawler
    'curl', // cURL (for local testing)
  ];

  use(req: Request, res: Response, next: NextFunction) {
    const userAgent = req.get('user-agent')?.toLowerCase() || '';

    // Verificar si es un bot
    const isBot = this.botPatterns.some((pattern) =>
      userAgent.includes(pattern),
    );

    if (isBot) {
      // Detectar si es una solicitud a una página de campamento
      const campamentoMatch = req.url.match(/\/campamentos\/(\d+)(?:\/|$|\?)/);

      if (campamentoMatch) {
        const campamentoId = campamentoMatch[1];
        // Redirigir al endpoint de share
        return res.redirect(`/share/campamento/${campamentoId}`);
      }
    }

    next();
  }
}
