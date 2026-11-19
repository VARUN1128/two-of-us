import React from 'react';
import { Sparkles, Trophy, Scissors } from 'lucide-react';
import { BINGO_SPELL } from '../../lib/bingoLogic';

interface BingoLetterTrackerProps {
  completedLinesCount: number;
  className?: string;
}

export const BingoLetterTracker: React.FC<BingoLetterTrackerProps> = ({
  completedLinesCount,
  className = '',
}) => {
  const cutCount = Math.min(5, Math.max(0, completedLinesCount));
  const isFullBingo = completedLinesCount >= 5;

  const getStatusMessage = () => {
    switch (cutCount) {
      case 0:
        return 'Complete any row, column, or diagonal to strike off B!';
      case 1:
        return '🎉 Letter B struck off! Complete your next line to cut I!';
      case 2:
        return '🔥 B & I struck off! 3 more lines to spell B-I-N-G-O!';
      case 3:
        return '⚡ B - I - N struck off! Only 2 lines left for BINGO!';
      case 4:
        return '🚨 B - I - N - G struck off! Complete 1 more line to win BINGO!';
      default:
        return '🏆 FULL B-I-N-G-O STRUCK OFF! YOU WON THE BINGO CHALLENGE! 🎉';
    }
  };

  return (
    <div
      className={`p-3.5 rounded-3xl bg-white border border-[#A3C4CB]/50 shadow-xs space-y-2.5 ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0B3B3D]">
          <Scissors className="w-3.5 h-3.5 text-[#E05A47]" />
          <span>B-I-N-G-O Strike Tracker</span>
        </div>

        <span
          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-colors ${
            isFullBingo
              ? 'bg-[#E05A47] text-white animate-pulse'
              : cutCount > 0
              ? 'bg-[#FDF2F0] text-[#E05A47] border border-[#E05A47]/30'
              : 'bg-[#F4F8F9] text-[#0B3B3D]/70'
          }`}
        >
          {cutCount} of 5 Letters Cut
        </span>
      </div>

      {/* 5 Distinct B-I-N-G-O Letters */}
      <div className="grid grid-cols-5 gap-2">
        {BINGO_SPELL.map((letter, idx) => {
          const isCut = idx < cutCount;
          const lineNumber = idx + 1;

          return (
            <div
              key={letter}
              className={`relative rounded-2xl p-2 flex flex-col items-center justify-center transition-all duration-300 overflow-hidden ${
                isCut
                  ? 'bg-[#FDF2F0] border-2 border-[#E05A47] shadow-xs scale-[1.02]'
                  : 'bg-[#F4F8F9] border border-[#A3C4CB]/40'
              }`}
            >
              {/* The Letter */}
              <span
                className={`font-serif text-2xl sm:text-3xl font-bold leading-none select-none transition-colors duration-300 ${
                  isCut ? 'text-[#D34E2A]' : 'text-[#0B3B3D]'
                }`}
                style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
              >
                {letter}
              </span>

              {/* Sub-label */}
              <span
                className={`text-[9px] uppercase tracking-wider font-semibold font-sans mt-1 select-none ${
                  isCut ? 'text-[#D34E2A]' : 'text-[#0B3B3D]/50'
                }`}
              >
                {isCut ? 'CUT ✓' : `Line ${lineNumber}`}
              </span>

              {/* Strikethrough Cut Line Animation */}
              {isCut && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {/* Angled SVG Strike Line */}
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-[#D34E2A] drop-shadow-xs"
                    preserveAspectRatio="none"
                  >
                    <line
                      x1="12"
                      y1="88"
                      x2="88"
                      y2="12"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className="animate-in fade-in duration-300"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dynamic Status Callout */}
      <div
        className={`px-3 py-2 rounded-xl text-center text-xs font-medium transition-colors ${
          isFullBingo
            ? 'bg-[#E05A47] text-white font-bold shadow-xs'
            : cutCount > 0
            ? 'bg-[#FDF2F0] text-[#D34E2A] border border-[#F3BEB5]/60'
            : 'bg-[#F4F8F9] text-[#0B3B3D]/75'
        }`}
      >
        <div className="flex items-center justify-center gap-1.5">
          {isFullBingo ? (
            <Trophy className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#E05A47]" />
          )}
          <span>{getStatusMessage()}</span>
        </div>
      </div>
    </div>
  );
};
