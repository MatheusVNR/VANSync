import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {} 