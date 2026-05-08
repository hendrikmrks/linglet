import { describe, expect, it } from 'vitest';
import { normalizeFaqLanguage, validateCreateFaqInput, validateUpdateFaqInput } from './faq';

describe('faq helpers', () => {
  it('normalizes supported languages and falls back to de', () => {
    expect(normalizeFaqLanguage('pt-br')).toBe('pt-br');
    expect(normalizeFaqLanguage('EN')).toBe('en');
    expect(normalizeFaqLanguage('fr')).toBe('de');
  });

  it('validates create payloads', () => {
    const result = validateCreateFaqInput({
      question: ' Frage ',
      answer: ' Antwort ',
      order: '2',
      language: 'de',
      isActive: true,
    });

    expect('value' in result).toBe(true);
    if ('value' in result) {
      expect(result.value).toEqual({
        question: 'Frage',
        answer: 'Antwort',
        order: 2,
        language: 'de',
        isActive: true,
      });
    }
  });

  it('rejects invalid update payloads', () => {
    expect(validateUpdateFaqInput({})).toEqual({ error: 'No valid fields to update' });
    expect(validateCreateFaqInput({ question: 'Test', answer: 'Antwort', language: 'fr' })).toEqual({
      error: 'Invalid language',
    });
  });
});
