import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // REQUIRED for Railway
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  const allowedOrigins = [
    'http://localhost:3000',
    'https://shop-frontend-fusc-ipqt1pdgk-seirans-projects-93be1431.vercel.app',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false); // ❗ NO THROW
    },
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
