'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';

export function Footer() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p className="font-medium text-gray-700">🦜 {t('common.appName')}</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/impressum" className="hover:text-gray-900">
              📜 {t('footer.imprint')}
            </Link>
            <Link href="/datenschutz" className="hover:text-gray-900">
              🔒 {t('footer.privacy')}
            </Link>
            <Link href="/agb" className="hover:text-gray-900">
              📋 {t('footer.terms')}
            </Link>
            <Link href="/kontakt" className="hover:text-gray-900">
              ✉️ {t('footer.contact')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
