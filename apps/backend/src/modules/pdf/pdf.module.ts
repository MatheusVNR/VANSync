import { Module, forwardRef } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { TemplatesModule } from '../templates/templates.module';
import { RedisModule } from '../redis/redis.module';
import { PdfController } from './pdf.controller';
import { SolicitacoesModule } from '../solicitacoes/solicitacoes.module';

@Module({
  imports: [TemplatesModule, RedisModule, forwardRef(() => SolicitacoesModule)],
  controllers: [PdfController],
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule {} 