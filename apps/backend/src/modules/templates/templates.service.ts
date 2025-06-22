import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class TemplatesService {
  constructor(
    private configService: ConfigService,
    private redisService: RedisService,
  ) {
    this.registerHelpers();
  }

  private registerHelpers() {
    // Helper para formatar CNPJ
    Handlebars.registerHelper('formatCNPJ', (cnpj: string) => 
      cnpj ? cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5') : ''
    );

    // Helper para formatar telefone
    Handlebars.registerHelper('formatPhone', (phone: string) => 
      phone ? phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3') : ''
    );

    // Helper para formatar data
    Handlebars.registerHelper('formatDate', () => 
      new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    );

    // Helper para repetir caracteres
    Handlebars.registerHelper('repeat', function(char: string, count: number) {
      return char.repeat(count);
    });

    // Helper para uppercase
    Handlebars.registerHelper('uppercase', (text: string) => 
      text ? text.toUpperCase() : ''
    );

    // Helper para padStart
    Handlebars.registerHelper('padStart', function(text: string, length: number, char: string) {
      return text ? text.padStart(length, char) : '';
    });

    Handlebars.registerHelper('check', (value: any, expected: any) => {
        if (Array.isArray(value)) {
            return value.includes(expected) ? '(X)' : '( )';
        }
        return value === expected ? '(X)' : '( )';
    });
  }

  async getTemplate(bancoPadrao: string): Promise<HandlebarsTemplateDelegate> {
    const cacheKey = `template:${bancoPadrao}`;
    let templateString = await this.redisService.get(cacheKey);

    if (!templateString) {
      const templatePath = path.join(__dirname, 'layouts', `${bancoPadrao}.hbs`);
      try {
        templateString = await fs.readFile(templatePath, 'utf-8');
        const templateTtl = this.configService.get('pdf.templateCacheTtl');
        await this.redisService.set(cacheKey, templateString, templateTtl);
      } catch (error) {
        throw new HttpException(`Layout para ${bancoPadrao} não encontrado.`, HttpStatus.NOT_FOUND);
      }
    }

    return Handlebars.compile(templateString);
  }

  async generateCartaContent(data: any): Promise<string> {
    if (!data.banco || !data.banco.padrao_van) {
        throw new HttpException('Padrão VAN do banco não especificado.', HttpStatus.BAD_REQUEST);
    }
    const template = await this.getTemplate(data.banco.padrao_van.toLowerCase());
    return template(data);
  }

  async updateTemplate(bancoPadrao: string, newTemplate: string): Promise<void> {
    try {
      Handlebars.compile(newTemplate);
    } catch (error) {
      throw new Error(`Template inválido: ${error.message}`);
    }
    await this.redisService.set(`template:${bancoPadrao}`, newTemplate);
  }

  async clearTemplateCache(bancoPadrao?: string): Promise<void> {
    await this.redisService.clearTemplateCache(bancoPadrao);
  }
} 