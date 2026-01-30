import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [HealthModule, MembersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
