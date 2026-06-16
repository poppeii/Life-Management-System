import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { startOfIsoDay } from '../../shared/utils/date';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async summary(userId: string) {
    const today = startOfIsoDay();
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const [goals, habits, todayCheckIns, tasks, learning, journalEntries, recentActivity] = await Promise.all([
      this.prisma.goal.findMany({ where: { userId, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 5 }),
      this.prisma.habit.findMany({ where: { userId, deletedAt: null, isArchived: false } }),
      this.prisma.habitCheckIn.findMany({ where: { userId, checkInDate: { gte: today, lt: tomorrow } } }),
      this.prisma.task.findMany({ where: { userId, deletedAt: null }, orderBy: { dueDate: 'asc' }, take: 10 }),
      this.prisma.learningItem.findMany({ where: { userId, deletedAt: null }, orderBy: { updatedAt: 'desc' }, take: 5 }),
      this.prisma.journalEntry.findMany({ where: { userId, deletedAt: null, entryDate: { gte: new Date(Date.now() - 7 * 86400000) } } }),
      this.prisma.activityLog.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 8 })
    ]);
    const activeGoals = goals.filter((g) => !['COMPLETED', 'CANCELLED'].includes(g.status)).length;
    const goalAverage = goals.length ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length : 0;
    const habitRate = habits.length ? (todayCheckIns.filter((c) => c.isCompleted).length / habits.length) * 100 : 0;
    const dueTodayTasks = tasks.filter((t) => t.dueDate && t.dueDate >= today && t.dueDate < tomorrow);
    const taskRate = tasks.length ? (tasks.filter((t) => t.status === 'DONE').length / tasks.length) * 100 : 0;
    const journalConsistency = Math.min(100, (journalEntries.length / 7) * 100);
    const lifeScore = Math.round(goalAverage * 0.3 + habitRate * 0.3 + taskRate * 0.25 + journalConsistency * 0.15);
    return {
      lifeScore,
      activeGoals,
      habitCompletionRate: Math.round(habitRate),
      todaysTasksCount: dueTodayTasks.length,
      recentGoals: goals,
      todaysHabits: habits.map((habit) => ({ ...habit, completedToday: todayCheckIns.some((c) => c.habitId === habit.id && c.isCompleted) })),
      todaysTasks: dueTodayTasks,
      learningSummary: {
        activeItems: learning.filter((item) => item.status === 'IN_PROGRESS').length,
        averageProgress: learning.length ? Math.round(learning.reduce((sum, item) => sum + item.progress, 0) / learning.length) : 0,
        items: learning
      },
      recentActivity
    };
  }
}
