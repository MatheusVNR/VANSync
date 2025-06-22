import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as puppeteer from 'puppeteer';
import { TemplatesService } from '../templates/templates.service';
import { RedisService } from '../redis/redis.service';
import { Browser } from 'puppeteer';

@Injectable()
export class PdfService implements OnModuleInit, OnModuleDestroy {
  private browser: Browser;

  constructor(
    private configService: ConfigService,
    private templatesService: TemplatesService,
    private redisService: RedisService,
  ) {}

  async onModuleInit() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
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
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      const pdfPuppeteerBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '2cm', right: '2cm', bottom: '2cm', left: '2cm' },
      });
      
      const pdfBuffer = Buffer.from(pdfPuppeteerBuffer);

      await this.redisService.setPdf(cacheKey, pdfBuffer);
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
} 