import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CampamentoService } from './campamento.service';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { GetUser } from '../auth/decorators/user.decorator';
import { CreateCampamentoDto } from './dto/create-campamento.dto.ts';
import { UpdateCampamentoDto } from './dto/update-campamento.dto';
import { InscriptionService } from '../inscription/inscription.service';
import { CreateInscriptionDto } from '../inscription/dto/create-inscription.dto';

@Controller('campamentos')
@UseGuards(JwtAuthGuard)
export class CampamentoController {
  constructor(
    private readonly campamentoService: CampamentoService,
    private readonly inscriptionService: InscriptionService,
  ) {}

  @Get()
  findAll(@GetUser() user: any) {
    return this.campamentoService.findAll(user.churchId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campamentoService.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateCampamentoDto, @GetUser() user: any) {
    return this.campamentoService.create(dto, user.id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCampamentoDto,
    @GetUser() user: any,
  ) {
    return this.campamentoService.update(Number(id), dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.campamentoService.remove(Number(id), user.id);
  }

  @Post(':id/inscribirse')
  async inscribe(
    @Param('id') id: string,
    @Body() dto: CreateInscriptionDto,
    @GetUser() user: any,
  ) {
    return this.inscriptionService.create(dto, user.id, Number(id));
  }

  @Get(':id/inscripciones')
  async findByCampamento(@Param('id') id: string) {
    return this.inscriptionService.findByCampamento(Number(id));
  }
}
