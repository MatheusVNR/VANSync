import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Usuario, TipoUsuario } from '../../database/entities/Usuario';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario)
    private usuarioModel: typeof Usuario,
  ) {}

  // Função para limpar CNPJ (remover máscaras)
  private cleanCNPJ(cnpj: string): string {
    return cnpj.replace(/\D/g, '');
  }

  async create(createUsuarioDto: any): Promise<Usuario> {
    const { cnpj, token, tipo, nome_empresa, email, telefone } = createUsuarioDto;
    
    const cleanCnpj = this.cleanCNPJ(cnpj);
    
    // Verificar se CNPJ já existe
    const existingUsuario = await this.usuarioModel.findOne({
      where: { cnpj: cleanCnpj }
    });

    if (existingUsuario) {
      throw new HttpException('CNPJ já cadastrado', HttpStatus.BAD_REQUEST);
    }

    // Criptografar token
    const hashedToken = await bcrypt.hash(token, 10);

    return this.usuarioModel.create({
      cnpj: cleanCnpj,
      token: hashedToken,
      tipo,
      nome_empresa,
      email,
      telefone
    });
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.findAll({
      attributes: { exclude: ['token'] } // Não retornar token criptografado
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioModel.findByPk(id, {
      attributes: { exclude: ['token'] }
    });
    
    if (!usuario) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    
    return usuario;
  }

  async findByCnpj(cnpj: string): Promise<Usuario> {
    const cleanCnpj = this.cleanCNPJ(cnpj);
    const usuario = await this.usuarioModel.findOne({
      where: { cnpj: cleanCnpj }
    });
    if (!usuario) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    return usuario;
  }

  async authenticate(cnpj: string, token: string): Promise<Usuario> {
    const cleanCnpj = this.cleanCNPJ(cnpj);
    
    const usuario = await this.usuarioModel.findOne({
      where: { cnpj: cleanCnpj }
    });
    
    if (!usuario) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }

    // Para testes: comparar tokens simples
    // TODO: Em produção, usar bcrypt.compare(token, usuario.token)
    const isTokenValid = token === usuario.token;
    
    if (!isTokenValid) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: any): Promise<Usuario> {
    const usuario = await this.findOne(id);
    
    const updateData: any = { ...updateUsuarioDto };
    
    // Se token foi fornecido, criptografar
    if (updateData.token) {
      updateData.token = await bcrypt.hash(updateData.token, 10);
    }

    await usuario.update(updateData);
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await usuario.destroy();
  }

  async countSolicitacoesEmAberto(cnpj: string): Promise<number> {
    const cleanCnpj = this.cleanCNPJ(cnpj);
    const usuario = await this.usuarioModel.findOne({
      where: { cnpj: cleanCnpj }
    });
    if (!usuario) return 0;

    return usuario.$count('solicitacoes', {
      where: { status: 'em_aberto' }
    });
  }
} 