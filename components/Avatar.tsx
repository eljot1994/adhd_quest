
import React from 'react';
import { AvatarConfig } from '../types';

interface AvatarProps {
  config: AvatarConfig;
  className?: string;
}

// Pre-defined SVG paths for different eyes and mouths
const EYES_PATHS = [
  // Normal
  '<circle cx="17" cy="20" r="2.5" fill="black" /><circle cx="31" cy="20" r="2.5" fill="black" />',
  // Happy
  '<path d="M14 20 Q17 17 20 20" stroke="black" stroke-width="2" fill="none" /><path d="M28 20 Q31 17 34 20" stroke="black" stroke-width="2" fill="none" />',
  // Surprised
  '<circle cx="17" cy="20" r="3" fill="white" stroke="black" stroke-width="1.5" /><circle cx="31" cy="20" r="3" fill="white" stroke="black" stroke-width="1.5" />',
  // Squint
  '<path d="M14 20 L20 20" stroke="black" stroke-width="2" /><path d="M28 20 L34 20" stroke="black" stroke-width="2" />',
  // X eyes
  '<path d="M15 18 L19 22 M19 18 L15 22" stroke="black" stroke-width="2" /><path d="M29 18 L33 22 M33 18 L29 22" stroke="black" stroke-width="2" />',
];

const MOUTHS_PATHS = [
  // Smile
  '<path d="M20 30 Q24 35 28 30" stroke="black" stroke-width="2" fill="none" />',
  // Open smile
  '<path d="M20 30 Q24 38 28 30" fill="#E74C3C" stroke="black" stroke-width="2" />',
  // Straight
  '<path d="M20 32 L28 32" stroke="black" stroke-width="2" />',
  // Sad
  '<path d="M20 34 Q24 29 28 34" stroke="black" stroke-width="2" fill="none"/>',
  // O-mouth
  '<ellipse cx="24" cy="32" rx="4" ry="3" fill="black" />',
];

const Avatar: React.FC<AvatarProps> = ({ config, className }) => {
  const eyesHtml = EYES_PATHS[config.eyes % EYES_PATHS.length] || EYES_PATHS[0];
  const mouthHtml = MOUTHS_PATHS[config.mouth % MOUTHS_PATHS.length] || MOUTHS_PATHS[0];

  return (
    <svg
      className={className || 'w-16 h-16'}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          className="avatar-body"
          d="M24,47 C34.49,47 43,38.49 43,28 C43,17.51 34.49,9 24,9 C13.51,9 5,17.51 5,28 C5,38.49 13.51,47 24,47 Z"
          fill={config.bodyColor}
          strokeWidth="2"
        />
        <g dangerouslySetInnerHTML={{ __html: eyesHtml }} />
        <g dangerouslySetInnerHTML={{ __html: mouthHtml }} />
      </g>
    </svg>
  );
};

export default Avatar;