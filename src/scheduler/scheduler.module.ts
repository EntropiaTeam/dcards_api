import { Module } from '@nestjs/common';
import { CommonModule } from '../_common/common.module';
import { SchedulerService } from './scheduler.service';

@Module({
  imports: [CommonModule],
  providers: [SchedulerService]
})
export class SchedulerModule {}
