'use client';

import { Protected } from '@/components/protected';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import { LearningPath } from '@/components/learning-path';
import { CefrProgress } from '@/components/cefr-progress';

export default function DashboardPage() {
  return (
    <Protected>
      {(user) => <DashboardContent user={user} />}
    </Protected>
  );
}

function DashboardContent({ user }: { user: any }) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const streakCount = user.streakCount || 0;
  const xpInLevel = user.xp % 500;
  const level = Math.floor(user.xp / 500) + 1;

  const [missedXp, setMissedXp] = useState<number | null>(null);

  useEffect(() => {
    if (user.plan !== 'FREE') return;
    fetch('/api/user/profile', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.missedXpThisWeek === 'number') {
          setMissedXp(data.missedXpThisWeek);
        }
      })
      .catch(() => {});
  }, [user.plan]);

  return (
    <div className="w-full">
      {/* Compact header with greeting + stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('dashboard.welcome')}, {user.name}! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{t('dashboard.readyToLearn')}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Compact XP badge */}
          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5">
            <span className="text-sm">⚡</span>
            <span className="text-sm font-bold text-blue-700">{user.xp} XP</span>
            <span className="text-xs text-blue-400 hidden sm:inline">Lv. {level}</span>
          </div>
          {/* Compact Streak badge */}
          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
            streakCount > 0
              ? 'bg-orange-50 border border-orange-200'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <span className="text-sm">{streakCount > 0 ? '🔥' : '❄️'}</span>
            <span className={`text-sm font-bold ${streakCount > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
              {streakCount} {streakCount === 1 ? t('streak.dayLabel') : t('streak.daysLabel')}
            </span>
          </div>
        </div>
      </div>

      {/* XP progress bar – subtle inline */}
      <div className="mb-8 bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-4">
        <div className="flex-1">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(xpInLevel / 5, 100)}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 whitespace-nowrap">{xpInLevel}/500 {t('dashboard.xpToNextLevel')}</p>
      </div>

      {/* CEFR Level Progress */}
      <CefrProgress />

      {/* Learning Path – main focus */}
      <div className="mb-8">
        <LearningPath
          variant="full"
          titleKey="path.dashboardTitle"
          subtitleKey="path.dashboardSubtitle"
        />
      </div>

      {/* Plan card – subtle at bottom */}
      <div className={`rounded-xl p-4 ${
        user.plan === 'PREMIUM'
          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200'
          : 'bg-gray-50 border border-gray-200'
      }`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-lg">{user.plan === 'PREMIUM' ? '⭐' : '📦'}</span>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {user.plan === 'PREMIUM' ? t('dashboard.premiumPlan') : t('dashboard.freePlan')}
              </p>
              {user.plan === 'PREMIUM' ? (
                <p className="text-xs text-gray-500">{t('dashboard.allPremiumUnlocked')}</p>
              ) : missedXp === null ? (
                // Loading skeleton
                <div className="h-3 w-48 bg-gray-200 rounded animate-pulse mt-1" />
              ) : missedXp > 0 ? (
                <p className="text-xs text-gray-500">
                  {t('dashboard.missedXpPrefix')}{' '}
                  <span className="text-amber-600 font-semibold">+{missedXp} XP</span>{' '}
                  {t('dashboard.missedXpSuffix')}
                </p>
              ) : (
                <p className="text-xs text-gray-500">{t('dashboard.unlockPremium')}</p>
              )}
            </div>
          </div>
          {user.plan === 'FREE' && (
            <Link href="/settings/upgrade">
              <Button size="sm">{t('dashboard.upgrading')}</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

