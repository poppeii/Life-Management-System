'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button, Card, EmptyState, Input, PageHeader, ProgressBar, Select, Textarea } from '@/components/ui';
import { api } from '@/lib/api';
import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';

export default function LearningPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title: '', description: '', category: 'FRONTEND', source: '', totalHours: 10 });
  const { data, error } = useQuery({ queryKey: ['learning'], queryFn: () => api<any[]>('/learning') });
  const create = useMutation({ mutationFn: () => api('/learning', { method: 'POST', body: JSON.stringify(form) }) });
  return (
    <>
      <PageHeader title={t('learningTitle')} description={t('learningDescription')} />
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-4 md:grid-cols-2">{error ? <EmptyState title="Learning unavailable" description={(error as Error).message} /> : data?.map((item) => <Card key={item.id}><h2 className="font-semibold">{item.title}</h2><p className="mt-1 text-sm text-slate-500">{item.category}</p><div className="mt-4"><ProgressBar value={item.progress} /></div><p className="mt-2 text-sm">{item.completedHours} / {item.totalHours} hours</p></Card>)}</div>
        <Card><h2 className="mb-4 font-semibold">{t('newLearningItem')}</h2><div className="space-y-3"><Input placeholder={t('title')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><Textarea placeholder={t('description')} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /><Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{['FRONTEND', 'BACKEND', 'DATABASE', 'DEVOPS', 'QA', 'SYSTEM_ANALYSIS', 'ENGLISH', 'OTHER'].map((item) => <option key={item}>{item}</option>)}</Select><Input placeholder={t('source')} value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} /><Input aria-label={t('totalHours')} type="number" value={form.totalHours} onChange={(e) => setForm({ ...form, totalHours: Number(e.target.value) })} /><Button onClick={async () => { await create.mutateAsync(); await queryClient.invalidateQueries({ queryKey: ['learning'] }); toast.success('Learning item created'); }}>{t('create')}</Button></div></Card>
      </div>
    </>
  );
}
