import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MetadataService } from './metadata.service';
import { MetadataController } from './metadata.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MetadataController],
  providers: [MetadataService],
  exports: [MetadataService],
})
export class MetadataModule {}
