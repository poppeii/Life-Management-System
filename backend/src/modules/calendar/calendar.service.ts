import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  async events(userId: string, startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const [tasks, milestones, habits] = await Promise.all([
      this.prisma.task.findMany({ where: { userId, deletedAt: null, dueDate: { gte: start, lte: end } } }),
      this.prisma.goalMilestone.findMany({ where: { deletedAt: null, dueDate: { gte: start, lte: end }, goal: { userId } }, include: { goal: true } }),
      this.prisma.habit.findMany({ where: { userId, deletedAt: null, isArchived: false, reminderTime: { not: null } } })
    ]);
    return [
      ...tasks.map((task) => ({ id: `task-${task.id}`, type: 'TASK', title: task.title, date: task.dueDate, status: task.status, category: task.priority, sourceId: task.id })),
      ...milestones.map((milestone) => ({ id: `milestone-${milestone.id}`, type: 'GOAL_MILESTONE', title: milestone.title, date: milestone.dueDate, status: milestone.status, category: milestone.goal.category, sourceId: milestone.id })),
      ...habits.map((habit) => ({ id: `habit-${habit.id}`, type: 'HABIT', title: habit.title, date: start, status: habit.frequency, category: habit.category, sourceId: habit.id }))
    ];
  }
}
