'use client';

import { Protected } from '@/components/protected';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';

interface CertificateData {
  userName: string;
  xp: number;
  level: number;
  completedLevels: number;
  totalLevels: number;
  fromLanguage: string;
  toLanguage: string;
  issuedAt: string;
}

const LANGUAGE_NAMES: Record<string, string> = {
  de: 'Deutsch',
  en: 'English',
  'pt-br': 'Português (Brasil)',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
};

export default function CertificatePage() {
  return (
    <Protected>
      {(user) => <CertificateContent user={user} />}
    </Protected>
  );
}

function CertificateCard({ cert, language }: { cert: CertificateData; language: string }) {
  const { t } = useTranslation(language);
  const issuedDate = new Date(cert.issuedAt).toLocaleDateString(
    language === 'de' ? 'de-DE' : language === 'pt-br' ? 'pt-BR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div
      className="print-full bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
      style={{ border: '4px solid #fbbf24' }}
    >
      {/* Gold top bar */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 h-3" />

      <div className="px-10 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🦜</div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Linglet
          </h1>
          <p className="text-sm text-yellow-600 font-semibold uppercase tracking-widest mt-1">
            {t('certificate.title')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mt-3 rounded-full" />
        </div>

        {/* Body */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-lg">{t('certificate.certifiedThat')}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2 mb-4">
            {cert.userName}
          </p>
          <p className="text-gray-600">
            {t('certificate.hasCompleted')}
          </p>
          <p className="text-2xl font-semibold text-blue-600 mt-2">
            {cert.fromLanguage} → {cert.toLanguage}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 border-t border-b border-gray-100 py-6 mb-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{cert.level}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t('certificate.level')}</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="text-2xl font-bold text-blue-600">
              {cert.xp.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{t('certificate.totalXP')}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {cert.completedLevels}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {t('certificate.completedLevels')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>linglet.de</span>
          <span>
            {t('certificate.issuedOn')}: {issuedDate}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span> Premium
          </span>
        </div>
      </div>

      {/* Gold bottom bar */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 h-3" />
    </div>
  );
}

function CertificateContent({ user }: { user: any }) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [cert, setCert] = useState<CertificateData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isPremium = user.plan === 'PREMIUM';

  // Construct a preview certificate from user data for free users
  const previewCert: CertificateData = {
    userName: user.name,
    xp: user.xp ?? 0,
    level: Math.floor((user.xp ?? 0) / 500) + 1,
    completedLevels: 0,
    totalLevels: 0,
    fromLanguage: LANGUAGE_NAMES[user.language ?? 'de'] ?? 'Deutsch',
    toLanguage: LANGUAGE_NAMES[user.learningLanguage ?? 'pt-br'] ?? 'Portugiesisch',
    issuedAt: new Date().toISOString(),
  };

  useEffect(() => {
    if (!isPremium) {
      setIsLoading(false);
      return;
    }

    const fetchCertificate = async () => {
      try {
        const res = await fetch('/api/user/certificate', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load certificate');
        const data = await res.json();
        setCert(data);
      } catch (err) {
        setError(t('common.error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificate();
  }, [isPremium, t]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">{t('certificate.loading')}</p>
        </div>
      </div>
    );
  }

  /* ── Free user: blurred preview with overlay CTA ── */
  if (!isPremium) {
    return (
      <>
        <style>{`
          @media print { .no-print { display: none !important; } }
        `}</style>

        <div className="no-print flex items-center max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/stats"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            ← {t('certificate.back')}
          </Link>
        </div>

        <div className="flex items-center justify-center px-4 py-6">
          <div className="relative w-full max-w-2xl">
            {/* Blurred certificate (real name, today's date) */}
            <div className="blur-md pointer-events-none select-none" aria-hidden="true">
              <CertificateCard cert={previewCert} language={language} />
            </div>

            {/* Overlay CTA */}
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-yellow-200 shadow-2xl px-8 py-8 text-center max-w-sm w-full">
                <div className="text-5xl mb-3">🏆</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {t('certificate.previewTitle')}
                </h2>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {t('certificate.previewSubtitle')}
                </p>
                <Link
                  href="/settings/upgrade"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity w-full justify-center"
                >
                  ⭐ {t('leaderboard.premiumOnlyCta')}
                </Link>
                <p className="text-xs text-gray-400 mt-3">
                  {t('certificate.previewHint')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── Premium error states ── */
  if (error || !cert) {
    return (
      <div className="text-center py-12 text-red-500">
        {error || t('common.error')}
      </div>
    );
  }

  /* ── Premium: real certificate ── */
  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          .print-full { box-shadow: none !important; border: 2px solid #e5e7eb !important; }
        }
      `}</style>

      {/* Actions bar – hidden when printing */}
      <div className="no-print flex items-center justify-between max-w-4xl mx-auto px-4 py-4">
        <Link
          href="/stats"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          ← {t('certificate.back')}
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm"
        >
          🖨️ {t('certificate.print')}
        </button>
      </div>

      {/* Certificate */}
      <div className="flex items-center justify-center px-4 py-6 print-full">
        <CertificateCard cert={cert} language={language} />
      </div>
    </>
  );
}

