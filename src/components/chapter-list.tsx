'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/lib/user-context';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';

interface Vocabulary {
  id: string;
  word: string;
  translation: string;
  example?: string;
  order: number;
}

interface Subchapter {
  id: string;
  title: string;
  description?: string;
  isLocked: boolean;
  isAvailable: boolean;
  status?: 'LOCKED' | 'CURRENT' | 'COMPLETED';
  order: number;
  vocabulary: Vocabulary[];
}

interface Chapter {
  id: string;
  title: string;
  description?: string;
  sourceLanguage: string;
  targetLanguage: string;
  isLocked: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  unlocksAt?: string | null;
  order: number;
  premiumLocked?: boolean;
  subchapters: Subchapter[];
}

export function ChapterList() {
  const { user } = useUser();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [comingSoonChapters, setComingSoonChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [prewallDismissed, setPrewallDismissed] = useState(true); // default true until localStorage checked

  useEffect(() => {
    setPrewallDismissed(localStorage.getItem('prewallDismissed') === 'true');
  }, []);

  // Pre-wall banner: show when free user has completed ≥70% of the free chapters
  const prewallData = useMemo(() => {
    if (!user || user.plan !== 'FREE') return null;
    const freeChapters = chapters.filter((ch) => !ch.premiumLocked);
    const premiumChapters = chapters.filter((ch) => ch.premiumLocked);
    if (premiumChapters.length === 0 || freeChapters.length === 0) return null;

    const totalSubs = freeChapters.reduce((acc, ch) => acc + ch.subchapters.length, 0);
    const completedSubs = freeChapters.reduce(
      (acc, ch) => acc + ch.subchapters.filter((s) => s.status === 'COMPLETED').length,
      0
    );
    if (totalSubs === 0) return null;

    const pct = Math.round((completedSubs / totalSubs) * 100);
    if (pct < 70) return null;

    return { pct, nextChapterTitle: premiumChapters[0].title };
  }, [user, chapters]);

  const checkAndUnlockChapters = (
    available: Chapter[],
    locked: Chapter[]
  ): { available: Chapter[]; locked: Chapter[] } => {
    const now = new Date();
    const stillLocked: Chapter[] = [];
    let newlyUnlocked: Chapter[] = [];
    for (const chapter of locked) {
      if (chapter.unlocksAt && new Date(chapter.unlocksAt) <= now) {
        newlyUnlocked = [...newlyUnlocked, { ...chapter, isAvailable: true }];
      } else {
        stillLocked.push(chapter);
      }
    }
    return { available: [...available, ...newlyUnlocked], locked: stillLocked };
  };

  useEffect(() => {
    const loadChapters = async () => {
      if (!user || !user.learningLanguage) return;
      const language = user.learningLanguage;
      try {
        const response = await fetch(`/api/chapters?learningLanguage=${language}&includeComingSoon=false`, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setChapters(data.chapters || []);
          // Auto-expand the chapter that has a CURRENT subchapter
          const activeChapter = (data.chapters || []).find((ch: Chapter) =>
            ch.subchapters.some((s: Subchapter) => s.status === 'CURRENT')
          );
          if (activeChapter) setExpandedChapterId(activeChapter.id);
        }
        const comingSoonResponse = await fetch(`/api/chapters?learningLanguage=${language}&includeComingSoon=true`, { credentials: 'include' });
        if (comingSoonResponse.ok) {
          const comingSoonData = await comingSoonResponse.json();
          setComingSoonChapters((comingSoonData.chapters || []).filter((ch: Chapter) => !ch.isAvailable));
        }
      } catch {
        setError(t('chapters.loadError'));
      } finally {
        setIsLoading(false);
      }
    };
    loadChapters();
  }, [user]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setChapters((available) => {
        setComingSoonChapters((locked) => {
          const { available: newAvailable, locked: stillLocked } = checkAndUnlockChapters(available, locked);
          if (newAvailable.length > available.length) setChapters(newAvailable);
          return stillLocked;
        });
        return available;
      });
    }, 15000);
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-500 mb-4" />
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Pre-wall banner: show when free user is nearly done with free chapters */}
      {prewallData && !prewallDismissed && (
        <div className="mb-6 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-indigo-800 mb-1">
                🎉 {t('chapters.prewallTitlePrefix')} {prewallData.pct}% {t('chapters.prewallTitleSuffix')}
              </p>
              <p className="text-xs text-indigo-700 mb-3">
                {t('chapters.prewallBodyPrefix')} „{prewallData.nextChapterTitle}" {t('chapters.prewallBodySuffix')}
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href="/settings/upgrade"
                  className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  ⭐ {t('chapters.prewallCta')}
                </Link>
                <button
                  onClick={() => {
                    localStorage.setItem('prewallDismissed', 'true');
                    setPrewallDismissed(true);
                  }}
                  className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
                >
                  {t('chapters.prewallLater')}
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.setItem('prewallDismissed', 'true');
                setPrewallDismissed(true);
              }}
              className="text-indigo-400 hover:text-indigo-600 transition-colors shrink-0"
              aria-label={t('common.close')}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {chapters.length > 0 && (
        <div className="mb-12">
          <div className="relative mx-auto">
            {/* Vertical connector line */}
            <div className="hidden sm:block absolute left-7 top-8 bottom-8 w-1 rounded-full bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200" />

            <div className="space-y-6">
              {chapters.map((chapter) => {
                const completedCount = chapter.subchapters.filter((s) => s.status === 'COMPLETED').length;
                const totalCount = chapter.subchapters.length;
                const allDone = completedCount === totalCount && totalCount > 0;
                const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                const isExpanded = expandedChapterId === chapter.id;

                return (
                  <div key={chapter.id} className="relative">
                    {/* Chapter header – clickable to expand */}
                    <button
                      onClick={() => setExpandedChapterId(isExpanded ? null : chapter.id)}
                      className={`w-full text-left relative sm:pl-16 transition-all duration-300 ${
                        isExpanded ? '' : 'group'
                      }`}
                    >
                      {/* Circle on the timeline */}
                      <div className={`hidden sm:flex absolute left-0 top-2 h-14 w-14 rounded-full border-4 items-center justify-center text-white font-extrabold text-lg shadow-md z-10 transition-transform duration-300 ${
                        allDone
                          ? 'bg-gradient-to-br from-green-400 to-emerald-600 border-green-300 scale-110'
                          : 'bg-gradient-to-br from-blue-500 to-indigo-600 border-blue-300 group-hover:scale-105'
                      }`}>
                        {allDone ? '✓' : chapter.order}
                      </div>

                      <div className={`rounded-2xl border-2 p-4 transition-all duration-300 ${
                        allDone
                          ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
                          : isExpanded
                            ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{chapter.title}</h3>
                            {chapter.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-1">{chapter.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-xs font-semibold text-gray-500">{completedCount}/{totalCount}</p>
                              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    allDone ? 'bg-green-500' : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${progressPct}%` }}
                                />
                              </div>
                            </div>
                            <span className={`transition-transform duration-300 text-gray-400 ${isExpanded ? 'rotate-180' : ''}`}>
                              ▼
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Expanded subchapter list */}
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isExpanded ? 'max-h-[2000px] opacity-100 mt-3' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="sm:pl-16 space-y-2">
                        {chapter.subchapters.map((sub) => {
                          const isLocked = sub.status === 'LOCKED';
                          const isCurrent = sub.status === 'CURRENT';
                          const isCompleted = sub.status === 'COMPLETED';

                          const href = isLocked
                            ? '#'
                            : `/lesson?chapterId=${chapter.id}&subchapterId=${sub.id}`;

                          return (
                            <Link
                              key={sub.id}
                              href={href}
                              onClick={(e) => { if (isLocked) e.preventDefault(); }}
                              className={`block rounded-xl border-2 p-3 transition-all duration-200 ${
                                isLocked
                                  ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                  : isCurrent
                                    ? 'border-blue-400 bg-blue-50 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                                    : isCompleted
                                      ? 'border-green-300 bg-green-50 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${
                                  isCompleted
                                    ? 'bg-green-500 text-white'
                                    : isCurrent
                                      ? 'bg-blue-500 text-white animate-pulse'
                                      : isLocked
                                        ? 'bg-gray-200 text-gray-400'
                                        : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {isCompleted ? '✓' : isLocked ? '🔒' : sub.order}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-semibold ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                                    {sub.title}
                                  </p>
                                  {sub.description && (
                                    <p className={`text-xs mt-0.5 ${isLocked ? 'text-gray-300' : 'text-gray-500'}`}>
                                      {sub.description}
                                    </p>
                                  )}
                                </div>
                                <div className="shrink-0">
                                  {isCurrent && (
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500 text-white">
                                      {t('chapters.start')}
                                    </span>
                                  )}
                                  {isCompleted && (
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                                      ✓ {t('chapters.done')}
                                    </span>
                                  )}
                                  {isLocked && (
                                    <span className="text-xs text-gray-400">{t('chapters.locked')}</span>
                                  )}
                                </div>
                              </div>
                            </Link>
                          );
                        })}

                        {/* Chapter test button – shows when all subchapters are done */}
                        {allDone && (
                          <Link
                            href={`/lesson?chapterId=${chapter.id}&mode=test`}
                            className="block rounded-xl border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 p-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-lg">
                                🏆
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900">{t('chapters.chapterTest')}</p>
                                <p className="text-xs text-gray-600">{t('chapters.passTestToUnlock')}</p>
                              </div>
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-400 text-yellow-900">
                                {t('chapters.test')}
                              </span>
                            </div>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon */}
      {comingSoonChapters.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">🔜 {t('chapters.comingSoon')}</h2>
          <div className="space-y-3">
            {comingSoonChapters.map((chapter) => {
              const unlocksAt = chapter.unlocksAt ? new Date(chapter.unlocksAt) : null;
              const localeMap: Record<string, string> = { de: 'de-DE', en: 'en-US', 'pt-br': 'pt-BR' };
              const unlockDate = unlocksAt
                ? unlocksAt.toLocaleDateString(localeMap[language] || 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : t('chapters.tba');
              const now = new Date();
              const isUnlockingSoon = unlocksAt && (unlocksAt.getTime() - now.getTime()) < 60000;

              return (
                <div
                  key={chapter.id}
                  className={`rounded-2xl border-2 border-dashed p-5 transition-all ${
                    isUnlockingSoon
                      ? 'border-yellow-400 bg-yellow-50 ring-2 ring-yellow-300'
                      : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-3xl ${isUnlockingSoon ? 'animate-pulse' : ''}`}>
                      {isUnlockingSoon ? '⚡' : '🔒'}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-700">{chapter.title}</h3>
                      {chapter.description && <p className="text-sm text-gray-500">{chapter.description}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        {isUnlockingSoon ? `🚀 ${t('chapters.unlockingSoon')}` : `${t('chapters.availableFrom')}: ${unlockDate}`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {chapters.length === 0 && comingSoonChapters.length === 0 && !isLoading && (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
          <p className="text-2xl mb-2">📚</p>
          <p className="text-gray-700 font-semibold mb-2">{t('chapters.noChapters')}</p>
          <p className="text-sm text-gray-500">{t('chapters.contentComingSoon')}</p>
        </div>
      )}
    </div>
  );
}
