import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { CommentDto, CreateTaskDto, MoveTaskDto, SubtaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService, private readonly logs: ActivityLogsService) {}

  findAll(userId: string) {
    return this.prisma.task.findMany({ where: { userId, deletedAt: null }, include: { subtasks: true, comments: true, goal: true }, orderBy: [{ status: 'asc' }, { order: 'asc' }] });
  }

  async create(userId: string, dto: CreateTaskDto) {
    const task = await this.prisma.task.create({ data: this.taskData(userId, dto) });
    await this.logs.create({ userId, action: 'TASK_CREATED', entityType: 'TASK', entityId: task.id, description: `Created task: ${task.title}` });
    return task;
  }

  async findOne(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({ where: { id, userId, deletedAt: null }, include: { subtasks: { orderBy: { order: 'asc' } }, comments: { orderBy: { createdAt: 'desc' } }, goal: true } });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    await this.findOne(userId, id);
    const task = await this.prisma.task.update({ where: { id }, data: this.taskData(userId, dto, true) });
    if (dto.status === 'DONE') await this.logs.create({ userId, action: 'TASK_COMPLETED', entityType: 'TASK', entityId: task.id, description: `Completed task: ${task.title}` });
    return task;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.task.update({ where: { id }, data: { deletedAt: new Date() } });
    return { ok: true };
  }

  async kanban(userId: string) {
    const tasks = await this.findAll(userId);
    return ['TODO', 'IN_PROGRESS', 'WAITING', 'DONE'].map((status) => ({ status, tasks: tasks.filter((task) => task.status === status) }));
  }

  async move(userId: string, id: string, dto: MoveTaskDto) {
    await this.findOne(userId, id);
    const task = await this.prisma.task.update({ where: { id }, data: { status: dto.status, order: dto.order ?? 0 } });
    await this.logs.create({ userId, action: dto.status === 'DONE' ? 'TASK_COMPLETED' : 'TASK_MOVED', entityType: 'TASK', entityId: task.id, description: `Moved task: ${task.title}` });
    return task;
  }

  async addSubtask(userId: string, taskId: string, dto: SubtaskDto) {
    await this.findOne(userId, taskId);
    return this.prisma.taskSubtask.create({ data: { taskId, title: dto.title, isCompleted: dto.isCompleted ?? false, order: dto.order ?? 0 } });
  }

  async updateSubtask(userId: string, taskId: string, subtaskId: string, dto: SubtaskDto) {
    await this.findOne(userId, taskId);
    return this.prisma.taskSubtask.update({ where: { id: subtaskId }, data: dto });
  }

  async deleteSubtask(userId: string, taskId: string, subtaskId: string) {
    await this.findOne(userId, taskId);
    await this.prisma.taskSubtask.delete({ where: { id: subtaskId } });
    return { ok: true };
  }

  async addComment(userId: string, taskId: string, dto: CommentDto) {
    await this.findOne(userId, taskId);
    return this.prisma.taskComment.create({ data: { taskId, userId, content: dto.content } });
  }

  async comments(userId: string, taskId: string) {
    await this.findOne(userId, taskId);
    return this.prisma.taskComment.findMany({ where: { taskId, userId }, orderBy: { createdAt: 'desc' } });
  }

  private taskData(userId: string, dto: CreateTaskDto | UpdateTaskDto, partial = false): any {
    return {
      ...(partial ? {} : { userId }),
      title: dto.title,
      description: dto.description,
      goalId: dto.goalId,
      status: dto.status,
      priority: dto.priority,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      order: dto.order
    };
  }
}
