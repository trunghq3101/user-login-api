import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

export const configureApp = (app: INestApplication) => {
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe());
};
