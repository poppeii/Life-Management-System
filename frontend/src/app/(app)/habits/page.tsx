'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { EntityForm, habitSchema } from '@/components/entity-form';
import { Badge, Card, EmptyState, PageHeader } from '@/components/ui';
import { api } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

export default function HabitsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ['habits'], queryFn: () => api<any[]>('/habits') });
  const create = useMutation({ mutationFn: (body: any) => api('/habits', { method: 'POST', body: JSON.stringify(body) }) });
  return (
    <>
      <PageHeader title={t('habitsTitle')} description={t('habitsDescription')} />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div>{isLoading ? <p>Loading habits...</p> : error ? <EmptyState title="Could not load habits" description={(error as Error).message} /> : !data?.length ? <EmptyState title={t('noHabits')} description={t('noHabitsDescription')} /> : <div className="grid gap-4 md:grid-cols-2">{data.map((habit) => <Link key={habit.id} href={`/habits/${habit.id}`}><Card><div className="flex items-start justify-between gap-3"><h2 className="min-w-0 truncate font-semibold">{habit.title}</h2><Badge tone={habit.stats?.todayCompleted ? 'green' : 'slate'}>{habit.stats?.todayCompleted ? t('done') : t('open')}</Badge></div><p className="mt-2 text-sm text-slate-500">{habit.category}</p><p className="mt-4 text-sm">{t('currentStreak')}: <b>{habit.stats?.currentStreak ?? 0}</b></p><p className="text-sm">{t('successRate')}: <b>{habit.stats?.successRate ?? 0}%</b></p></Card></Link>)}</div>}</div>
        <Card><h2 className="mb-4 flex items-center gap-2 font-semibold"><Plus size={16} />{t('newHabit')}</h2><EntityForm schema={habitSchema} defaults={{ title: '', description: '', category: 'PRODUCTIVITY', frequency: 'DAILY', targetValue: 1, unit: 'times' }} submitLabel={t('createHabit')} fields={[{ name: 'title', label: t('title') }, { name: 'description', label: t('description'), type: 'textarea' }, { name: 'category', label: t('category'), type: 'select', options: ['HEALTH', 'LEARNING', 'PRODUCTIVITY', 'MINDFULNESS', 'PERSONAL'] }, { name: 'frequency', label: t('frequency'), type: 'select', options: ['DAILY', 'WEEKLY', 'WEEKDAYS', 'WEEKENDS', 'CUSTOM'] }, { name: 'targetValue', label: t('targetValue'), type: 'number' }, { name: 'unit', label: t('unit') }]} onSubmit={async (values) => { await create.mutateAsync(values); await queryClient.invalidateQueries({ queryKey: ['habits'] }); toast.success('Habit created'); }} /></Card>
      </div>
    </>
  );
}
