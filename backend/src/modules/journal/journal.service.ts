import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { startOfIsoDay } from '../../shared/utils/date';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { JournalDto } from './dto';

@Injectable()
export class JournalService {
  constructor(private readonly prisma: PrismaService, private readonly logs: ActivityLogsService) {}

  findAll(userId: string, search?: string) {
    return this.prisma.journalEntry.findMany({
      where: { userId, deletedAt: null, ...(search ? { OR: [{ note: { contains: search, mode: 'insensitive' } }, { gratitude: { contains: search, mode: 'insensitive' } }] } : {}) },
      orderBy: { entryDate: 'desc' }
    });
  }

  async create(userId: string, dto: JournalDto) {
    const entryDate = startOfIsoDay(new Date(dto.entryDate));
    const entry = await this.prisma.journalEntry.upsert({
      where: { userId_entryDate: { userId, entryDate } },
      update: { ...dto, entryDate },
      create: { userId, ...dto, entryDate }
    });
    await this.logs.create({ userId, action: 'JOURNAL_ENTRY_CREATED', entityType: 'JOURNAL_ENTRY', entityId: entry.id, description: `Saved journal entry for ${entryDate.toISOString().slice(0, 10)}` });
    return entry;
  }

  async findOne(userId: string, id: string) {
    const entry = await this.prisma.journalEntry.findFirst({ where: { id, userId, deletedAt: null } });
    if (!entry) throw new NotFoundException('Journal entry not found');
    return entry;
  }

  async update(userId: string, id: string, dto: JournalDto) {
    await this.findOne(userId, id);
    return this.prisma.journalEntry.update({ where: { id }, data: { ...dto, entryDate: startOfIsoDay(new Date(dto.entryDate)) } });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.journalEntry.update({ where: { id }, data: { deletedAt: new Date() } });
    return { ok: true };
  }
}
