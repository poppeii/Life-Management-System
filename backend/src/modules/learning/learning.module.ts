import { Module } from '@nestjs/common';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { LearningController } from './learning.controller';
import { LearningService } from './learning.service';

@Module({ imports: [ActivityLogsModule], controllers: [LearningController], providers: [LearningService], exports: [LearningService] })
export class LearningModule {}
