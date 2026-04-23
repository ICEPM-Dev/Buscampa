import { Module } from '@nestjs/common';
import { SitemapController } from './sitemap.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [SitemapController],
  imports: [PrismaModule],
})
export class SitemapModule {}