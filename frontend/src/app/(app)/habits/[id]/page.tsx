'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Badge, Button, Card, EmptyState, Input, PageHeader } from '@/components/ui';
import { api } from '@/lib/api';
import { useState } from 'react';

export default function HabitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [value, setValue] = useState('1');
  const queryClient = useQueryClient();
  const { data: habit, isLoading, error } = useQuery({ queryKey: ['habit', id], queryFn: () => api<any>(`/habits/${id}`) });
  const checkIn = useMutation({ mutationFn: () => api(`/habits/${id}/check-ins`, { method: 'POST', body: JSON.stringify({ value: Number(value) }) }) });
  if (isLoading) return <PageHeader title="Habit" description="Loading..." />;
  if (error || !habit) return <EmptyState title="Habit unavailable" description={(error as Error)?.message ?? 'Not found'} />;
  return (
    <>
      <PageHeader title={habit.title} description={habit.description} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card><div className="grid gap-4 sm:grid-cols-3"><div><p className="text-sm text-slate-500">Current streak</p><p className="text-3xl font-semibold">{habit.stats.currentStreak}</p></div><div><p className="text-sm text-slate-500">Best streak</p><p className="text-3xl font-semibold">{habit.stats.bestStreak}</p></div><div><p className="text-sm text-slate-500">Success rate</p><p className="text-3xl font-semibold">{habit.stats.successRate}%</p></div></div></Card>
        <Card><h2 className="mb-3 font-semibold">Check in today</h2><div className="flex gap-2"><Input type="number" value={value} onChange={(event) => setValue(event.target.value)} /><Button onClick={async () => { await checkIn.mutateAsync(); await queryClient.invalidateQueries({ queryKey: ['habit', id] }); await queryClient.invalidateQueries({ queryKey: ['habits'] }); toast.success('Habit checked in'); }}>Check in</Button></div></Card>
        <Card className="lg:col-span-2"><h2 className="mb-4 font-semibold">History</h2><div className="space-y-3">{habit.checkIns?.map((item: any) => <div key={item.id} className="flex justify-between rounded-lg bg-slate-50 p-3"><span>{new Date(item.checkInDate).toLocaleDateString()}</span><Badge tone={item.isCompleted ? 'green' : 'amber'}>{item.value} {habit.unit}</Badge></div>)}</div></Card>
      </div>
    </>
  );
}
