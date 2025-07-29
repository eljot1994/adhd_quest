import React from 'react';

const HourglassIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
    <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 2h12v2H6V2zm0 18h12v2H6v-2z"
    />
    <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 4l6 6 6-6M6 20l6-6 6 6"
    />
  </svg>
);

export default HourglassIcon;