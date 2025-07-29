export enum TaskDifficulty {
  Easy = 'Łatwe',
  Medium = 'Średnie',
  Hard = 'Trudne',
}

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export enum BadgeType {
  NOVICE = 'NOVICE',
  ADEPT = 'ADEPT',
  EXPERT = 'EXPERT',
  LEVEL_10_MASTER = 'LEVEL_10_MASTER',
  AVATAR_STYLIST = 'AVATAR_STYLIST',
  RECURRING_MASTER = 'RECURRING_MASTER',
  GROUP_SPECIALIST = 'GROUP_SPECIALIST',
}

export interface Badge {
  type: BadgeType;
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  condition: (profile: Profile) => boolean;
}

export enum DeadlineType {
    None = 'none',
    DateTime = 'datetime',
    Duration = 'duration'
}

// Represents a single, standalone task
export interface SingleTask {
  type: 'single';
  id: string;
  name: string;
  difficulty: TaskDifficulty;
  isRecurring?: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'custom';
  customRecurringDays?: number;
  lastCompleted?: string; // ISO date string
  
  deadlineType: DeadlineType;
  deadline?: string; // ISO string for 'datetime'
  createdAt?: string; // ISO string, set when task is created
  durationMinutes?: number; // duration in minutes for 'duration'
}

// Represents a task within a group
export interface SubTask {
  id: string;
  name: string;
  difficulty: TaskDifficulty;
  completed: boolean;
}

// Represents a group of tasks as a single item in the main list
export interface TaskGroupInList {
  type: 'group';
  id:string;
  name: string; // e.g., "Sprzątanie kuchni"
  subTasks: SubTask[];
}

// A task item can be either a single task or a group
export type TaskItem = SingleTask | TaskGroupInList;


export interface AvatarConfig {
  bodyColor: string;
  eyes: number;
  mouth: number;
}

export interface Profile {
  id: string;
  name: string;
  exp: number;
  level: number;
  tasks: TaskItem[];
  completedTasksCount: number;
  avatar: AvatarConfig;
  theme: Theme;
  badges: BadgeType[];
}

export interface Reward {
  level: number;
  description: string;
  type?: string;
}