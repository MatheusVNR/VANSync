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

@Module({
  imports: [
    SequelizeModule.forFeature([SolicitacaoCarta, Usuario, Banco]),
    UsuariosModule,
    PdfModule,
    TemplatesModule,
    RedisModule,
  ],
  controllers: [SolicitacoesController],
  providers: [SolicitacoesService],
  exports: [SolicitacoesService]
})
export class SolicitacoesModule {} 