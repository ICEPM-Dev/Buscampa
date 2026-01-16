import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CampamentoModule } from './campamento/campamento.module';
import { InscriptionModule } from './inscription/inscription.module';

@Module({
  imports: [AuthModule, CampamentoModule, InscriptionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
