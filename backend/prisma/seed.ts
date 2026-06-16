import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash('Password123!');
  const user = await prisma.user.upsert({
    where: { email: 'demo@lifeos.dev' },
    update: {},
    create: { name: 'Demo User', email: 'demo@lifeos.dev', passwordHash, avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Demo' }
  });

  const goal = await prisma.goal.create({
    data: {
      userId: user.id,
      title: 'Build a calm weekly routine',
      description: 'Create a realistic rhythm for work, learning, movement, and reflection.',
      category: 'PERSONAL',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      progress: 50,
      targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45)
    }
  });

  await prisma.goalMilestone.createMany({
    data: [
      { goalId: goal.id, title: 'Define weekly anchors', status: 'COMPLETED', completedAt: new Date(), order: 1 },
      { goalId: goal.id, title: 'Review the routine for two Sundays', status: 'TODO', dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), order: 2 }
    ]
  });

  const habit = await prisma.habit.create({
    data: { userId: user.id, title: 'Morning planning', category: 'PRODUCTIVITY', frequency: 'DAILY', targetValue: 1, unit: 'session', icon: 'sun', color: '#7c3aed', reminderTime: '08:30' }
  });

  await prisma.habitCheckIn.create({
    data: { userId: user.id, habitId: habit.id, checkInDate: new Date(new Date().toISOString().slice(0, 10)), value: 1, isCompleted: true, note: 'Started gently.' }
  });

  await prisma.task.createMany({
    data: [
      { userId: user.id, goalId: goal.id, title: 'Plan this week', status: 'TODO', priority: 'HIGH', dueDate: new Date() },
      { userId: user.id, title: 'Clear inbox for 20 minutes', status: 'IN_PROGRESS', priority: 'MEDIUM' }
    ]
  });

  const learning = await prisma.learningItem.create({
    data: { userId: user.id, title: 'NestJS testing patterns', category: 'BACKEND', source: 'Docs and examples', status: 'IN_PROGRESS', progress: 35, totalHours: 12, completedHours: 4 }
  });
  await prisma.studyLog.create({ data: { userId: user.id, learningItemId: learning.id, topic: 'Supertest integration tests', durationMinutes: 45, note: 'Mapped happy paths.' } });

  await prisma.journalEntry.upsert({
    where: { userId_entryDate: { userId: user.id, entryDate: new Date(new Date().toISOString().slice(0, 10)) } },
    update: {},
    create: { userId: user.id, entryDate: new Date(new Date().toISOString().slice(0, 10)), mood: 'CALM', whatWentWell: 'Protected focus time.', gratitude: 'A quiet start.', tomorrowFocus: 'Keep the plan small.' }
  });

  await prisma.activityLog.createMany({
    data: [
      { userId: user.id, action: 'USER_REGISTERED', entityType: 'USER', entityId: user.id, description: 'Demo user registered' },
      { userId: user.id, action: 'GOAL_CREATED', entityType: 'GOAL', entityId: goal.id, description: 'Created goal: Build a calm weekly routine' },
      { userId: user.id, action: 'HABIT_CHECKED_IN', entityType: 'HABIT', entityId: habit.id, description: 'Checked in habit: Morning planning' }
    ]
  });
}

main().finally(async () => prisma.$disconnect());
