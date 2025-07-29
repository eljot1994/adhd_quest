import React, { useEffect } from 'react';
import SparklesIcon from './icons/SparklesIcon';
import { TOAST_DURATION } from '../constants';

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, TOAST_DURATION);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 w-auto max-w-sm bg-cyan-600 dark:bg-cyan-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg flex items-center gap-3 z-50 animate-slide-in-up"
      style={{
        animation: `slideInUp 0.5s ease-out, fadeOut 0.5s ease-in ${TOAST_DURATION / 1000 - 0.5}s forwards`,
      }}
    >
      <SparklesIcon className="w-6 h-6" />
      <span>{message}</span>
      <style>{`
        @keyframes slideInUp {
          from { transform: translate(-50%, 100px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translate(-50%, 0); }
          to { opacity: 0; transform: translate(-50%, 20px); }
        }
      `}</style>
    </div>
  );
};

export default Toast;
