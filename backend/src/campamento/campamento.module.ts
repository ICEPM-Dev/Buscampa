import { Module } from '@nestjs/common';
import { CampamentoService } from './campamento.service';
import { CampamentoController } from './campamento.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { InscriptionModule } from 'src/inscription/inscription.module';

@Module({
  imports: [PrismaModule, InscriptionModule],
  controllers: [CampamentoController],
  providers: [CampamentoService],
})
export class CampamentoModule {}
