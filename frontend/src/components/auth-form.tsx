'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { useTranslation } from '@/lib/i18n';
import { AuthPanelIntro, AuthShell } from './auth-shell';
import { passwordIssues } from './password-policy';
import { Button, Input } from './ui';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const registerSchema = loginSchema.extend({
  name: z.string().min(1),
  password: z.string().superRefine((value, context) => {
    for (const message of passwordIssues(value)) {
      context.addIssue({ code: z.ZodIssueCode.custom, message });
    }
  })
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type Values = LoginValues & Partial<RegisterValues>;

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(mode === 'register' ? registerSchema : loginSchema),
    defaultValues: { name: '', email: '', password: '' }
  });
  const registerPasswordIssues = mode === 'register' && (form.formState.submitCount > 0 || form.formState.touchedFields.password)
    ? passwordIssues(form.watch('password'))
    : [];

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
    <AuthShell>
      <AuthPanelIntro title={mode === 'register' ? t('registerTitle') : t('loginTitle')} subtitle={t('authSubtitle')} />

      <form onSubmit={form.handleSubmit(submit, showValidationError)} className="space-y-3">
        {mode === 'register' ? (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="name">{t('name')}</label>
            <div className="relative">
              <UserRound aria-hidden="true" className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <Input
                id="name"
                autoComplete="name"
                className="h-12 rounded-[18px] border-white/70 bg-white/70 pl-14 text-base shadow-sm placeholder:text-slate-400 focus:bg-white"
                placeholder="Poppie"
                {...form.register('name')}
              />
            </div>
            {form.formState.errors.name ? <span className="mt-2 block text-xs font-medium text-rose-600">{form.formState.errors.name.message}</span> : null}
          </div>
        ) : null}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">{t('email')}</label>
          <div className="relative">
            <Mail aria-hidden="true" className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <Input
              id="email"
              autoComplete="email"
              className="h-12 rounded-[18px] border-white/70 bg-white/70 pl-14 text-base shadow-sm placeholder:text-slate-400 focus:bg-white"
              placeholder="you@example.com"
              type="email"
              {...form.register('email')}
            />
          </div>
          {form.formState.errors.email ? <span className="mt-2 block text-xs font-medium text-rose-600">{form.formState.errors.email.message}</span> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">{t('password')}</label>
          <div className="relative">
            <LockKeyhole aria-hidden="true" className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <Input
              id="password"
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              className="h-12 rounded-[18px] border-white/70 bg-white/70 pl-14 pr-14 text-base shadow-sm placeholder:text-slate-400 focus:bg-white"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              {...form.register('password')}
            />
            <button
              type="button"
              aria-label={showPassword ? t('hidePassword') : t('showPassword')}
              className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-white hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-sky-100"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
          {mode === 'register' && registerPasswordIssues.length ? (
            <ul className="mt-2 space-y-1 text-xs font-medium text-rose-600">
              {registerPasswordIssues.map((message) => <li key={message}>{message}</li>)}
            </ul>
          ) : form.formState.errors.password ? <span className="mt-2 block text-xs font-medium text-rose-600">{form.formState.errors.password.message}</span> : null}
        </div>

        {mode === 'login' ? (
          <div className="flex items-center justify-between gap-3 pt-1 text-sm">
            <label className="inline-flex items-center gap-3 text-slate-600">
              <input
                checked={rememberMe}
                className="size-5 rounded-md border-slate-300 text-[#2980b9] accent-[#2980b9] focus:ring-sky-100"
                onChange={(event) => setRememberMe(event.target.checked)}
                type="checkbox"
              />
              จดจำฉัน
            </label>
            <Link className="font-semibold text-slate-700 transition hover:text-[#2980b9]" href="/forgot-password">
              ลืมรหัสผ่าน?
            </Link>
          </div>
        ) : null}

        <Button className="h-12 w-full rounded-[18px] bg-gradient-to-r from-[#2980b9] to-[#6dd5fa] text-base shadow-[0_16px_34px_rgba(41,128,185,0.24)] hover:from-[#2474a7] hover:to-[#5acbf3]" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : null}
          {mode === 'register' ? t('register') : t('login')}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm font-medium text-slate-500">
        {mode === 'register' ? t('alreadyHaveAccount') : t('newHere')}{' '}
        <Link className="font-semibold text-slate-800 transition hover:text-[#2980b9]" href={mode === 'register' ? '/login' : '/register'}>
          {mode === 'register' ? t('login') : t('register')}
        </Link>
      </p>
    </AuthShell>
  );
}
