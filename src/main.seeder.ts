import { NestFactory } from '@nestjs/core';
import { User } from './schema/user.schema';
import { UserSeed } from './schema/user.seed';
import { SeedsModule } from './shared/seeds/seeds.module';

const userData = [
  {
    username: 'test',
    password: 'test',
  },
  {
    username: 'test2',
    password: 'test2',
  },
] as User[];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedsModule);
  const userSeed = app.get(UserSeed);
  await userSeed.seed(userData);
  app.close();
}
bootstrap();
