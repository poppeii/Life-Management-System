'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { EntityForm, goalSchema } from '@/components/entity-form';
import { Card, PageHeader } from '@/components/ui';
import { api } from '@/lib/api';

export default function EditGoalPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ['goal', id], queryFn: () => api<any>(`/goals/${id}`) });
  const mutation = useMutation({ mutationFn: (body: any) => api(`/goals/${id}`, { method: 'PATCH', body: JSON.stringify(body) }) });
  if (!data) return <PageHeader title="Edit Goal" description="Loading..." />;
  return <><PageHeader title="Edit Goal" /><Card><EntityForm schema={goalSchema} defaults={{ title: data.title, description: data.description ?? '', category: data.category, priority: data.priority, status: data.status, targetDate: data.targetDate?.slice(0, 10) ?? '' }} submitLabel="Save goal" fields={[{ name: 'title', label: 'Title' }, { name: 'description', label: 'Description', type: 'textarea' }, { name: 'category', label: 'Category', type: 'select', options: ['HEALTH', 'CAREER', 'FINANCE', 'LEARNING', 'PERSONAL', 'RELATIONSHIP', 'TRAVEL'] }, { name: 'priority', label: 'Priority', type: 'select', options: ['LOW', 'MEDIUM', 'HIGH'] }, { name: 'status', label: 'Status', type: 'select', options: ['NOT_STARTED', 'IN_PROGRESS', 'ON_TRACK', 'AT_RISK', 'COMPLETED', 'PAUSED', 'CANCELLED'] }, { name: 'targetDate', label: 'Target date', type: 'date' }]} onSubmit={async (values) => { await mutation.mutateAsync(values); await queryClient.invalidateQueries({ queryKey: ['goal', id] }); toast.success('Goal saved'); router.push(`/goals/${id}`); }} /></Card></>;
}
