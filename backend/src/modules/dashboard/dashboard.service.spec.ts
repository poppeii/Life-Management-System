import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  it('calculates a life score from goals, habits, tasks, and journal consistency', async () => {
    const prisma: any = {
      goal: { findMany: jest.fn().mockResolvedValue([{ progress: 100, status: 'IN_PROGRESS' }]) },
      habit: { findMany: jest.fn().mockResolvedValue([{ id: 'h1' }]) },
      habitCheckIn: { findMany: jest.fn().mockResolvedValue([{ habitId: 'h1', isCompleted: true }]) },
      task: { findMany: jest.fn().mockResolvedValue([{ status: 'DONE', dueDate: new Date() }]) },
      learningItem: { findMany: jest.fn().mockResolvedValue([{ status: 'IN_PROGRESS', progress: 50 }]) },
      journalEntry: { findMany: jest.fn().mockResolvedValue(new Array(7).fill({})) },
      activityLog: { findMany: jest.fn().mockResolvedValue([]) }
    };
    const result = await new DashboardService(prisma).summary('u1');
    expect(result.lifeScore).toBe(100);
  });
});
