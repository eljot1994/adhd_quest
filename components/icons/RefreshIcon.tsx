import React from 'react';

const RefreshIcon: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.49 9.33a8.5 8.5 0 10-2.48 9.34M19 4.5v5h-5"
    />
  </svg>
);

export default RefreshIcon;