import { LogLevel, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './shared/configure_app';

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

  configureApp(app);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 3000;
  await app.listen(port);

  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
