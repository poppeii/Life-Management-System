import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryDto } from '../../shared/dto/pagination.dto';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { CreateGoalDto, CreateMilestoneDto, UpdateGoalDto, UpdateMilestoneDto } from './dto';

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService, private readonly logs: ActivityLogsService) {}

  findAll(userId: string, query: QueryDto) {
    const where: Prisma.GoalWhereInput = {
      userId,
      deletedAt: null,
      ...(query.status ? { status: query.status as any } : {}),
      ...(query.category ? { category: query.category as any } : {}),
      ...(query.search ? { title: { contains: query.search, mode: 'insensitive' } } : {})
    };
    return this.prisma.goal.findMany({
      where,
      include: { milestones: { where: { deletedAt: null }, orderBy: { order: 'asc' } } },
      orderBy: query.sort === 'dueDate' ? { targetDate: 'asc' } : { createdAt: 'desc' }
    });
  }

  async create(userId: string, dto: CreateGoalDto) {
    const goal = await this.prisma.goal.create({ data: this.goalData(userId, dto) });
    await this.logs.create({ userId, action: 'GOAL_CREATED', entityType: 'GOAL', entityId: goal.id, description: `Created goal: ${goal.title}` });
    return goal;
  }

  async findOne(userId: string, id: string) {
    const goal = await this.prisma.goal.findFirst({
      where: { id, userId, deletedAt: null },
      include: { milestones: { where: { deletedAt: null }, orderBy: { order: 'asc' } }, tasks: { where: { deletedAt: null } } }
    });
    if (!goal) throw new NotFoundException('Goal not found');
    return goal;
  }

  async update(userId: string, id: string, dto: UpdateGoalDto) {
    await this.findOne(userId, id);
    const goal = await this.prisma.goal.update({ where: { id }, data: this.goalData(userId, dto, true) });
    await this.logs.create({ userId, action: 'GOAL_UPDATED', entityType: 'GOAL', entityId: id, description: `Updated goal: ${goal.title}` });
    return goal;
  }

  async remove(userId: string, id: string) {
    const goal = await this.findOne(userId, id);
    await this.prisma.goal.update({ where: { id }, data: { deletedAt: new Date() } });
    await this.logs.create({ userId, action: 'GOAL_DELETED', entityType: 'GOAL', entityId: id, description: `Deleted goal: ${goal.title}` });
    return { ok: true };
  }

  async createMilestone(userId: string, goalId: string, dto: CreateMilestoneDto) {
    await this.findOne(userId, goalId);
    const milestone = await this.prisma.goalMilestone.create({ data: { goalId, title: dto.title, description: dto.description, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined, order: dto.order ?? 0 } });
    await this.updateGoalProgress(goalId);
    return milestone;
  }

  async updateMilestone(userId: string, goalId: string, milestoneId: string, dto: UpdateMilestoneDto) {
    await this.ensureMilestone(userId, goalId, milestoneId);
    const milestone = await this.prisma.goalMilestone.update({
      where: { id: milestoneId },
      data: { title: dto.title, description: dto.description, dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined, order: dto.order, status: dto.status as any }
    });
    await this.updateGoalProgress(goalId);
    return milestone;
  }

  async completeMilestone(userId: string, goalId: string, milestoneId: string) {
    await this.ensureMilestone(userId, goalId, milestoneId);
    const milestone = await this.prisma.goalMilestone.update({ where: { id: milestoneId }, data: { status: 'COMPLETED', completedAt: new Date() } });
    await this.updateGoalProgress(goalId);
    await this.logs.create({ userId, action: 'MILESTONE_COMPLETED', entityType: 'GOAL_MILESTONE', entityId: milestoneId, description: `Completed milestone: ${milestone.title}` });
    return milestone;
  }

  async removeMilestone(userId: string, goalId: string, milestoneId: string) {
    await this.ensureMilestone(userId, goalId, milestoneId);
    await this.prisma.goalMilestone.update({ where: { id: milestoneId }, data: { deletedAt: new Date() } });
    await this.updateGoalProgress(goalId);
    return { ok: true };
  }

  private goalData(userId: string, dto: CreateGoalDto | UpdateGoalDto, partial = false): any {
    return {
      ...(partial ? {} : { userId }),
      title: dto.title,
      description: dto.description,
      category: dto.category,
      priority: dto.priority,
      status: dto.status,
      progress: dto.progress,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined
    };
  }

  private async ensureMilestone(userId: string, goalId: string, milestoneId: string) {
    const milestone = await this.prisma.goalMilestone.findFirst({ where: { id: milestoneId, goalId, deletedAt: null }, include: { goal: true } });
    if (!milestone) throw new NotFoundException('Milestone not found');
    if (milestone.goal.userId !== userId) throw new ForbiddenException('Milestone belongs to another user');
    return milestone;
  }

  private async updateGoalProgress(goalId: string) {
    const milestones = await this.prisma.goalMilestone.findMany({ where: { goalId, deletedAt: null } });
    const progress = milestones.length ? Math.round((milestones.filter((m) => m.status === 'COMPLETED').length / milestones.length) * 100) : 0;
    await this.prisma.goal.update({ where: { id: goalId }, data: { progress, status: progress === 100 ? 'COMPLETED' : 'IN_PROGRESS' } });
  }
}
