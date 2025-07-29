
import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, label }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">{label}</span>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {value} / {max}
        </span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
        <div
          className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;