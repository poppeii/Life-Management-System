'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { useTranslation } from '@/lib/i18n';
import { Button, Card, Input } from './ui';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const registerSchema = loginSchema.extend({
  name: z.string().min(1)
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type Values = LoginValues & Partial<RegisterValues>;

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const { t } = useTranslation();
  const form = useForm<Values>({
    resolver: zodResolver(mode === 'register' ? registerSchema : loginSchema),
    defaultValues: { name: '', email: '', password: '' }
  });

  async function submit(values: Values) {
    try {
      const session = mode === 'register'
        ? await authApi.register({ name: values.name ?? '', email: values.email, password: values.password })
        : await authApi.login({ email: values.email, password: values.password });
      setSession(session);
      toast.success(mode === 'register' ? t('welcomeToLifeOS') : t('welcomeBack'));
      router.push('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    }
  }

  function showValidationError(errors: FieldErrors<Values>) {
    const firstError = errors.name?.message ?? errors.email?.message ?? errors.password?.message ?? 'Please check the form';
    toast.error(String(firstError));
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <div className="mb-4 grid size-11 place-items-center rounded-lg bg-primary-600 text-lg font-bold text-white">L</div>
          <h1 className="text-2xl font-semibold">{mode === 'register' ? t('registerTitle') : t('loginTitle')}</h1>
          <p className="mt-1 text-sm text-slate-500">{t('authSubtitle')}</p>
        </div>
        <form onSubmit={form.handleSubmit(submit, showValidationError)} className="space-y-4">
          {mode === 'register' ? <label className="block text-sm font-medium">{t('name')}<Input className="mt-1" {...form.register('name')} />{form.formState.errors.name ? <span className="mt-1 block text-xs text-rose-600">{form.formState.errors.name.message}</span> : null}</label> : null}
          <label className="block text-sm font-medium">{t('email')}<Input className="mt-1" type="email" {...form.register('email')} />{form.formState.errors.email ? <span className="mt-1 block text-xs text-rose-600">{form.formState.errors.email.message}</span> : null}</label>
          <label className="block text-sm font-medium">{t('password')}<Input className="mt-1" type="password" {...form.register('password')} />{form.formState.errors.password ? <span className="mt-1 block text-xs text-rose-600">{form.formState.errors.password.message}</span> : null}</label>
          <Button className="w-full" disabled={form.formState.isSubmitting}>{mode === 'register' ? t('register') : t('login')}</Button>
        </form>
        <p className="mt-5 text-sm text-slate-500">
          {mode === 'register' ? t('alreadyHaveAccount') : t('newHere')}{' '}
          <Link className="font-medium text-primary-700" href={mode === 'register' ? '/login' : '/register'}>
            {mode === 'register' ? t('login') : t('register')}
          </Link>
        </p>
      </Card>
    </main>
  );
}
