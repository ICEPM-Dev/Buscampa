/**
 * DTO para la solicitud de login.
 * Valida que el email sea válido y que ambos campos estén presentes.
 */
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
