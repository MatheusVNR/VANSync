import { IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { TipoUsuario } from '../../database/entities/Usuario';

export class UsuarioDTO {
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsEnum(TipoUsuario)
  @IsNotEmpty()
  tipo: TipoUsuario;

  @IsString()
  @IsOptional()
  nome_empresa?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefone?: string;
} 