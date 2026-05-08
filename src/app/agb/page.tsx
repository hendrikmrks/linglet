'use client';

import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';

export default function AgbPage() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const sections = [
    { title: t('terms.scopeTitle'), body: t('terms.scopeBody') },
    { title: t('terms.accountTitle'), body: t('terms.accountBody') },
    { title: t('terms.paymentsTitle'), body: t('terms.paymentsBody') },
    { title: t('terms.liabilityTitle'), body: t('terms.liabilityBody') },
    { title: t('terms.terminationTitle'), body: t('terms.terminationBody') },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{t('terms.kicker')}</p>
        <h1 className="mt-3 text-4xl font-display font-semibold text-gray-900">{t('terms.title')}</h1>
        <p className="mt-2 text-gray-600">{t('terms.subtitle')}</p>
      </header>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
