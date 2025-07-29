import { Profile, BadgeType } from '../types';
import { BADGES } from '../components/badges';

export const checkAndAwardBadges = (profile: Profile): Profile => {
  const newBadges: BadgeType[] = [];

  for (const badge of BADGES) {
    if (!profile.badges.includes(badge.type)) {
      if (badge.condition(profile)) {
        newBadges.push(badge.type);
      }
    }
  }

  if (newBadges.length > 0) {
    return {
      ...profile,
      badges: [...profile.badges, ...newBadges],
    };
  }

  return profile;
};
