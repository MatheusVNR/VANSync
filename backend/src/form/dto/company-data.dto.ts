import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CompanyDataDto {
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  razaoSocial: string;

  @IsString()
  @IsNotEmpty()
  responsavelNome: string;

  @IsString()
  @IsNotEmpty()
  responsavelCargo: string;

  @IsString()
  @IsNotEmpty()
  responsavelTelefone: string;

  @IsEmail()
  @IsNotEmpty()
  responsavelEmail: string;

  @IsString()
  @IsNotEmpty()
  banco: string;

  @IsString()
  @IsNotEmpty()
  agencia: string;

  @IsString()
  @IsNotEmpty()
  conta: string;

  @IsString()
  @IsNotEmpty()
  convenio: string;

  @IsString()
  @IsNotEmpty()
  gerenteConta: string;

  @IsString()
  @IsNotEmpty()
  gerenteTelefone: string;

  @IsEmail()
  @IsNotEmpty()
  gerenteEmail: string;
} 