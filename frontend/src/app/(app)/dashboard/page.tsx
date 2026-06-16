'use client';

import { useQuery } from '@tanstack/react-query';
import { Activity, BookOpen, CheckCircle2, ListTodo, Target } from 'lucide-react';
import { api } from '@/lib/api';
import { Badge, Card, EmptyState, PageHeader, ProgressBar } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({ queryKey: ['dashboard'], queryFn: () => api<any>('/dashboard/summary') });
  if (isLoading) return <PageHeader title={t('dashboardTitle')} description={t('loadingDashboard')} />;
  if (error) return <EmptyState title={t('dashboardUnavailable')} description={(error as Error).message} />;
  const cards = [
    { label: t('lifeScore'), value: `${data.lifeScore}%`, icon: Activity },
    { label: t('activeGoals'), value: data.activeGoals, icon: Target },
    { label: t('habitCompletion'), value: `${data.habitCompletionRate}%`, icon: CheckCircle2 },
    { label: t('todaysTasks'), value: data.todaysTasksCount, icon: ListTodo }
  ];
  return (
    <>
      <PageHeader title={t('dashboardTitle')} description={t('dashboardDescription')} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => <Card key={card.label} className="p-4"><card.icon className="mb-3 text-primary-600" /><p className="text-sm text-slate-500">{card.label}</p><p className="mt-1 text-2xl font-semibold sm:text-3xl">{card.value}</p></Card>)}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card><h2 className="mb-4 font-semibold">{t('recentGoals')}</h2><div className="space-y-4">{data.recentGoals?.map((goal: any) => <div key={goal.id}><div className="mb-2 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between"><span className="min-w-0 truncate">{goal.title}</span><Badge>{goal.status}</Badge></div><ProgressBar value={goal.progress} /></div>)}</div></Card>
        <Card><h2 className="mb-4 font-semibold">{t('todaysHabits')}</h2><div className="space-y-3">{data.todaysHabits?.map((habit: any) => <div key={habit.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3"><span className="min-w-0 truncate">{habit.title}</span><Badge tone={habit.completedToday ? 'green' : 'slate'}>{habit.completedToday ? t('done') : t('open')}</Badge></div>)}</div></Card>
        <Card><h2 className="mb-4 font-semibold">{t('todaysTasks')}</h2><div className="space-y-3">{data.todaysTasks?.length ? data.todaysTasks.map((task: any) => <div key={task.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3"><span className="min-w-0 truncate">{task.title}</span><Badge tone="blue">{task.priority}</Badge></div>) : <p className="text-sm text-slate-500">{t('noTasksToday')}</p>}</div></Card>
        <Card><h2 className="mb-4 flex items-center gap-2 font-semibold"><BookOpen size={18} /> {t('learning')}</h2><p className="text-sm text-slate-500">{t('averageProgress')}</p><p className="mb-3 text-3xl font-semibold">{data.learningSummary.averageProgress}%</p><ProgressBar value={data.learningSummary.averageProgress} /></Card>
        <Card className="lg:col-span-2"><h2 className="mb-4 font-semibold">{t('recentActivity')}</h2><div className="grid gap-3 md:grid-cols-2">{data.recentActivity?.map((item: any) => <div key={item.id} className="rounded-lg bg-slate-50 p-3 text-sm"><p>{item.description}</p><p className="mt-1 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p></div>)}</div></Card>
      </div>
    </>
  );
}
