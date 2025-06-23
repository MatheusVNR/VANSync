import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ZapierService {
  constructor(private configService: ConfigService) {}

  async enviarParaZapier(dados: {
    cnpj_sh: string;
    email: string;
    cnpj_cliente: string;
    produto: string;
    arquivo: string; // base64
  }): Promise<any> {
    try {
      const zapierWebhookUrl = this.configService.get<string>('ZAPIER_WEBHOOK_URL') || 'https://hooks.zapier.com/hooks/catch/21923307/2gwb3a6/';
      
      if (!zapierWebhookUrl) {
        throw new HttpException('Webhook URL não configurada', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const response = await axios.post(zapierWebhookUrl, dados, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 segundos
      });

      if (response.status === 200) {
        return {
          success: true,
          message: 'Dados enviados com sucesso para o Zapier'
        };
      } else {
        throw new HttpException(
          'Erro ao enviar dados para o Zapier',
          HttpStatus.BAD_GATEWAY
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // Log do erro para debug
      console.error('Erro Zapier:', error.message);
      
      throw new HttpException(
        'Erro na integração com Zapier. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async testarConexao(): Promise<boolean> {
    try {
      const zapierWebhookUrl = this.configService.get<string>('ZAPIER_WEBHOOK_URL');
      
      if (!zapierWebhookUrl) {
        return false;
      }

      await axios.post(zapierWebhookUrl, {
        test: true,
        timestamp: new Date().toISOString()
      }, {
        timeout: 10000,
      });

      return true;
    } catch (error) {
      return false;
    }
  }
} 