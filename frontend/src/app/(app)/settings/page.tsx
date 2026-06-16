'use client';

import { Card, PageHeader } from '@/components/ui';
import { LanguageSelector } from '@/components/language-selector';
import { useAuthStore } from '@/lib/auth-store';
import { useTranslation } from '@/lib/i18n';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title={t('settingsTitle')} description={t('settingsDescription')} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold">{t('profile')}</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <dt className="text-slate-500">{t('name')}</dt><dd className="font-medium">{user?.name}</dd>
            <dt className="text-slate-500">{t('email')}</dt><dd className="font-medium">{user?.email}</dd>
            <dt className="text-slate-500">{t('role')}</dt><dd className="font-medium">{user?.role}</dd>
          </dl>
        </Card>
        <Card>
          <h2 className="mb-4 font-semibold">{t('languageSettings')}</h2>
          <LanguageSelector />
        </Card>
      </div>
    </>
  );
}
