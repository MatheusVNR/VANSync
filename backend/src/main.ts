import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitando CORS para permitir requisições do frontend
  app.enableCors({
    origin: 'http://localhost:3000', // URL do frontend React
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });
  
  // Adicionando pipe de validação global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  // Prefixo para todas as rotas da API
  app.setGlobalPrefix('api');
  
  await app.listen(3001);
  console.log(`Aplicação está rodando em: ${await app.getUrl()}`);
}
bootstrap();
