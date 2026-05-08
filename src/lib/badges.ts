export type BadgeRequirement =
  | { type: 'levels'; value: number }
  | { type: 'xp'; value: number }
  | { type: 'streak'; value: number };

export interface BadgeDefinition {
  id: string;
  titleKey: string;
  descriptionKey: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  icon: string;
  requirement: BadgeRequirement;
  orderIndex: number;
}

export const BADGES: BadgeDefinition[] = [
  {
    id: 'first_steps',
    titleKey: 'badges.first_steps.title',
    descriptionKey: 'badges.first_steps.description',
    tier: 'bronze',
    icon: '🥉',
    requirement: { type: 'levels', value: 1 },
    orderIndex: 1,
  },
  {
    id: 'five_levels',
    titleKey: 'badges.five_levels.title',
    descriptionKey: 'badges.five_levels.description',
    tier: 'bronze',
    icon: '🏁',
    requirement: { type: 'levels', value: 5 },
    orderIndex: 2,
  },
  {
    id: 'ten_levels',
    titleKey: 'badges.ten_levels.title',
    descriptionKey: 'badges.ten_levels.description',
    tier: 'silver',
    icon: '🥈',
    requirement: { type: 'levels', value: 10 },
    orderIndex: 3,
  },
  {
    id: 'xp_100',
    titleKey: 'badges.xp_100.title',
    descriptionKey: 'badges.xp_100.description',
    tier: 'bronze',
    icon: '⚡',
    requirement: { type: 'xp', value: 100 },
    orderIndex: 4,
  },
  {
    id: 'xp_300',
    titleKey: 'badges.xp_300.title',
    descriptionKey: 'badges.xp_300.description',
    tier: 'silver',
    icon: '⚡',
    requirement: { type: 'xp', value: 300 },
    orderIndex: 5,
  },
  {
    id: 'xp_600',
    titleKey: 'badges.xp_600.title',
    descriptionKey: 'badges.xp_600.description',
    tier: 'gold',
    icon: '⚡',
    requirement: { type: 'xp', value: 600 },
    orderIndex: 6,
  },
  {
    id: 'streak_3',
    titleKey: 'badges.streak_3.title',
    descriptionKey: 'badges.streak_3.description',
    tier: 'bronze',
    icon: '🔥',
    requirement: { type: 'streak', value: 3 },
    orderIndex: 7,
  },
  {
    id: 'streak_7',
    titleKey: 'badges.streak_7.title',
    descriptionKey: 'badges.streak_7.description',
    tier: 'silver',
    icon: '🔥',
    requirement: { type: 'streak', value: 7 },
    orderIndex: 8,
  },
  {
    id: 'streak_14',
    titleKey: 'badges.streak_14.title',
    descriptionKey: 'badges.streak_14.description',
    tier: 'gold',
    icon: '🔥',
    requirement: { type: 'streak', value: 14 },
    orderIndex: 9,
  },
  {
    id: 'streak_30',
    titleKey: 'badges.streak_30.title',
    descriptionKey: 'badges.streak_30.description',
    tier: 'platinum',
    icon: '🏆',
    requirement: { type: 'streak', value: 30 },
    orderIndex: 10,
  },
];

export interface BadgeStats {
  xp: number;
  streakCount: number;
  completedLevels: number;
}

export function getEligibleBadges(stats: BadgeStats): string[] {
  return BADGES.filter((badge) => {
    if (badge.requirement.type === 'levels') {
      return stats.completedLevels >= badge.requirement.value;
    }
    if (badge.requirement.type === 'xp') {
      return stats.xp >= badge.requirement.value;
    }
    return stats.streakCount >= badge.requirement.value;
  }).map((badge) => badge.id);
}
