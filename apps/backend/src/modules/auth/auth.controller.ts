import { Controller, Post, Body, HttpException, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsuariosService } from '../usuarios/usuarios.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usuariosService: UsuariosService
  ) {}

  @Post('login')
  async login(@Body() loginDto: { cnpj: string; token: string }) {
    const { cnpj, token } = loginDto;
    
    if (!cnpj || !token) {
      throw new HttpException(
        { message: 'CNPJ e Token são obrigatórios' },
        HttpStatus.BAD_REQUEST
      );
    }

    return this.authService.login(cnpj, token);
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: { refreshToken: string }) {
    const { refreshToken } = refreshDto;
    
    if (!refreshToken) {
      throw new HttpException(
        { message: 'Refresh token é obrigatório' },
        HttpStatus.BAD_REQUEST
      );
    }

    return this.authService.refresh(refreshToken);
  }

  @Get('test-users')
  async testUsers() {
    try {
      const users = await this.usuariosService.findAll();
      return {
        message: 'Usuários encontrados',
        count: users.length,
        users: users.map(user => ({
          id: user.id,
          cnpj: user.cnpj,
          tipo: user.tipo,
          nome_empresa: user.nome_empresa,
          email: user.email
        }))
      };
    } catch (error) {
      return {
        message: 'Erro ao buscar usuários',
        error: error.message
      };
    }
  }
}