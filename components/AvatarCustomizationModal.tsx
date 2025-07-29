
import React, { useState, useEffect } from 'react';
import { AvatarConfig } from '../types';
import { AVATAR_COLORS, AVATAR_EYES_COUNT, AVATAR_MOUTHS_COUNT } from '../constants';
import Avatar from './Avatar';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';

interface AvatarCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: AvatarConfig;
  onSave: (newConfig: AvatarConfig) => void;
}

const AvatarCustomizationModal: React.FC<AvatarCustomizationModalProps> = ({
  isOpen,
  onClose,
  currentConfig,
  onSave,
}) => {
  const [tempConfig, setTempConfig] = useState<AvatarConfig>(currentConfig);

  useEffect(() => {
    setTempConfig(currentConfig);
  }, [currentConfig, isOpen]);

  if (!isOpen) {
    return null;
  }

  const cycleOption = (key: keyof AvatarConfig, direction: 1 | -1) => {
    setTempConfig((prev) => {
      let newValue;
      if (key === 'bodyColor') {
        const currentIndex = AVATAR_COLORS.indexOf(prev.bodyColor);
        const nextIndex = (currentIndex + direction + AVATAR_COLORS.length) % AVATAR_COLORS.length;
        newValue = AVATAR_COLORS[nextIndex];
      } else {
        const count = key === 'eyes' ? AVATAR_EYES_COUNT : AVATAR_MOUTHS_COUNT;
        newValue = (prev[key] + direction + count) % count;
      }
      return { ...prev, [key]: newValue };
    });
  };

  const handleSave = () => {
    onSave(tempConfig);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/70 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 w-full max-w-sm m-4 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Dostosuj Swój Awatar</h2>

        <div className="flex justify-center mb-8">
          <Avatar config={tempConfig} className="w-40 h-40" />
        </div>

        <div className="space-y-4">
          {/* Body Color */}
          <div className="flex items-center justify-between">
            <span className="font-semibold">Kolor</span>
            <div className="flex items-center gap-4">
              <button onClick={() => cycleOption('bodyColor', -1)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition"><ArrowLeftIcon className="w-5 h-5" /></button>
              <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-500" style={{ backgroundColor: tempConfig.bodyColor }}></div>
              <button onClick={() => cycleOption('bodyColor', 1)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition"><ArrowRightIcon className="w-5 h-5" /></button>
            </div>
          </div>
          {/* Eyes */}
          <div className="flex items-center justify-between">
            <span className="font-semibold">Oczy</span>
            <div className="flex items-center gap-4">
              <button onClick={() => cycleOption('eyes', -1)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition"><ArrowLeftIcon className="w-5 h-5" /></button>
              <span className="w-8 text-center text-lg">{tempConfig.eyes + 1}</span>
              <button onClick={() => cycleOption('eyes', 1)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition"><ArrowRightIcon className="w-5 h-5" /></button>
            </div>
          </div>
          {/* Mouth */}
          <div className="flex items-center justify-between">
            <span className="font-semibold">Usta</span>
            <div className="flex items-center gap-4">
              <button onClick={() => cycleOption('mouth', -1)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition"><ArrowLeftIcon className="w-5 h-5" /></button>
              <span className="w-8 text-center text-lg">{tempConfig.mouth + 1}</span>
              <button onClick={() => cycleOption('mouth', 1)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition"><ArrowRightIcon className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-lg transition"
          >
            Anuluj
          </button>
          <button
            onClick={handleSave}
            className="w-full bg-cyan-600 hover:bg-cyan-500 font-bold py-3 px-4 rounded-lg transition text-white"
          >
            Zapisz
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCustomizationModal;