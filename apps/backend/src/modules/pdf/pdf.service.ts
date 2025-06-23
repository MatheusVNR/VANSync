import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as puppeteer from 'puppeteer';
import { TemplatesService } from '../templates/templates.service';
import { RedisService } from '../redis/redis.service';
import { Browser } from 'puppeteer';

@Injectable()
export class PdfService implements OnModuleInit, OnModuleDestroy {
  private browser: Browser;
  private readonly logger = new Logger(PdfService.name);

  constructor(
    private configService: ConfigService,
    private templatesService: TemplatesService,
    private redisService: RedisService,
  ) {}

  async onModuleInit() {
    this.logger.log('Tentando iniciar o Puppeteer...');
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
      this.logger.log('Navegador Puppeteer iniciado com sucesso.');
    } catch (error) {
      this.logger.error('Falha ao iniciar o navegador Puppeteer:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
      this.logger.log('Navegador Puppeteer fechado.');
    }
  }

  async generatePdf(solicitacaoId: number, data: any): Promise<Buffer> {
    const cacheKey = `pdf:${solicitacaoId}`;
    const cachedPdf = await this.redisService.getPdf(cacheKey);
    if (cachedPdf) {
      return cachedPdf;
    }

    const htmlContent = await this.templatesService.generateCartaContent({
        banco: data.banco,
        dados: data,
        produtos: data.produtos,
        cnab: data.cnab,
    });

    const page = await this.browser.newPage();
    try {
      this.logger.log(`Gerando PDF para solicitação ${solicitacaoId}`);
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      const pdfPuppeteerBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '2cm', right: '2cm', bottom: '2cm', left: '2cm' },
      });
      
      const pdfBuffer = Buffer.from(pdfPuppeteerBuffer);

      await this.redisService.setPdf(cacheKey, pdfBuffer);
      this.logger.log(`PDF para solicitação ${solicitacaoId} gerado e cacheado com sucesso.`);
      return pdfBuffer;
    } finally {
      await page.close();
    }
  }

  async generatePdfBase64(solicitacaoId: number, data: any): Promise<string> {
    const pdfBuffer = await this.generatePdf(solicitacaoId, data);
    return pdfBuffer.toString('base64');
  }

  async clearPdfCache(solicitacaoId?: number): Promise<void> {
    if (solicitacaoId) {
        const key = `pdf:${solicitacaoId}`;
        await this.redisService.del(key);
    } else {
        const keys = await this.redisService.keys('pdf:*');
        await this.redisService.del(keys);
    }
  }

  async generatePdfFromTemplate(templateName: string, data: any): Promise<Buffer> {
    // Função simples para gerar hash dos dados
    const simpleHash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash).toString();
    };

    const cacheKey = `preview:${templateName}:${simpleHash(JSON.stringify(data))}`;
    const cachedPdf = await this.redisService.getPdf(cacheKey);
    if (cachedPdf) {
      return cachedPdf;
    }

    const htmlContent = await this.templatesService.generateCartaContent({
      banco: data.banco,
      dados: data.dados,
      produtos: data.produtos,
      cnab: data.cnab,
    });

    let page;
    try {
      page = await this.browser.newPage();
      this.logger.log(`Gerando preview de PDF para template ${templateName}`);
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      const pdfPuppeteerBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '2cm', right: '2cm', bottom: '2cm', left: '2cm' },
      });
      
      const pdfBuffer = Buffer.from(pdfPuppeteerBuffer);

      // Cache por 30 minutos para previews
      await this.redisService.setPdf(cacheKey, pdfBuffer, 1800);
      this.logger.log(`Preview de PDF para template ${templateName} gerado e cacheado com sucesso.`);
      return pdfBuffer;
    } catch (error) {
      this.logger.error(`Erro ao gerar preview de PDF para o template ${templateName}`, error);
      throw error;
    }
    finally {
      if (page) {
        await page.close();
      }
    }
  }
}