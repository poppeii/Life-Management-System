'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, LockKeyhole } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { AuthPanelIntro, AuthShell } from './auth-shell';
import { passwordIssues } from './password-policy';
import { Button, Input } from './ui';

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
    <AuthShell>
        <AuthPanelIntro title="ตั้งรหัสผ่านใหม่" subtitle="เลือกรหัสผ่านใหม่ที่ปลอดภัยสำหรับบัญชี LifeOS ของคุณ" />
        {!token ? (
          <div className="rounded-[20px] border border-rose-100 bg-rose-50/90 p-4 text-sm font-medium text-rose-700">ลิงก์ตั้งรหัสผ่านไม่ถูกต้องหรือหมดอายุ</div>
        ) : (
          <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">รหัสผ่านใหม่</label>
              <div className="relative">
                <LockKeyhole aria-hidden="true" className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  autoComplete="new-password"
                  className="h-14 rounded-[20px] border-white/70 bg-white/70 pl-14 pr-14 text-base shadow-sm placeholder:text-slate-400 focus:bg-white"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  {...form.register('password')}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-white hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-sky-100"
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
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</label>
              <div className="relative">
                <LockKeyhole aria-hidden="true" className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
                <Input
                  id="confirmPassword"
                  autoComplete="new-password"
                  className="h-14 rounded-[20px] border-white/70 bg-white/70 pl-14 text-base shadow-sm placeholder:text-slate-400 focus:bg-white"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  {...form.register('confirmPassword')}
                />
              </div>
              {form.formState.errors.confirmPassword ? <span className="mt-2 block text-xs font-medium text-rose-600">{form.formState.errors.confirmPassword.message}</span> : null}
            </div>
            <Button className="h-14 w-full rounded-[20px] bg-gradient-to-r from-[#2980b9] to-[#6dd5fa] text-base shadow-[0_16px_34px_rgba(41,128,185,0.24)] hover:from-[#2474a7] hover:to-[#5acbf3]" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : null}
              ตั้งรหัสผ่านใหม่
            </Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm font-medium text-slate-500">
          กลับไปหน้า{' '}
          <Link className="font-semibold text-slate-800 transition hover:text-[#2980b9]" href="/login">เข้าสู่ระบบ</Link>
        </p>
    </AuthShell>
  );
}
