import React from 'react';
import ListBulletIcon from './icons/ListBulletIcon';
import TrophyIcon from './icons/TrophyIcon';
import UserCircleIcon from './icons/UserCircleIcon';

export type ActiveView = 'tasks' | 'rewards' | 'profile';

interface BottomNavBarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-cyan-500 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400'
    }`}
  >
    {icon}
    <span className={`text-xs font-medium mt-1 ${isActive ? 'font-bold' : ''}`}>{label}</span>
  </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, onNavigate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 shadow-t-lg z-40">
      <div className="flex justify-around items-stretch h-full">
        <NavItem
          icon={<ListBulletIcon className="w-7 h-7" />}
          label="Zadania"
          isActive={activeView === 'tasks'}
          onClick={() => onNavigate('tasks')}
        />
        <NavItem
          icon={<TrophyIcon className="w-7 h-7" />}
          label="Nagrody"
          isActive={activeView === 'rewards'}
          onClick={() => onNavigate('rewards')}
        />
        <NavItem
          icon={<UserCircleIcon className="w-7 h-7" />}
          label="Profil"
          isActive={activeView === 'profile'}
          onClick={() => onNavigate('profile')}
        />
      </div>
    </div>
  );
};

export default BottomNavBar;
