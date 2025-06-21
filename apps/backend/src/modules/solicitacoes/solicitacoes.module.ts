import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SolicitacoesController } from './solicitacoes.controller';
import { SolicitacoesService } from './solicitacoes.service';
import { SolicitacaoCarta } from '../../database/entities/SolicitacaoCarta';
import { Usuario } from '../../database/entities/Usuario';
import { Banco } from '../../database/entities/Banco';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [
    SequelizeModule.forFeature([SolicitacaoCarta, Usuario, Banco]),
    UsuariosModule
  ],
  controllers: [SolicitacoesController],
  providers: [SolicitacoesService],
  exports: [SolicitacoesService]
})
export class SolicitacoesModule {} 