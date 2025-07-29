import React from 'react';
import { Profile } from '../types';
import { REWARDS } from '../rewards';
import TrophyIcon from './icons/TrophyIcon';
import LockClosedIcon from './icons/LockClosedIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface RewardsScreenProps {
  profile: Profile;
}

const RewardsScreen: React.FC<RewardsScreenProps> = ({ profile }) => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
            <div className="flex items-center gap-3">
                <TrophyIcon className="w-10 h-10 text-cyan-500 dark:text-cyan-400" />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Osiągnięcia i Nagrody</h1>
            </div>
        </header>

        <div className="space-y-4">
          {REWARDS.map((reward) => {
            const isUnlocked = profile.level >= reward.level;
            return (
              <div
                key={reward.level}
                className={`
                  p-5 rounded-lg border flex items-center gap-5 transition-all
                  ${isUnlocked 
                    ? 'bg-white dark:bg-slate-800 border-cyan-500/30 shadow-lg' 
                    : 'bg-white/60 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                  }
                `}
              >
                <div className={`
                    flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                    ${isUnlocked ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-500 dark:text-cyan-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'}
                `}>
                    {isUnlocked 
                        ? <CheckCircleIcon className="w-7 h-7" /> 
                        : <LockClosedIcon className="w-7 h-7" />
                    }
                </div>
                <div className="flex-grow">
                  <p className={`font-bold ${isUnlocked ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    {reward.description}
                  </p>
                  <p className={`text-sm ${isUnlocked ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    Odblokowuje się na poziomie {reward.level}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RewardsScreen;