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
