'use client';

import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { Card, EmptyState, PageHeader } from '@/components/ui';
import { api } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';

export default function CalendarPage() {
  const { t } = useTranslation();
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());
  const days = eachDayOfInterval({ start, end });
  const { data, error } = useQuery({ queryKey: ['calendar', format(start, 'yyyy-MM-dd')], queryFn: () => api<any[]>(`/calendar?startDate=${format(start, 'yyyy-MM-dd')}&endDate=${format(end, 'yyyy-MM-dd')}`) });
  if (error) return <EmptyState title="Calendar unavailable" description={(error as Error).message} />;
  return (
    <>
      <PageHeader title={t('calendarTitle')} description={format(new Date(), 'MMMM yyyy')} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-7">{days.map((day) => {
        const key = format(day, 'yyyy-MM-dd');
        const events = data?.filter((event) => event.date?.startsWith(key)) ?? [];
        const isToday = key === format(new Date(), 'yyyy-MM-dd');
        return <Card key={key} className={isToday ? 'border-primary-300 bg-primary-50/60' : ''}><p className="mb-3 text-sm font-medium">{format(day, 'd')}</p><div className="space-y-2">{events.slice(0, 3).map((event) => <div key={event.id} className="truncate rounded-md bg-white px-2 py-1 text-xs ring-1 ring-slate-200">{event.title}</div>)}</div></Card>;
      })}</div>
    </>
  );
}
