import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisConfig = this.configService.get('redis');
    
    this.redisClient = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
      db: redisConfig.db,
      maxRetriesPerRequest: 3,
    });

    this.redisClient.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    this.redisClient.on('connect', () => {
      console.log('Connected to Redis');
    });
  }

  async onModuleDestroy() {
    if (this.redisClient) {
      await this.redisClient.quit();
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const redisConfig = this.configService.get('redis');
    const expiry = ttl || redisConfig.ttl;
    await this.redisClient.setex(key, expiry, value);
  }
  
  async getPdf(key: string): Promise<Buffer | null> {
    const pdfBase64 = await this.redisClient.get(key);
    return pdfBase64 ? Buffer.from(pdfBase64, 'base64') : null;
  }

  async setPdf(key: string, pdfBuffer: Buffer, ttl?: number): Promise<void> {
    const redisConfig = this.configService.get('pdf');
    const expiry = ttl || redisConfig.cacheTtl;
    const pdfBase64 = pdfBuffer.toString('base64');
    await this.redisClient.setex(key, expiry, pdfBase64);
  }

  async del(key: string | string[]): Promise<void> {
    const keys = Array.isArray(key) ? key : [key];
    if (keys.length > 0) {
        await this.redisClient.del(...keys);
    }
  }

  async keys(pattern: string): Promise<string[]> {
      return this.redisClient.keys(pattern);
  }

  // Cache de templates
  async getTemplate(bancoPadrao: string): Promise<string | null> {
    return await this.redisClient.get(`template:${bancoPadrao}`);
  }

  async setTemplate(bancoPadrao: string, template: string, ttl?: number): Promise<void> {
    const templateTtl = ttl || this.configService.get('pdf.templateCacheTtl') || 7200;
    await this.redisClient.setex(`template:${bancoPadrao}`, templateTtl, template);
  }

  // Rate limiting
  async incrementRateLimit(userId: number, action: string): Promise<number> {
    const key = `rate:${action}:${userId}`;
    const count = await this.redisClient.incr(key);
    
    if (count === 1) {
      await this.redisClient.expire(key, 3600); // 1 hora
    }
    
    return count;
  }

  // Limpeza de cache
  async clearTemplateCache(bancoPadrao?: string): Promise<void> {
    if (bancoPadrao) {
      await this.redisClient.del(`template:${bancoPadrao}`);
    } else {
      const keys = await this.redisClient.keys('template:*');
      if (keys.length > 0) {
        await this.redisClient.del(...keys);
      }
    }
  }

  async clearPdfCache(solicitacaoId?: number): Promise<void> {
    if (solicitacaoId) {
      await this.redisClient.del(`pdf:${solicitacaoId}`);
    } else {
      const keys = await this.redisClient.keys('pdf:*');
      if (keys.length > 0) {
        await this.redisClient.del(...keys);
      }
    }
  }

  // Health check
  async ping(): Promise<string> {
    return await this.redisClient.ping();
  }
} 