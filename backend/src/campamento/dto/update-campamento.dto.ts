/**
 * DTO para la actualización de campamentos.
 * Hace todos los campos opcionales usando PartialType.
 */
import { PartialType } from '@nestjs/mapped-types';
import { CreateCampamentoDto } from './create-campamento.dto.ts';

export class UpdateCampamentoDto extends PartialType(CreateCampamentoDto) {}
