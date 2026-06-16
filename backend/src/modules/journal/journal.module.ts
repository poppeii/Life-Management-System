import { Module } from '@nestjs/common';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';

@Module({ imports: [ActivityLogsModule], controllers: [JournalController], providers: [JournalService], exports: [JournalService] })
export class JournalModule {}
