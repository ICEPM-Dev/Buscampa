import { IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateCampamentoDto {
  @IsNotEmpty()
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  price: number;

  @IsNotEmpty()
  location: string;
  description?: string;
}
