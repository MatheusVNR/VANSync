import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class BancoDTO {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  padrao_van: string;

  @IsBoolean()
  @IsOptional()
  cnab240?: boolean;

  @IsBoolean()
  @IsOptional()
  cnab400?: boolean;

  @IsBoolean()
  @IsOptional()
  cnab444?: boolean;

  @IsOptional()
  produtos?: string | string[];
}