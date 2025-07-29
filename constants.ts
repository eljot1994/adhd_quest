import { TaskDifficulty } from './types';

// EXP points awarded for completing a task of a certain difficulty
export const EXP_FOR_DIFFICULTY: Record<TaskDifficulty, number> = {
  [TaskDifficulty.Easy]: 10,
  [TaskDifficulty.Medium]: 20,
  [TaskDifficulty.Hard]: 40,
};

// Base multiplier for calculating EXP needed for the next level
export const EXP_TO_LEVEL_UP_BASE = 100;

// Levels at which features are unlocked
export const UNLOCK_LEVELS = {
  DELETE_TASK: 2,
  EDIT_TASK: 3,
  SHOW_COMPLETED_COUNT: 4,
  SELECT_DIFFICULTY: 5,
  BADGES: 6,
  AVATAR: 7,
  AVATAR_CUSTOMIZATION: 8,
  EXP_PROGRESS_BAR: 9,
  THEME_SELECTION: 10,
  TASK_GROUP_KITCHEN: 11,
  RECURRING_TASKS: 12,
  TASK_GROUP_BATHROOM: 13,
  LEVEL_UP_ANIMATION: 14,
  TASK_GROUP_BEDROOM: 15,
  CUSTOM_TASK_GROUPS: 17,
  TASK_TIME_LIMIT: 23,
};

// Avatar Customization Options
export const AVATAR_COLORS = ['#ff6b6b', '#48dbfb', '#1dd1a1', '#feca57', '#ff9f43', '#70a1ff', '#5f27cd', '#a29bfe'];
export const AVATAR_EYES_COUNT = 5;
export const AVATAR_MOUTHS_COUNT = 5;

// Duration for toast notifications in milliseconds
export const TOAST_DURATION = 3000;