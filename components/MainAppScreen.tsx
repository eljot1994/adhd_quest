
import React, { useState, useMemo } from 'react';
import { Profile, SingleTask, TaskDifficulty, AvatarConfig, Theme, TaskItem, TaskGroupInList, BadgeType } from '../types';
import { EXP_FOR_DIFFICULTY, EXP_TO_LEVEL_UP_BASE, UNLOCK_LEVELS } from '../constants';
import TaskItemComponent from './TaskItem';
import RewardsScreen from './RewardsScreen';
import AvatarCustomizationModal from './AvatarCustomizationModal';
import TaskGroupListItem from './TaskGroupListItem';
import { isTaskAvailable } from '../utils/taskUtils';
import { checkAndAwardBadges } from '../utils/badgeUtils';
import BottomNavBar, { ActiveView } from './BottomNavBar';
import ProfileScreen from './ProfileScreen';
import AddTaskModal from './AddTaskModal';
import PlusIcon from './icons/PlusIcon';
import Toast from './Toast';
import Avatar from './Avatar';
import ProgressBar from './ProgressBar';

interface MainAppScreenProps {
  profile: Profile;
  onUpdateProfile: (updatedProfile: Profile) => void;
  onLogout: () => void;
}

const MainAppScreen: React.FC<MainAppScreenProps> = ({ profile, onUpdateProfile, onLogout }) => {
  const [activeView, setActiveView] = useState<ActiveView>('tasks');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canShowAvatar = profile.level >= UNLOCK_LEVELS.AVATAR;
  const canShowProgressBar = profile.level >= UNLOCK_LEVELS.EXP_PROGRESS_BAR;

  const expForNextLevel = useMemo(() => {
    return EXP_TO_LEVEL_UP_BASE * profile.level;
  }, [profile.level]);

  const handleUpdate = (updatedProfile: Profile) => {
    const profileWithBadges = checkAndAwardBadges(updatedProfile);
    onUpdateProfile(profileWithBadges);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500); // Duration + buffer
  };

  const handleLevelUp = (newLevel: number, newExp: number, updatedTasks: TaskItem[], completedCount: number) => {
    const updatedProfile: Profile = {
      ...profile,
      exp: newExp,
      level: newLevel,
      completedTasksCount: completedCount,
      tasks: updatedTasks,
    };
    handleUpdate(updatedProfile);
    showToast(`Gratulacje! Zdobyłeś/aś poziom ${newLevel}!`);
  };

  const handleAddTask = (newTask: SingleTask) => {
    const updatedProfile = { ...profile, tasks: [...profile.tasks, newTask] };
    handleUpdate(updatedProfile);
  };
  
  const handleAddTaskGroup = (newGroup: TaskGroupInList) => {
    const updatedProfile = { ...profile, tasks: [...profile.tasks, newGroup] };
    handleUpdate(updatedProfile);
  };

  const handleCompleteTask = (taskToComplete: SingleTask) => {
    const expGained = EXP_FOR_DIFFICULTY[taskToComplete.difficulty];
    let newExp = profile.exp + expGained;
    let newLevel = profile.level;
    const expToLevelUp = EXP_TO_LEVEL_UP_BASE * newLevel;

    let updatedTasks: TaskItem[];
    if (taskToComplete.isRecurring) {
      updatedTasks = profile.tasks.map(t =>
        t.id === taskToComplete.id && t.type === 'single'
          ? { ...t, lastCompleted: new Date().toISOString() }
          : t
      );
    } else {
      updatedTasks = profile.tasks.filter(t => t.id !== taskToComplete.id);
    }

    if (newExp >= expToLevelUp) {
      newLevel += 1;
      newExp -= expToLevelUp;
      handleLevelUp(newLevel, newExp, updatedTasks, profile.completedTasksCount + 1);
    } else {
      handleUpdate({ ...profile, exp: newExp, tasks: updatedTasks, completedTasksCount: profile.completedTasksCount + 1 });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (profile.level < UNLOCK_LEVELS.DELETE_TASK) return;
    const updatedProfile = { ...profile, tasks: profile.tasks.filter((t) => t.id !== taskId) };
    handleUpdate(updatedProfile);
  };

  const handleEditTask = (taskId: string, newName: string) => {
    if (profile.level < UNLOCK_LEVELS.EDIT_TASK) return;
    const updatedProfile = {
      ...profile,
      tasks: profile.tasks.map((t) => (t.id === taskId && t.type === 'single' ? { ...t, name: newName } : t)),
    };
    handleUpdate(updatedProfile);
  };

  const handleSaveAvatar = (newConfig: AvatarConfig) => {
    let updatedProfile = { ...profile, avatar: newConfig };
    if (!profile.badges.includes(BadgeType.AVATAR_STYLIST)) {
       updatedProfile.badges.push(BadgeType.AVATAR_STYLIST);
    }
    handleUpdate(updatedProfile);
  };

  const handleThemeToggle = () => {
    if (profile.level < UNLOCK_LEVELS.THEME_SELECTION) return;
    const newTheme = profile.theme === Theme.Light ? Theme.Dark : Theme.Light;
    handleUpdate({ ...profile, theme: newTheme });
  };

  const handleCompleteSubTask = (groupId: string, subTaskId: string, difficulty: TaskDifficulty) => {
    const expGained = EXP_FOR_DIFFICULTY[difficulty];
    let newExp = profile.exp + expGained;
    let newLevel = profile.level;
    const expToLevelUp = EXP_TO_LEVEL_UP_BASE * newLevel;

    let profileAfterCompletion = {
      ...profile,
      tasks: profile.tasks.map(task => {
        if (task.id === groupId && task.type === 'group') {
          const updatedSubTasks = task.subTasks.map(sub =>
            sub.id === subTaskId ? { ...sub, completed: true } : sub
          );
          return { ...task, subTasks: updatedSubTasks };
        }
        return task;
      })
    };

    const targetGroup = profileAfterCompletion.tasks.find(t => t.id === groupId && t.type === 'group') as TaskGroupInList | undefined;
    if (targetGroup && targetGroup.subTasks.every(sub => sub.completed)) {
      profileAfterCompletion.tasks = profileAfterCompletion.tasks.filter(t => t.id !== groupId);
      if (!profileAfterCompletion.badges.includes(BadgeType.GROUP_SPECIALIST)) {
        profileAfterCompletion.badges.push(BadgeType.GROUP_SPECIALIST);
      }
    }

    if (newExp >= expToLevelUp) {
      newLevel += 1;
      newExp -= expToLevelUp;
      handleLevelUp(newLevel, newExp, profileAfterCompletion.tasks, profile.completedTasksCount + 1);
    } else {
      handleUpdate({ ...profileAfterCompletion, exp: newExp, completedTasksCount: profile.completedTasksCount + 1 });
    }
  };

  const handleDeleteTaskGroup = (groupId: string) => {
    if (profile.level < UNLOCK_LEVELS.DELETE_TASK) return;
    handleUpdate({ ...profile, tasks: profile.tasks.filter(t => t.id !== groupId) });
  };

  const handleEditSubTask = (groupId: string, subTaskId: string, newName: string) => {
    if (profile.level < UNLOCK_LEVELS.EDIT_TASK) return;
    const updatedTasks = profile.tasks.map(task => {
      if (task.id === groupId && task.type === 'group') {
        return { ...task, subTasks: task.subTasks.map(sub => sub.id === subTaskId ? { ...sub, name: newName } : sub) };
      }
      return task;
    });
    handleUpdate({ ...profile, tasks: updatedTasks });
  };

  const handleDeleteSubTask = (groupId: string, subTaskId: string) => {
    if (profile.level < UNLOCK_LEVELS.DELETE_TASK) return;
    const updatedTasks = profile.tasks
      .map(task => {
        if (task.id === groupId && task.type === 'group') {
          const remainingSubTasks = task.subTasks.filter(sub => sub.id !== subTaskId);
          if (remainingSubTasks.length === 0 || remainingSubTasks.every(sub => sub.completed)) return null;
          return { ...task, subTasks: remainingSubTasks };
        }
        return task;
      })
      .filter((task): task is TaskItem => task !== null);
    handleUpdate({ ...profile, tasks: updatedTasks });
  };
  
  const renderContent = () => {
    switch (activeView) {
        case 'tasks':
            return (
                 <div className="p-4">
                    <header className="flex items-start gap-4 mb-6">
                       {canShowAvatar && <Avatar config={profile.avatar} className="w-16 h-16 flex-shrink-0" />}
                       <div className="flex-grow">
                         <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Witaj, {profile.name}</h1>
                         <p className="text-slate-500 dark:text-slate-400">Poziom {profile.level}</p>
                         <div className="mt-3">
                            {canShowProgressBar ? (
                              <ProgressBar value={profile.exp} max={expForNextLevel} label="EXP" />
                            ) : (
                              <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                <span>EXP: {profile.exp} / {expForNextLevel}</span>
                              </div>
                            )}
                         </div>
                       </div>
                    </header>
                    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg dark:shadow-none border border-slate-200 dark:border-slate-700">
                      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-700">Twoje Zadania</h2>
                      <div className="space-y-3">
                        {profile.tasks.length > 0 ? (
                          profile.tasks.map((task) =>
                            task.type === 'single' ? (
                              <TaskItemComponent key={task.id} task={task} userLevel={profile.level} isAvailable={isTaskAvailable(task)} onComplete={handleCompleteTask} onEdit={handleEditTask} onDelete={handleDeleteTask}/>
                            ) : (
                              <TaskGroupListItem key={task.id} group={task} userLevel={profile.level} onCompleteSubTask={handleCompleteSubTask} onDeleteGroup={handleDeleteTaskGroup} onEditSubTask={handleEditSubTask} onDeleteSubTask={handleDeleteSubTask}/>
                            )
                          )
                        ) : (
                          <div className="text-center py-10 px-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700">
                            <p className="text-slate-500 dark:text-slate-400">Naciśnij przycisk +, aby dodać zadanie!</p>
                          </div>
                        )}
                      </div>
                    </div>
                 </div>
            );
        case 'rewards':
            return <RewardsScreen profile={profile} />;
        case 'profile':
            return <ProfileScreen profile={profile} onLogout={onLogout} onThemeToggle={handleThemeToggle} onOpenAvatarModal={() => setIsAvatarModalOpen(true)} />;
        default:
            return null;
    }
  }

  return (
    <>
      <AvatarCustomizationModal isOpen={isAvatarModalOpen} onClose={() => setIsAvatarModalOpen(false)} currentConfig={profile.avatar} onSave={handleSaveAvatar} />
      <AddTaskModal isOpen={isAddTaskModalOpen} onClose={() => setIsAddTaskModalOpen(false)} onAddTask={handleAddTask} onAddTaskGroup={handleAddTaskGroup} userLevel={profile.level} />
      {toastMessage && <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />}

      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 pb-24">
        {renderContent()}
      </div>

      {activeView === 'tasks' && (
         <button
            onClick={() => setIsAddTaskModalOpen(true)}
            className="fixed bottom-24 right-4 w-16 h-16 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full shadow-lg flex items-center justify-center z-40 transition-transform transform hover:scale-110"
            title="Dodaj nowe zadanie"
        >
            <PlusIcon className="w-8 h-8"/>
        </button>
      )}

      <BottomNavBar activeView={activeView} onNavigate={setActiveView} />
    </>
  );
};

export default MainAppScreen;