import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { json, urlencoded } from 'express';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');

    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });

    // Pra aumentar o limite do body parser
    app.use(json({ limit: '20mb' }));
    app.use(urlencoded({ extended: true, limit: '20mb' }));

    await app.listen(3000);
}
bootstrap();
