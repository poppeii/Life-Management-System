'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Badge, Button, Card, EmptyState, Input, PageHeader } from '@/components/ui';
import { api } from '@/lib/api';
import { useState } from 'react';

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [subtask, setSubtask] = useState('');
  const [comment, setComment] = useState('');
  const { data: task, error } = useQuery({ queryKey: ['task', id], queryFn: () => api<any>(`/tasks/${id}`) });
  const addSubtask = useMutation({ mutationFn: () => api(`/tasks/${id}/subtasks`, { method: 'POST', body: JSON.stringify({ title: subtask }) }) });
  const addComment = useMutation({ mutationFn: () => api(`/tasks/${id}/comments`, { method: 'POST', body: JSON.stringify({ content: comment }) }) });
  const remove = useMutation({ mutationFn: () => api(`/tasks/${id}`, { method: 'DELETE' }) });
  if (error) return <EmptyState title="Task unavailable" description={(error as Error).message} />;
  if (!task) return <PageHeader title="Task" description="Loading..." />;
  async function refresh() { await queryClient.invalidateQueries({ queryKey: ['task', id] }); await queryClient.invalidateQueries({ queryKey: ['kanban'] }); }
  return (
    <>
      <PageHeader title={task.title} description={task.description} action={<div className="flex gap-2"><Link href={`/tasks/${id}/edit`}><Button variant="ghost">Edit</Button></Link><Button variant="danger" onClick={async () => { await remove.mutateAsync(); toast.success('Task deleted'); router.push('/tasks'); }}>Delete</Button></div>} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><h2 className="mb-3 font-semibold">Details</h2><div className="flex gap-2"><Badge>{task.status}</Badge><Badge tone="blue">{task.priority}</Badge></div></Card>
        <Card><h2 className="mb-3 font-semibold">Add Subtask</h2><div className="flex gap-2"><Input value={subtask} onChange={(e) => setSubtask(e.target.value)} /><Button onClick={async () => { await addSubtask.mutateAsync(); setSubtask(''); await refresh(); }}>Add</Button></div></Card>
        <Card><h2 className="mb-4 font-semibold">Subtasks</h2><div className="space-y-2">{task.subtasks?.map((item: any) => <div key={item.id} className="rounded-lg bg-slate-50 p-3">{item.title}</div>)}</div></Card>
        <Card><h2 className="mb-3 font-semibold">Comments</h2><div className="mb-3 flex gap-2"><Input value={comment} onChange={(e) => setComment(e.target.value)} /><Button onClick={async () => { await addComment.mutateAsync(); setComment(''); await refresh(); }}>Post</Button></div><div className="space-y-2">{task.comments?.map((item: any) => <div key={item.id} className="rounded-lg bg-slate-50 p-3 text-sm">{item.content}</div>)}</div></Card>
      </div>
    </>
  );
}
