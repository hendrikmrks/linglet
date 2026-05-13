'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/user-context';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import { ExerciseRunner, type ExerciseSummary } from '@/components/exercise-runner';
import { VocabIntro } from '@/components/vocab-intro';
import { generateExercises, type GeneratedExercise, type Vocabulary } from '@/lib/exercise-generator';

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

interface Subchapter {
  id: string;
  title: string;
  description?: string;
  vocabulary: Vocabulary[];
  isLocked: boolean;
  isAvailable: boolean;
  status?: 'LOCKED' | 'CURRENT' | 'COMPLETED';
  order: number;
}

interface Chapter {
  id: string;
  title: string;
  sourceLanguage: string;
  targetLanguage: string;
  isLocked: boolean;
  isAvailable: boolean;
  unlocksAt?: string | null;
  subchapters: Subchapter[];
}

const MAX_HEARTS = 5;

// ────────────────────────────────────────────
// Confetti animation component
// ────────────────────────────────────────────

function Confetti() {
  const pieces = useMemo(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      color: colors[i % colors.length],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.5}s`,
      duration: `${1.5 + Math.random() * 2}s`,
      size: `${6 + Math.random() * 8}px`,
      rotation: `${Math.random() * 360}deg`,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: p.left,
            top: '-20px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `rotate(${p.rotation})`,
          }}
        />
      ))}
    </div>
  );
}

// ────────────────────────────────────────────
// Summary screen
// ────────────────────────────────────────────

interface SummaryScreenProps {
  summary: ExerciseSummary;
  xpReward: number;
  title: string;
  isChapterTest?: boolean;
  passed?: boolean;
  isPremium?: boolean;
  onRetry: () => void;
  onContinue: () => void;
}

function SummaryScreen({ summary, xpReward, title, isChapterTest, passed, isPremium, onRetry, onContinue }: SummaryScreenProps) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [showConfetti, setShowConfetti] = useState(false);
  const accuracy = summary.totalExercises > 0
    ? Math.round((summary.correctFirst / summary.totalExercises) * 100)
    : 0;

  const minutes = Math.floor(summary.durationMs / 60000);
  const seconds = Math.floor((summary.durationMs % 60000) / 1000);
  const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  const success = isChapterTest ? Boolean(passed) : summary.heartsRemaining > 0;

  useEffect(() => {
    if (success) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 4000);
      return () => { clearTimeout(t); };
    }
    return undefined;
  }, [success]);

  return (
    <div className="relative">
      {showConfetti && <Confetti />}

      <div className={`text-center transition-all duration-700 ${showConfetti ? 'animate-summary-pop' : ''}`}>
        {/* Hero */}
        <div className={`text-6xl mb-4 ${success ? 'animate-bounce' : ''}`}>
          {isChapterTest
            ? (passed ? '🏆' : '📝')
            : (success ? '🎉' : '💔')
          }
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-1">{title}</h2>
        <p className={`text-lg font-semibold mb-6 ${success ? 'text-green-600' : 'text-red-600'}`}>
          {isChapterTest
            ? (passed ? t('lessonReader.testPassed') : t('lessonReader.testFailed'))
            : (success ? t('lessonReader.lessonComplete') : t('lessonReader.heartsUsedUp'))
          }
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6 max-w-sm mx-auto">
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
            <p className="text-2xl font-black text-blue-600">{accuracy}%</p>
            <p className="text-xs text-blue-500 font-semibold">{t('lesson.accuracy')}</p>
          </div>
          <div className="rounded-xl bg-purple-50 border border-purple-200 p-3">
            <p className="text-2xl font-black text-purple-600">{timeStr}</p>
            <p className="text-xs text-purple-500 font-semibold">{t('lessonReader.time')}</p>
          </div>
          <div className="rounded-xl bg-green-50 border border-green-200 p-3">
            <p className="text-2xl font-black text-green-600">{summary.correctFirst}</p>
            <p className="text-xs text-green-500 font-semibold">{t('lessonReader.correctFirstTry')}</p>
          </div>
          <div className="rounded-xl bg-red-50 border border-red-200 p-3">
            <p className="text-2xl font-black text-red-600">{summary.wrongCount}</p>
            <p className="text-xs text-red-500 font-semibold">{t('lessonReader.mistakes')}</p>
          </div>
        </div>

        {/* XP reward */}
        {xpReward > 0 && (
          <div className="mb-2 flex flex-col items-center gap-1">
            <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-300 rounded-full px-5 py-2">
              <span className="text-xl">⭐</span>
              <span className="font-black text-yellow-700 text-lg">+{xpReward} XP</span>
              {isPremium && (
                <span className="text-xs font-bold bg-indigo-100 text-indigo-600 rounded-full px-2 py-0.5">✕ 1,5×</span>
              )}
            </div>
            {!isPremium && (
              <p className="text-indigo-500 text-xs mt-1">
                🔒 Mit Premium: +{Math.round(xpReward * 1.5)} XP
              </p>
            )}
          </div>
        )}

        {/* Hearts remaining */}
        <div className="flex justify-center gap-1 mt-4 mb-6">
          {Array.from({ length: MAX_HEARTS }).map((_, i) => (
            <span key={i} className={`text-2xl transition-all ${i < summary.heartsRemaining ? 'text-red-500 scale-100' : 'text-gray-300 scale-75'}`}>
              ♥
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          {isChapterTest && !passed ? (
            <Button onClick={onRetry} size="lg">
              🔄 {t('lessonReader.retryTest')}
            </Button>
          ) : (
            <>
              <Button onClick={onContinue} size="lg">
                {success ? `→ ${t('lessonReader.continue')}` : `🔄 ${t('lessonReader.retryLesson')}`}
              </Button>
              <Button variant="secondary" onClick={onRetry} size="lg">
                ↩️ {t('lessonReader.repeat')}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface GameOverScreenProps {
  title: string;
  onRetry: () => void;
  onBackToOverview: () => void;
}

function GameOverScreen({ title, onRetry, onBackToOverview }: GameOverScreenProps) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const copy = {
    de: {
      label: 'Game Over',
      description: 'Du hast alle Herzen verloren. Diese Lektion zählt nicht als abgeschlossen.',
      noProgress: 'Kein XP, kein Streak, kein Fortschritt',
      back: 'Zur Übersicht',
    },
    en: {
      label: 'Game Over',
      description: 'You lost all hearts. This lesson does not count as completed.',
      noProgress: 'No XP, no streak, no progress',
      back: 'Back to overview',
    },
    'pt-br': {
      label: 'Fim de jogo',
      description: 'Você perdeu todos os corações. Esta lição não conta como concluída.',
      noProgress: 'Sem XP, sem streak, sem progresso',
      back: 'Voltar à visão geral',
    },
  }[language] ?? {
    label: 'Game Over',
    description: 'You lost all hearts. This lesson does not count as completed.',
    noProgress: 'No XP, no streak, no progress',
    back: 'Back to overview',
  };

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
      <div className="mb-4 text-6xl">💔</div>
      <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-red-500">{copy.label}</p>
      <h2 className="mb-2 text-3xl font-black text-gray-900">{title}</h2>
      <p className="mb-6 text-base text-gray-700">{copy.description}</p>

      <div className="mb-8 inline-flex rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600">
        {copy.noProgress}
      </div>

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Button onClick={onRetry} size="lg">
          🔄 {t('lessonReader.retryTest')}
        </Button>
        <Button variant="secondary" onClick={onBackToOverview} size="lg">
          ← {copy.back}
        </Button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// Lesson Reader (main component)
// ────────────────────────────────────────────

export function LessonReader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser, user } = useUser();
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const [activeSubchapterId, setActiveSubchapterId] = useState<string | null>(null);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [exercises, setExercises] = useState<GeneratedExercise[]>([]);
  const [exerciseKey, setExerciseKey] = useState(0);

  // Summary / completion state  
  const [showSummary, setShowSummary] = useState(false);
  const [showVocabIntro, setShowVocabIntro] = useState(false);
  const [lastSummary, setLastSummary] = useState<ExerciseSummary | null>(null);
  const [lastXpReward, setLastXpReward] = useState(0);

  // Chapter test mode
  const isTestMode = searchParams.get('mode') === 'test';
  const [testPassed, setTestPassed] = useState(false);

  const chapterId = searchParams.get('chapterId');
  const preselectedSubchapterId = searchParams.get('subchapterId');

  const activeSubchapter = useMemo(() => {
    if (!chapter || !activeSubchapterId) return null;
    return chapter.subchapters.find((s) => s.id === activeSubchapterId) || null;
  }, [chapter, activeSubchapterId]);

  const shouldShowVocabIntro = useCallback(
    (subchapter: Subchapter | null | undefined) => {
      if (isTestMode || !subchapter) {
        return false;
      }

      return subchapter.status !== 'LOCKED' && subchapter.vocabulary.length > 0;
    },
    [isTestMode]
  );

  const resetSession = useCallback(
    (options: { skipIntro?: boolean; subchapter?: Subchapter | null } = {}) => {
      const nextSubchapter = options.subchapter ?? activeSubchapter;

      setHearts(MAX_HEARTS);
      setShowSummary(false);
      setShowVocabIntro(!options.skipIntro && shouldShowVocabIntro(nextSubchapter));
      setLastSummary(null);
      setLastXpReward(0);
      setExerciseKey((k) => k + 1);
    },
    [activeSubchapter, shouldShowVocabIntro]
  );

  // Generate exercises
  useEffect(() => {
    if (isTestMode && chapter) {
      // Chapter test: combine vocab from ALL subchapters
      const allVocab = chapter.subchapters.flatMap((s) => s.vocabulary);
      if (allVocab.length > 0) {
        setExercises(generateExercises(allVocab));
      } else {
        setExercises([]);
      }
    } else if (activeSubchapter && activeSubchapter.vocabulary.length > 0) {
      setExercises(generateExercises(activeSubchapter.vocabulary));
    } else {
      setExercises([]);
    }
  }, [activeSubchapter, isTestMode, chapter]);

  const loadChapter = async (options: { preserveSession?: boolean; preserveSelection?: boolean } = {}) => {
    if (!chapterId) {
      setError(t('lessonReader.chapterNotFound'));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chapters?includeComingSoon=true', { credentials: 'include' });
      if (!response.ok) {
        setError(t('lessonReader.loadError'));
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      const foundChapter = data.chapters?.find((item: Chapter) => item.id === chapterId);

      if (!foundChapter) {
        setError(t('lessonReader.chapterNotFound'));
        setIsLoading(false);
        return;
      }

      if (!foundChapter.isAvailable && foundChapter.isLocked) {
        setIsLocked(true);
        setChapter(foundChapter);
        setIsLoading(false);
        return;
      }

      setIsLocked(false);
      setChapter(foundChapter);

      let selectedSubchapter: Subchapter | null = null;

      if (!isTestMode) {
        if (options.preserveSelection) {
          selectedSubchapter = foundChapter.subchapters.find((subchapter: Subchapter) => subchapter.id === activeSubchapterId) || null;
        } else {
          const firstCurrent = foundChapter.subchapters.find((subchapter: Subchapter) => subchapter.status === 'CURRENT');
          const firstOpen = foundChapter.subchapters.find((subchapter: Subchapter) => subchapter.status !== 'LOCKED');
          const explicit = foundChapter.subchapters.find(
            (subchapter: Subchapter) => subchapter.id === preselectedSubchapterId && subchapter.status !== 'LOCKED'
          );
          selectedSubchapter = explicit || firstCurrent || firstOpen || foundChapter.subchapters[0] || null;
          setActiveSubchapterId(selectedSubchapter?.id || null);
        }
      }

      if (!options.preserveSession) {
        resetSession({ skipIntro: isTestMode, subchapter: selectedSubchapter });
      }
    } catch {
      setError(t('lessonReader.loadError'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChapter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId, preselectedSubchapterId]);

  const completeActiveSubchapter = async (score: number, maxScore: number, livesRemaining: number) => {
    if (!activeSubchapter && !isTestMode) {
      return { success: false };
    }

    try {
      if (isTestMode) {
        return { success: livesRemaining > 0 };
      }

      const response = await fetch('/api/subchapters/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          subchapterId: activeSubchapter!.id,
          score,
          maxScore,
          livesRemaining,
          failed: livesRemaining <= 0,
        }),
      });

      if (!response.ok) {
        setLastXpReward(0);
        return { success: false };
      }

      const result = await response.json();

      if (!result.success) {
        setLastXpReward(0);
        return { success: false, reason: result.reason as string | undefined };
      }

      setLastXpReward(result.xpReward || 0);
      await refreshUser();
      await loadChapter({ preserveSession: true, preserveSelection: true });
      return { success: true };
    } catch {
      setLastXpReward(0);
      return { success: false };
    }
  };

  const handleHeartLost = useCallback(() => {
    setHearts((h) => Math.max(0, h - 1));
  }, []);

  const handleExerciseComplete = useCallback(
    async (score: number, total: number, summary: ExerciseSummary) => {
      setLastSummary(summary);
      setShowSummary(true);

      if (isTestMode) {
        const passed = summary.totalExercises > 0 &&
          (summary.correctFirst / summary.totalExercises) >= 0.8 &&
          summary.heartsRemaining > 0;
        setTestPassed(passed);
        setLastXpReward(passed ? 50 : 0);
      } else {
        await completeActiveSubchapter(score, total, summary.heartsRemaining);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSubchapter, isTestMode]
  );

  const handleContinue = () => {
    if (isTestMode) {
      router.push('/path');
      return;
    }
    // Go to next subchapter or back to path
    if (chapter && activeSubchapter) {
      const currentIndex = chapter.subchapters.findIndex((s) => s.id === activeSubchapter.id);
      const nextSub = chapter.subchapters[currentIndex + 1];
      if (nextSub && nextSub.status !== 'LOCKED') {
        setActiveSubchapterId(nextSub.id);
        resetSession({ subchapter: nextSub });
      } else {
        router.push('/path');
      }
    } else {
      router.push('/path');
    }
  };

  // ─── Renders ───

  if (isLoading) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-blue-200 border-t-blue-500" />
          <span className="text-gray-600">{t('lessonReader.loading')}</span>
        </div>
      </div>
    );
  }

  if (error && !chapter) {
    return (
      <div className="w-full p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
    );
  }

  if (!chapter) {
    return (
      <div className="w-full p-6 bg-gray-50 border border-gray-200 rounded-lg">{t('lessonReader.chapterNotFound')}</div>
    );
  }

  if (isLocked) {
    return (
      <div className="w-full p-8 border-2 rounded-lg text-center bg-gray-50 border-gray-300">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold mb-2 text-gray-900">{chapter.title}</h1>
        <p className="mb-6 text-gray-700">{t('lessonReader.chapterUnavailable')}</p>
        <Button onClick={() => router.back()}>{t('lessonReader.back')}</Button>
      </div>
    );
  }

  // ─── CHAPTER TEST MODE ───
  if (isTestMode) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t('lessonReader.chapterTest')}</h2>
                <p className="text-sm text-gray-500">{chapter.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: MAX_HEARTS }).map((_, i) => (
                <span key={i} className={`text-lg ${i < hearts ? 'text-red-500' : 'text-gray-300'}`}>♥</span>
              ))}
            </div>
          </div>

          {showSummary && lastSummary ? (
            lastSummary.heartsRemaining === 0 ? (
              <GameOverScreen
                title={t('lessonReader.chapterTest')}
                onRetry={resetSession}
                onBackToOverview={() => router.push('/path')}
              />
            ) : (
              <SummaryScreen
                summary={lastSummary}
                xpReward={lastXpReward}
                title={t('lessonReader.chapterTest')}
                isChapterTest
                passed={testPassed}
                isPremium={user?.plan === 'PREMIUM'}
                onRetry={resetSession}
                onContinue={handleContinue}
              />
            )
          ) : exercises.length > 0 ? (
            <ExerciseRunner
              key={exerciseKey}
              exercises={exercises}
              hearts={hearts}
              onHeartLost={handleHeartLost}
              onComplete={handleExerciseComplete}
            />
          ) : (
            <div className="text-gray-600 text-center py-8">{t('lessonReader.noTestExercises')}</div>
          )}
        </div>

        <div className="mt-4 text-center">
          <Button variant="secondary" onClick={() => router.push('/path')}>{t('lessonReader.backToLearningPath')}</Button>
        </div>
      </div>
    );
  }

  // ─── NORMAL SUBCHAPTER MODE ───
  return (
    <div className="w-full grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <aside className="bg-white rounded-2xl border border-gray-200 p-4 h-fit">
        <h1 className="text-lg font-bold text-gray-900 mb-3">{chapter.title}</h1>

        <div className="space-y-1.5">
          {chapter.subchapters.map((sub) => {
            const isActive = sub.id === activeSubchapterId;
            const isCompleted = sub.status === 'COMPLETED';
            const isSubLocked = sub.status === 'LOCKED';

            return (
              <button
                key={sub.id}
                disabled={isSubLocked}
                onClick={() => {
                  setActiveSubchapterId(sub.id);
                  resetSession({ subchapter: sub });
                }}
                className={`w-full text-left rounded-xl border p-2.5 transition-all duration-200 ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : isSubLocked
                      ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      : isCompleted
                        ? 'border-green-200 bg-green-50 hover:border-green-400'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                        ? 'bg-blue-500 text-white'
                        : isSubLocked
                          ? 'bg-gray-200 text-gray-400'
                          : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isCompleted ? '✓' : isSubLocked ? '🔒' : sub.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isSubLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                      {sub.title}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          <Button variant="secondary" className="w-full" onClick={() => router.push('/path')}>
            ← {t('lessonReader.backToPath')}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6">
        {!activeSubchapter ? (
          <div className="text-gray-600">{t('lessonReader.noSubchapter')}</div>
        ) : activeSubchapter.status === 'LOCKED' ? (
          <div className="text-gray-600">{t('lessonReader.subchapterLocked')}</div>
        ) : activeSubchapter.vocabulary.length === 0 ? (
          <div className="text-gray-600">{t('lessonReader.noVocabulary')}</div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{activeSubchapter.title}</h2>
              <div className="flex items-center gap-1">
                {Array.from({ length: MAX_HEARTS }).map((_, i) => (
                  <span key={i} className={`text-lg transition-all ${i < hearts ? 'text-red-500' : 'text-gray-300'}`}>♥</span>
                ))}
              </div>
            </div>

            {/* Summary or exercises */}
            {showSummary && lastSummary ? (
              lastSummary.heartsRemaining === 0 ? (
                <GameOverScreen
                  title={activeSubchapter.title}
                  onRetry={() => resetSession({ skipIntro: true })}
                  onBackToOverview={() => router.push('/path')}
                />
              ) : (
                <SummaryScreen
                  summary={lastSummary}
                  xpReward={lastXpReward}
                  title={activeSubchapter.title}
                  isPremium={user?.plan === 'PREMIUM'}
                  onRetry={() => resetSession({ skipIntro: true })}
                  onContinue={handleContinue}
                />
              )
            ) : showVocabIntro ? (
              <VocabIntro
                vocabulary={activeSubchapter.vocabulary}
                onStart={() => setShowVocabIntro(false)}
                onSkip={() => setShowVocabIntro(false)}
                canSkip={activeSubchapter.status === 'COMPLETED'}
                language={language}
                sourceLanguage={chapter.sourceLanguage}
                targetLanguage={chapter.targetLanguage}
              />
            ) : (
              <ExerciseRunner
                key={exerciseKey}
                exercises={exercises}
                hearts={hearts}
                onHeartLost={handleHeartLost}
                onComplete={handleExerciseComplete}
              />
            )}
          </div>
        )}
      </section>
    </div>
  );
}
