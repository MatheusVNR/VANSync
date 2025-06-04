import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    try {
      const { email, password } = body;
      const result = await this.authService.login(email, password);
      return result; // Retorna usuário e token
    } catch (error) {
      throw error; 
    }
  }
}