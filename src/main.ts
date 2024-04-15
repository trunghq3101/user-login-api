import { LogLevel, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const allLogLevels = [
    'fatal',
    'error',
    'warn',
    'log',
    'debug',
    'verbose',
  ] as LogLevel[];
  const logLevel = (process.env.LOG_LEVEL || 'verbose') as LogLevel;
  const logLevels = allLogLevels.slice(0, allLogLevels.indexOf(logLevel) + 1);

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = app.get(ConfigService);
  await app.listen(config.get<number>('PORT') || 3000);
}
bootstrap();
