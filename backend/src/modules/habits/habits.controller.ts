import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AuthUser, CurrentUser } from '../../shared/decorators/current-user.decorator';
import { CheckInDto, CreateHabitDto, UpdateHabitDto } from './dto';
import { HabitsService } from './habits.service';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habits: HabitsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.habits.findAll(user.sub);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateHabitDto) {
    return this.habits.create(user.sub, dto);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.habits.findOne(user.sub, id);
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() dto: UpdateHabitDto) {
    return this.habits.update(user.sub, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.habits.remove(user.sub, id);
  }

  @Patch(':id/archive')
  archive(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.habits.archive(user.sub, id);
  }

  @Post(':habitId/check-ins')
  checkIn(@CurrentUser() user: AuthUser, @Param('habitId') habitId: string, @Body() dto: CheckInDto) {
    return this.habits.checkIn(user.sub, habitId, dto);
  }

  @Get(':habitId/check-ins')
  checkIns(@CurrentUser() user: AuthUser, @Param('habitId') habitId: string) {
    return this.habits.checkIns(user.sub, habitId);
  }

  @Patch(':habitId/check-ins/:checkInId')
  updateCheckIn(@CurrentUser() user: AuthUser, @Param('habitId') habitId: string, @Param('checkInId') checkInId: string, @Body() dto: CheckInDto) {
    return this.habits.updateCheckIn(user.sub, habitId, checkInId, dto);
  }

  @Delete(':habitId/check-ins/:checkInId')
  deleteCheckIn(@CurrentUser() user: AuthUser, @Param('habitId') habitId: string, @Param('checkInId') checkInId: string) {
    return this.habits.deleteCheckIn(user.sub, habitId, checkInId);
  }
}
