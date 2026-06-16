'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button, Card, Input, PageHeader, ProgressBar, Badge } from '@/components/ui';
import { api } from '@/lib/api';
import { useState } from 'react';

export default function GoalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const { data: goal, isLoading } = useQuery({ queryKey: ['goal', id], queryFn: () => api<any>(`/goals/${id}`) });
  const addMilestone = useMutation({ mutationFn: () => api(`/goals/${id}/milestones`, { method: 'POST', body: JSON.stringify({ title }) }) });
  const complete = useMutation({ mutationFn: (milestoneId: string) => api(`/goals/${id}/milestones/${milestoneId}/complete`, { method: 'PATCH' }) });
  const remove = useMutation({ mutationFn: () => api(`/goals/${id}`, { method: 'DELETE' }) });
  if (isLoading || !goal) return <PageHeader title="Goal" description="Loading..." />;
  async function refresh() { await queryClient.invalidateQueries({ queryKey: ['goal', id] }); await queryClient.invalidateQueries({ queryKey: ['goals'] }); }
  return (
    <>
      <PageHeader title={goal.title} description={goal.description} action={<div className="flex gap-2"><Link href={`/goals/${id}/edit`}><Button variant="ghost">Edit</Button></Link><Button variant="danger" onClick={async () => { await remove.mutateAsync(); toast.success('Goal deleted'); router.push('/goals'); }}>Delete</Button></div>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card><div className="mb-3 flex justify-between"><Badge>{goal.status}</Badge><span className="text-sm text-slate-500">{goal.progress}%</span></div><ProgressBar value={goal.progress} /></Card>
        <Card><h2 className="mb-3 font-semibold">Add Milestone</h2><div className="flex gap-2"><Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Milestone title" /><Button onClick={async () => { await addMilestone.mutateAsync(); setTitle(''); await refresh(); }}>Add</Button></div></Card>
        <Card className="lg:col-span-2"><h2 className="mb-4 font-semibold">Milestones</h2><div className="space-y-3">{goal.milestones?.map((m: any) => <div key={m.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3"><div><p className="font-medium">{m.title}</p><p className="text-xs text-slate-500">{m.status}</p></div><Button variant="ghost" disabled={m.status === 'COMPLETED'} onClick={async () => { await complete.mutateAsync(m.id); toast.success('Milestone completed'); await refresh(); }}>Complete</Button></div>)}</div></Card>
      </div>
    </>
  );
}
