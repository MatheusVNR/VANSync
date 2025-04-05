import { Module } from '@nestjs/common';
import { BancoController } from './banco.controller';
import { BancoService } from './banco.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Banco } from 'src/database/entities/Banco';

@Module({
  imports: [SequelizeModule.forFeature([Banco])],
  controllers: [BancoController],
  providers: [BancoService],
  exports: [BancoService],
})
export class BancoModule {}