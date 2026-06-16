'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-[520px] border-slate-200/80 p-6 shadow-soft sm:p-8">
        <div className="mb-7">
          <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-primary-600 text-2xl font-bold text-white shadow-lg shadow-primary-600/20">L</div>
          <h1 className="text-3xl font-semibold tracking-normal text-ink">{mode === 'register' ? t('registerTitle') : t('loginTitle')}</h1>
          <p className="mt-2 text-base leading-7 text-slate-500">{t('authSubtitle')}</p>
        </div>
        <form onSubmit={form.handleSubmit(submit, showValidationError)} className="space-y-5">
          {mode === 'register' ? (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="name">{t('name')}</label>
              <Input id="name" autoComplete="name" className="h-12 text-base" {...form.register('name')} />
              {form.formState.errors.name ? <span className="mt-2 block text-xs font-medium text-rose-600">{form.formState.errors.name.message}</span> : null}
            </div>
          ) : null}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="email">{t('email')}</label>
            <Input id="email" autoComplete="email" className="h-12 text-base" type="email" {...form.register('email')} />
            {form.formState.errors.email ? <span className="mt-2 block text-xs font-medium text-rose-600">{form.formState.errors.email.message}</span> : null}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="password">{t('password')}</label>
            <div className="relative">
              <Input
                id="password"
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                className="h-12 pr-12 text-base"
                type={showPassword ? 'text' : 'password'}
                {...form.register('password')}
              />
              <button
                type="button"
                aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
            {form.formState.errors.password ? <span className="mt-2 block text-xs font-medium text-rose-600">{form.formState.errors.password.message}</span> : null}
          </div>
          <Button className="h-12 w-full text-base" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : null}
            {mode === 'register' ? t('register') : t('login')}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm font-medium text-slate-500">
          {mode === 'register' ? t('alreadyHaveAccount') : t('newHere')}{' '}
          <Link className="font-semibold text-primary-700 transition hover:text-primary-600" href={mode === 'register' ? '/login' : '/register'}>
            {mode === 'register' ? t('login') : t('register')}
          </Link>
        </p>
      </Card>
    </main>
  );
}
