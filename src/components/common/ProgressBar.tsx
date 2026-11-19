import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((current / total) * 100)));

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center text-xs font-medium text-[#0B3B3D]/70 mb-1.5">
        <span>{label || `Progress: ${current} of ${total}`}</span>
        <span className="text-[#E05A47] font-semibold">{percentage}%</span>
      </div>
      <div className="w-full h-1.5 bg-[#A3C4CB]/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#E05A47] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
