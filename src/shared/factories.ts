import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

export const mongooseFactory = async (config: ConfigService) => {
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
};

export const jwtFactory = async (config: ConfigService) => {
  return {
    global: true,
    secret: config.get('JWT_SECRET'),
    signOptions: { expiresIn: '60s' },
  };
};
