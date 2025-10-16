import React from 'react';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  showLabel = true,
  height = 'md' 
}) => {
  const heightClass = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }[height];

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClass}`}>
        <div 
          className="h-full bg-gradient-to-r from-[#fdb715] to-yellow-500 transition-all duration-500 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-600 mt-1">{progress}% Complete</p>
      )}
    </div>
  );
};
