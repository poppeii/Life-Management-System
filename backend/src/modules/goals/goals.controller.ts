import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AuthUser, CurrentUser } from '../../shared/decorators/current-user.decorator';
import { QueryDto } from '../../shared/dto/pagination.dto';
import { CreateGoalDto, CreateMilestoneDto, UpdateGoalDto, UpdateMilestoneDto } from './dto';
import { GoalsService } from './goals.service';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goals: GoalsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser, @Query() query: QueryDto) {
    return this.goals.findAll(user.sub, query);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateGoalDto) {
    return this.goals.create(user.sub, dto);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.goals.findOne(user.sub, id);
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateGoalDto) {
    return this.goals.update(user.sub, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.goals.remove(user.sub, id);
  }

  @Post(':goalId/milestones')
  createMilestone(@CurrentUser() user: AuthUser, @Param('goalId') goalId: string, @Body() dto: CreateMilestoneDto) {
    return this.goals.createMilestone(user.sub, goalId, dto);
  }

  @Patch(':goalId/milestones/:milestoneId')
  updateMilestone(@CurrentUser() user: AuthUser, @Param('goalId') goalId: string, @Param('milestoneId') milestoneId: string, @Body() dto: UpdateMilestoneDto) {
    return this.goals.updateMilestone(user.sub, goalId, milestoneId, dto);
  }

  @Delete(':goalId/milestones/:milestoneId')
  removeMilestone(@CurrentUser() user: AuthUser, @Param('goalId') goalId: string, @Param('milestoneId') milestoneId: string) {
    return this.goals.removeMilestone(user.sub, goalId, milestoneId);
  }

  @Patch(':goalId/milestones/:milestoneId/complete')
  completeMilestone(@CurrentUser() user: AuthUser, @Param('goalId') goalId: string, @Param('milestoneId') milestoneId: string) {
    return this.goals.completeMilestone(user.sub, goalId, milestoneId);
  }
}
