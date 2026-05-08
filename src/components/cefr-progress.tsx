'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';

interface SubchapterData {
  id: string;
  status: 'LOCKED' | 'CURRENT' | 'COMPLETED';
}

interface ChapterData {
  id: string;
  order: number;
  subchapters: SubchapterData[];
}

interface CefrLevelData {
  level: 'A1' | 'A2' | 'B1';
  label: string;
  totalSubchapters: number;
  completedSubchapters: number;
  percentage: number;
  isUnlocked: boolean;
}

const LEVEL_RANGES = [
  { level: 'A1' as const, labelKey: 'dashboard.cefrA1Label', minOrder: 1, maxOrder: 6 },
  { level: 'A2' as const, labelKey: 'dashboard.cefrA2Label', minOrder: 7, maxOrder: 10 },
  { level: 'B1' as const, labelKey: 'dashboard.cefrB1Label', minOrder: 11, maxOrder: 14 },
];

const LEVEL_COLORS = {
  A1: {
    badge: 'from-blue-500 to-indigo-600',
    bar: 'from-blue-400 to-indigo-500',
    ring: 'ring-2 ring-indigo-400 ring-offset-2',
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
    text: 'text-indigo-700',
    subtext: 'text-indigo-500',
  },
  A2: {
    badge: 'from-violet-500 to-purple-600',
    bar: 'from-violet-400 to-purple-500',
    ring: 'ring-2 ring-purple-400 ring-offset-2',
    bg: 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200',
    text: 'text-purple-700',
    subtext: 'text-purple-500',
  },
  B1: {
    badge: 'from-purple-500 to-fuchsia-600',
    bar: 'from-purple-400 to-fuchsia-500',
    ring: 'ring-2 ring-fuchsia-400 ring-offset-2',
    bg: 'bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-200',
    text: 'text-fuchsia-700',
    subtext: 'text-fuchsia-500',
  },
};

function computeLevelProgress(chapters: ChapterData[], t: (key: string) => string): CefrLevelData[] {
  return LEVEL_RANGES.map(({ level, labelKey, minOrder, maxOrder }) => {
    const levelChapters = chapters.filter(
      (c) => c.order >= minOrder && c.order <= maxOrder
    );
    const totalSubchapters = levelChapters.reduce(
      (sum, c) => sum + c.subchapters.length,
      0
    );
    const completedSubchapters = levelChapters.reduce(
      (sum, c) =>
        sum + c.subchapters.filter((s) => s.status === 'COMPLETED').length,
      0
    );
    const percentage =
      totalSubchapters > 0
        ? Math.round((completedSubchapters / totalSubchapters) * 100)
        : 0;
    return {
      level,
      label: t(labelKey),
      totalSubchapters,
      completedSubchapters,
      percentage,
      isUnlocked: false,
    };
  });
}

export function CefrProgress() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [levels, setLevels] = useState<CefrLevelData[]>([]);
  const [currentLevel, setCurrentLevel] = useState<string>('A1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/chapters?includeComingSoon=true')
      .then((res) => res.json())
      .then((data) => {
        if (!data.chapters) return;

        const computed = computeLevelProgress(data.chapters, t);

        // Unlock logic: A1 always; A2 when A1 ≥ 50%; B1 when A2 ≥ 50%
        computed[0].isUnlocked = true;
        computed[1].isUnlocked = computed[0].percentage >= 50;
        computed[2].isUnlocked = computed[1].percentage >= 50;

        // currentLevel: highest unlocked level not yet fully complete
        let current = computed[0].level;
        for (const l of computed) {
          if (!l.isUnlocked) break;
          current = l.level;
          if (l.percentage < 100) break;
        }

        setLevels(computed);
        setCurrentLevel(current);
      })
      .catch(() => {
        // Silently fail – section simply won't appear
      })
      .finally(() => setLoading(false));
  }, [language]);

  if (loading) {
    return (
      <div className="mb-8 animate-pulse">
        <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-36 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (levels.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-base font-semibold text-gray-700 mb-3">
        📊 {t('dashboard.learningProgress')}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {levels.map((lvl) => {
          const colors = LEVEL_COLORS[lvl.level];
          const isActive = lvl.level === currentLevel;

          if (!lvl.isUnlocked) {
            return (
              <div
                key={lvl.level}
                className="rounded-xl border bg-gray-50 border-gray-200 p-4 opacity-60 select-none"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-400">{lvl.level}</span>
                  </div>
                  <span className="text-lg">🔒</span>
                </div>
                <p className="text-xs font-medium text-gray-400 mb-1">{lvl.label}</p>
                <p className="text-xs text-gray-400">{t('chapters.locked')}</p>
                <div className="mt-3 h-1.5 bg-gray-200 rounded-full" />
              </div>
            );
          }

          return (
            <div
              key={lvl.level}
              className={`rounded-xl border p-4 transition-all duration-200 ${colors.bg} ${
                isActive ? colors.ring : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors.badge} flex items-center justify-center shadow-sm`}
                >
                  <span className="text-sm font-bold text-white">{lvl.level}</span>
                </div>
                {isActive && (
                  <span className="text-xs font-semibold bg-white/70 border border-current rounded-full px-2 py-0.5 text-indigo-600">
                    {t('lesson.currentLevel')}
                  </span>
                )}
                {lvl.percentage === 100 && (
                  <span className="text-lg">✅</span>
                )}
              </div>

              <p className={`text-xs font-semibold ${colors.text} mb-0.5`}>{lvl.label}</p>
              <p className={`text-xs ${colors.subtext} mb-3`}>
                {lvl.completedSubchapters} / {lvl.totalSubchapters} {t('dashboard.lessonsLabel')}
              </p>

              <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-700`}
                  style={{ width: `${lvl.percentage}%` }}
                />
              </div>

              <p className={`text-right text-xs font-medium ${colors.subtext} mt-1`}>
                {lvl.percentage}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
