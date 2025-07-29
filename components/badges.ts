import { Badge, BadgeType, Profile } from '../types';
import StarIcon from './icons/StarIcon';
import MedalIcon from './icons/MedalIcon';
import { UNLOCK_LEVELS } from '../constants';

export const BADGES: Badge[] = [
  {
    type: BadgeType.NOVICE,
    name: 'Nowicjusz',
    description: 'Ukończ 10 zadań',
    icon: StarIcon,
    condition: (profile: Profile) => profile.completedTasksCount >= 10,
  },
  {
    type: BadgeType.ADEPT,
    name: 'Adept',
    description: 'Ukończ 50 zadań',
    icon: StarIcon,
    condition: (profile: Profile) => profile.completedTasksCount >= 50,
  },
  {
    type: BadgeType.EXPERT,
    name: 'Ekspert',
    description: 'Ukończ 100 zadań',
    icon: StarIcon,
    condition: (profile: Profile) => profile.completedTasksCount >= 100,
  },
  {
    type: BadgeType.LEVEL_10_MASTER,
    name: 'Mistrz Poziomu 10',
    description: 'Osiągnij 10 poziom',
    icon: MedalIcon,
    condition: (profile: Profile) => profile.level >= 10,
  },
  {
    type: BadgeType.AVATAR_STYLIST,
    name: 'Stylista',
    description: 'Dostosuj swój awatar po raz pierwszy',
    icon: MedalIcon,
    condition: () => false, // Awarded manually on action
  },
  {
    type: BadgeType.RECURRING_MASTER,
    name: 'Mistrz Nawyków',
    description: 'Ukończ zadanie cykliczne',
    icon: MedalIcon,
    condition: (profile: Profile) => profile.tasks.some(t => t.type === 'single' && t.isRecurring && t.lastCompleted),
  },
  {
    type: BadgeType.GROUP_SPECIALIST,
    name: 'Specjalista od Grup',
    description: 'Ukończ całą grupę zadań',
    icon: MedalIcon,
    condition: () => false, // Awarded manually on action
  },
];