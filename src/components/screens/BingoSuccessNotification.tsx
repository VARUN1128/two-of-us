import React, { useEffect } from 'react';
import type { WinningLine } from '../../types';
import { Trophy, Sparkles, X, Scissors, Award } from 'lucide-react';
import { fireBingoConfetti } from '../common/Confetti';
import { BINGO_SPELL } from '../../lib/bingoLogic';

interface BingoSuccessNotificationProps {
  newlyCompletedLines: WinningLine[];
  totalCompletedLinesCount: number;
  newlyCutLetters?: string[];
  onDismiss: () => void;
}

export const BingoSuccessNotification: React.FC<BingoSuccessNotificationProps> = ({
  newlyCompletedLines,
  totalCompletedLinesCount,
  newlyCutLetters = [],
  onDismiss,
}) => {
  const cutCount = Math.min(5, Math.max(0, totalCompletedLinesCount));
  const isFullBingoNow = totalCompletedLinesCount >= 5;

  useEffect(() => {
    if (newlyCompletedLines.length > 0) {
      fireBingoConfetti(isFullBingoNow);
    }
  }, [newlyCompletedLines, isFullBingoNow]);

  if (!newlyCompletedLines || newlyCompletedLines.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B3B3D]/70 backdrop-blur-xs animate-in zoom-in-90 fade-in duration-300">
      <div 
        className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border-2 border-[#E05A47] space-y-4 relative overflow-hidden"
        role="alertdialog"
        aria-modal="true"
      >
        {/* Decorative background glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-[#FDF2F0] blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-[#A3C4CB]/30 blur-xl pointer-events-none" />

        {/* Close icon */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-[#0B3B3D]/50 hover:text-[#0B3B3D] p-1 rounded-full hover:bg-[#F4F8F9] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Trophy / Award Badge */}
        <div className="w-16 h-16 rounded-full bg-[#FDF2F0] border-2 border-[#E05A47] flex items-center justify-center text-[#E05A47] mx-auto animate-pulse-subtle shadow-md">
          {isFullBingoNow ? (
            <Trophy className="w-8 h-8 fill-[#E05A47]/20" />
          ) : (
            <Award className="w-8 h-8 fill-[#E05A47]/20" />
          )}
        </div>

        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F0] text-xs font-bold text-[#E05A47] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Winning Line Completed</span>
          </div>

          <h3 
            className="text-2xl sm:text-3xl font-bold text-[#0B3B3D] tracking-tight"
            style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
          >
            {isFullBingoNow ? "Full B-I-N-G-O!" : "You've got a Line!"}
          </h3>

          <p className="text-xs text-[#0B3B3D]/80 font-sans">
            {newlyCutLetters.length > 0 ? (
              <span>
                Letter <strong className="text-[#D34E2A] text-sm font-bold">'{newlyCutLetters.join("', '")}'</strong> in BINGO is now struck off!
              </span>
            ) : (
              <span>You completed 5 connections in a line!</span>
            )}
          </p>
        </div>

        {/* Visual 5-Letter B-I-N-G-O Strike Preview */}
        <div className="p-3 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/30">
          <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-[#0B3B3D]/70 mb-2">
            <Scissors className="w-3 h-3 text-[#E05A47]" />
            <span>B-I-N-G-O Progress</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {BINGO_SPELL.map((char, i) => {
              const isCut = i < cutCount;
              const isJustCut = newlyCutLetters.includes(char);

              return (
                <div
                  key={char}
                  className={`relative p-1.5 rounded-xl flex flex-col items-center justify-center ${
                    isCut
                      ? 'bg-[#FDF2F0] border border-[#E05A47] text-[#D34E2A] font-bold'
                      : 'bg-white border border-[#A3C4CB]/40 text-[#0B3B3D]/50 font-medium'
                  } ${isJustCut ? 'ring-2 ring-[#E05A47] scale-105' : ''}`}
                >
                  <span
                    className="font-serif text-lg leading-none"
                    style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
                  >
                    {char}
                  </span>
                  {isCut && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full text-[#D34E2A]" preserveAspectRatio="none">
                        <line x1="15" y1="85" x2="85" y2="15" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed line pills */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {newlyCompletedLines.map((line) => (
            <span
              key={line.id}
              className="px-3 py-1 rounded-full bg-[#E05A47] text-white text-[11px] font-semibold shadow-2xs flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-white" />
              <span>{line.label} Completed</span>
            </span>
          ))}
        </div>

        <div>
          <button
            onClick={onDismiss}
            className="w-full py-3 px-6 rounded-2xl bg-[#E05A47] hover:bg-[#C44633] text-white font-semibold text-xs transition-all active:scale-98 shadow-md cursor-pointer"
          >
            Keep Playing & Connecting
          </button>
        </div>
      </div>
    </div>
  );
};
