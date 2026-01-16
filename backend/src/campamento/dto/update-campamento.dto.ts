import { PartialType } from '@nestjs/mapped-types';
import { CreateCampamentoDto } from './create-campamento.dto.ts';

export class UpdateCampamentoDto extends PartialType(CreateCampamentoDto) {}