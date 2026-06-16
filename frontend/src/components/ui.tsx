import { clsx } from 'clsx';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

export function Button({ className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  return (
    <button
      className={clsx(
        'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary' && 'bg-primary-600 text-white shadow-sm hover:bg-primary-700',
        variant === 'ghost' && 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50',
        variant === 'danger' && 'bg-rose-600 text-white hover:bg-rose-700',
        className
      )}
      {...props}
    />
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-primary-100 focus:ring-4" {...props} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-primary-100 focus:ring-4" {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none ring-primary-100 focus:ring-4" {...props} />;
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-soft sm:p-5', className)} {...props} />;
}

export function Badge({ children, tone = 'purple' }: { children: React.ReactNode; tone?: 'purple' | 'blue' | 'green' | 'amber' | 'slate' }) {
  const tones = { purple: 'bg-primary-50 text-primary-700', blue: 'bg-skysoft text-sky-800', green: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700', slate: 'bg-slate-100 text-slate-700' };
  return <span className={clsx('rounded-full px-2.5 py-1 text-xs font-medium', tones[tone])}>{children}</span>;
}

export function ProgressBar({ value }: { value: number }) {
  return <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-primary-600" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>;
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex min-w-0 flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold tracking-normal text-ink sm:text-2xl">{title}</h1>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 flex-col gap-2 sm:flex-row">{action}</div> : null}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <Card className="text-center"><h2 className="font-medium">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></Card>;
}
