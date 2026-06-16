import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { startOfIsoDay } from '../../shared/utils/date';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { CheckInDto, CreateHabitDto, UpdateHabitDto } from './dto';

@Injectable()
export class HabitsService {
  constructor(private readonly prisma: PrismaService, private readonly logs: ActivityLogsService) {}

  async findAll(userId: string) {
    const habits = await this.prisma.habit.findMany({ where: { userId, deletedAt: null }, include: { checkIns: { orderBy: { checkInDate: 'desc' }, take: 60 } }, orderBy: { createdAt: 'desc' } });
    return habits.map((habit) => ({ ...habit, stats: this.stats(habit.checkIns) }));
  }

  async create(userId: string, dto: CreateHabitDto) {
    const habit = await this.prisma.habit.create({ data: { userId, ...dto } });
    await this.logs.create({ userId, action: 'HABIT_CREATED', entityType: 'HABIT', entityId: habit.id, description: `Created habit: ${habit.title}` });
    return habit;
  }

  async findOne(userId: string, id: string) {
    const habit = await this.prisma.habit.findFirst({ where: { id, userId, deletedAt: null }, include: { checkIns: { orderBy: { checkInDate: 'desc' } } } });
    if (!habit) throw new NotFoundException('Habit not found');
    return { ...habit, stats: this.stats(habit.checkIns) };
  }

  async update(userId: string, id: string, dto: UpdateHabitDto) {
    await this.findOne(userId, id);
    return this.prisma.habit.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.habit.update({ where: { id }, data: { deletedAt: new Date() } });
    return { ok: true };
  }

  async archive(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.habit.update({ where: { id }, data: { isArchived: true } });
  }

  async checkIn(userId: string, habitId: string, dto: CheckInDto) {
    const habit = await this.findOne(userId, habitId);
    const checkInDate = startOfIsoDay(dto.checkInDate ? new Date(dto.checkInDate) : new Date());
    const value = dto.value ?? 1;
    const checkIn = await this.prisma.habitCheckIn.upsert({
      where: { habitId_userId_checkInDate: { habitId, userId, checkInDate } },
      update: { value, isCompleted: value >= habit.targetValue, note: dto.note },
      create: { habitId, userId, checkInDate, value, isCompleted: value >= habit.targetValue, note: dto.note }
    });
    await this.logs.create({ userId, action: 'HABIT_CHECKED_IN', entityType: 'HABIT', entityId: habitId, description: `Checked in habit: ${habit.title}` });
    return checkIn;
  }

  async checkIns(userId: string, habitId: string) {
    await this.findOne(userId, habitId);
    return this.prisma.habitCheckIn.findMany({ where: { habitId, userId }, orderBy: { checkInDate: 'desc' } });
  }

  async updateCheckIn(userId: string, habitId: string, checkInId: string, dto: CheckInDto) {
    const habit = await this.findOne(userId, habitId);
    const current = await this.prisma.habitCheckIn.findFirst({ where: { id: checkInId, habitId, userId } });
    if (!current) throw new NotFoundException('Check-in not found');
    const value = dto.value ?? current.value;
    return this.prisma.habitCheckIn.update({ where: { id: checkInId }, data: { value, isCompleted: value >= habit.targetValue, note: dto.note } });
  }

  async deleteCheckIn(userId: string, habitId: string, checkInId: string) {
    await this.findOne(userId, habitId);
    await this.prisma.habitCheckIn.delete({ where: { id: checkInId } });
    return { ok: true };
  }

  private stats(checkIns: Array<Prisma.HabitCheckInGetPayload<object>>) {
    const completed = checkIns.filter((item) => item.isCompleted);
    const days = new Set(completed.map((item) => item.checkInDate.toISOString().slice(0, 10)));
    let currentStreak = 0;
    const cursor = startOfIsoDay();
    while (days.has(cursor.toISOString().slice(0, 10))) {
      currentStreak += 1;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
    }
    let bestStreak = 0;
    let running = 0;
    [...days].sort().forEach((day, index, all) => {
      running = index === 0 || (new Date(day).getTime() - new Date(all[index - 1]).getTime()) / 86400000 === 1 ? running + 1 : 1;
      bestStreak = Math.max(bestStreak, running);
    });
    return { currentStreak, bestStreak, successRate: checkIns.length ? Math.round((completed.length / checkIns.length) * 100) : 0, todayCompleted: days.has(startOfIsoDay().toISOString().slice(0, 10)) };
  }
}
