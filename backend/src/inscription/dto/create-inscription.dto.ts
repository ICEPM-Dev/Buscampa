/**
 * DTO para la creación de inscripciones a campamentos.
 * Incluye validaciones para los datos personales del participante.
 */
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateInscriptionDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(10)
  phone: string;
}