'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language-context';
import { useTranslation } from '@/lib/use-translation';
import { type GeneratedExercise } from '@/lib/exercise-generator';

// ────────────────────────────────────────────
// Shared types
// ────────────────────────────────────────────

type FeedbackState = 'idle' | 'correct' | 'wrong';

interface ExerciseProps {
  exercise: GeneratedExercise;
  onResult: (correct: boolean) => void;
}

// ────────────────────────────────────────────
// Multiple-choice (translate-choice & reverse-choice)
// ────────────────────────────────────────────

function MultipleChoice({ exercise, onResult }: ExerciseProps) {
  const ex = exercise as Extract<GeneratedExercise, { type: 'translate-choice' | 'reverse-choice' }>;
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const label = ex.type === 'translate-choice' ? t('exercise.whatDoesThisMean') : t('exercise.whichWordFits');

  const handleSelect = (idx: number) => {
    if (feedback !== 'idle') return;
    setSelected(idx);
    const isCorrect = idx === ex.correctIndex;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      onResult(isCorrect);
      setSelected(null);
      setFeedback('idle');
    }, 1200);
  };

  return (
    <div>
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      <p className="text-3xl font-black text-gray-900 mb-6">{ex.prompt}</p>

      <div className="grid grid-cols-2 gap-3">
        {ex.options.map((opt, idx) => {
          let border = 'border-gray-200 hover:border-blue-400';
          let bg = 'bg-white';

          if (feedback !== 'idle' && idx === ex.correctIndex) {
            border = 'border-green-500';
            bg = 'bg-green-50';
          } else if (feedback === 'wrong' && idx === selected) {
            border = 'border-red-500';
            bg = 'bg-red-50';
          }

          return (
            <button
              key={idx}
              disabled={feedback !== 'idle'}
              onClick={() => handleSelect(idx)}
              className={`border-2 rounded-xl p-4 text-lg font-semibold transition-all ${border} ${bg} ${
                feedback !== 'idle' ? 'cursor-default' : 'cursor-pointer active:scale-95'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {feedback === 'correct' && (
        <div className="mt-4 rounded-xl bg-green-100 border border-green-300 text-green-800 font-bold p-3 text-center">
          ✅ {t('exercise.correct')}
        </div>
      )}
      {feedback === 'wrong' && (
        <div className="mt-4 rounded-xl bg-red-100 border border-red-300 text-red-800 font-bold p-3 text-center">
          ❌ {t('exercise.wrongCorrectIs')}: <span className="underline">{ex.options[ex.correctIndex]}</span>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────
// Fill in the blank
// ────────────────────────────────────────────

function FillInBlank({ exercise, onResult }: ExerciseProps) {
  const ex = exercise as Extract<GeneratedExercise, { type: 'fill-in-blank' }>;
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [beforeBlank, ...afterBlankParts] = ex.sentence.split('_____');
  const afterBlank = afterBlankParts.join('_____');

  const handleSelect = (idx: number) => {
    if (feedback !== 'idle') return;
    setSelected(idx);
    const isCorrect = idx === ex.correctIndex;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      onResult(isCorrect);
      setSelected(null);
      setFeedback('idle');
    }, 1200);
  };

  return (
    <div>
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('exercise.fillInBlank')}</p>
      <p className="text-base text-gray-600 mb-4">{t('exercise.fillInBlankHint')}</p>
      <p className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
        {beforeBlank}
        <span className="inline-flex rounded-lg bg-blue-100 px-3 py-1 text-blue-700">_____</span>
        {afterBlank}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {ex.options.map((option, idx) => {
          let border = 'border-gray-200 hover:border-blue-400';
          let bg = 'bg-white';

          if (feedback !== 'idle' && idx === ex.correctIndex) {
            border = 'border-green-500';
            bg = 'bg-green-50';
          } else if (feedback === 'wrong' && idx === selected) {
            border = 'border-red-500';
            bg = 'bg-red-50';
          }

          return (
            <button
              key={idx}
              disabled={feedback !== 'idle'}
              onClick={() => handleSelect(idx)}
              className={`border-2 rounded-xl p-4 text-lg font-semibold transition-all ${border} ${bg} ${
                feedback !== 'idle' ? 'cursor-default' : 'cursor-pointer active:scale-95'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {feedback === 'correct' && (
        <div className="mt-4 rounded-xl bg-green-100 border border-green-300 text-green-800 font-bold p-3 text-center">
          ✅ {t('exercise.correct')}
        </div>
      )}
      {feedback === 'wrong' && (
        <div className="mt-4 rounded-xl bg-red-100 border border-red-300 text-red-800 font-bold p-3 text-center">
          ❌ {t('exercise.wrongCorrectIs')}: <span className="underline">{ex.options[ex.correctIndex]}</span>
        </div>
      )}
    </div>
  );
}

function TrueFalse({ exercise, onResult }: ExerciseProps) {
  const ex = exercise as Extract<GeneratedExercise, { type: 'true-false' }>;
  const [selected, setSelected] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const correctChoice = ex.isCorrect;

  const handleSelect = (choice: boolean) => {
    if (feedback !== 'idle') return;
    setSelected(choice);
    const isCorrect = choice === correctChoice;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      onResult(isCorrect);
      setSelected(null);
      setFeedback('idle');
    }, 1200);
  };

  const getButtonClasses = (choice: boolean) => {
    if (feedback === 'idle') {
      return 'border-gray-200 bg-white hover:border-blue-400 cursor-pointer active:scale-95';
    }

    if (choice === correctChoice) {
      return 'border-green-500 bg-green-50 text-green-800 cursor-default';
    }

    if (choice === selected) {
      return 'border-red-500 bg-red-50 text-red-800 cursor-default';
    }

    return 'border-gray-200 bg-white cursor-default';
  };

  return (
    <div>
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('exercise.trueFalse')}</p>
      <p className="text-base text-gray-600 mb-4">{t('exercise.trueFalseHint')}</p>
      <p className="text-3xl font-black text-gray-900 mb-3">{ex.word}</p>
      <p className="text-xl font-bold text-gray-700 mb-6">= {ex.proposedTranslation}</p>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={feedback !== 'idle'}
          onClick={() => handleSelect(true)}
          className={`w-full rounded-xl border-2 p-4 text-base font-semibold transition-all ${getButtonClasses(true)}`}
        >
          {t('exercise.correct_btn')}
        </button>
        <button
          type="button"
          disabled={feedback !== 'idle'}
          onClick={() => handleSelect(false)}
          className={`w-full rounded-xl border-2 p-4 text-base font-semibold transition-all ${getButtonClasses(false)}`}
        >
          {t('exercise.wrong_btn')}
        </button>
      </div>

      {feedback === 'correct' && (
        <div className="mt-4 rounded-xl bg-green-100 border border-green-300 text-green-800 font-bold p-3 text-center">
          ✅ {t('exercise.correct')}
        </div>
      )}
      {feedback === 'wrong' && (
        <div className="mt-4 rounded-xl bg-red-100 border border-red-300 text-red-800 font-bold p-3 text-center">
          ❌ {t('exercise.wrongCorrectIs')}: <span className="underline">{ex.isCorrect ? t('exercise.correct_btn') : t('exercise.wrong_btn')}</span>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────
// Match pairs
// ────────────────────────────────────────────

function MatchPairs({ exercise, onResult }: ExerciseProps) {
  const ex = exercise as Extract<GeneratedExercise, { type: 'match-pairs' }>;
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const shuffledWords = useMemo(() => [...ex.pairs].sort(() => Math.random() - 0.5).map((p) => p.word), [ex.pairs]);
  const shuffledTranslations = useMemo(() => [...ex.pairs].sort(() => Math.random() - 0.5).map((p) => p.translation), [ex.pairs]);

  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<{ word: string; translation: string } | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const correctMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of ex.pairs) m.set(p.word, p.translation);
    return m;
  }, [ex.pairs]);

  const handleWordClick = (w: string) => {
    if (matched.has(w)) return;
    setSelectedWord(w);
    setWrongPair(null);
  };

  const handleTranslationClick = (t: string) => {
    if (!selectedWord) return;
    if ([...matched].some((mw) => correctMap.get(mw) === t)) return;

    if (correctMap.get(selectedWord) === t) {
      const next = new Set(matched);
      next.add(selectedWord);
      setMatched(next);
      setSelectedWord(null);
      setWrongPair(null);

      if (next.size === ex.pairs.length) {
        setTimeout(() => onResult(mistakes === 0), 600);
      }
    } else {
      setWrongPair({ word: selectedWord, translation: t });
      setMistakes((m) => m + 1);
      setTimeout(() => {
        setWrongPair(null);
        setSelectedWord(null);
      }, 800);
    }
  };

  return (
    <div>
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('exercise.matchPairs')}</p>
      <p className="text-base text-gray-600 mb-6">{t('exercise.matchPairsHint')}</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {shuffledWords.map((w) => {
            const isMatched = matched.has(w);
            const isSelected = selectedWord === w;
            const isWrong = wrongPair?.word === w;
            return (
              <button
                key={w}
                disabled={isMatched}
                onClick={() => handleWordClick(w)}
                className={`w-full rounded-xl border-2 p-3 text-base font-semibold transition-all ${
                  isMatched
                    ? 'border-green-400 bg-green-50 text-green-700 opacity-70'
                    : isWrong
                      ? 'border-red-400 bg-red-50 text-red-700'
                      : isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-800 scale-[1.03]'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                {w}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {shuffledTranslations.map((t) => {
            const isMatched = [...matched].some((mw) => correctMap.get(mw) === t);
            const isWrong = wrongPair?.translation === t;
            return (
              <button
                key={t}
                disabled={isMatched}
                onClick={() => handleTranslationClick(t)}
                className={`w-full rounded-xl border-2 p-3 text-base font-semibold transition-all ${
                  isMatched
                    ? 'border-green-400 bg-green-50 text-green-700 opacity-70'
                    : isWrong
                      ? 'border-red-400 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {matched.size === ex.pairs.length && (
        <div className="mt-4 rounded-xl bg-green-100 border border-green-300 text-green-800 font-bold p-3 text-center">
          {mistakes === 0 ? `✅ ${t('exercise.perfect')}` : `✅ ${t('exercise.doneWithMistakes')} (${mistakes} ${t('lessonReader.mistakes')})`}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────
// Type answer
// ────────────────────────────────────────────

function TypeAnswer({ exercise, onResult }: ExerciseProps) {
  const ex = exercise as Extract<GeneratedExercise, { type: 'type-answer' }>;
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const normalize = (s: string) => s.trim().toLowerCase().replace(/[.,!?;:'"()\-]/g, '');

  const handleCheck = () => {
    if (feedback !== 'idle') return;
    const isCorrect = normalize(input) === normalize(ex.correctAnswer);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      onResult(isCorrect);
      setInput('');
      setFeedback('idle');
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCheck();
  };

  return (
    <div>
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('exercise.translateThisWord')}</p>
      <p className="text-3xl font-black text-gray-900 mb-6">{ex.prompt}</p>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('exercise.enterTranslation')}
        disabled={feedback !== 'idle'}
        autoFocus
        className={`w-full border-2 rounded-xl p-4 text-lg font-medium outline-none transition-all ${
          feedback === 'correct'
            ? 'border-green-500 bg-green-50'
            : feedback === 'wrong'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-300 focus:border-blue-500'
        }`}
      />

      {feedback === 'idle' && (
        <Button className="mt-4 w-full" onClick={handleCheck} disabled={input.trim().length === 0}>
          {t('exercise.check')}
        </Button>
      )}

      {feedback === 'correct' && (
        <div className="mt-4 rounded-xl bg-green-100 border border-green-300 text-green-800 font-bold p-3 text-center">
          ✅ {t('exercise.correct')}
        </div>
      )}
      {feedback === 'wrong' && (
        <div className="mt-4 rounded-xl bg-red-100 border border-red-300 text-red-800 font-bold p-3 text-center">
          ❌ {t('exercise.correctAnswer')}: <span className="underline">{ex.correctAnswer}</span>
        </div>
      )}
    </div>
  );
}

function WordScramble({ exercise, onResult }: ExerciseProps) {
  const ex = exercise as Extract<GeneratedExercise, { type: 'word-scramble' }>;
  const [selectedTileIds, setSelectedTileIds] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  const tiles = useMemo(
    () => ex.scrambledWord.split('').map((letter, index) => ({ id: index, letter })),
    [ex.scrambledWord]
  );

  const selectedTiles = selectedTileIds.map((tileId) => tiles.find((tile) => tile.id === tileId)).filter(Boolean) as {
    id: number;
    letter: string;
  }[];
  const currentAnswer = selectedTiles.map((tile) => tile.letter).join('');

  const handleTileClick = (tileId: number) => {
    if (feedback !== 'idle') return;
    if (selectedTileIds.includes(tileId)) return;
    if (selectedTileIds.length >= ex.correctWord.length) return;
    setSelectedTileIds((currentIds) => [...currentIds, tileId]);
  };

  const handleRemoveTile = (position: number) => {
    if (feedback !== 'idle') return;
    setSelectedTileIds((currentIds) => currentIds.filter((_, index) => index !== position));
  };

  const handleCheck = () => {
    if (feedback !== 'idle') return;

    const isCorrect = currentAnswer === ex.correctWord;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setTimeout(() => {
        onResult(true);
        setSelectedTileIds([]);
        setFeedback('idle');
      }, 1500);
      return;
    }

    setTimeout(() => {
      setSelectedTileIds([]);
      setFeedback('idle');
    }, 900);
  };

  return (
    <div>
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('exercise.wordScramble')}</p>
      <p className="text-base text-gray-600 mb-2">{t('exercise.wordScrambleHint')}</p>
      <p className="text-3xl font-black text-gray-900 mb-6">{ex.prompt}</p>

      <div
        className={`min-h-[4.5rem] rounded-xl border-2 p-3 mb-4 flex flex-wrap gap-2 ${
          feedback === 'correct'
            ? 'border-green-500 bg-green-50'
            : feedback === 'wrong'
              ? 'border-red-500 bg-red-50'
              : 'border-gray-200 bg-white'
        }`}
      >
        {selectedTiles.length > 0 ? (
          selectedTiles.map((tile, index) => (
            <button
              key={`${tile.id}-${index}`}
              type="button"
              onClick={() => handleRemoveTile(index)}
              disabled={feedback !== 'idle'}
              className="w-10 h-10 rounded-lg border-2 border-blue-300 bg-blue-50 text-lg font-bold text-blue-800 transition-all active:scale-95"
            >
              {tile.letter}
            </button>
          ))
        ) : (
          <div className="flex min-h-[2.5rem] items-center text-sm font-medium text-gray-400">
            {Array.from({ length: ex.correctWord.length }, () => '•').join(' ')}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tiles.map((tile) => {
          const isUsed = selectedTileIds.includes(tile.id);
          return (
            <button
              key={tile.id}
              type="button"
              disabled={isUsed || feedback !== 'idle'}
              onClick={() => handleTileClick(tile.id)}
              className={`w-10 h-10 rounded-lg border-2 text-lg font-bold transition-all ${
                isUsed
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-default'
                  : 'border-gray-200 bg-white text-gray-900 hover:border-blue-400 active:scale-95'
              }`}
            >
              {tile.letter}
            </button>
          );
        })}
      </div>

      {feedback === 'idle' && currentAnswer.length === ex.correctWord.length && (
        <Button className="mt-4 w-full" onClick={handleCheck}>
          {t('exercise.check')}
        </Button>
      )}

      {feedback === 'correct' && (
        <div className="mt-4 rounded-xl bg-green-100 border border-green-300 text-green-800 font-bold p-3 text-center">
          ✅ {t('exercise.correct')}
        </div>
      )}
      {feedback === 'wrong' && <div className="mt-4 rounded-xl bg-red-100 border border-red-300 p-3 text-center text-red-800 font-bold">❌</div>}
    </div>
  );
}

// ────────────────────────────────────────────
// Summary data
// ────────────────────────────────────────────

export interface ExerciseSummary {
  totalExercises: number;
  correctFirst: number;        // correct on first attempt (no retry)
  wrongCount: number;          // total wrong answers (including retries)
  durationMs: number;          // total time
  heartsRemaining: number;
}

// ────────────────────────────────────────────
// Exercise runner with retry & tracking
// ────────────────────────────────────────────

interface ExerciseRunnerProps {
  exercises: GeneratedExercise[];
  hearts: number;
  onHeartLost: () => void;
  onComplete: (score: number, total: number, summary: ExerciseSummary) => void;
}

export function ExerciseRunner({ exercises, hearts, onHeartLost, onComplete }: ExerciseRunnerProps) {
  const [index, setIndex] = useState(0);
  const [correctFirst, setCorrectFirst] = useState(0);
  const [wrongTotal, setWrongTotal] = useState(0);
  const [finished, setFinished] = useState(false);
  const [retryQueue, setRetryQueue] = useState<GeneratedExercise[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);
  const startTimeRef = useRef(Date.now());
  const { language } = useLanguage();
  const { t } = useTranslation(language);

  // Combine original exercises + retry queue
  const allExercises = useMemo(() => [...exercises, ...retryQueue], [exercises, retryQueue]);
  const total = allExercises.length;
  const current = allExercises[index] ?? null;
  const progress = total > 0 ? Math.round((index / total) * 100) : 0;

  const handleResult = useCallback(
    (correct: boolean) => {
      if (correct) {
        if (!isRetrying || !retryQueue.includes(current!)) {
          setCorrectFirst((c) => c + 1);
        }
      } else {
        setWrongTotal((w) => w + 1);
        onHeartLost();
        // Add this exercise to the retry queue (to be repeated later)
        if (current) {
          setRetryQueue((q) => [...q, current]);
        }
      }

      const newHearts = correct ? hearts : hearts - 1;
      const nextIndex = index + 1;

      if (newHearts <= 0) {
        setFinished(true);
        const duration = Date.now() - startTimeRef.current;
        onComplete(correctFirst + (correct ? 1 : 0), exercises.length, {
          totalExercises: exercises.length,
          correctFirst: correctFirst + (correct ? 1 : 0),
          wrongCount: wrongTotal + (correct ? 0 : 1),
          durationMs: duration,
          heartsRemaining: 0,
        });
        return;
      }

      // Check if we've gone through everything (including retries)
      if (nextIndex >= allExercises.length + (correct ? 0 : 1)) {
        setFinished(true);
        const duration = Date.now() - startTimeRef.current;
        const finalCorrectFirst = correctFirst + (correct ? 1 : 0);
        const finalWrong = wrongTotal + (correct ? 0 : 1);
        onComplete(finalCorrectFirst, exercises.length, {
          totalExercises: exercises.length,
          correctFirst: finalCorrectFirst,
          wrongCount: finalWrong,
          durationMs: duration,
          heartsRemaining: newHearts,
        });
        return;
      }

      if (nextIndex >= exercises.length && !isRetrying) {
        setIsRetrying(true);
      }

      setIndex(nextIndex);
    },
    [index, total, hearts, correctFirst, wrongTotal, onHeartLost, onComplete, exercises, current, isRetrying, retryQueue, allExercises.length]
  );

  if (finished || !current) {
    return null;
  }

  return (
    <div>
      {/* Progress bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-500">
          {t('exercise.taskOf')} {index + 1} / {total}
        </p>
        {isRetrying && (
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-700">
            🔄 {t('exercise.retry')}
          </span>
        )}
      </div>

      {(current.type === 'translate-choice' || current.type === 'reverse-choice') && (
        <MultipleChoice key={`${index}-${current.type}`} exercise={current} onResult={handleResult} />
      )}
      {current.type === 'match-pairs' && (
        <MatchPairs key={`${index}-match`} exercise={current} onResult={handleResult} />
      )}
      {current.type === 'type-answer' && (
        <TypeAnswer key={`${index}-type`} exercise={current} onResult={handleResult} />
      )}
      {current.type === 'fill-in-blank' && (
        <FillInBlank key={`${index}-fill`} exercise={current} onResult={handleResult} />
      )}
      {current.type === 'true-false' && (
        <TrueFalse key={`${index}-true-false`} exercise={current} onResult={handleResult} />
      )}
      {current.type === 'word-scramble' && (
        <WordScramble key={`${index}-scramble`} exercise={current} onResult={handleResult} />
      )}
    </div>
  );
}
