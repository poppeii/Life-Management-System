'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, EmptyState, PageHeader } from '@/components/ui';
import { api } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

export default function ActivityLogPage() {
  const { t } = useTranslation();
  const { data, error } = useQuery({ queryKey: ['activity'], queryFn: () => api<any[]>('/activity-logs') });
  return (
    <>
      <PageHeader title={t('activityLogTitle')} description={t('activityLogDescription')} />
      {error ? <EmptyState title="Activity unavailable" description={(error as Error).message} /> : <div className="space-y-3">{data?.map((item) => <Card key={item.id} className="p-4"><p className="font-medium">{item.description}</p><p className="mt-1 text-xs text-slate-500">{item.action} · {new Date(item.createdAt).toLocaleString()}</p></Card>)}</div>}
    </>
  );
}
