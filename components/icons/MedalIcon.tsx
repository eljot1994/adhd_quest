import React from 'react';

const MedalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className || "h-6 w-6"} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={1.5}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.4,18.8c0,1.3-1.1,2.4-2.4,2.4s-2.4-1.1-2.4-2.4c0-1.3,1.1-2.4,2.4-2.4S15.4,17.5,15.4,18.8z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13,3v6.5l-1-1-1,1V3H9v7l3,3,3-3V3z"
    />
  </svg>
);

export default MedalIcon;