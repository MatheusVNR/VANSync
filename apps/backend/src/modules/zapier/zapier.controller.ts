import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ZapierService } from './zapier.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('zapier')
@UseGuards(JwtAuthGuard)
export class ZapierController {
  constructor(private readonly zapierService: ZapierService) {}

  @Post('envio')
  async enviarParaZapier(@Body() dados: {
    cnpj_sh: string;
    email: string;
    cnpj_cliente: string;
    produto: string;
    arquivo: string;
  }) {
    return this.zapierService.enviarParaZapier(dados);
  }

  @Post('teste')
  async testarConexao() {
    const resultado = await this.zapierService.testarConexao();
    return {
      conectado: resultado,
      message: resultado ? 'Conexão OK' : 'Erro na conexão'
    };
  }
} 