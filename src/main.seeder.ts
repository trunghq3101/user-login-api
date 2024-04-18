import { NestFactory } from '@nestjs/core';
import { SeedsModule } from './shared/seeds/seeds.module';
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
  const app = await NestFactory.createApplicationContext(SeedsModule);
  const userSeed = app.get(UserSeed);
  await userSeed.seed(userData);
  app.close();
}
bootstrap();
