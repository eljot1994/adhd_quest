import { SingleTask } from '../types';

/**
 * Checks if a recurring task is available to be completed today.
 * @param task The task to check.
 * @returns True if the task is available, false otherwise.
 */
export const isTaskAvailable = (task: SingleTask): boolean => {
  if (!task.isRecurring || !task.lastCompleted) {
    return true; // Always available if not recurring or never completed
  }

  const lastCompletedDate = new Date(task.lastCompleted);
  const now = new Date();

  // Set to midnight to compare days only
  lastCompletedDate.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);


  switch (task.recurringInterval) {
    case 'daily': {
      return lastCompletedDate.getTime() < now.getTime();
    }
    case 'weekly': {
      const last = new Date(task.lastCompleted);
      const current = new Date();
      
      const lastSunday = new Date(last.setDate(last.getDate() - last.getDay()));
      lastSunday.setHours(0, 0, 0, 0);

      const thisSunday = new Date(current.setDate(current.getDate() - current.getDay()));
      thisSunday.setHours(0, 0, 0, 0);
      
      return lastSunday.getTime() < thisSunday.getTime();
    }
    case 'monthly': {
      return lastCompletedDate.getFullYear() < now.getFullYear() ||
             (lastCompletedDate.getFullYear() === now.getFullYear() && lastCompletedDate.getMonth() < now.getMonth());
    }
    case 'custom': {
        if (!task.customRecurringDays || task.customRecurringDays <= 0) return true;

        const diffTime = Math.abs(now.getTime() - lastCompletedDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays >= task.customRecurringDays;
    }
    default:
      return true;
  }
};