import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { CreateLearningItemDto, StudyLogDto, UpdateLearningItemDto } from './dto';

@Injectable()
export class LearningService {
  constructor(private readonly prisma: PrismaService, private readonly logs: ActivityLogsService) {}

  findAll(userId: string) {
    return this.prisma.learningItem.findMany({ where: { userId, deletedAt: null }, include: { studyLogs: { orderBy: { studiedAt: 'desc' } } }, orderBy: { createdAt: 'desc' } });
  }

  async create(userId: string, dto: CreateLearningItemDto) {
    const item = await this.prisma.learningItem.create({ data: { userId, ...dto, startDate: dto.startDate ? new Date(dto.startDate) : undefined, targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined } });
    await this.logs.create({ userId, action: 'LEARNING_ITEM_CREATED', entityType: 'LEARNING_ITEM', entityId: item.id, description: `Created learning item: ${item.title}` });
    return item;
  }

  async findOne(userId: string, id: string) {
    const item = await this.prisma.learningItem.findFirst({ where: { id, userId, deletedAt: null }, include: { studyLogs: { orderBy: { studiedAt: 'desc' } } } });
    if (!item) throw new NotFoundException('Learning item not found');
    return item;
  }

  async update(userId: string, id: string, dto: UpdateLearningItemDto) {
    await this.findOne(userId, id);
    return this.prisma.learningItem.update({ where: { id }, data: { ...dto, startDate: dto.startDate ? new Date(dto.startDate) : undefined, targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined } });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.learningItem.update({ where: { id }, data: { deletedAt: new Date() } });
    return { ok: true };
  }

  async addStudyLog(userId: string, id: string, dto: StudyLogDto) {
    await this.findOne(userId, id);
    const log = await this.prisma.studyLog.create({ data: { userId, learningItemId: id, topic: dto.topic, durationMinutes: dto.durationMinutes, note: dto.note, studiedAt: dto.studiedAt ? new Date(dto.studiedAt) : new Date() } });
    await this.prisma.learningItem.update({ where: { id }, data: { completedHours: { increment: dto.durationMinutes / 60 } } });
    return log;
  }

  async studyLogs(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.studyLog.findMany({ where: { userId, learningItemId: id }, orderBy: { studiedAt: 'desc' } });
  }
}
