import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { BancoModule } from './modules/banco/banco.module';
import { SolicitacoesModule } from './modules/solicitacoes/solicitacoes.module';
import { ZapierModule } from './modules/zapier/zapier.module';
import { AppConfigModule } from './modules/config/config.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './modules/redis/redis.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { EmailModule } from './modules/email/email.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TokenRefreshInterceptor } from './modules/auth/token-refresh.interceptor';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    UsuariosModule,
    BancoModule,
    SolicitacoesModule,
    ZapierModule,
    RedisModule,
    TemplatesModule,
    PdfModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TokenRefreshInterceptor,
    },
  ],
})
export class AppModule {}