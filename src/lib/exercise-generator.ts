/**
 * Generates Duolingo-style exercises from vocabulary data.
 *
 * Exercise types:
 *  - translate-choice : show source word → pick the target translation (4 options)
 *  - reverse-choice   : show target word → pick the source meaning (4 options)
 *  - match-pairs      : match source words with target translations
 *  - type-answer      : type the target translation for a source word
 *  - fill-in-blank    : fill the missing target word in a target-language example sentence
 *  - true-false       : decide whether a source→target pairing is correct
 *  - word-scramble    : rebuild a scrambled target word from its source-language prompt
 */

export interface Vocabulary {
  id: string;
  word: string;
  translation: string;
  example?: string;
  translatedExample?: string;
  alternativeAnswers?: string[];
}

export type GeneratedExercise =
  | {
      type: 'translate-choice';
      prompt: string;
      options: string[];
      correctIndices: number[];
      vocabularyId: string;
    }
  | {
      type: 'reverse-choice';
      prompt: string;
      options: string[];
      correctIndices: number[];
      vocabularyId: string;
    }
  | {
      type: 'match-pairs';
      pairs: { word: string; translation: string; id: string }[];
    }
  | {
      type: 'type-answer';
      prompt: string;
      acceptedAnswers: string[];
      vocabularyId: string;
    }
  | {
      type: 'fill-in-blank';
      sentence: string;
      options: string[];
      correctIndices: number[];
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
      acceptedAnswers: string[];
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

function uniqueAnswers(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      continue;
    }

    const key = trimmedValue.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(trimmedValue);
  }

  return result;
}

function getAcceptedAnswers(vocab: Vocabulary): string[] {
  return uniqueAnswers([vocab.translation, ...(vocab.alternativeAnswers ?? [])]);
}

/** Pick `count` random items from `pool`, excluding `exclude`. */
function pickDistractors(pool: string[], exclude: string[], count: number): string[] {
  const excluded = new Set(exclude.map((value) => value.trim().toLowerCase()));
  const candidates = uniqueAnswers(pool).filter((value) => !excluded.has(value.toLowerCase()));
  return shuffle(candidates).slice(0, count);
}

function getCorrectIndices(options: string[], acceptedAnswers: string[]): number[] {
  const accepted = new Set(acceptedAnswers.map((answer) => answer.trim().toLowerCase()));
  return options.reduce<number[]>((indices, option, index) => {
    if (accepted.has(option.trim().toLowerCase())) {
      indices.push(index);
    }

    return indices;
  }, []);
}

function buildChoiceOptions(correctOptions: string[], pool: string[]): string[] | null {
  const includedCorrectOptions = uniqueAnswers(correctOptions).slice(0, 3);
  const distractorCount = 4 - includedCorrectOptions.length;

  if (distractorCount < 0) {
    return null;
  }

  const distractors = pickDistractors(pool, includedCorrectOptions, distractorCount);
  if (distractors.length < distractorCount) {
    return null;
  }

  return shuffle([...includedCorrectOptions, ...distractors]);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceWordWithBlank(example: string, acceptedAnswers: string[]): string | null {
  const trimmedExample = example.trim();
  if (!trimmedExample) {
    return null;
  }

  const candidates = [...uniqueAnswers(acceptedAnswers)].sort((left, right) => right.length - left.length);
  for (const candidate of candidates) {
    const regex = new RegExp(escapeRegExp(candidate), 'i');
    if (regex.test(trimmedExample)) {
      return trimmedExample.replace(regex, '_____');
    }
  }

  return null;
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

function sortLetters(word: string): string {
  return word.toLowerCase().split('').sort().join('');
}

function createTranslateChoice(vocab: Vocabulary, allTranslations: string[]): GeneratedExercise | null {
  const acceptedAnswers = getAcceptedAnswers(vocab);
  const options = buildChoiceOptions(acceptedAnswers, allTranslations);
  if (!options) {
    return null;
  }

  return {
    type: 'translate-choice',
    prompt: vocab.word,
    options,
    correctIndices: getCorrectIndices(options, acceptedAnswers),
    vocabularyId: vocab.id,
  };
}

function createReverseChoice(vocab: Vocabulary, allWords: string[]): GeneratedExercise | null {
  const distractors = pickDistractors(allWords, [vocab.word], 3);
  if (distractors.length < 3) {
    return null;
  }

  const options = shuffle([vocab.word, ...distractors]);
  return {
    type: 'reverse-choice',
    prompt: shuffle(getAcceptedAnswers(vocab))[0] ?? vocab.translation,
    options,
    correctIndices: getCorrectIndices(options, [vocab.word]),
    vocabularyId: vocab.id,
  };
}

function createFillInBlank(vocab: Vocabulary, allTranslations: string[]): GeneratedExercise | null {
  if (!vocab.translatedExample) {
    return null;
  }

  const acceptedAnswers = getAcceptedAnswers(vocab);
  const sentence = replaceWordWithBlank(vocab.translatedExample, acceptedAnswers);
  if (!sentence) {
    return null;
  }

  const options = buildChoiceOptions(acceptedAnswers, allTranslations);
  if (!options) {
    return null;
  }

  return {
    type: 'fill-in-blank',
    sentence,
    options,
    correctIndices: getCorrectIndices(options, acceptedAnswers),
    vocabularyId: vocab.id,
  };
}

function createTrueFalse(
  vocab: Vocabulary,
  allTranslations: string[]
): Extract<GeneratedExercise, { type: 'true-false' }> {
  const acceptedAnswers = getAcceptedAnswers(vocab);
  const fakeTranslations = pickDistractors(allTranslations, acceptedAnswers, allTranslations.length);
  const canUseFake = fakeTranslations.length > 0;
  const isCorrect = canUseFake ? Math.random() >= 0.5 : true;
  const proposedTranslation = isCorrect ? acceptedAnswers[0] : shuffle(fakeTranslations)[0]!;

  return {
    type: 'true-false',
    word: vocab.word,
    proposedTranslation,
    isCorrect,
    vocabularyId: vocab.id,
  };
}

function createWordScramble(vocab: Vocabulary): GeneratedExercise | null {
  const acceptedAnswers = getAcceptedAnswers(vocab);
  const scrambleCandidates = acceptedAnswers
    .map((answer) => {
      const trimmedAnswer = answer.trim();
      if (/\s/.test(trimmedAnswer)) {
        return null;
      }

      const scrambledWord = scrambleWord(trimmedAnswer);
      if (!scrambledWord) {
        return null;
      }

      return {
        answer: trimmedAnswer,
        scrambledWord,
      };
    })
    .filter(Boolean) as { answer: string; scrambledWord: string }[];

  const selectedCandidate = scrambleCandidates[0];
  if (!selectedCandidate) {
    return null;
  }

  const anagramAnswers = uniqueAnswers(
    acceptedAnswers.filter((answer) => sortLetters(answer.trim()) === sortLetters(selectedCandidate.answer))
  );
  const scrambleAcceptedAnswers = uniqueAnswers([selectedCandidate.answer, ...anagramAnswers]);

  return {
    type: 'word-scramble',
    prompt: vocab.word,
    scrambledWord: selectedCandidate.scrambledWord,
    correctWord: selectedCandidate.answer,
    acceptedAnswers: scrambleAcceptedAnswers,
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

  const allTranslations = vocabulary.flatMap((vocab) => getAcceptedAnswers(vocab));
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
      acceptedAnswers: getAcceptedAnswers(vocab),
      vocabularyId: vocab.id,
    });

    const fillInBlank = createFillInBlank(vocab, allTranslations);
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
