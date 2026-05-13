import { describe, expect, it } from 'vitest';
import { useTranslation } from '@/lib/use-translation';

describe('useTranslation', () => {
  it('returns translated strings for nested keys', () => {
    const { t } = useTranslation('en');
    expect(t('lessonReader.continue')).toBe('Continue');
  });

  it('replaces interpolation placeholders', () => {
    const { t } = useTranslation('de');
    expect(t('vocabIntro.cardOf', { current: 2, total: 5 })).toBe('2 von 5');
  });

  it('keeps unknown placeholders untouched', () => {
    const { t } = useTranslation('en');
    expect(t('vocabIntro.cardOf', { current: 1 })).toBe('1 of {{total}}');
  });
});
