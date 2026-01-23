/**
 * DTO para la eliminación de cuenta.
 * Requiere la contraseña para confirmar la acción.
 */
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAccountDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}
