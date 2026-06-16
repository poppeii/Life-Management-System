import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AuthUser, CurrentUser } from '../../shared/decorators/current-user.decorator';
import { CreateLearningItemDto, StudyLogDto, UpdateLearningItemDto } from './dto';
import { LearningService } from './learning.service';

@Controller('learning')
export class LearningController {
  constructor(private readonly learning: LearningService) {}

  @Get() findAll(@CurrentUser() user: AuthUser) { return this.learning.findAll(user.sub); }
  @Post() create(@CurrentUser() user: AuthUser, @Body() dto: CreateLearningItemDto) { return this.learning.create(user.sub, dto); }
  @Get(':id') findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) { return this.learning.findOne(user.sub, id); }
  @Patch(':id') update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateLearningItemDto) { return this.learning.update(user.sub, id, dto); }
  @Delete(':id') remove(@CurrentUser() user: AuthUser, @Param('id') id: string) { return this.learning.remove(user.sub, id); }
  @Post(':id/study-logs') addStudyLog(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: StudyLogDto) { return this.learning.addStudyLog(user.sub, id, dto); }
  @Get(':id/study-logs') studyLogs(@CurrentUser() user: AuthUser, @Param('id') id: string) { return this.learning.studyLogs(user.sub, id); }
}
