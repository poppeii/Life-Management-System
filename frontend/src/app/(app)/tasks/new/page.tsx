'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { EntityForm, taskSchema } from '@/components/entity-form';
import { Card, PageHeader } from '@/components/ui';
import { api } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

export default function NewTaskPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const mutation = useMutation({ mutationFn: (body: any) => api('/tasks', { method: 'POST', body: JSON.stringify(body) }) });
  return <><PageHeader title={t('createTask')} /><Card><EntityForm schema={taskSchema} defaults={{ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '' }} submitLabel={t('createTask')} fields={[{ name: 'title', label: t('title') }, { name: 'description', label: t('description'), type: 'textarea' }, { name: 'status', label: t('status'), type: 'select', options: ['TODO', 'IN_PROGRESS', 'WAITING', 'DONE', 'CANCELLED'] }, { name: 'priority', label: t('priority'), type: 'select', options: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] }, { name: 'dueDate', label: t('targetDate'), type: 'date' }]} onSubmit={async (values) => { await mutation.mutateAsync(values); await queryClient.invalidateQueries({ queryKey: ['kanban'] }); toast.success('Task created'); router.push('/tasks'); }} /></Card></>;
}
