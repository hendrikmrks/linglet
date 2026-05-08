'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/use-translation';
import { useLanguage } from '@/lib/language-context';

interface StreakCardProps {
  currentStreak: number;
  bestStreak?: number;
  lastActiveDate?: string | null;
}

export function StreakCard({ currentStreak, bestStreak = 0, lastActiveDate }: StreakCardProps) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [daysUntilReset, setDaysUntilReset] = useState<number | null>(null);
  const [streakStatus, setStreakStatus] = useState<'active' | 'danger' | 'lost'>('active');

  useEffect(() => {
    if (!lastActiveDate) {
      setStreakStatus('active');
      return;
    }

    const lastActive = new Date(lastActiveDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastActive.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - lastActive.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // Benutzer war heute aktiv
      setStreakStatus('active');
      setDaysUntilReset(1); // Reset morgen
    } else if (diffDays === 1) {
      // Benutzer war gestern aktiv - Streak ist in Gefahr!
      setStreakStatus('danger');
      setDaysUntilReset(0); // Reset heute Mitternacht
    } else {
      // Streak ist verloren
      setStreakStatus('lost');
      setDaysUntilReset(null);
    }
  }, [lastActiveDate]);

  const getStreakMessage = (): string => {
    if (streakStatus === 'active') {
      if (currentStreak === 1) {
        return t('streak.messageGoodStart');
      } else {
        return t('streak.messageKeepGoing').replace('{days}', currentStreak.toString());
      }
    } else if (streakStatus === 'danger') {
      return t('streak.messageDanger');
    } else {
      return t('streak.messageLost').replace('{best}', bestStreak.toString());
    }
  };

  const getMotivationalText = (): string => {
    if (currentStreak >= 30) {
      return t('streak.motivational.amazing');
    } else if (currentStreak >= 10) {
      return t('streak.motivational.great');
    } else if (currentStreak >= 5) {
      return t('streak.motivational.building');
    }
    return t('streak.motivational.every');
  };

  return (
    <div
      className={`relative rounded-3xl shadow-2xl p-8 overflow-hidden transition-all duration-500 ${
        streakStatus === 'danger'
          ? 'bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 border-2 border-orange-400'
          : streakStatus === 'lost'
            ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300'
            : 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 border-2 border-orange-300'
      }`}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-1/2 -right-1/2 w-full h-full rounded-full ${
          streakStatus === 'danger' ? 'bg-orange-200 opacity-30' : 'bg-red-200 opacity-20'
        } blur-3xl animate-pulse`} />
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-widest mb-2">
              🔥 {t('streak.currentStreak')}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className={`text-6xl font-black ${
                streakStatus === 'danger'
                  ? 'text-orange-600 animate-pulse'
                  : 'text-orange-600'
              }`}>
                {currentStreak}
              </h3>
              <span className="text-2xl font-bold text-orange-500">
                {currentStreak === 1 ? t('streak.dayLabel') : t('streak.daysLabel')}
              </span>
            </div>
          </div>

          {/* Animated fire icon */}
          <div className={`relative w-24 h-24 flex items-center justify-center ${
            streakStatus === 'danger' ? 'animate-bounce' : ''
          }`}>
            <div className={`absolute inset-0 rounded-full ${
              streakStatus === 'danger'
                ? 'bg-orange-400 animate-pulse'
                : 'bg-red-400'
            } opacity-30 blur-2xl`} />
            <div className="relative text-6xl">
              {streakStatus === 'lost' ? '❄️' : '🔥'}
            </div>
          </div>
        </div>

        {/* Best Streak */}
        {bestStreak > 0 && (
          <div className="mb-6 p-4 bg-white/60 backdrop-blur rounded-2xl border border-orange-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">{t('streak.bestStreak')}</p>
              <p className="text-2xl font-bold text-orange-600">
                {bestStreak} {bestStreak === 1 ? t('streak.dayLabel') : t('streak.daysLabel')}
              </p>
            </div>
            {bestStreak > currentStreak && (
              <p className="text-xs text-gray-500 mt-2">
                {t('streak.daysUntilRecord').replace('{days}', (bestStreak - currentStreak).toString())}
              </p>
            )}
          </div>
        )}

        {/* Status message */}
        <div className={`p-4 rounded-2xl border-2 ${
          streakStatus === 'danger'
            ? 'bg-orange-100/70 border-orange-400 text-orange-800'
            : streakStatus === 'lost'
            ? 'bg-gray-100/70 border-gray-300 text-gray-700'
            : 'bg-green-100/70 border-green-400 text-green-800'
        }`}>
          <p className="text-sm font-semibold flex items-center gap-2">
            {streakStatus === 'danger' ? '⚠️' : streakStatus === 'lost' ? '😔' : '✨'}
            {getStreakMessage()}
          </p>
        </div>

        {/* Reset information */}
        {daysUntilReset !== null && streakStatus !== 'lost' && (
          <div className="mt-4 pt-4 border-t border-orange-200/50">
            <p className="text-xs text-gray-600">
              {streakStatus === 'active'
                ? t('streak.resetInfoActive').replace('{days}', daysUntilReset.toString())
                : t('streak.resetInfoDanger')}
            </p>
          </div>
        )}

        {/* Motivational footer */}
        <div className="mt-6 p-3 bg-white/40 backdrop-blur rounded-xl">
          <p className="text-xs font-medium text-center text-gray-700">
            {currentStreak >= 7 ? '🏆 ' : ''}
            {getMotivationalText()}
          </p>
        </div>
      </div>
    </div>
  );
}
