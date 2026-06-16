'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Badge, Button, Card, EmptyState, PageHeader, ProgressBar } from '@/components/ui';
import { useTranslation } from '@/lib/i18n';

export default function GoalsPage() {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({ queryKey: ['goals'], queryFn: () => api<any[]>('/goals') });
  return (
    <>
      <PageHeader title={t('goalsTitle')} description={t('goalsDescription')} action={<Link href="/goals/new"><Button><Plus size={16} />{t('newGoal')}</Button></Link>} />
      {isLoading ? <p>Loading goals...</p> : error ? <EmptyState title="Could not load goals" description={(error as Error).message} /> : !data?.length ? <EmptyState title={t('noGoals')} description={t('noGoalsDescription')} /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{data.map((goal) => (
          <Link key={goal.id} href={`/goals/${goal.id}`}><Card className="h-full hover:border-primary-200"><div className="mb-3 flex justify-between gap-3"><h2 className="font-semibold">{goal.title}</h2><Badge>{goal.status}</Badge></div><p className="mb-4 line-clamp-2 text-sm text-slate-500">{goal.description}</p><ProgressBar value={goal.progress} /><p className="mt-2 text-xs text-slate-500">{goal.progress}% complete</p></Card></Link>
        ))}</div>
      )}
    </>
  );
}
