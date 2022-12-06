import { PrismaService } from '@libs/prisma';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppConfig } from 'config/config.interface';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService<AppConfig>>(ConfigService);
  const MODE = configService.get<string>('mode');

  const whitelist = [
    '185.71.65.92',
    '185.71.65.189',
    '149.202.17.210',
    'https://bull.anazirov.com',
    'https://bull-metrics.vercel.app',
  ];

  if (MODE === 'DEV') {
    whitelist.push('http://localhost:3000');
  }

  app.enableCors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    allowedHeaders: '*',
    methods: '*',
    credentials: true,
  });

  app.enableShutdownHooks();

  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      enableDebugMessages: MODE === 'DEV',
    }),
  );

  const PORT = configService.get<string>('port');

  await app.listen(PORT, '0.0.0.0', async () => {
    new Logger('NestApplication').log(
      [`🚀 Server ready on ${MODE} mode at: ${await app.getUrl()}`].join('\n'),
    );
  });
}
bootstrap();
