// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { calculateStreakUpdate } from '@/lib/streak';

describe('calculateStreakUpdate', () => {
  it('starts a new streak at 1 when there is no previous streak date', () => {
    expect(calculateStreakUpdate(0, null, new Date('2026-03-10T12:00:00.000Z'))).toEqual({
      shouldUpdate: true,
      nextStreakCount: 1,
    });
  });

  it('starts a new streak at 1 even if streakUpdatedAt was prefilled by the schema', () => {
    expect(
      calculateStreakUpdate(
        0,
        new Date('2026-03-10T08:00:00.000Z'),
        new Date('2026-03-10T20:00:00.000Z')
      )
    ).toEqual({
      shouldUpdate: true,
      nextStreakCount: 1,
    });
  });

  it('does not update more than once on the same UTC day', () => {
    expect(
      calculateStreakUpdate(
        4,
        new Date('2026-03-10T01:00:00.000Z'),
        new Date('2026-03-10T23:59:59.000Z')
      )
    ).toEqual({
      shouldUpdate: false,
      nextStreakCount: 4,
    });
  });

  it('increments the streak when the last streak day was yesterday in UTC', () => {
    expect(
      calculateStreakUpdate(
        4,
        new Date('2026-03-09T23:59:59.000Z'),
        new Date('2026-03-10T00:00:01.000Z')
      )
    ).toEqual({
      shouldUpdate: true,
      nextStreakCount: 5,
    });
  });

  it('resets the streak to 1 after a gap of two or more UTC days', () => {
    expect(
      calculateStreakUpdate(
        9,
        new Date('2026-03-07T23:59:59.000Z'),
        new Date('2026-03-10T00:00:01.000Z')
      )
    ).toEqual({
      shouldUpdate: true,
      nextStreakCount: 1,
    });
  });

  it('uses UTC calendar days instead of local midnight boundaries', () => {
    expect(
      calculateStreakUpdate(
        6,
        new Date('2026-03-10T23:30:00+02:00'),
        new Date('2026-03-11T00:30:00+02:00')
      )
    ).toEqual({
      shouldUpdate: false,
      nextStreakCount: 6,
    });
  });
});
