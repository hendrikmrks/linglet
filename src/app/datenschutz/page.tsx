'use client';

import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';

export default function DatenschutzPage() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const sections = [
    { title: t('privacy.dataTitle'), body: t('privacy.dataBody') },
    { title: t('privacy.purposeTitle'), body: t('privacy.purposeBody') },
    { title: t('privacy.cookiesTitle'), body: t('privacy.cookiesBody') },
    { title: t('privacy.rightsTitle'), body: t('privacy.rightsBody') },
    { title: t('privacy.retentionTitle'), body: t('privacy.retentionBody') },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{t('privacy.kicker')}</p>
        <h1 className="mt-3 text-4xl font-display font-semibold text-gray-900">{t('privacy.title')}</h1>
        <p className="mt-2 text-gray-600">{t('privacy.subtitle')}</p>
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
