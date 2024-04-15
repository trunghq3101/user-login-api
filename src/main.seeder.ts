import { NestFactory } from '@nestjs/core';
import { User } from './schema/user.schema';
import { UserSeed } from './schema/user.seed';
import { SeedsModule } from './shared/seeds/seeds.module';

const userData = [
  {
    username: '',
    password: '',
  },
  {
    username: '',
    password: '',
  },
] as User[];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedsModule);
  const userSeed = app.get(UserSeed);
  await userSeed.seed(userData);
  app.close();
}
bootstrap();
