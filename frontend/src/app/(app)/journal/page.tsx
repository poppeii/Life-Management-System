'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Button, Card, EmptyState, PageHeader, Select, Textarea } from '@/components/ui';
import { api } from '@/lib/api';
import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';

export default function JournalPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ entryDate: format(new Date(), 'yyyy-MM-dd'), mood: 'CALM', whatWentWell: '', whatCanImprove: '', tomorrowFocus: '', gratitude: '', note: '' });
  const { data, error } = useQuery({ queryKey: ['journal'], queryFn: () => api<any[]>('/journal') });
  const save = useMutation({ mutationFn: () => api('/journal', { method: 'POST', body: JSON.stringify(form) }) });
  return (
    <>
      <PageHeader title={t('journalTitle')} description={t('journalDescription')} />
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card><h2 className="mb-4 font-semibold">{t('todaysReflection')}</h2><div className="space-y-3"><Select value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })}>{['HAPPY', 'CALM', 'TIRED', 'STRESSED', 'MOTIVATED', 'SAD', 'NEUTRAL'].map((mood) => <option key={mood}>{mood}</option>)}</Select><Textarea placeholder={t('whatWentWell')} value={form.whatWentWell} onChange={(e) => setForm({ ...form, whatWentWell: e.target.value })} /><Textarea placeholder={t('whatCanImprove')} value={form.whatCanImprove} onChange={(e) => setForm({ ...form, whatCanImprove: e.target.value })} /><Textarea placeholder={t('tomorrowFocus')} value={form.tomorrowFocus} onChange={(e) => setForm({ ...form, tomorrowFocus: e.target.value })} /><Textarea placeholder={t('gratitude')} value={form.gratitude} onChange={(e) => setForm({ ...form, gratitude: e.target.value })} /><Button onClick={async () => { await save.mutateAsync(); await queryClient.invalidateQueries({ queryKey: ['journal'] }); toast.success('Journal saved'); }}>{t('saveEntry')}</Button></div></Card>
        <div className="space-y-4">{error ? <EmptyState title="Journal unavailable" description={(error as Error).message} /> : data?.map((entry) => <Card key={entry.id}><div className="mb-2 flex justify-between"><h2 className="font-semibold">{new Date(entry.entryDate).toLocaleDateString()}</h2><span className="text-sm text-primary-700">{entry.mood}</span></div><p className="text-sm text-slate-600">{entry.whatWentWell || entry.note || entry.gratitude}</p></Card>)}</div>
      </div>
    </>
  );
}
