import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usuariosService: UsuariosService
  ) {}

  async login(cnpj: string, token: string) {
    try {
      const usuario = await this.usuariosService.authenticate(cnpj, token);
      
      // Gera o access token (curta duração)
      const accessTokenPayload = { 
        sub: usuario.id, 
        cnpj: usuario.cnpj, 
        tipo: usuario.tipo,
        type: 'access'
      };
      
      const accessToken = this.jwtService.sign(accessTokenPayload, {
        expiresIn: '15m' // 15 minutos
      });

      // Gera o refresh token (longa duração)
      const refreshTokenPayload = {
        sub: usuario.id,
        type: 'refresh'
      };

      const refreshToken = this.jwtService.sign(refreshTokenPayload, {
        expiresIn: '7d' // 7 dias
      });

      return {
        user: {
          id: usuario.id,
          cnpj: usuario.cnpj,
          tipo: usuario.tipo,
          nome_empresa: usuario.nome_empresa,
          email: usuario.email
        },
        token: accessToken,
        refreshToken: refreshToken,
        expiresIn: 900 // 15 minutos em segundos
      };
    } catch (error) {
      throw new HttpException(
        { message: 'CNPJ ou Token inválidos' },
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async refresh(refreshToken: string) {
    try {
      // Verifica o refresh token
      const payload = this.jwtService.verify(refreshToken);
      
      if (payload.type !== 'refresh') {
        throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
      }

      // Busca o usuário
      const usuario = await this.usuariosService.findOne(payload.sub);
      
      // Gera novo access token
      const accessTokenPayload = { 
        sub: usuario.id, 
        cnpj: usuario.cnpj, 
        tipo: usuario.tipo,
        type: 'access'
      };
      
      const accessToken = this.jwtService.sign(accessTokenPayload, {
        expiresIn: '15m'
      });

      return {
        token: accessToken,
        refreshToken: refreshToken, // Mantém o mesmo refresh token
        expiresIn: 900
      };
    } catch (error) {
      throw new HttpException(
        { message: 'Refresh token inválido' },
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  async validateUser(payload: any) {
    const usuario = await this.usuariosService.findOne(payload.sub);
    return usuario;
  }

  /**
   * Verifica se o token está próximo de expirar (últimos 2 minutos)
   */
  isTokenExpiringSoon(token: string): boolean {
    try {
      const payload = this.jwtService.decode(token) as any;
      if (!payload || !payload.exp) {
        return false;
      }

      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - now;
      
      // Considera "próximo de expirar" se faltar menos de 2 minutos
      return timeUntilExpiry < 120;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se o token ainda é válido
   */
  isTokenValid(token: string): boolean {
    try {
      this.jwtService.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtém informações do token sem verificar assinatura
   */
  getTokenInfo(token: string): any {
    try {
      return this.jwtService.decode(token);
    } catch (error) {
      return null;
    }
  }
}