import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { BancoModule } from './modules/banco/banco.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { SolicitacoesModule } from './modules/solicitacoes/solicitacoes.module';
import { ZapierModule } from './modules/zapier/zapier.module';

@Module({
    imports: [
        DatabaseModule, 
        AuthModule, 
        BancoModule, 
        UsuariosModule, 
        SolicitacoesModule, 
        ZapierModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }