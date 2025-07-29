import React, { useState, useEffect } from 'react';
import { SingleTask, TaskDifficulty, DeadlineType } from '../types';
import { UNLOCK_LEVELS } from '../constants';
import CheckIcon from './icons/CheckIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';
import RefreshIcon from './icons/RefreshIcon';
import ClockIcon from './icons/ClockIcon';
import HourglassIcon from './icons/HourglassIcon';

interface TaskItemProps {
  task: SingleTask;
  userLevel: number;
  isAvailable: boolean;
  onComplete: (task: SingleTask) => void;
  onEdit: (taskId: string, newName: string) => void;
  onDelete: (taskId: string) => void;
}

const difficultyColors: Record<TaskDifficulty, string> = {
  [TaskDifficulty.Easy]: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30',
  [TaskDifficulty.Medium]: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/30',
  [TaskDifficulty.Hard]: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30',
};

const getRecurrenceText = (task: SingleTask): string | null => {
    if (!task.isRecurring) return null;
    switch(task.recurringInterval) {
        case 'daily': return 'Cykliczność: Codziennie';
        case 'weekly': return 'Cykliczność: Co tydzień';
        case 'monthly': return 'Cykliczność: Co miesiąc';
        case 'custom': return `Cykliczność: Co ${task.customRecurringDays || '?'} dni`;
        default: return null;
    }
}

const getDisabledTitle = (task: SingleTask): string => {
  if (!task.isRecurring || !task.lastCompleted) return "Zadanie dostępne";
  switch(task.recurringInterval) {
      case 'daily': return "Zadanie będzie dostępne jutro";
      case 'weekly': return "Zadanie będzie dostępne w przyszłym tygodniu";
      case 'monthly': return "Zadanie będzie dostępne w przyszłym miesiącu";
      case 'custom': return `Zadanie odnowi się za ${task.customRecurringDays || '?'} dni`;
      default: return "Zadanie tymczasowo niedostępne";
  }
}

const formatRemainingTime = (ms: number): string => {
  if (ms <= 0) return "Czas minął";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const DeadlineInfo: React.FC<{ task: SingleTask }> = ({ task }) => {
    const [remainingTime, setRemainingTime] = useState<number | null>(null);

    useEffect(() => {
        if (task.deadlineType !== DeadlineType.Duration || !task.createdAt || !task.durationMinutes) {
            return;
        }

        const endTime = new Date(task.createdAt).getTime() + task.durationMinutes * 60 * 1000;

        const updateRemainingTime = () => {
            const now = Date.now();
            const remaining = endTime - now;
            setRemainingTime(remaining > 0 ? remaining : 0);
        };

        updateRemainingTime();
        const interval = setInterval(updateRemainingTime, 1000);
        return () => clearInterval(interval);

    }, [task.deadlineType, task.createdAt, task.durationMinutes]);

    if (task.deadlineType === DeadlineType.None) return null;

    let text: string;
    let colorClass: string;
    let icon: React.ReactNode;

    if (task.deadlineType === DeadlineType.DateTime && task.deadline) {
        const deadlineDate = new Date(task.deadline);
        const now = new Date();
        const diffTime = deadlineDate.getTime() - now.getTime();
        
        text = `Termin: ${deadlineDate.toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
        icon = <ClockIcon className="w-3.5 h-3.5" />;
        
        if (diffTime < 0) {
            colorClass = 'text-red-500 dark:text-red-400';
        } else if (diffTime < 3 * 24 * 60 * 60 * 1000) {
            colorClass = 'text-yellow-600 dark:text-yellow-400';
        } else {
            colorClass = 'text-slate-500 dark:text-slate-400';
        }
    } else if (task.deadlineType === DeadlineType.Duration && remainingTime !== null) {
        text = formatRemainingTime(remainingTime);
        icon = <HourglassIcon className="w-3.5 h-3.5" />;
        
        const totalDuration = (task.durationMinutes || 0) * 60 * 1000;
        
        if (remainingTime <= 0) {
            colorClass = 'text-red-500 dark:text-red-400';
        } else if (remainingTime < totalDuration * 0.25) { // last 25% of time
            colorClass = 'text-yellow-600 dark:text-yellow-400';
        } else {
            colorClass = 'text-slate-500 dark:text-slate-400';
        }
    } else {
        return null;
    }

    return (
        <div className={`flex items-center gap-1 font-medium ${colorClass}`}>
            {icon}
            <span>{text}</span>
        </div>
    );
};


const TaskItem: React.FC<TaskItemProps> = ({ task, userLevel, isAvailable, onComplete, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);

  const canEdit = userLevel >= UNLOCK_LEVELS.EDIT_TASK;
  const canDelete = userLevel >= UNLOCK_LEVELS.DELETE_TASK;

  const handleSaveEdit = () => {
    if (editedName.trim()) {
      onEdit(task.id, editedName.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedName(task.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  if (isEditing) {
    return (
      <div className="bg-slate-200 dark:bg-slate-700 p-4 rounded-lg flex items-center justify-between gap-4 ring-2 ring-cyan-500">
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow bg-slate-100 dark:bg-slate-600 text-slate-800 dark:text-white placeholder-slate-400 border border-slate-300 dark:border-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition"
          autoFocus
        />
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSaveEdit}
            className="p-2 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/20 rounded-full transition-colors"
            title="Zapisz"
          >
            <CheckIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleCancelEdit}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 rounded-full transition-colors"
            title="Anuluj"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  const recurrenceText = getRecurrenceText(task);

  return (
    <div className={`bg-white dark:bg-slate-800 p-4 rounded-lg flex items-center justify-between gap-4 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-md dark:shadow-none dark:border dark:border-slate-700 ${!isAvailable ? 'opacity-60' : ''}`}>
        <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center gap-2">
                {task.isRecurring && <RefreshIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" title="Zadanie cykliczne" />}
                <span className="font-medium text-slate-800 dark:text-slate-100 truncate">{task.name}</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${difficultyColors[task.difficulty]}`}>
                    {task.difficulty}
                </span>
            </div>
            {(recurrenceText || task.deadlineType !== DeadlineType.None) && (
              <div className="text-xs mt-1 pl-6 flex items-center gap-3">
                {recurrenceText && <p className="text-slate-500 dark:text-slate-400">{recurrenceText}</p>}
                {task.deadlineType !== DeadlineType.None && <DeadlineInfo task={task} />}
              </div>
            )}
        </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          onClick={() => onComplete(task)}
          title={isAvailable ? "Ukończ zadanie" : getDisabledTitle(task)}
          disabled={!isAvailable}
          className="p-2 text-green-600 dark:text-green-400 rounded-full transition-colors disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed enabled:hover:bg-green-100 dark:enabled:hover:bg-green-500/20"
        >
          <CheckIcon className="w-5 h-5" />
        </button>
        {canEdit && (
          <button
            onClick={() => setIsEditing(true)}
            title="Edytuj zadanie"
            className="p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-500/20 rounded-full transition-colors"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
        )}
        {canDelete && (
          <button
            onClick={() => onDelete(task.id)}
            title="Usuń zadanie"
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-full transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskItem;