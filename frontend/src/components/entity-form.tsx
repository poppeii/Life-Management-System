'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Input, Select, Textarea } from './ui';

export const goalSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().default('PERSONAL'),
  priority: z.string().default('MEDIUM'),
  status: z.string().default('IN_PROGRESS'),
  targetDate: z.string().optional()
});

export const habitSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().default('PRODUCTIVITY'),
  frequency: z.string().default('DAILY'),
  targetValue: z.coerce.number().min(1).default(1),
  unit: z.string().default('times')
});

export const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.string().default('TODO'),
  priority: z.string().default('MEDIUM'),
  dueDate: z.string().optional()
});

export function EntityForm<T extends z.ZodTypeAny>({ schema, defaults, onSubmit, fields, submitLabel }: {
  schema: T;
  defaults: z.infer<T>;
  onSubmit: (values: z.infer<T>) => Promise<void>;
  fields: Array<{ name: keyof z.infer<T>; label: string; type?: 'text' | 'textarea' | 'select' | 'date' | 'number'; options?: string[] }>;
  submitLabel: string;
}) {
  const form = useForm<z.infer<T>>({ resolver: zodResolver(schema), defaultValues: defaults });
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field) => (
        <label key={String(field.name)} className="block text-sm font-medium text-slate-700">
          {field.label}
          {field.type === 'textarea' ? <Textarea className="mt-1" {...form.register(field.name as any)} /> : field.type === 'select' ? (
            <Select className="mt-1" {...form.register(field.name as any)}>{field.options?.map((option) => <option key={option}>{option}</option>)}</Select>
          ) : <Input className="mt-1" type={field.type ?? 'text'} {...form.register(field.name as any)} />}
          {form.formState.errors[field.name as string]?.message ? <span className="mt-1 block text-xs text-rose-600">{String(form.formState.errors[field.name as string]?.message)}</span> : null}
        </label>
      ))}
      <Button disabled={form.formState.isSubmitting}>{submitLabel}</Button>
    </form>
  );
}
