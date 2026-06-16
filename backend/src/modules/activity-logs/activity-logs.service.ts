import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type LogInput = { userId: string; action: string; entityType: string; entityId?: string; description: string; metadata?: any };

@Injectable()
export class ActivityLogsService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: LogInput) {
    return this.prisma.activityLog.create({ data: input });
  }

  findAll(userId: string) {
    return this.prisma.activityLog.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 100 });
  }
}
