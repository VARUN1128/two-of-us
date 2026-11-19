import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { ArrowRight, Grid3X3, Sparkles } from 'lucide-react';

interface QuestionnaireCompletionProps {
  onStartBingo: () => void;
}

export const QuestionnaireCompletion: React.FC<QuestionnaireCompletionProps> = ({
  onStartBingo,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between items-center px-6 py-10 max-w-md mx-auto w-full text-center animate-in fade-in zoom-in-95 duration-400">
      <div className="pt-4">
        <BrandLogo size="md" showSubtitle={false} />
      </div>

      <div className="my-auto py-8 space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#E6F6F5] border border-[#088F87]/20 flex items-center justify-center text-[#088F87] mx-auto shadow-sm">
          <Grid3X3 className="w-8 h-8" />
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F8F9] text-xs font-semibold text-[#088F87]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Questionnaire Complete</span>
          </div>

          <h2
            className="text-3xl md:text-4xl font-medium text-[#0B3B3D] leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
          >
            That's a little more about you.
          </h2>

          <p className="text-base text-[#0B3B3D]/80 font-sans max-w-xs mx-auto leading-relaxed">
            Now comes the fun part. Go meet someone new.
          </p>
        </div>

        {/* Quick Bingo preview rules card */}
        <div className="p-4 rounded-2xl bg-[#F4F8F9] border border-[#A3C4CB]/40 text-left space-y-2 text-xs text-[#0B3B3D]/85">
          <p className="font-semibold text-[#0B3B3D] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#088F87]" /> How Human Bingo Works:
          </p>
          <ul className="space-y-1.5 pl-3.5 list-disc text-[11px] text-[#0B3B3D]/80">
            <li>Find someone whose first name starts with any letter on your board.</li>
            <li>Take a selfie together and ask them one quick quirky question.</li>
            <li>Complete horizontal, vertical, or diagonal lines to score a <strong>BINGO!</strong></li>
          </ul>
        </div>
      </div>

      <div className="w-full pb-4">
        <button
          onClick={onStartBingo}
          className="w-full py-4 px-6 rounded-2xl bg-[#088F87] hover:bg-[#06726B] text-white font-medium text-base shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Start Human Bingo</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
