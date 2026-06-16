'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { Button, Card, Input } from './ui';

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
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <Card className="w-full max-w-[520px] border-slate-200/80 p-6 shadow-soft sm:p-8">
        <div className="mb-7">
          <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-primary-600 text-2xl font-bold text-white shadow-lg shadow-primary-600/20">L</div>
          <h1 className="text-3xl font-semibold tracking-normal text-ink">ลืมรหัสผ่าน</h1>
          <p className="mt-2 text-base leading-7 text-slate-500">กรอกอีเมลที่ใช้สมัคร LifeOS แล้วตั้งรหัสผ่านใหม่อย่างปลอดภัย</p>
        </div>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="email">อีเมล</label>
            <Input id="email" autoComplete="email" className="h-12 text-base" type="email" {...form.register('email')} />
            {form.formState.errors.email ? <span className="mt-2 block text-xs font-medium text-rose-600">{form.formState.errors.email.message}</span> : null}
          </div>
          <Button className="h-12 w-full text-base" disabled={form.formState.isSubmitting}>
            ส่งลิงก์ตั้งรหัสผ่านใหม่
          </Button>
        </form>
        {resetUrl ? (
          <div className="mt-5 rounded-lg border border-primary-100 bg-primary-50 p-3 text-sm text-primary-700">
            <p className="font-semibold">ลิงก์สำหรับทดสอบในเครื่องพร้อมแล้ว</p>
            <Link className="mt-2 inline-block font-semibold underline" href={resetUrl.replace(/^https?:\/\/[^/]+/, '')}>
              ไปตั้งรหัสผ่านใหม่
            </Link>
          </div>
        ) : (
          <p className="mt-5 text-sm text-slate-500">ถ้ามีบัญชีนี้อยู่ในระบบ เราจะเตรียมขั้นตอนตั้งรหัสผ่านใหม่ให้</p>
        )}
        <p className="mt-6 text-center text-sm font-medium text-slate-500">
          จำรหัสได้แล้ว?{' '}
          <Link className="font-semibold text-primary-700 transition hover:text-primary-600" href="/login">เข้าสู่ระบบ</Link>
        </p>
      </Card>
    </main>
  );
}
