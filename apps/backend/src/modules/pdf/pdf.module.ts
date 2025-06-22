import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { TemplatesModule } from '../templates/templates.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TemplatesModule, RedisModule],
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {} 