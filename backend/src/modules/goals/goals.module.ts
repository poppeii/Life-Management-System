import { Module } from '@nestjs/common';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';

@Module({ imports: [ActivityLogsModule], controllers: [GoalsController], providers: [GoalsService], exports: [GoalsService] })
export class GoalsModule {}
