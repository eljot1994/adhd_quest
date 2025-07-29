import { TaskDifficulty } from '../types';

export interface PredefinedTask {
  name: string;
  difficulty: TaskDifficulty;
}

export interface TaskGroup {
  name: string;
  unlockLevel: number;
  tasks: PredefinedTask[];
}

export const PREDEFINED_TASK_GROUPS: TaskGroup[] = [
  {
    name: 'Sprzątanie kuchni',
    unlockLevel: 11,
    tasks: [
      { name: 'Pozmywać naczynia', difficulty: TaskDifficulty.Medium },
      { name: 'Wyczyścić blaty', difficulty: TaskDifficulty.Easy },
      { name: 'Wynieść śmieci', difficulty: TaskDifficulty.Easy },
      { name: 'Zamiść podłogę', difficulty: TaskDifficulty.Medium },
    ],
  },
  {
    name: 'Sprzątanie łazienki',
    unlockLevel: 13,
    tasks: [
      { name: 'Umyć umywalkę', difficulty: TaskDifficulty.Easy },
      { name: 'Wyczyścić toaletę', difficulty: TaskDifficulty.Medium },
      { name: 'Umyć prysznic/wannę', difficulty: TaskDifficulty.Hard },
      { name: 'Wyczyścić lustro', difficulty: TaskDifficulty.Easy },
    ],
  },
  {
    name: 'Sprzątanie sypialni',
    unlockLevel: 15,
    tasks: [
      { name: 'Pościelić łóżko', difficulty: TaskDifficulty.Easy },
      { name: 'Odkurzyć meble', difficulty: TaskDifficulty.Medium },
      { name: 'Uporządkować ubrania', difficulty: TaskDifficulty.Medium },
      { name: 'Odkurzyć podłogę', difficulty: TaskDifficulty.Medium },
    ],
  },
];