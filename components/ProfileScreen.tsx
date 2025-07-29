
import React from 'react';
import { Profile, Theme } from '../types';
import { UNLOCK_LEVELS } from '../constants';
import { BADGES } from './badges';
import Avatar from './Avatar';
import MoonIcon from './icons/MoonIcon';
import SunIcon from './icons/SunIcon';

interface ProfileScreenProps {
  profile: Profile;
  onLogout: () => void;
  onThemeToggle: () => void;
  onOpenAvatarModal: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ profile, onLogout, onThemeToggle, onOpenAvatarModal }) => {
  
  const canCustomizeAvatar = profile.level >= UNLOCK_LEVELS.AVATAR_CUSTOMIZATION;
  const canChangeTheme = profile.level >= UNLOCK_LEVELS.THEME_SELECTION;
  const canSeeBadges = profile.level >= UNLOCK_LEVELS.BADGES;

  const earnedBadges = BADGES.filter(b => profile.badges.includes(b.type));

  return (
    <div className="p-4 pb-12">
      <div className="flex flex-col items-center text-center">
        <button
            onClick={() => canCustomizeAvatar && onOpenAvatarModal()}
            className={`rounded-full transition-transform duration-300 ${canCustomizeAvatar ? 'cursor-pointer transform hover:scale-110' : 'cursor-default'}`}
            title={canCustomizeAvatar ? 'Dostosuj awatar' : `Odblokuj na poziomie ${UNLOCK_LEVELS.AVATAR_CUSTOMIZATION}`}
        >
            <Avatar config={profile.avatar} className="w-24 h-24 mb-4" />
        </button>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{profile.name}</h1>
        <div className="flex items-center gap-4 mt-2 text-slate-600 dark:text-slate-300">
            <span className="font-semibold">Poziom: {profile.level}</span>
            {profile.level >= UNLOCK_LEVELS.SHOW_COMPLETED_COUNT && <span>Ukończone: {profile.completedTasksCount}</span>}
        </div>
      </div>
      
      {canSeeBadges && (
        <div className="mt-8 max-w-sm mx-auto">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-3 text-center">Odznaki</h2>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-none border dark:border-slate-700">
            {earnedBadges.length > 0 ? (
              <div className="space-y-4">
                {earnedBadges.map(badge => (
                  <div key={badge.type} className="flex items-center gap-4">
                    <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-500/10 p-2 rounded-full">
                      <badge.icon className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                    </div>
                    <div className="flex-grow">
                        <p className="font-bold text-slate-800 dark:text-white">{badge.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 dark:text-slate-400">Nie zdobyto jeszcze żadnych odznak. Działaj dalej!</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 space-y-4 max-w-sm mx-auto">
        {canChangeTheme && (
            <button
                onClick={onThemeToggle}
                className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-none border dark:border-slate-700 transition-colors"
            >
                <span className="font-semibold">Zmień motyw</span>
                {profile.theme === Theme.Light ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
        )}
         <button
            onClick={onLogout}
            className="w-full text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md dark:shadow-none border dark:border-slate-700 font-semibold text-red-600 dark:text-red-400 transition-colors"
         >
            Wyloguj się
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;