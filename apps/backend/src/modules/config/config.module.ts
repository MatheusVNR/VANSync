import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [
        () => ({
          database: {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          },
          redis: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            password: process.env.REDIS_PASSWORD || undefined,
            db: parseInt(process.env.REDIS_DB || '0'),
            ttl: parseInt(process.env.REDIS_TTL || '3600'),
          },
          pdf: {
            cacheTtl: parseInt(process.env.PDF_CACHE_TTL || '3600'),
            templateCacheTtl: parseInt(process.env.TEMPLATE_CACHE_TTL || '7200'),
          },
          zapier: {
            webhookUrl: process.env.ZAPIER_WEBHOOK_URL,
          },
          email: {
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true',
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        }),
      ],
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}