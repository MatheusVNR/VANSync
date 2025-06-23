import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailConfig = this.configService.get('email');
    
    if (!emailConfig?.host || !emailConfig?.user || !emailConfig?.pass) {
      console.warn('Configurações de email não encontradas. Emails não serão enviados.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
      },
    });
  }

  async sendCartaEmail(data: {
    to: string;
    produto: string;
    banco: string;
    pdfBuffer: Buffer;
    dadosCliente: any;
  }): Promise<boolean> {
    try {
      if (!this.transporter) {
        console.warn('Transporter de email não inicializado. Email não enviado.');
        return false;
      }

      const { to, produto, banco, pdfBuffer, dadosCliente } = data;

      const mailOptions = {
        from: this.configService.get('email.user'),
        to: to,
        subject: `Carta de Solicitação VAN - ${produto} - ${banco}`,
        html: this.generateEmailTemplate(produto, banco, dadosCliente),
        attachments: [
          {
            filename: `carta-van-${produto}-${banco}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf',
          },
        ],
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      console.log(`✅ Email enviado com sucesso para ${to} - Produto: ${produto} - Banco: ${banco}`);
      console.log(`📧 Message ID: ${result.messageId}`);
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error.message);
      throw new HttpException(
        `Erro ao enviar email: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private generateEmailTemplate(produto: string, banco: string, dadosCliente: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Carta de Solicitação VAN</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px; }
          .footer { margin-top: 20px; padding: 20px; background-color: #f8f9fa; border-radius: 5px; font-size: 12px; color: #6c757d; }
          .highlight { color: #007bff; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📋 Carta de Solicitação VAN</h2>
            <p><strong>Produto:</strong> <span class="highlight">${produto}</span></p>
            <p><strong>Banco:</strong> <span class="highlight">${banco}</span></p>
          </div>
          
          <div class="content">
            <p>Prezado(a),</p>
            
            <p>Segue em anexo a carta de solicitação VAN para o produto <strong>${produto}</strong> junto ao banco <strong>${banco}</strong>.</p>
            
            <p><strong>Dados da solicitação:</strong></p>
            <ul>
              <li><strong>Razão Social:</strong> ${dadosCliente.razao_social}</li>
              <li><strong>CNPJ:</strong> ${dadosCliente.cnpj_emitente}</li>
              <li><strong>Responsável:</strong> ${dadosCliente.nome_responsavel}</li>
              <li><strong>Email:</strong> ${dadosCliente.email}</li>
            </ul>
            
            <p>Esta carta foi gerada automaticamente pelo sistema VANSync da Tecnospeed.</p>
            
            <p>Atenciosamente,<br>
            <strong>Equipe Tecnospeed</strong></p>
          </div>
          
          <div class="footer">
            <p>Este é um email automático. Não responda a esta mensagem.</p>
            <p>Sistema VANSync - Tecnospeed</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.transporter) {
        return false;
      }
      
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Erro ao testar conexão de email:', error.message);
      return false;
    }
  }
} 