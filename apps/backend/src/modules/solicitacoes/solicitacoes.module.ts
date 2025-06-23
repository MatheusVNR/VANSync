import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SolicitacoesController } from './solicitacoes.controller';
import { SolicitacoesService } from './solicitacoes.service';
import { SolicitacaoCarta } from '../../database/entities/SolicitacaoCarta';
import { Usuario } from '../../database/entities/Usuario';
import { Banco } from '../../database/entities/Banco';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { PdfModule } from '../pdf/pdf.module';
import { TemplatesModule } from '../templates/templates.module';
import { RedisModule } from '../redis/redis.module';
import { EmailModule } from '../email/email.module';
import { ZapierModule } from '../zapier/zapier.module';

@Module({
  imports: [
    SequelizeModule.forFeature([SolicitacaoCarta, Usuario, Banco]),
    UsuariosModule,
    PdfModule,
    TemplatesModule,
    RedisModule,
    EmailModule,
    ZapierModule,
  ],
  controllers: [SolicitacoesController],
  providers: [SolicitacoesService],
  exports: [SolicitacoesService]
})
export class SolicitacoesModule {} 