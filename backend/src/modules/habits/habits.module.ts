import { Module } from '@nestjs/common';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { HabitsController } from './habits.controller';
import { HabitsService } from './habits.service';

@Module({ imports: [ActivityLogsModule], controllers: [HabitsController], providers: [HabitsService], exports: [HabitsService] })
export class HabitsModule {}
