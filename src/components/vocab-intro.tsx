'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { type Vocabulary } from '@/lib/exercise-generator';
import { useTranslation } from '@/lib/use-translation';

interface VocabIntroProps {
  vocabulary: Vocabulary[];
  onStart: () => void;
  onSkip: () => void;
  canSkip?: boolean;
  language: string;
  targetLanguage: string;
  sourceLanguage: string;
}

function formatLanguageLabel(language: string) {
  return language.toUpperCase();
}

export function VocabIntro({
  vocabulary,
  onStart,
  onSkip,
  canSkip = false,
  language,
  targetLanguage,
  sourceLanguage,
}: VocabIntroProps) {
  const { t } = useTranslation(language);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'cards' | 'overview'>('cards');

  useEffect(() => {
    setCurrentIndex(0);
    setPhase('cards');
  }, [vocabulary]);

  if (vocabulary.length === 0) {
    return null;
  }

  const current = vocabulary[currentIndex];
  const total = vocabulary.length;
  const progress = ((currentIndex + 1) / total) * 100;
  const sourceLabel = formatLanguageLabel(sourceLanguage);
  const targetLabel = formatLanguageLabel(targetLanguage);

  if (phase === 'overview') {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">{t('vocabIntro.title')}</p>
          <h3 className="mt-2 text-2xl font-black text-gray-900">{t('vocabIntro.overview')}</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {vocabulary.map((item) => (
            <div key={item.id} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">{sourceLabel}</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">{targetLabel}</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{item.word}</p>
              <p className="mt-1 text-base text-gray-700">{item.translation}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Button variant="secondary" size="lg" onClick={() => {
            setCurrentIndex(0);
            setPhase('cards');
          }}>
            {t('vocabIntro.reviewAll')}
          </Button>
          <Button size="lg" onClick={onStart}>
            {t('vocabIntro.startExercise')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">{t('vocabIntro.title')}</p>
          <p className="mt-2 text-sm font-medium text-gray-500">
            {t('vocabIntro.cardOf', { current: currentIndex + 1, total })}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {canSkip && (
          <Button variant="secondary" onClick={onSkip}>
            {t('vocabIntro.skip')}
          </Button>
        )}
      </div>

      <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">{sourceLabel}</span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">{targetLabel}</span>
        </div>

        <p className="text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">{current.word}</p>
        <p className="mt-3 text-xl font-semibold text-gray-700 sm:text-2xl">{current.translation}</p>

        <div className="mt-8 space-y-4">
          {current.example && (
            <div className="rounded-2xl border border-blue-100 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
                {t('vocabIntro.example')} · {sourceLabel}
              </p>
              <p className="mt-2 text-base text-gray-700">{current.example}</p>
            </div>
          )}
          {current.translatedExample && (
            <div className="rounded-2xl border border-emerald-100 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">
                {t('vocabIntro.translatedExample')} · {targetLabel}
              </p>
              <p className="mt-2 text-base text-gray-700">{current.translatedExample}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <Button variant="secondary" size="lg" disabled={currentIndex === 0} onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}>
          ← {t('vocabIntro.previous')}
        </Button>
        <Button
          size="lg"
          onClick={() => {
            if (currentIndex === total - 1) {
              setPhase('overview');
              return;
            }

            setCurrentIndex((index) => Math.min(total - 1, index + 1));
          }}
        >
          {currentIndex === total - 1 ? `${t('vocabIntro.overview')} →` : `${t('vocabIntro.next')} →`}
        </Button>
      </div>
    </div>
  );
}
