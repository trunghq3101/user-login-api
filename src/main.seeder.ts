import { NestFactory } from '@nestjs/core';
import { AppSeederModule } from './app-seeder.module';
import { UserSeed } from './user/user.seed';

const userData = [
  {
    username: 'test',
    password: 'test',
  },
  {
    username: 'test2',
    password: 'test2',
  },
  {
    username: 'test3',
    password: 'test3',
  },
  {
    username: 'test4',
    password: 'test4',
  },
] as any[];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppSeederModule);
  const userSeed = app.get(UserSeed);
  await userSeed.seed(userData);
  app.close();
}
bootstrap();
