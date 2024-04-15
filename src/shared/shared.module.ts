import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseFactory } from 'src/shared/factories';

const envFilePath = 'env/.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: mongooseFactory,
      inject: [ConfigService],
    }),
  ],
})
export class SharedModule {}
