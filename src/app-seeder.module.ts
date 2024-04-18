import { Module } from '@nestjs/common';
import { SeedsModule } from './shared/seeds/seeds.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule, SeedsModule],
})
export class AppSeederModule {}
