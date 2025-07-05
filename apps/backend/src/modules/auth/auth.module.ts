import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { JwtStrategy } from './jwt.strategy';
import { TokenRefreshInterceptor } from './token-refresh.interceptor';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    UsuariosModule,
  ],
  providers: [AuthService, JwtStrategy, TokenRefreshInterceptor],
  controllers: [AuthController],
  exports: [AuthService, TokenRefreshInterceptor],
})
export class AuthModule {}