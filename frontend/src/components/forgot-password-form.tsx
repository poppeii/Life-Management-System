'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { AuthPanelIntro, AuthShell } from './auth-shell';
import { Button, Input } from './ui';

const schema = z.object({
  email: z.string().email()
});

type Values = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [resetUrl, setResetUrl] = useState<string>();
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: '' } });

  async function submit(values: Values) {
    try {
      const response = await authApi.forgotPassword(values);
      setResetUrl(response.resetUrl);
      toast.success('ตรวจสอบอีเมลของคุณ');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'ไม่สามารถส่งคำขอได้');
    }
  }

  return (
    <AuthShell>
        <AuthPanelIntro title="ลืมรหัสผ่าน" subtitle="กรอกอีเมลที่ใช้สมัคร LifeOS แล้วตั้งรหัสผ่านใหม่อย่างปลอดภัย" />
        <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">อีเมล</label>
            <div className="relative">
              <Mail aria-hidden="true" className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                autoComplete="email"
                className="h-14 rounded-[20px] border-white/70 bg-white/70 pl-14 text-base shadow-sm placeholder:text-slate-400 focus:bg-white"
                placeholder="you@example.com"
                type="email"
                {...form.register('email')}
              />
            </div>
            {form.formState.errors.email ? <span className="mt-2 block text-xs font-medium text-rose-600">{form.formState.errors.email.message}</span> : null}
          </div>
          <Button className="h-14 w-full rounded-[20px] bg-gradient-to-r from-[#2980b9] to-[#6dd5fa] text-base shadow-[0_16px_34px_rgba(41,128,185,0.24)] hover:from-[#2474a7] hover:to-[#5acbf3]" disabled={form.formState.isSubmitting}>
            ส่งลิงก์ตั้งรหัสผ่านใหม่
          </Button>
        </form>
        {resetUrl ? (
          <div className="mt-5 rounded-[20px] border border-white/70 bg-white/70 p-4 text-sm text-slate-700 shadow-sm">
            <p className="font-semibold">ลิงก์สำหรับทดสอบในเครื่องพร้อมแล้ว</p>
            <Link className="mt-2 inline-block font-semibold text-[#2980b9] underline" href={resetUrl.replace(/^https?:\/\/[^/]+/, '')}>
              ไปตั้งรหัสผ่านใหม่
            </Link>
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-500">ถ้ามีบัญชีนี้อยู่ในระบบ เราจะเตรียมขั้นตอนตั้งรหัสผ่านใหม่ให้</p>
        )}
        <p className="mt-6 text-center text-sm font-medium text-slate-500">
          จำรหัสได้แล้ว?{' '}
          <Link className="font-semibold text-slate-800 transition hover:text-[#2980b9]" href="/login">เข้าสู่ระบบ</Link>
        </p>
    </AuthShell>
  );
}
