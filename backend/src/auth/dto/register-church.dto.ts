/**
 * DTO para el registro de iglesias.
 */
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterChurchDto {
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
