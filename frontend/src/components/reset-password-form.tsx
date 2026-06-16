'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { passwordIssues } from './password-policy';
import { Button, Card, Input } from './ui';

const schema = z.object({
  password: z.string().superRefine((value, context) => {
    for (const message of passwordIssues(value)) {
      context.addIssue({ code: z.ZodIssueCode.custom, message });
    }
  }),
  confirmPassword: z.string()
}).refine((value) => value.password === value.confirmPassword, {
  message: 'รหัสผ่านทั้งสองช่องต้องตรงกัน',
  path: ['confirmPassword']
});

type Values = z.infer<typeof schema>;

export function ResetPasswordForm({ token }: { token?: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { password: '', confirmPassword: '' } });
  const issues = form.formState.submitCount > 0 || form.formState.touchedFields.password ? passwordIssues(form.watch('password')) : [];

  async function submit(values: Values) {
    if (!token) {
      toast.error('ลิงก์ตั้งรหัสผ่านไม่ถูกต้อง');
      return;
    }
    try {
      await authApi.resetPassword({ token, password: values.password });
      toast.success('ตั้งรหัสผ่านใหม่แล้ว');
      router.push('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'ไม่สามารถตั้งรหัสผ่านใหม่ได้');
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-[520px] border-slate-200/80 p-6 shadow-soft sm:p-8">
        <div className="mb-7">
          <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-primary-600 text-2xl font-bold text-white shadow-lg shadow-primary-600/20">L</div>
          <h1 className="text-3xl font-semibold tracking-normal text-ink">ตั้งรหัสผ่านใหม่</h1>
          <p className="mt-2 text-base leading-7 text-slate-500">เลือกรหัสผ่านใหม่ที่ปลอดภัยสำหรับบัญชี LifeOS ของคุณ</p>
        </div>
        {!token ? (
          <div className="rounded-lg border border-rose-100 bg-rose-50 p-3 text-sm font-medium text-rose-700">ลิงก์ตั้งรหัสผ่านไม่ถูกต้องหรือหมดอายุ</div>
        ) : (
          <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="password">รหัสผ่านใหม่</label>
              <div className="relative">
                <Input
                  id="password"
                  autoComplete="new-password"
                  className="h-12 pr-12 text-base"
                  type={showPassword ? 'text' : 'password'}
                  {...form.register('password')}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100"
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
              {issues.length ? (
                <ul className="mt-2 space-y-1 text-xs font-medium text-rose-600">
                  {issues.map((message) => <li key={message}>{message}</li>)}
                </ul>
              ) : null}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</label>
              <Input id="confirmPassword" autoComplete="new-password" className="h-12 text-base" type={showPassword ? 'text' : 'password'} {...form.register('confirmPassword')} />
              {form.formState.errors.confirmPassword ? <span className="mt-2 block text-xs font-medium text-rose-600">{form.formState.errors.confirmPassword.message}</span> : null}
            </div>
            <Button className="h-12 w-full text-base" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : null}
              ตั้งรหัสผ่านใหม่
            </Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm font-medium text-slate-500">
          กลับไปหน้า{' '}
          <Link className="font-semibold text-primary-700 transition hover:text-primary-600" href="/login">เข้าสู่ระบบ</Link>
        </p>
      </Card>
    </main>
  );
}
