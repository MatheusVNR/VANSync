import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { BancoModule } from 'src/modules/banco/banco.module';
import { AppConfigModule } from 'src/modules/config/config.module';
import { Banco } from './entities/Banco';
import { Usuario } from './entities/Usuario';
import { SolicitacaoCarta } from './entities/SolicitacaoCarta';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        autoLoadModels: true,
        synchronize: true,
        models: [Banco, Usuario, SolicitacaoCarta]
      })
    }),
    
    BancoModule
  ]
})
export class DatabaseModule {}