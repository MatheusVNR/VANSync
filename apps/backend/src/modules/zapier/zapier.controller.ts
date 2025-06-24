import { Controller, Post, Body, Get } from '@nestjs/common';
import { ZapierService } from './zapier.service';

@Controller('zapier')
export class ZapierController {
  constructor(private readonly zapierService: ZapierService) {}

  @Post('integrate')
  async integrate(@Body() data: {
    cnpj_sh: string;
    email: string;
    cnpj_cliente: string;
    produto: string;
    arquivo: string; // base64
  }) {
    try {
      const result = await this.zapierService.enviarParaZapier(data);
      return {
        success: true,
        message: 'Dados enviados com sucesso para o Zapier',
        response: result
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get('test')
  async testConnection() {
    try {
      const isConnected = await this.zapierService.testarConexao();
      return {
        success: isConnected,
        message: isConnected ? 'Conexão com Zapier OK' : 'Falha na conexão com Zapier'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
} 