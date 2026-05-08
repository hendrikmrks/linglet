'use client';

import { Protected } from '@/components/protected';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';

interface StatsData {
  xp: number;
  level: number;
  xpInLevel: number;
  xpToNextLevel: number;
  streakCount: number;
  completedLevels: number;
  totalLevels: number;
  badgesCount: number;
  purchasesCount: number;
  learningLanguage: string;
  language: string;
  memberSince: string | null;
}

const LANGUAGE_NAMES: Record<string, string> = {
  de: 'Deutsch',
  en: 'English',
  'pt-br': 'Português (Brasil)',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
};

export default function StatsPage() {
  return (
    <Protected>
      {(user) => <StatsContent user={user} />}
    </Protected>
  );
}

function PremiumGate({ t }: { t: (key: string) => string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-6xl mb-4">⭐</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('stats.title')}
        </h2>
        <p className="text-gray-500 mb-6">{t('stats.premiumOnly')}</p>
        <Link
          href="/settings/upgrade"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          ⭐ {t('stats.upgradeToPremium')}
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

function StatsContent({ user }: { user: any }) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isPremium = user.plan === 'PREMIUM';

  useEffect(() => {
    if (!isPremium) return;

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/user/stats', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(t('common.error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [isPremium, t]);

  if (!isPremium) {
    return <PremiumGate t={t} />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">{t('stats.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12 text-red-500">
        {error || t('common.error')}
      </div>
    );
  }

  const progressPercent = Math.min(
    Math.round((stats.xpInLevel / 500) * 100),
    100
  );

  const fromLang = LANGUAGE_NAMES[stats.language] ?? stats.language;
  const toLang = LANGUAGE_NAMES[stats.learningLanguage] ?? stats.learningLanguage;

  const memberSince = stats.memberSince
    ? new Date(stats.memberSince).toLocaleDateString(
        language === 'de' ? 'de-DE' : language === 'pt-br' ? 'pt-BR' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : '—';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-3xl font-bold text-gray-900">
            📊 {t('stats.title')}
          </h1>
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            PREMIUM
          </span>
        </div>
        <p className="text-gray-500">
          {fromLang} → {toLang} · {t('stats.member')}: {memberSince}
        </p>
      </div>

      {/* XP Level Progress */}
      <div className="mb-6 bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-500">{t('stats.totalXP')}</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.xp.toLocaleString()} XP
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">{t('stats.level')}</p>
            <p className="text-3xl font-bold text-indigo-600">{stats.level}</p>
          </div>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2 text-right">
          {stats.xpInLevel} / 500 XP
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon="🔥"
          label={t('stats.currentStreak')}
          value={stats.streakCount}
          sub={t('stats.days')}
          color="bg-orange-50 border-orange-200"
        />
        <StatCard
          icon="🏅"
          label={t('stats.completedLevels')}
          value={stats.completedLevels}
          sub={`/ ${stats.totalLevels} ${t('stats.totalLevels')}`}
          color="bg-green-50 border-green-200"
        />
        <StatCard
          icon="🎖️"
          label={t('stats.badges')}
          value={stats.badgesCount}
          color="bg-purple-50 border-purple-200"
        />
      </div>

      {/* Completed levels progress bar */}
      {stats.totalLevels > 0 && (
        <div className="mb-8 bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">
              {t('stats.completedLevels')}
            </p>
            <p className="text-sm text-gray-500">
              {stats.completedLevels} / {stats.totalLevels}
            </p>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(
                  Math.round((stats.completedLevels / stats.totalLevels) * 100),
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Certificate CTA */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">🏆 {t('certificate.title')}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{fromLang} → {toLang}</p>
        </div>
        <Link
          href="/certificate"
          className="flex-shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
        >
          📄 {t('stats.getCertificate')}
        </Link>
      </div>
    </div>
  );
}
