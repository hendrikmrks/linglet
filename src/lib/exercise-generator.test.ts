import { describe, it, expect } from 'vitest';
import { generateExercises, type GeneratedExercise } from '@/lib/exercise-generator';

const mockVocab = [
  {
    id: '1',
    word: 'Hund',
    translation: 'cachorro',
    alternativeAnswers: ['canino'],
    example: 'Der Hund spielt im Park.',
    translatedExample: 'O cachorro brinca no parque.',
  },
  {
    id: '2',
    word: 'Katze',
    translation: 'gato',
    example: 'Die Katze schläft auf dem Sofa.',
    translatedExample: 'O gato dorme no sofá.',
  },
  {
    id: '3',
    word: 'Haus',
    translation: 'casa',
    example: 'Das Haus ist sehr alt.',
    translatedExample: 'A casa é muito antiga.',
  },
  {
    id: '4',
    word: 'Auto',
    translation: 'carro',
    example: 'Mein Auto ist blau.',
    translatedExample: 'Meu carro é azul.',
  },
  { id: '5', word: 'Baum', translation: 'arvore' },
];

const exerciseTypes: GeneratedExercise['type'][] = [
  'translate-choice',
  'reverse-choice',
  'match-pairs',
  'type-answer',
  'fill-in-blank',
  'true-false',
  'word-scramble',
];

function getAcceptedAnswers(id: string) {
  const vocab = mockVocab.find((entry) => entry.id === id)!;
  return [vocab.translation, ...(vocab.alternativeAnswers ?? [])];
}

describe('generateExercises', () => {
  it('returns empty array for empty input', () => {
    expect(generateExercises([])).toEqual([]);
  });

  it('returns a non-empty array for 5 vocab items', () => {
    const result = generateExercises(mockVocab);
    expect(result.length).toBeGreaterThan(0);
  });

  it('only returns valid exercise type names', () => {
    const result = generateExercises(mockVocab);
    expect(result.every((exercise) => exerciseTypes.includes(exercise.type))).toBe(true);
  });

  it('all translate-choice exercises have exactly 4 options and valid correct indices', () => {
    const result = generateExercises(mockVocab);
    const translateChoices = result.filter((exercise) => exercise.type === 'translate-choice');
    expect(translateChoices.length).toBeGreaterThan(0);

    for (const exercise of translateChoices) {
      if (exercise.type !== 'translate-choice') continue;
      expect(exercise.options).toHaveLength(4);
      expect(exercise.correctIndices.length).toBeGreaterThan(0);
      const acceptedAnswers = getAcceptedAnswers(exercise.vocabularyId);
      const expectedCorrectIndices = exercise.options
        .map((option, index) => (acceptedAnswers.includes(option) ? index : -1))
        .filter((index) => index >= 0);
      expect(exercise.correctIndices).toEqual(expectedCorrectIndices);
    }
  });

  it('all reverse-choice exercises have exactly 4 options', () => {
    const result = generateExercises(mockVocab);
    const reverseChoices = result.filter((exercise) => exercise.type === 'reverse-choice');
    expect(reverseChoices.length).toBeGreaterThan(0);

    for (const exercise of reverseChoices) {
      if (exercise.type !== 'reverse-choice') continue;
      expect(exercise.options).toHaveLength(4);
      expect(exercise.correctIndices.length).toBe(1);
      const vocab = mockVocab.find((entry) => entry.id === exercise.vocabularyId)!;
      expect(exercise.options[exercise.correctIndices[0]]).toBe(vocab.word);
      expect(getAcceptedAnswers(exercise.vocabularyId)).toContain(exercise.prompt);
    }
  });

  it('match-pairs exercise has at least 3 pairs', () => {
    const result = generateExercises(mockVocab);
    const matchPairs = result.filter((exercise) => exercise.type === 'match-pairs');
    expect(matchPairs.length).toBeGreaterThan(0);

    for (const exercise of matchPairs) {
      if (exercise.type !== 'match-pairs') continue;
      expect(exercise.pairs.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('type-answer exercises expose all accepted answers with the translation first', () => {
    const result = generateExercises(mockVocab);
    const typedAnswers = result.filter((exercise) => exercise.type === 'type-answer');
    expect(typedAnswers.length).toBeGreaterThan(0);

    for (const exercise of typedAnswers) {
      if (exercise.type !== 'type-answer') continue;
      expect(exercise.acceptedAnswers).toEqual(getAcceptedAnswers(exercise.vocabularyId));
    }
  });

  it('fill-in-blank exercises only use target-language examples and blank accepted answers', () => {
    const result = generateExercises(mockVocab);
    const fillInBlank = result.filter((exercise) => exercise.type === 'fill-in-blank');
    expect(fillInBlank.length).toBeGreaterThan(0);

    for (const exercise of fillInBlank) {
      if (exercise.type !== 'fill-in-blank') continue;
      const vocab = mockVocab.find((entry) => entry.id === exercise.vocabularyId)!;
      const acceptedAnswers = getAcceptedAnswers(exercise.vocabularyId);
      expect(vocab.translatedExample).toBeTruthy();
      expect(exercise.sentence).toContain('_____');
      expect(acceptedAnswers.some((answer) => exercise.sentence.includes(answer))).toBe(false);
      expect(exercise.options).toHaveLength(4);
      const expectedCorrectIndices = exercise.options
        .map((option, index) => (acceptedAnswers.includes(option) ? index : -1))
        .filter((index) => index >= 0);
      expect(exercise.correctIndices).toEqual(expectedCorrectIndices);
      expect(exercise.options).not.toContain(vocab.word);
    }
  });

  it('true-false exercises reflect whether the proposed translation matches the vocab item', () => {
    const result = generateExercises(mockVocab);
    const trueFalse = result.filter((exercise) => exercise.type === 'true-false');
    expect(trueFalse.length).toBeGreaterThan(0);

    for (const exercise of trueFalse) {
      if (exercise.type !== 'true-false') continue;
      const vocab = mockVocab.find((entry) => entry.id === exercise.vocabularyId)!;
      expect(exercise.word).toBe(vocab.word);
      if (exercise.isCorrect) {
        expect(exercise.proposedTranslation).toBe(vocab.translation);
      } else {
        expect(getAcceptedAnswers(exercise.vocabularyId)).not.toContain(exercise.proposedTranslation);
      }
    }
  });

  it('word-scramble exercises require spelling a valid target translation', () => {
    const result = generateExercises(mockVocab);
    const wordScrambles = result.filter((exercise) => exercise.type === 'word-scramble');
    expect(wordScrambles.length).toBeGreaterThan(0);

    for (const exercise of wordScrambles) {
      if (exercise.type !== 'word-scramble') continue;
      const acceptedAnswers = getAcceptedAnswers(exercise.vocabularyId);
      const vocab = mockVocab.find((entry) => entry.id === exercise.vocabularyId)!;
      expect(exercise.prompt).toBe(vocab.word);
      expect(exercise.acceptedAnswers).toContain(exercise.correctWord);
      expect(acceptedAnswers).toContain(exercise.correctWord);
      expect(exercise.scrambledWord).not.toBe(exercise.correctWord);
      expect(exercise.scrambledWord.length).toBe(exercise.correctWord.length);
    }
  });

  it('can generate a word-scramble from a scrambleable alternative answer', () => {
    const result = generateExercises([
      {
        id: 'alt-1',
        word: 'Gruß',
        translation: 'bom dia',
        alternativeAnswers: ['sauda'],
      },
    ]);

    const exercise = result.find((entry) => entry.type === 'word-scramble');
    expect(exercise).toBeTruthy();
    if (exercise?.type !== 'word-scramble') return;
    expect(exercise.correctWord).toBe('sauda');
    expect(exercise.acceptedAnswers).toEqual(['sauda']);
  });

  it('no translate-choice with only 1 vocab item (needs >= 1 distractor)', () => {
    const result = generateExercises([mockVocab[0]]);
    const translateChoices = result.filter((exercise) => exercise.type === 'translate-choice');
    expect(translateChoices).toHaveLength(0);
  });

  it('no match-pairs with only 1 vocab item (needs >= 3 pairs)', () => {
    const result = generateExercises([mockVocab[0]]);
    const matchPairs = result.filter((exercise) => exercise.type === 'match-pairs');
    expect(matchPairs).toHaveLength(0);
  });

  it('does not crash with 2 vocab items', () => {
    expect(() => generateExercises(mockVocab.slice(0, 2))).not.toThrow();
  });

  it('skips fill-in-blank when no target-language example exists', () => {
    const result = generateExercises([mockVocab[4]]);
    const fillInBlank = result.filter((exercise) => exercise.type === 'fill-in-blank');
    expect(fillInBlank).toHaveLength(0);
  });

  it('type-answer is generated even with 1 vocab item', () => {
    const result = generateExercises([mockVocab[0]]);
    const typedAnswers = result.filter((exercise) => exercise.type === 'type-answer');
    expect(typedAnswers.length).toBeGreaterThan(0);
  });

  it('shuffling: same input produces different orderings across runs (probabilistic)', () => {
    const orderings = Array.from({ length: 10 }, () =>
      generateExercises(mockVocab).map((exercise) =>
        exercise.type === 'match-pairs' ? `${exercise.type}:${exercise.pairs.map((pair) => pair.id).join('-')}` : `${exercise.type}:${exercise.vocabularyId}`
      )
    );
    const allSame = orderings.every((ordering) => JSON.stringify(ordering) === JSON.stringify(orderings[0]));
    expect(allSame).toBe(false);
  });
});
