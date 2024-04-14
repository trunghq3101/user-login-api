import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const testEnvFilePath = 'env/.test.env';
const envFilePath = 'env/.env';
const isTestEnv = process.env.NODE_ENV == 'test';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: isTestEnv ? testEnvFilePath : envFilePath,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const logger = new Logger(MongooseModule.name);

        const user = config.get('MONGO_AUTH_DB_USERNAME');
        const password = config.get('MONGO_AUTH_DB_PASSWORD');
        const host = config.get('MONGO_HOST');
        const port = config.get('MONGO_PORT');
        const mongoUri = `mongodb://${user}:${password}@${host}:${port}/auth`;

        logger.verbose(`MongoDB URI: ${mongoUri}`);

        return {
          uri: mongoUri,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
