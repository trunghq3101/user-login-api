import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseFactory } from './factories';
import { SeedsModule } from './seeds/seeds.module';

const testEnvFilePath = 'env/.test.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: testEnvFilePath,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mongooseFactory,
      inject: [ConfigService],
    }),
    SeedsModule,
  ],
})
export class SharedTestModule {}
