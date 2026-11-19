import React, { useEffect } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { Trophy, Users, Award, Clock, ArrowRight } from 'lucide-react';
import { fireBingoConfetti } from '../common/Confetti';
import type { BingoBoard } from '../../types';

interface CompletionPageProps {
  board: BingoBoard;
  onViewConnections: () => void;
}

export const CompletionPage: React.FC<CompletionPageProps> = ({
  board,
  onViewConnections,
}) => {
  useEffect(() => {
    fireBingoConfetti(true);
  }, []);

  // Calculate elapsed time from board creation to completion
  const calculateDuration = (): string => {
    try {
      const start = new Date(board.created_at).getTime();
      const end = board.completed_at ? new Date(board.completed_at).getTime() : Date.now();
      const diffMs = Math.max(0, end - start);
      const mins = Math.floor(diffMs / (1000 * 60));
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;

      if (hours > 0) {
        return `${hours}h ${remainingMins}m`;
      }
      return `${Math.max(1, mins)} mins`;
    } catch {
      return 'Completed';
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between items-center px-6 py-8 md:py-12 max-w-md mx-auto w-full text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="pt-2">
        <BrandLogo size="md" showSubtitle={false} />
      </div>

      <div className="my-auto py-6 space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#FDF2F0] border-2 border-[#E05A47] flex items-center justify-center text-[#E05A47] mx-auto shadow-lg animate-pulse-subtle">
          <Trophy className="w-10 h-10 fill-[#E05A47]/20" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2F0] text-xs font-bold text-[#E05A47] uppercase tracking-wider">
            ★ All 25 Letters Conquered ★
          </div>

          <h1
            className="text-3xl md:text-4xl font-medium text-[#0B3B3D] leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
          >
            25 people. Countless stories. One unforgettable experience.
          </h1>

          <p className="text-sm md:text-base text-[#0B3B3D]/80 font-sans max-w-xs mx-auto leading-relaxed">
            You completed your Two of Us Human Bingo!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 p-4 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/40 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[11px] text-[#0B3B3D]/70">
              <Users className="w-3 h-3 text-[#E05A47]" />
              <span>Met</span>
            </div>
            <div className="text-xl font-bold text-[#0B3B3D]">25</div>
            <div className="text-[10px] text-[#E05A47] font-medium">People</div>
          </div>

          <div className="space-y-1 border-x border-[#A3C4CB]/30 px-2">
            <div className="flex items-center gap-1 text-[11px] text-[#0B3B3D]/70">
              <Award className="w-3 h-3 text-[#E05A47]" />
              <span>Lines</span>
            </div>
            <div className="text-xl font-bold text-[#0B3B3D]">12</div>
            <div className="text-[10px] text-[#E05A47] font-medium">All 12 Bingos</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[11px] text-[#0B3B3D]/70">
              <Clock className="w-3 h-3 text-[#E05A47]" />
              <span>Time</span>
            </div>
            <div className="text-lg font-bold text-[#0B3B3D] truncate">{calculateDuration()}</div>
            <div className="text-[10px] text-[#E05A47] font-medium">Duration</div>
          </div>
        </div>
      </div>

      <div className="w-full pb-4 space-y-3">
        <button
          onClick={onViewConnections}
          className="w-full py-4 px-6 rounded-2xl bg-[#E05A47] hover:bg-[#C44633] text-white font-medium text-base shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>View All Your 25 Connections</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
