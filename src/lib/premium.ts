interface UserLike {
  plan?: string | null;
}

/**
 * Check if user has premium plan
 */
export function isPremium(user: UserLike | null): boolean {
  if (!user) return false;
  return user.plan === 'PREMIUM';
}

/**
 * Require premium plan
 */
export function requirePremium(user: UserLike | null) {
  if (!isPremium(user)) {
    throw new Response('Premium plan required', { status: 403 });
  }
}

/**
 * Get plan display name
 */
export function getPlanDisplayName(plan: string): string {
  return plan === 'PREMIUM' ? 'Premium' : 'Free';
}
