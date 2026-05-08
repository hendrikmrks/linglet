import { describe, it, expect } from 'vitest';
import { generateExercises, type GeneratedExercise } from '@/lib/exercise-generator';

const mockVocab = [
  { id: '1', word: 'Hund', translation: 'cachorro', example: 'Der Hund spielt im Park.' },
  { id: '2', word: 'Katze', translation: 'gato', example: 'Die Katze schläft auf dem Sofa.' },
  { id: '3', word: 'Haus', translation: 'casa', example: 'Das Haus ist sehr alt.' },
  { id: '4', word: 'Auto', translation: 'carro', example: 'Mein Auto ist blau.' },
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

  it('all translate-choice exercises have exactly 4 options', () => {
    const result = generateExercises(mockVocab);
    const translateChoices = result.filter((exercise) => exercise.type === 'translate-choice');
    expect(translateChoices.length).toBeGreaterThan(0);

    for (const exercise of translateChoices) {
      if (exercise.type !== 'translate-choice') continue;
      expect(exercise.options).toHaveLength(4);
      expect(exercise.correctIndex).toBeGreaterThanOrEqual(0);
      expect(exercise.correctIndex).toBeLessThanOrEqual(3);
      const vocab = mockVocab.find((entry) => entry.id === exercise.vocabularyId)!;
      expect(exercise.options[exercise.correctIndex]).toBe(vocab.translation);
    }
  });

  it('all reverse-choice exercises have exactly 4 options', () => {
    const result = generateExercises(mockVocab);
    const reverseChoices = result.filter((exercise) => exercise.type === 'reverse-choice');
    expect(reverseChoices.length).toBeGreaterThan(0);

    for (const exercise of reverseChoices) {
      if (exercise.type !== 'reverse-choice') continue;
      expect(exercise.options).toHaveLength(4);
      const vocab = mockVocab.find((entry) => entry.id === exercise.vocabularyId)!;
      expect(exercise.options[exercise.correctIndex]).toBe(vocab.word);
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

  it('type-answer exercises have correctAnswer equal to the translation', () => {
    const result = generateExercises(mockVocab);
    const typedAnswers = result.filter((exercise) => exercise.type === 'type-answer');
    expect(typedAnswers.length).toBeGreaterThan(0);

    for (const exercise of typedAnswers) {
      if (exercise.type !== 'type-answer') continue;
      const vocab = mockVocab.find((entry) => entry.id === exercise.vocabularyId)!;
      expect(exercise.correctAnswer).toBe(vocab.translation);
    }
  });

  it('fill-in-blank exercises only use vocab with examples and replace the word with a blank', () => {
    const result = generateExercises(mockVocab);
    const fillInBlank = result.filter((exercise) => exercise.type === 'fill-in-blank');
    expect(fillInBlank.length).toBeGreaterThan(0);

    for (const exercise of fillInBlank) {
      if (exercise.type !== 'fill-in-blank') continue;
      const vocab = mockVocab.find((entry) => entry.id === exercise.vocabularyId)!;
      expect(vocab.example).toBeTruthy();
      expect(exercise.sentence).toContain('_____');
      expect(exercise.options).toHaveLength(4);
      expect(exercise.options[exercise.correctIndex]).toBe(vocab.word);
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
        expect(exercise.proposedTranslation).not.toBe(vocab.translation);
      }
    }
  });

  it('word-scramble exercises use the correct word and a different scrambled value', () => {
    const result = generateExercises(mockVocab);
    const wordScrambles = result.filter((exercise) => exercise.type === 'word-scramble');
    expect(wordScrambles.length).toBeGreaterThan(0);

    for (const exercise of wordScrambles) {
      if (exercise.type !== 'word-scramble') continue;
      const vocab = mockVocab.find((entry) => entry.id === exercise.vocabularyId)!;
      expect(exercise.correctWord).toBe(vocab.word);
      expect(exercise.scrambledWord).not.toBe(vocab.word);
      expect(exercise.scrambledWord.length).toBe(vocab.word.length);
    }
  });

  it('no translate-choice with only 1 vocab item (needs >= 2 distractors)', () => {
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
