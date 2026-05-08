/**
 * Generates Duolingo-style exercises from vocabulary data.
 *
 * Exercise types:
 *  - translate-choice : show word → pick correct translation (4 options)
 *  - reverse-choice   : show translation → pick correct word (4 options)
 *  - match-pairs      : match 3-4 word↔translation pairs
 *  - type-answer      : type the translation for a word
 *  - fill-in-blank    : fill the missing word in an example sentence
 *  - true-false       : decide whether a translation pairing is correct
 *  - word-scramble    : rebuild a scrambled word from its translation
 */

export interface Vocabulary {
  id: string;
  word: string;
  translation: string;
  example?: string;
}

export type GeneratedExercise =
  | {
      type: 'translate-choice';
      prompt: string;
      options: string[];
      correctIndex: number;
      vocabularyId: string;
    }
  | {
      type: 'reverse-choice';
      prompt: string;
      options: string[];
      correctIndex: number;
      vocabularyId: string;
    }
  | {
      type: 'match-pairs';
      pairs: { word: string; translation: string; id: string }[];
    }
  | {
      type: 'type-answer';
      prompt: string;
      correctAnswer: string;
      vocabularyId: string;
    }
  | {
      type: 'fill-in-blank';
      sentence: string;
      options: string[];
      correctIndex: number;
      vocabularyId: string;
    }
  | {
      type: 'true-false';
      word: string;
      proposedTranslation: string;
      isCorrect: boolean;
      vocabularyId: string;
    }
  | {
      type: 'word-scramble';
      prompt: string;
      scrambledWord: string;
      correctWord: string;
      vocabularyId: string;
    };

type ExerciseType = GeneratedExercise['type'];

type ExercisePoolMap = Record<ExerciseType, GeneratedExercise[]>;

const TARGET_WEIGHTS: Record<ExerciseType, number> = {
  'translate-choice': 20,
  'reverse-choice': 20,
  'match-pairs': 15,
  'type-answer': 15,
  'fill-in-blank': 15,
  'true-false': 15,
  'word-scramble': 15,
};

/** Fisher-Yates shuffle (does NOT mutate original) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick `count` random items from `pool`, excluding `exclude`. */
function pickDistractors(pool: string[], exclude: string, count: number): string[] {
  const candidates = pool.filter((value) => value.toLowerCase() !== exclude.toLowerCase());
  return shuffle(candidates).slice(0, count);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceWordWithBlank(example: string, word: string): string | null {
  const trimmedExample = example.trim();
  if (!trimmedExample) {
    return null;
  }

  const regex = new RegExp(escapeRegExp(word), 'i');
  if (!regex.test(trimmedExample)) {
    return null;
  }

  return trimmedExample.replace(regex, '_____');
}

function scrambleWord(word: string): string | null {
  const letters = word.split('');
  if (letters.length < 4 || letters.length > 10) {
    return null;
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const scrambled = shuffle(letters).join('');
    if (scrambled !== word) {
      return scrambled;
    }
  }

  const reversed = letters.slice().reverse().join('');
  return reversed !== word ? reversed : null;
}

function createTranslateChoice(vocab: Vocabulary, allTranslations: string[]): GeneratedExercise | null {
  const distractors = pickDistractors(allTranslations, vocab.translation, 3);
  if (distractors.length < 2) {
    return null;
  }

  const options = shuffle([vocab.translation, ...distractors.slice(0, 3)]);
  return {
    type: 'translate-choice',
    prompt: vocab.word,
    options,
    correctIndex: options.indexOf(vocab.translation),
    vocabularyId: vocab.id,
  };
}

function createReverseChoice(vocab: Vocabulary, allWords: string[]): GeneratedExercise | null {
  const distractors = pickDistractors(allWords, vocab.word, 3);
  if (distractors.length < 2) {
    return null;
  }

  const options = shuffle([vocab.word, ...distractors.slice(0, 3)]);
  return {
    type: 'reverse-choice',
    prompt: vocab.translation,
    options,
    correctIndex: options.indexOf(vocab.word),
    vocabularyId: vocab.id,
  };
}

function createFillInBlank(vocab: Vocabulary, allWords: string[]): GeneratedExercise | null {
  if (!vocab.example) {
    return null;
  }

  const sentence = replaceWordWithBlank(vocab.example, vocab.word);
  if (!sentence) {
    return null;
  }

  const distractors = pickDistractors(allWords, vocab.word, 3);
  if (distractors.length < 3) {
    return null;
  }

  const options = shuffle([vocab.word, ...distractors]);
  return {
    type: 'fill-in-blank',
    sentence,
    options,
    correctIndex: options.indexOf(vocab.word),
    vocabularyId: vocab.id,
  };
}

function createTrueFalse(
  vocab: Vocabulary,
  allTranslations: string[]
): Extract<GeneratedExercise, { type: 'true-false' }> {
  const fakeTranslations = allTranslations.filter(
    (translation) => translation.toLowerCase() !== vocab.translation.toLowerCase()
  );
  const canUseFake = fakeTranslations.length > 0;
  const isCorrect = canUseFake ? Math.random() >= 0.5 : true;
  const proposedTranslation = isCorrect ? vocab.translation : shuffle(fakeTranslations)[0]!;

  return {
    type: 'true-false',
    word: vocab.word,
    proposedTranslation,
    isCorrect,
    vocabularyId: vocab.id,
  };
}

function createWordScramble(vocab: Vocabulary): GeneratedExercise | null {
  const trimmedWord = vocab.word.trim();
  if (/\s/.test(trimmedWord)) {
    return null;
  }

  const scrambledWord = scrambleWord(trimmedWord);
  if (!scrambledWord) {
    return null;
  }

  return {
    type: 'word-scramble',
    prompt: vocab.translation,
    scrambledWord,
    correctWord: trimmedWord,
    vocabularyId: vocab.id,
  };
}

function rankTypesByBalance(pools: ExercisePoolMap, selectedCounts: Record<ExerciseType, number>): ExerciseType[] {
  return (Object.keys(TARGET_WEIGHTS) as ExerciseType[])
    .filter((type) => pools[type].length > 0)
    .sort((left, right) => {
      const leftRatio = selectedCounts[left] / TARGET_WEIGHTS[left];
      const rightRatio = selectedCounts[right] / TARGET_WEIGHTS[right];

      if (leftRatio !== rightRatio) {
        return leftRatio - rightRatio;
      }

      if (TARGET_WEIGHTS[left] !== TARGET_WEIGHTS[right]) {
        return TARGET_WEIGHTS[right] - TARGET_WEIGHTS[left];
      }

      return pools[right].length - pools[left].length;
    });
}

export function generateExercises(vocabulary: Vocabulary[]): GeneratedExercise[] {
  if (vocabulary.length === 0) {
    return [];
  }

  const allTranslations = vocabulary.map((vocab) => vocab.translation);
  const allWords = vocabulary.map((vocab) => vocab.word);
  const shuffledVocab = shuffle(vocabulary);

  const pools: ExercisePoolMap = {
    'translate-choice': [],
    'reverse-choice': [],
    'match-pairs': [],
    'type-answer': [],
    'fill-in-blank': [],
    'true-false': [],
    'word-scramble': [],
  };

  for (const vocab of shuffledVocab) {
    const translateChoice = createTranslateChoice(vocab, allTranslations);
    if (translateChoice) {
      pools['translate-choice'].push(translateChoice);
    }

    const reverseChoice = createReverseChoice(vocab, allWords);
    if (reverseChoice) {
      pools['reverse-choice'].push(reverseChoice);
    }

    pools['type-answer'].push({
      type: 'type-answer',
      prompt: vocab.word,
      correctAnswer: vocab.translation,
      vocabularyId: vocab.id,
    });

    const fillInBlank = createFillInBlank(vocab, allWords);
    if (fillInBlank) {
      pools['fill-in-blank'].push(fillInBlank);
    }

    pools['true-false'].push(createTrueFalse(vocab, allTranslations));

    const wordScramble = createWordScramble(vocab);
    if (wordScramble) {
      pools['word-scramble'].push(wordScramble);
    }
  }

  for (let index = 0; index < shuffledVocab.length; index += 4) {
    const chunk = shuffledVocab.slice(index, index + 4);
    if (chunk.length >= 3) {
      pools['match-pairs'].push({
        type: 'match-pairs',
        pairs: chunk.map((vocab) => ({ word: vocab.word, translation: vocab.translation, id: vocab.id })),
      });
    }
  }

  const eligibleTypes = (Object.keys(pools) as ExerciseType[]).filter((type) => pools[type].length > 0);
  if (eligibleTypes.length === 0) {
    return [];
  }

  for (const type of eligibleTypes) {
    pools[type] = shuffle(pools[type]);
  }

  const totalAvailable = eligibleTypes.reduce((sum, type) => sum + pools[type].length, 0);
  const targetCount = Math.max(eligibleTypes.length, Math.min(totalAvailable, vocabulary.length * 2));
  const selectedCounts: Record<ExerciseType, number> = {
    'translate-choice': 0,
    'reverse-choice': 0,
    'match-pairs': 0,
    'type-answer': 0,
    'fill-in-blank': 0,
    'true-false': 0,
    'word-scramble': 0,
  };
  const selectedExercises: GeneratedExercise[] = [];

  for (const type of eligibleTypes) {
    const exercise = pools[type].shift();
    if (!exercise) {
      continue;
    }

    selectedExercises.push(exercise);
    selectedCounts[type] += 1;
  }

  while (selectedExercises.length < targetCount) {
    const rankedTypes = rankTypesByBalance(pools, selectedCounts);
    const nextType = rankedTypes[0];

    if (!nextType) {
      break;
    }

    const nextExercise = pools[nextType].shift();
    if (!nextExercise) {
      break;
    }

    selectedExercises.push(nextExercise);
    selectedCounts[nextType] += 1;
  }

  return shuffle(selectedExercises);
}
