// components/MainAppScreen.tsx

import React, { useState, useMemo, useEffect } from "react";
import {
  Profile,
  SingleTask,
  TaskDifficulty,
  AvatarConfig,
  Theme,
  TaskItem as TaskItemType,
  TaskGroupInList,
  BadgeType,
} from "../types";
import {
  EXP_FOR_DIFFICULTY,
  EXP_TO_LEVEL_UP_BASE,
  UNLOCK_LEVELS,
} from "../constants";
import { predefinedTaskGroups } from "./predefinedTaskGroups";
import TaskItemComponent from "./TaskItem";
import RewardsScreen from "./RewardsScreen";
import AvatarCustomizationModal from "./AvatarCustomizationModal";
import TaskGroupListItem from "./TaskGroupListItem";
import { isTaskAvailable } from "../utils/taskUtils";
import { checkAndAwardBadges } from "../utils/badgeUtils";
import BottomNavBar, { ActiveView } from "./BottomNavBar";
import ProfileScreen from "./ProfileScreen";
import AddTaskModal from "./AddTaskModal";
import PlusIcon from "./icons/PlusIcon";
import Toast from "./Toast";
import Avatar from "./Avatar";
import ProgressBar from "./ProgressBar";
import { useAuth } from "../context/AuthContext"; // <-- KLUCZOWY IMPORT

const MainAppScreen: React.FC = () => {
  // <-- Usunięte propsy
  const { profile, updateProfile, logout } = useAuth(); // <-- UŻYCIE HOOKA

  const [activeView, setActiveView] = useState<ActiveView>("tasks");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [levelUpAnimation, setLevelUpAnimation] = useState(false);

  // Zabezpieczenie na wypadek, gdyby profil jeszcze się nie załadował
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Wczytywanie profilu...
      </div>
    );
  }

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLevelUp = (newProfile: Profile) => {
    showToast(`Gratulacje! Osiągnąłeś poziom ${newProfile.level}!`);
    setLevelUpAnimation(true);
    setTimeout(() => setLevelUpAnimation(false), 2000);
  };

  const handleUpdate = (
    updatedTasks: TaskItemType[],
    updatedProfile: Profile,
    message?: string
  ) => {
    const previousLevel = profile.level;
    const newBadges = checkAndAwardBadges(updatedProfile);

    // Sprawdzamy, czy nastąpił awans na wyższy poziom
    if (updatedProfile.level > previousLevel) {
      handleLevelUp(updatedProfile);
    }

    if (newBadges.length > 0) {
      showToast(
        `Zdobyto nowe odznaki: ${newBadges.map((b) => b.name).join(", ")}!`
      );
    }

    if (message) {
      showToast(message);
    }

    // Używamy funkcji updateProfile z kontekstu
    updateProfile(updatedProfile);
  };

  const groupedTasks = useMemo(() => {
    const groups: { [key: string]: TaskGroupInList } = {};

    predefinedTaskGroups.forEach((group) => {
      if (isTaskAvailable(group, profile.level)) {
        groups[group.id] = { ...group, tasks: [] };
      }
    });

    profile.tasks.forEach((task) => {
      if (task.groupId && groups[task.groupId]) {
        groups[task.groupId].tasks.push(task);
      }
    });

    return Object.values(groups);
  }, [profile.tasks, profile.level]);

  const handleTaskCompletion = (taskId: string, difficulty: TaskDifficulty) => {
    const expGained = EXP_FOR_DIFFICULTY[difficulty];
    let newExp = profile.exp + expGained;
    let newLevel = profile.level;
    let expToLevelUp = EXP_TO_LEVEL_UP_BASE * Math.pow(1.5, newLevel - 1);

    while (newExp >= expToLevelUp) {
      newExp -= expToLevelUp;
      newLevel++;
      expToLevelUp = EXP_TO_LEVEL_UP_BASE * Math.pow(1.5, newLevel - 1);
    }

    const updatedTasks = profile.tasks.filter((t) => t.id !== taskId);
    const updatedProfile: Profile = {
      ...profile,
      tasks: updatedTasks,
      exp: newExp,
      level: newLevel,
      completedTasks: (profile.completedTasks || 0) + 1,
    };

    handleUpdate(updatedTasks, updatedProfile, `+${expGained} EXP`);
  };

  const handleAddTask = (task: SingleTask) => {
    const newTask: TaskItemType = {
      ...task,
      id: `task_${new Date().getTime()}`,
    };

    const updatedTasks = [...profile.tasks, newTask];
    const updatedProfile = { ...profile, tasks: updatedTasks };
    handleUpdate(updatedTasks, updatedProfile, "Dodano nowe zadanie!");
  };

  const handleThemeChange = (theme: Theme) => {
    const updatedProfile = { ...profile, theme };
    updateProfile(updatedProfile); // Bezpośrednio używamy funkcji z kontekstu
    if (theme === Theme.Dark) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  const handleAvatarSave = (newAvatar: AvatarConfig) => {
    const updatedProfile = { ...profile, avatar: newAvatar };
    updateProfile(updatedProfile); // Bezpośrednio używamy funkcji z kontekstu
    setIsAvatarModalOpen(false);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "tasks":
        return (
          <div className="space-y-4">
            {groupedTasks.map((group) => (
              <TaskGroupListItem
                key={group.id}
                group={group}
                onTaskComplete={handleTaskCompletion}
              />
            ))}
          </div>
        );
      case "rewards":
        return <RewardsScreen profile={profile} />;
      case "profile":
        return (
          <ProfileScreen
            onThemeChange={handleThemeChange}
            onAvatarCustomize={() => setIsAvatarModalOpen(true)}
            onLogout={logout} // Używamy funkcji logout z kontekstu
          />
        );
      default:
        return <div>Wybierz widok</div>;
    }
  };

  const expToLevelUp = EXP_TO_LEVEL_UP_BASE * Math.pow(1.5, profile.level - 1);

  return (
    <div className="text-slate-800 dark:text-slate-200 min-h-screen pb-20">
      <header className="p-4 bg-white dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Avatar
              config={profile.avatar}
              onClick={() => setActiveView("profile")}
              level={profile.level}
            />
            <div>
              <p className="font-bold text-lg">{profile.name}</p>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-semibold">Poziom {profile.level}</p>
              </div>
              <ProgressBar current={profile.exp} max={expToLevelUp} />
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 max-w-4xl mx-auto">{renderActiveView()}</main>

      <div
        className="fixed bottom-24 right-4 z-20"
        style={{ transform: activeView === "tasks" ? "scale(1)" : "scale(0)" }}
      >
        <button
          onClick={() => setIsAddTaskModalOpen(true)}
          className="bg-sky-500 hover:bg-sky-600 text-white rounded-full p-4 shadow-lg transition-transform duration-300 ease-in-out"
          aria-label="Dodaj zadanie"
        >
          <PlusIcon className="w-8 h-8" />
        </button>
      </div>

      <BottomNavBar activeView={activeView} setActiveView={setActiveView} />

      <AvatarCustomizationModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={profile.avatar}
        onSave={handleAvatarSave}
      />

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={handleAddTask}
        availableGroups={groupedTasks}
      />

      {toastMessage && <Toast message={toastMessage} />}

      {levelUpAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-center text-white animate-pulse">
            <p className="text-4xl font-bold">LEVEL UP!</p>
            <p className="text-2xl">Osiągnięto poziom {profile.level}!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainAppScreen;
