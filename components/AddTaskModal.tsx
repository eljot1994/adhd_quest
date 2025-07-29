import React, { useState } from 'react';
import { TaskDifficulty, SingleTask, TaskGroupInList, DeadlineType } from '../types';
import { UNLOCK_LEVELS } from '../constants';
import { PREDEFINED_TASK_GROUPS, TaskGroup } from './predefinedTaskGroups';
import XMarkIcon from './icons/XMarkIcon';
import PlusCircleIcon from './icons/PlusCircleIcon';
import LockClosedIcon from './icons/LockClosedIcon';


interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: SingleTask) => void;
  onAddTaskGroup: (taskGroup: TaskGroupInList) => void;
  userLevel: number;
}

type ModalTab = 'single' | 'group';

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  onAddTaskGroup,
  userLevel,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('single');

  // State for single task form
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDifficulty, setNewTaskDifficulty] = useState<TaskDifficulty>(TaskDifficulty.Easy);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [customDays, setCustomDays] = useState<string>('2');
  
  // New state for deadline
  const [deadlineType, setDeadlineType] = useState<DeadlineType>(DeadlineType.None);
  const [deadlineDateTime, setDeadlineDateTime] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');


  const canSelectDifficulty = userLevel >= UNLOCK_LEVELS.SELECT_DIFFICULTY;
  const canCreateRecurringTasks = userLevel >= UNLOCK_LEVELS.RECURRING_TASKS;
  const canSeeTaskGroups = userLevel >= UNLOCK_LEVELS.TASK_GROUP_KITCHEN;
  const canSetDeadline = userLevel >= UNLOCK_LEVELS.TASK_TIME_LIMIT;

  if (!isOpen) {
    return null;
  }
  
  const resetForm = () => {
    setNewTaskName('');
    setNewTaskDifficulty(TaskDifficulty.Easy);
    setIsRecurring(false);
    setRecurringInterval('daily');
    setCustomDays('2');
    setDeadlineType(DeadlineType.None);
    setDeadlineDateTime('');
    setDurationHours('');
    setDurationMinutes('');
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    const newTask: SingleTask = {
      id: crypto.randomUUID(),
      type: 'single',
      name: newTaskName.trim(),
      difficulty: canSelectDifficulty ? newTaskDifficulty : TaskDifficulty.Easy,
      deadlineType: canSetDeadline ? deadlineType : DeadlineType.None,
      ...(isRecurring && canCreateRecurringTasks && {
        isRecurring: true,
        recurringInterval: recurringInterval,
        ...(recurringInterval === 'custom' && { customRecurringDays: Math.max(1, parseInt(customDays, 10) || 1) })
      }),
    };
    
    if (canSetDeadline) {
        if (deadlineType === DeadlineType.DateTime && deadlineDateTime) {
            newTask.deadline = new Date(deadlineDateTime).toISOString();
        } else if (deadlineType === DeadlineType.Duration) {
            const hours = parseInt(durationHours, 10) || 0;
            const minutes = parseInt(durationMinutes, 10) || 0;
            newTask.durationMinutes = hours * 60 + minutes;
            newTask.createdAt = new Date().toISOString();
        }
    }

    onAddTask(newTask);
    resetForm();
    onClose();
  };
  
  const handleAddTaskGroupClick = (taskGroup: TaskGroup) => {
     const newGroup: TaskGroupInList = {
      id: crypto.randomUUID(),
      type: 'group',
      name: taskGroup.name,
      subTasks: taskGroup.tasks.map(t => ({
        id: crypto.randomUUID(),
        name: t.name,
        difficulty: t.difficulty,
        completed: false
      })),
    };
    onAddTaskGroup(newGroup);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 flex items-end justify-center z-50 transition-opacity" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-t-2xl shadow-xl w-full max-w-2xl text-slate-800 dark:text-white border-t border-slate-200 dark:border-slate-700 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-bold">Dodaj Zadanie</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        
        {canSeeTaskGroups && (
            <div className="p-2 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={() => setActiveTab('single')}
                        className={`px-4 py-2 rounded-md font-semibold transition ${activeTab === 'single' ? 'bg-cyan-600 text-white' : 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        Pojedyncze
                    </button>
                    <button
                        onClick={() => setActiveTab('group')}
                        className={`px-4 py-2 rounded-md font-semibold transition ${activeTab === 'group' ? 'bg-cyan-600 text-white' : 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        Grupy Zadań
                    </button>
                </div>
            </div>
        )}

        <div className="overflow-y-auto p-6">
            {activeTab === 'single' && (
                <form onSubmit={handleAddTaskSubmit} className="space-y-4">
                  <input
                      type="text"
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      placeholder="Co masz do zrobienia?"
                      className="w-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                  />
                  
                  {canCreateRecurringTasks && (
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center space-x-3 mb-3">
                            <input
                                type="checkbox"
                                id="recurring-checkbox"
                                checked={isRecurring}
                                onChange={(e) => setIsRecurring(e.target.checked)}
                                className="h-5 w-5 text-cyan-600 bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 rounded focus:ring-cyan-500 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800"
                            />
                            <label htmlFor="recurring-checkbox" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">Zadanie cykliczne</label>
                        </div>
                        {isRecurring && (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <select
                                value={recurringInterval}
                                onChange={(e) => setRecurringInterval(e.target.value as any)}
                                className="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                            >
                                <option value="daily">Codziennie</option>
                                <option value="weekly">Co tydzień</option>
                                <option value="monthly">Co miesiąc</option>
                                <option value="custom">Niestandardowa</option>
                            </select>
                            {recurringInterval === 'custom' && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={customDays}
                                        onChange={e => setCustomDays(e.target.value)}
                                        min="1"
                                        className="w-20 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                                    />
                                    <span className="text-slate-700 dark:text-slate-300">dni</span>
                                </div>
                            )}
                            </div>
                        )}
                    </div>
                  )}

                  {canSetDeadline && (
                     <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                        <label className="text-slate-700 dark:text-slate-300 font-medium mb-2 block">Limit czasowy</label>
                        <select
                            value={deadlineType}
                            onChange={e => setDeadlineType(e.target.value as DeadlineType)}
                            className="w-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition mb-3"
                        >
                            <option value={DeadlineType.None}>Brak</option>
                            <option value={DeadlineType.DateTime}>Termin</option>
                            <option value={DeadlineType.Duration}>Czas trwania</option>
                        </select>
                        
                        {deadlineType === DeadlineType.DateTime && (
                             <input
                                type="datetime-local"
                                value={deadlineDateTime}
                                onChange={(e) => setDeadlineDateTime(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                                className="w-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                             />
                        )}

                        {deadlineType === DeadlineType.Duration && (
                            <div className="flex items-center gap-2">
                                <input type="number" value={durationHours} onChange={e => setDurationHours(e.target.value)} placeholder="Godz." min="0" className="w-full bg-slate-100 dark:bg-slate-700 rounded-md px-3 py-2 border border-slate-300 dark:border-slate-600 focus:ring-cyan-500" />
                                <input type="number" value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)} placeholder="Min." min="0" max="59" className="w-full bg-slate-100 dark:bg-slate-700 rounded-md px-3 py-2 border border-slate-300 dark:border-slate-600 focus:ring-cyan-500" />
                            </div>
                        )}
                     </div>
                  )}


                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                     <div>
                        {canSelectDifficulty ? (
                           <select
                              value={newTaskDifficulty}
                              onChange={(e) => setNewTaskDifficulty(e.target.value as TaskDifficulty)}
                              className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                           >
                              <option value={TaskDifficulty.Easy}>Łatwe</option>
                              <option value={TaskDifficulty.Medium}>Średnie</option>
                              <option value={TaskDifficulty.Hard}>Trudne</option>
                           </select>
                        ) : (
                           <p className="text-xs text-slate-500 dark:text-slate-400">Wybór trudności od poz. {UNLOCK_LEVELS.SELECT_DIFFICULTY}.</p>
                        )}
                     </div>
                     <button
                        type="submit"
                        className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-400 text-white font-bold py-2 px-4 rounded-md transition w-full sm:w-auto"
                        disabled={!newTaskName.trim()}
                     >
                        Dodaj Zadanie
                     </button>
                  </div>
                </form>
            )}
            {activeTab === 'group' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PREDEFINED_TASK_GROUPS.map((group) => {
                    const isUnlocked = userLevel >= group.unlockLevel;
                    return (
                      <button
                        key={group.name}
                        onClick={() => isUnlocked && handleAddTaskGroupClick(group)}
                        disabled={!isUnlocked}
                        className={`p-4 rounded-lg border-2 text-left transition-all flex items-center gap-4 ${isUnlocked ? 'border-cyan-500/50 bg-cyan-50 dark:bg-cyan-500/10 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 cursor-pointer' : 'border-slate-300/70 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 cursor-not-allowed'}`}
                      >
                        {isUnlocked
                          ? <PlusCircleIcon className="w-8 h-8 flex-shrink-0 text-cyan-600 dark:text-cyan-400" />
                          : <LockClosedIcon className="w-8 h-8 flex-shrink-0" />
                        }
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{group.name}</span>
                          {!isUnlocked && (<p className="text-xs">Odblokuj na poziomie {group.unlockLevel}</p>)}
                        </div>
                      </button>
                    );
                  })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;