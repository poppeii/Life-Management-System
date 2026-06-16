import { TasksService } from './tasks.service';

describe('TasksService', () => {
  it('moves a task and records activity', async () => {
    const prisma: any = {
      task: {
        findFirst: jest.fn().mockResolvedValue({ id: 't1', userId: 'u1', title: 'Move me' }),
        update: jest.fn().mockResolvedValue({ id: 't1', title: 'Move me', status: 'DONE' })
      }
    };
    const logs: any = { create: jest.fn() };
    const service = new TasksService(prisma, logs);
    await service.move('u1', 't1', { status: 'DONE' as any, order: 1 });
    expect(prisma.task.update).toHaveBeenCalledWith({ where: { id: 't1' }, data: { status: 'DONE', order: 1 } });
    expect(logs.create).toHaveBeenCalledWith(expect.objectContaining({ action: 'TASK_COMPLETED' }));
  });
});
