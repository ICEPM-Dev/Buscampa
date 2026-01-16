import { Controller, Get, UseGuards } from '@nestjs/common';
import { InscriptionService } from './inscription.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';

@Controller('inscription')
@UseGuards(JwtAuthGuard)
export class InscriptionController {
  constructor(private readonly inscriptionService: InscriptionService) {}

  @Get('me')
  findMyInscriptions(@GetUser() user: any) {
    return this.inscriptionService.findByUser(user.id);
  }
}
