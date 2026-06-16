import { GoalsService } from './goals.service';

describe('GoalsService', () => {
  it('creates a goal scoped to the current user and writes activity', async () => {
    const prisma: any = { goal: { create: jest.fn().mockResolvedValue({ id: 'g1', title: 'Calm goal' }) } };
    const logs: any = { create: jest.fn() };
    const service = new GoalsService(prisma, logs);
    await service.create('u1', { title: 'Calm goal', category: 'PERSONAL' as any });
    expect(prisma.goal.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ userId: 'u1' }) }));
    expect(logs.create).toHaveBeenCalledWith(expect.objectContaining({ action: 'GOAL_CREATED' }));
  });
});
