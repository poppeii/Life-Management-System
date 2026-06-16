import { HabitsService } from './habits.service';

describe('HabitsService', () => {
  it('marks a check-in completed when value reaches target', async () => {
    const prisma: any = {
      habit: { findFirst: jest.fn().mockResolvedValue({ id: 'h1', userId: 'u1', targetValue: 2, checkIns: [] }) },
      habitCheckIn: { upsert: jest.fn().mockResolvedValue({ isCompleted: true }) }
    };
    const service = new HabitsService(prisma, { create: jest.fn() } as any);
    await service.checkIn('u1', 'h1', { checkInDate: '2026-06-16', value: 2 });
    expect(prisma.habitCheckIn.upsert).toHaveBeenCalledWith(expect.objectContaining({ create: expect.objectContaining({ isCompleted: true }) }));
  });
});
