
import React, { useState } from 'react';
import { Profile } from '../types';
import UserPlusIcon from './icons/UserPlusIcon';
import TrophyIcon from './icons/TrophyIcon';

interface ProfileSelectionScreenProps {
  profiles: Profile[];
  onSelectProfile: (profile: Profile) => void;
  onCreateProfile: (name: string) => void;
}

const ProfileSelectionScreen: React.FC<ProfileSelectionScreenProps> = ({
  profiles,
  onSelectProfile,
  onCreateProfile,
}) => {
  const [newProfileName, setNewProfileName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      onCreateProfile(newProfileName.trim());
      setNewProfileName('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-100 dark:bg-slate-900">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-10">
          <TrophyIcon className="w-16 h-16 mx-auto text-cyan-500 dark:text-cyan-400 mb-2" />
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight">ADHD_Quest</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Zmień swoje zadania w przygodę!</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl mb-8">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Stwórz Nowy Profil</h2>
          <form onSubmit={handleCreate} className="flex space-x-2">
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Wpisz nazwę gracza..."
              className="flex-grow bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 border border-slate-300 dark:border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-md flex items-center transition"
              disabled={!newProfileName.trim()}
            >
              <UserPlusIcon className="w-5 h-5 mr-2" />
              Stwórz
            </button>
          </form>
        </div>

        {profiles.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-2xl">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Lub Wybierz Istniejący Profil</h2>
            <div className="space-y-3">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => onSelectProfile(profile)}
                  className="w-full text-left bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white p-4 rounded-lg transition transform hover:scale-105"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">{profile.name}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Poziom {profile.level}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSelectionScreen;