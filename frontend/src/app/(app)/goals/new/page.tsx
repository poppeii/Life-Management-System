'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { EntityForm, goalSchema } from '@/components/entity-form';
import { Card, PageHeader } from '@/components/ui';
import { api } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

export default function NewGoalPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const mutation = useMutation({ mutationFn: (body: any) => api('/goals', { method: 'POST', body: JSON.stringify(body) }) });
  return (
    <>
      <PageHeader title={t('createGoal')} description="Name the direction, then let milestones carry the detail." />
      <Card>
        <EntityForm schema={goalSchema} defaults={{ title: '', description: '', category: 'PERSONAL', priority: 'MEDIUM', status: 'IN_PROGRESS', targetDate: '' }} submitLabel={t('createGoal')} fields={[
          { name: 'title', label: t('title') }, { name: 'description', label: t('description'), type: 'textarea' },
          { name: 'category', label: t('category'), type: 'select', options: ['HEALTH', 'CAREER', 'FINANCE', 'LEARNING', 'PERSONAL', 'RELATIONSHIP', 'TRAVEL'] },
          { name: 'priority', label: t('priority'), type: 'select', options: ['LOW', 'MEDIUM', 'HIGH'] }, { name: 'targetDate', label: t('targetDate'), type: 'date' }
        ]} onSubmit={async (values) => { await mutation.mutateAsync(values); await queryClient.invalidateQueries({ queryKey: ['goals'] }); toast.success('Goal created'); router.push('/goals'); }} />
      </Card>
    </>
  );
}
