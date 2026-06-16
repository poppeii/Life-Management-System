'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { EntityForm, taskSchema } from '@/components/entity-form';
import { Card, PageHeader } from '@/components/ui';
import { api } from '@/lib/api';

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ['task', id], queryFn: () => api<any>(`/tasks/${id}`) });
  const mutation = useMutation({ mutationFn: (body: any) => api(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) }) });
  if (!data) return <PageHeader title="Edit Task" description="Loading..." />;
  return <><PageHeader title="Edit Task" /><Card><EntityForm schema={taskSchema} defaults={{ title: data.title, description: data.description ?? '', status: data.status, priority: data.priority, dueDate: data.dueDate?.slice(0, 10) ?? '' }} submitLabel="Save task" fields={[{ name: 'title', label: 'Title' }, { name: 'description', label: 'Description', type: 'textarea' }, { name: 'status', label: 'Status', type: 'select', options: ['TODO', 'IN_PROGRESS', 'WAITING', 'DONE', 'CANCELLED'] }, { name: 'priority', label: 'Priority', type: 'select', options: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] }, { name: 'dueDate', label: 'Due date', type: 'date' }]} onSubmit={async (values) => { await mutation.mutateAsync(values); await queryClient.invalidateQueries({ queryKey: ['task', id] }); toast.success('Task saved'); router.push(`/tasks/${id}`); }} /></Card></>;
}
