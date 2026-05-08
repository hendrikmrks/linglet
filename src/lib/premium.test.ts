import { describe, it, expect } from 'vitest';
import { isPremium, getPlanDisplayName } from '@/lib/premium';

describe('isPremium', () => {
  it('returns false for null', () => {
    expect(isPremium(null)).toBe(false);
  });

  it('returns false for FREE plan', () => {
    expect(isPremium({ plan: 'FREE' })).toBe(false);
  });

  it('returns true for PREMIUM plan', () => {
    expect(isPremium({ plan: 'PREMIUM' })).toBe(true);
  });

  it('returns false when plan is undefined', () => {
    expect(isPremium({ plan: undefined })).toBe(false);
  });

  it('returns false when plan is null', () => {
    expect(isPremium({ plan: null })).toBe(false);
  });
});

describe('getPlanDisplayName', () => {
  it('returns "Premium" for PREMIUM', () => {
    expect(getPlanDisplayName('PREMIUM')).toBe('Premium');
  });

  it('returns "Free" for FREE', () => {
    expect(getPlanDisplayName('FREE')).toBe('Free');
  });

  it('returns "Free" for empty string', () => {
    expect(getPlanDisplayName('')).toBe('Free');
  });

  it('returns "Free" for unknown plan', () => {
    expect(getPlanDisplayName('UNKNOWN')).toBe('Free');
  });
});
