/**
 * DTO para el registro de usuarios normales.
 * Incluye validaciones para email, nombre y contraseña.
 */
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
