import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(email: string, password: string) {
    if (email === 'teste@tecnospeed.com.br' && password === '123456') { // apenas para os testes
      // Gera o token JWT
      const payload = { username: email, sub: 1 };
      const token = this.jwtService.sign(payload);

      return {
        user: email,
        token: token,
      };
    } else {
      throw new HttpException(
        { message: 'Credenciais inválidas' },
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}