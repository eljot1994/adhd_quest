
import React from 'react';

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className || 'h-6 w-6'}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.999 3.001c-2.4 0-4.47 1.622-5.11 3.864l-.326 1.136H3a1 1 0 00-1 1v4.4c0 1.38 1.12 2.5 2.5 2.5h1.258l.685 3.424A3.003 3.003 0 0011.999 21a3.003 3.003 0 002.956-2.675l.685-3.424H16.9a2.5 2.5 0 002.5-2.5V9a1 1 0 00-1-1h-3.563l-.326-1.136C16.47 4.623 14.399 3 11.999 3zM7 9h10m-5 3v9"
    />
  </svg>
);

export default TrophyIcon;
