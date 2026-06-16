'use client';

import { BookOpen, CalendarDays, CheckSquare, CircleUserRound, ClipboardList, Home, LogOut, NotebookPen, Settings, Target, TimerReset } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { TranslationKey, useTranslation } from '@/lib/i18n';
import { LanguageSelector } from './language-selector';
import { Button } from './ui';

const nav = [
  { href: '/dashboard', labelKey: 'navDashboard', icon: Home },
  { href: '/goals', labelKey: 'navGoals', icon: Target },
  { href: '/habits', labelKey: 'navHabits', icon: TimerReset },
  { href: '/tasks', labelKey: 'navTasks', icon: CheckSquare },
  { href: '/calendar', labelKey: 'navCalendar', icon: CalendarDays },
  { href: '/learning', labelKey: 'navLearning', icon: BookOpen },
  { href: '/journal', labelKey: 'navJournal', icon: NotebookPen },
  { href: '/activity-log', labelKey: 'navActivity', icon: ClipboardList },
  { href: '/settings', labelKey: 'navSettings', icon: Settings }
] satisfies Array<{ href: string; labelKey: TranslationKey; icon: typeof Home }>;

const shortMobileLabels: Partial<Record<TranslationKey, TranslationKey>> = {
  navActivity: 'navActivity'
};

function navLabel(labelKey: TranslationKey, t: (key: TranslationKey) => string, mobile = false) {
  const label = t(mobile && shortMobileLabels[labelKey] ? shortMobileLabels[labelKey] : labelKey);
  return mobile && labelKey === 'navActivity' && label.length > 8 ? (label === 'Activity Log' ? 'Activity' : 'กิจกรรม') : label;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, accessToken, hasHydrated, clear } = useAuthStore();
  const { t } = useTranslation();
  useEffect(() => { if (hasHydrated && !accessToken) router.replace('/login'); }, [accessToken, hasHydrated, router]);
  if (!hasHydrated || !accessToken) return null;

  async function logout() {
    await authApi.logout().catch(() => undefined);
    clear();
    router.replace('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="hidden border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:block lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center gap-3 px-5">
          <div className="grid size-9 place-items-center rounded-lg bg-primary-600 font-bold text-white">L</div>
          <div><p className="font-semibold">LifeOS</p><p className="text-xs text-slate-500">{t('appTagline')}</p></div>
        </div>
        <nav className="space-y-1 px-3 pb-3">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={`flex min-w-max items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${active ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}>
                <Icon size={18} /> {navLabel(item.labelKey, t)}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1 lg:pl-72">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:h-16 sm:px-5">
          <div className="flex min-w-0 items-center gap-3 lg:hidden">
            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-600 font-bold text-white">L</div>
            <div className="min-w-0">
              <p className="truncate font-semibold">LifeOS</p>
              <p className="hidden text-xs text-slate-500 sm:block">{t('appTagline')}</p>
            </div>
          </div>
          <div className="hidden text-sm text-slate-500 lg:block">{t('topbarMessage')}</div>
          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
            <div className="hidden min-w-0 items-center gap-2 sm:flex">
              <CircleUserRound className="shrink-0 text-primary-600" />
              <span className="max-w-36 truncate text-sm font-medium">{user?.name}</span>
            </div>
            <LanguageSelector compact />
            <Button variant="ghost" className="h-9 w-9 px-0 sm:w-[132px] sm:px-3" onClick={logout}><LogOut size={16} /><span className="hidden min-w-0 truncate sm:inline">{t('logout')}</span></Button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-3 pb-24 pt-5 sm:px-6 sm:pb-8 sm:pt-6">{children}</main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <div className="flex gap-1 overflow-x-auto">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-[72px] flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-medium ${active ? 'bg-primary-50 text-primary-700' : 'text-slate-500'}`}
              >
                <Icon size={18} />
                <span className="max-w-full truncate">{navLabel(item.labelKey, t, true)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
