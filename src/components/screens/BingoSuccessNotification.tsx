import React, { useEffect } from 'react';
import type { WinningLine } from '../../types';
import { Trophy, Sparkles, X } from 'lucide-react';
import { fireBingoConfetti } from '../common/Confetti';

interface BingoSuccessNotificationProps {
  newlyCompletedLines: WinningLine[];
  onDismiss: () => void;
}

export const BingoSuccessNotification: React.FC<BingoSuccessNotificationProps> = ({
  newlyCompletedLines,
  onDismiss,
}) => {
  useEffect(() => {
    if (newlyCompletedLines.length > 0) {
      fireBingoConfetti(false);
    }
  }, [newlyCompletedLines]);

  if (!newlyCompletedLines || newlyCompletedLines.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B3B3D]/70 backdrop-blur-xs animate-in zoom-in-90 fade-in duration-300">
      <div 
        className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-2 border-[#088F87] space-y-5 relative overflow-hidden"
        role="alertdialog"
        aria-modal="true"
      >
        {/* Decorative background glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-[#E6F6F5] blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-[#A3C4CB]/30 blur-xl pointer-events-none" />

        {/* Close icon */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-[#0B3B3D]/50 hover:text-[#0B3B3D] p-1 rounded-full hover:bg-[#F4F8F9]"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy icon with animated pulse */}
        <div className="w-16 h-16 rounded-full bg-[#E6F6F5] border-2 border-[#088F87] flex items-center justify-center text-[#088F87] mx-auto animate-pulse-subtle shadow-md">
          <Trophy className="w-8 h-8 fill-[#088F87]/20" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F6F5] text-xs font-bold text-[#088F87] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Winning Line Detected</span>
          </div>

          <h3 
            className="text-3xl font-bold text-[#0B3B3D] tracking-tight"
            style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
          >
            You've got BINGO!
          </h3>

          <p className="text-xs text-[#0B3B3D]/80 font-sans">
            Congratulations! You connected 5 people in a row:
          </p>
        </div>

        {/* Completed line pills */}
        <div className="flex flex-wrap gap-2 justify-center py-1">
          {newlyCompletedLines.map((line) => (
            <span
              key={line.id}
              className="px-3.5 py-1.5 rounded-full bg-[#088F87] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-white" />
              <span>{line.label} Completed</span>
            </span>
          ))}
        </div>

        <div>
          <button
            onClick={onDismiss}
            className="w-full py-3 px-6 rounded-2xl bg-[#088F87] hover:bg-[#06726B] text-white font-semibold text-xs transition-all active:scale-98 shadow-md cursor-pointer"
          >
            Keep Playing & Connecting
          </button>
        </div>
      </div>
    </div>
  );
};
