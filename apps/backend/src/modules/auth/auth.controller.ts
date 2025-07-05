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
    try {
      return await this.authService.login(loginDto.cnpj, loginDto.token);
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: { refreshToken: string }) {
    try {
      return await this.authService.refresh(refreshDto.refreshToken);
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  @Post('validate')
  async validateToken(@Body() validateDto: { token: string }) {
    try {
      const isValid = this.authService.isTokenValid(validateDto.token);
      const isExpiringSoon = this.authService.isTokenExpiringSoon(validateDto.token);
      const tokenInfo = this.authService.getTokenInfo(validateDto.token);
      
      return {
        valid: isValid,
        expiringSoon: isExpiringSoon,
        info: tokenInfo
      };
    } catch (error) {
      throw new HttpException(
        { message: 'Token inválido' },
        HttpStatus.UNAUTHORIZED
      );
    }
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