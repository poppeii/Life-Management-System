'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Badge, Button, Card, EmptyState, PageHeader } from '@/components/ui';
import { api } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

export default function TasksPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ['kanban'], queryFn: () => api<any[]>('/tasks/kanban') });
  const move = useMutation({ mutationFn: ({ id, status }: { id: string; status: string }) => api(`/tasks/${id}/move`, { method: 'PATCH', body: JSON.stringify({ status }) }) });
  async function moveTask(id: string, status: string) { await move.mutateAsync({ id, status }); await queryClient.invalidateQueries({ queryKey: ['kanban'] }); toast.success('Task moved'); }
  const labels: Record<string, string> = { TODO: t('todo'), IN_PROGRESS: t('inProgress'), WAITING: t('waiting'), DONE: t('done') };
  return (
    <>
      <PageHeader title={t('tasksTitle')} description={t('tasksDescription')} action={<Link href="/tasks/new"><Button><Plus size={16} />{t('newTask')}</Button></Link>} />
      {isLoading ? <p>{t('loadingBoard')}</p> : error ? <EmptyState title={t('boardUnavailable')} description={(error as Error).message} /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{data?.map((column) => <div key={column.status} className="min-w-0 rounded-lg border border-slate-200 bg-white/70 p-3"><h2 className="mb-3 font-semibold">{labels[column.status]}</h2><div className="space-y-3">{column.tasks.map((task: any) => <Card key={task.id} className="p-4"><Link href={`/tasks/${task.id}`} className="block truncate font-medium">{task.title}</Link><div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><Badge tone={task.priority === 'URGENT' ? 'amber' : 'blue'}>{task.priority}</Badge><select className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm sm:text-xs" value={task.status} onChange={(event) => moveTask(task.id, event.target.value)}>{Object.keys(labels).map((status) => <option key={status}>{status}</option>)}</select></div></Card>)}</div></div>)}</div>
      )}
    </>
  );
}
