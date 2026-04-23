import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class SitemapController {
  constructor(private prisma: PrismaService) {}

  @Get('robots.txt')
  getRobots(@Res() res: Response) {
    const baseUrl = process.env.FRONTEND_URL || 'https://buscampa.com.ar';
    
    const robots = `# Robots.txt para Buscampa
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /profile
Disallow: /inscripciones

Sitemap: ${baseUrl}/api/sitemap.xml`;

    res.setHeader('Content-Type', 'text/plain');
    res.send(robots);
  }

  @Get('sitemap.xml')
  async getSitemap(@Res() res: Response) {
    const baseUrl = process.env.FRONTEND_URL || 'https://buscampa.com.ar';
    
    const campamentos = await this.prisma.campamento.findMany({
      where: {
        startDate: {
          gte: new Date(),
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const urls = [
      {
        loc: baseUrl,
        lastmod: new Date().toISOString().split('T')[0],
        priority: '1.0',
        changefreq: 'weekly',
      },
      {
        loc: `${baseUrl}/campamentos`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: '0.9',
        changefreq: 'daily',
      },
      {
        loc: `${baseUrl}/auth`,
        lastmod: new Date().toISOString().split('T')[0],
        priority: '0.8',
        changefreq: 'monthly',
      },
      {
        loc: `${baseUrl}/terms-conditions`,
        lastmod: '2026-04-21',
        priority: '0.3',
        changefreq: 'yearly',
      },
      {
        loc: `${baseUrl}/privacy-policy`,
        lastmod: '2026-04-21',
        priority: '0.3',
        changefreq: 'yearly',
      },
    ];

    for (const camp of campamentos) {
      urls.push({
        loc: `${baseUrl}/c/${camp.id}`,
        lastmod: camp.createdAt.toISOString().split('T')[0],
        priority: '0.7',
        changefreq: 'weekly',
      });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(xml);
  }
}
