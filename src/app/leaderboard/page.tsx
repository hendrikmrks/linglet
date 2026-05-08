'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import { Protected } from '@/components/protected';
import { Button } from '@/components/ui/button';

interface BadgeInfo {
  icon: string;
  name: string;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  streakCount: number;
  badges: BadgeInfo[];
}

export default function LeaderboardPage() {
  return (
    <Protected>
      {(user) => <LeaderboardContent isPremium={user.plan === 'PREMIUM'} userXp={user.xp || 0} />}
    </Protected>
  );
}

interface EstimatedRank {
  estimatedRank: number;
  totalUsers: number;
  nearbyXp: number | null;
  userXp: number;
}

function LeaderboardContent({ isPremium, userXp }: { isPremium: boolean; userXp: number }) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(isPremium);
  const [error, setError] = useState<string | null>(null);
  const [estimatedRank, setEstimatedRank] = useState<EstimatedRank | null>(null);

  const previewEntries = useMemo<LeaderboardEntry[]>(() => {
    const base = Math.max(userXp, 100);
    return [
      { id: 'preview-1', name: 'Ava',   xp: Math.round(base * 1.4), streakCount: 19, badges: [{ icon: '👑', name: 'Krone' }] },
      { id: 'preview-2', name: 'Luis',  xp: Math.round(base * 1.3), streakCount: 15, badges: [{ icon: '🔥', name: 'Flamme' }] },
      { id: 'preview-3', name: 'Mia',   xp: Math.round(base * 1.2), streakCount: 12, badges: [] },
      { id: 'preview-4', name: 'Noah',  xp: Math.round(base * 1.1), streakCount: 9,  badges: [{ icon: '⭐', name: 'Stern' }] },
      { id: 'preview-5', name: 'Sofia', xp: Math.round(base * 1.0), streakCount: 8,  badges: [] },
    ];
  }, [userXp]);

  useEffect(() => {
    if (!isPremium) {
      setEntries([]);
      setError(null);
      setIsLoading(false);
      // Fetch estimated rank for free users
      fetch('/api/leaderboard?mode=estimated-rank', { credentials: 'include' })
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data) setEstimatedRank(data); })
        .catch(() => {});
      return;
    }

    const loadLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');
        if (!response.ok) {
          setError(t('leaderboard.loadFailed'));
          return;
        }
        const data = await response.json();
        setEntries(data.entries || []);
      } catch (err) {
        console.error(err);
        setError(t('leaderboard.loadFailed'));
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [isPremium, language]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{t('leaderboard.kicker')}</p>
        <h1 className="mt-3 text-4xl font-display font-semibold text-gray-900">{t('leaderboard.title')}</h1>
        <p className="mt-2 text-gray-600">{t('leaderboard.subtitle')}</p>
      </header>

      {isLoading && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-gray-600">
          {t('leaderboard.loading')}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      )}

      {/* Premium upsell for free users */}
      {!isLoading && !error && !isPremium && (
        <div className="relative">
          {/* Blur overlay with CTA */}
          <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-indigo-200 px-8 py-8 text-center shadow-2xl max-w-md w-full">
              {/* Crown icon */}
              <div className="mb-3 flex justify-center">
                <span className="text-5xl">👑</span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
                {t('leaderboard.premiumOnlyKicker')}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                {t('leaderboard.premiumOnlyTitle')}
              </h2>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {t('leaderboard.premiumOnlySubtitle')}
              </p>
              {estimatedRank && (
                <p className="text-sm text-gray-700 bg-indigo-50 rounded-lg px-4 py-3 mt-3">
                  📊 Basierend auf deinen <span className="font-semibold">{estimatedRank.userXp} XP</span> wärst du aktuell auf ungefähr Platz{' '}
                  <span className="font-semibold text-indigo-700">{estimatedRank.estimatedRank}</span> von{' '}
                  <span className="font-semibold">{estimatedRank.totalUsers}</span> Lernenden.
                </p>
              )}
              <div className="mt-6">
                <Link href="/settings/upgrade">
                  <Button className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white border-0 px-6 w-full sm:w-auto">
                    {t('leaderboard.premiumOnlyCta')}
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-xs text-gray-400">
                {t('leaderboard.premiumOnlyNote')}
              </p>
            </div>
          </div>

          {/* Blurred preview table */}
          <div className="blur-md select-none pointer-events-none" aria-hidden="true">
            <LeaderboardTable
              entries={previewEntries}
              emptyLabel={t('leaderboard.empty')}
              playerLabel={t('leaderboard.playerLabel')}
              rankLabel={t('leaderboard.rank')}
              playerTitle={t('leaderboard.player')}
              xpLabel={t('leaderboard.xp')}
              streakLabel={t('leaderboard.streak')}
            />
          </div>
        </div>
      )}

      {/* Real leaderboard for premium users */}
      {!isLoading && !error && isPremium && (
        <LeaderboardTable
          entries={entries}
          emptyLabel={t('leaderboard.empty')}
          playerLabel={t('leaderboard.playerLabel')}
          rankLabel={t('leaderboard.rank')}
          playerTitle={t('leaderboard.player')}
          xpLabel={t('leaderboard.xp')}
          streakLabel={t('leaderboard.streak')}
        />
      )}
    </div>
  );
}

function LeaderboardTable({
  entries,
  emptyLabel,
  playerLabel,
  rankLabel,
  playerTitle,
  xpLabel,
  streakLabel,
}: {
  entries: LeaderboardEntry[];
  emptyLabel: string;
  playerLabel: string;
  rankLabel: string;
  playerTitle: string;
  xpLabel: string;
  streakLabel: string;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="grid grid-cols-[72px,1fr,120px,120px] gap-2 bg-gray-50 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
        <span>{rankLabel}</span>
        <span>{playerTitle}</span>
        <span>{xpLabel}</span>
        <span>{streakLabel}</span>
      </div>
      <div className="divide-y divide-gray-100">
        {entries.length === 0 ? (
          <div className="px-6 py-6 text-gray-600">{emptyLabel}</div>
        ) : (
          entries.map((entry, index) => (
            <div
              key={entry.id}
              className="grid grid-cols-[72px,1fr,120px,120px] gap-2 px-6 py-4 items-center"
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                  index === 0
                    ? 'bg-amber-100 text-amber-700'
                    : index === 1
                    ? 'bg-gray-100 text-gray-700'
                    : index === 2
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-50 text-gray-600'
                }`}>
                  {index + 1}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{entry.name}</p>
                    {entry.badges && entry.badges.length > 0 && (
                      <div className="flex gap-1">
                        {entry.badges.map((badge, i) => (
                          <span
                            key={i}
                            className="text-lg"
                            title={badge.name}
                          >
                            {badge.icon}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{playerLabel}</p>
                </div>
              </div>
              <div className="font-semibold text-gray-900">{entry.xp}</div>
              <div className="font-semibold text-gray-900">{entry.streakCount}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
