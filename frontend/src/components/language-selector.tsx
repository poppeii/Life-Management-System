'use client';

import { Check, ChevronDown, Globe2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Locale, useTranslation } from '@/lib/i18n';

const options: Array<{ locale: Locale; flag: string; labelKey: 'thai' | 'english' }> = [
  { locale: 'th', flag: '🇹🇭', labelKey: 'thai' },
  { locale: 'en', flag: '🇬🇧', labelKey: 'english' }
];

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const current = options.find((option) => option.locale === locale) ?? options[0];

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block text-left" aria-label={t('language')}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex h-9 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-primary-200 hover:bg-primary-50/60 ${compact ? 'w-[128px]' : 'w-[176px]'}`}
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          {!compact ? <Globe2 size={16} className="text-slate-400" /> : null}
          <span aria-hidden="true" className="text-base leading-none">{current.flag}</span>
          <span className="min-w-0 truncate">{t(current.labelKey)}</span>
        </span>
        <ChevronDown size={16} className={`shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-lg" role="listbox" aria-label={t('language')}>
          {options.map((option) => {
            const active = locale === option.locale;
            return (
              <button
                key={option.locale}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  setLocale(option.locale);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-sm transition ${active ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true" className="text-base leading-none">{option.flag}</span>
                  <span>{t(option.labelKey)}</span>
                </span>
                {active ? <Check size={16} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
