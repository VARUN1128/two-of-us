import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { ArrowRight, Users, Camera, Trophy, Sparkles } from 'lucide-react';

interface QuestionnaireCompletionProps {
  onStartBingo: () => void;
}

export const QuestionnaireCompletion: React.FC<QuestionnaireCompletionProps> = ({
  onStartBingo,
}) => {
  return (
    <div className="relative min-h-[92vh] flex-1 flex flex-col justify-between items-center px-6 pt-2 pb-10 text-center max-w-md mx-auto w-full select-none overflow-hidden isolate">
      {/* Top right organic wave background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full opacity-60"
        >
          <path
            d="M80 0C140 30 220 50 300 20V0H80Z"
            fill="#FDF2F0"
          />
          <path
            d="M120 0C180 60 250 120 300 160V0H120Z"
            fill="#FAD4C0"
            fillOpacity="0.35"
          />
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="w-full space-y-4 pt-1 relative z-10">
        {/* Brand Logo & LIVE EVENT */}
        <div className="flex flex-col items-center">
          <BrandLogo size="md" showSubtitle={true} />
        </div>

        {/* Celebratory Transition Mascot Foxes in Reddish-Orange */}
        <div className="relative w-full max-w-[290px] mx-auto py-1">
          <img
            src="/mascot-foxes-transition.png"
            alt="Celebrating Foxes in Reddish-Orange"
            className="w-full h-auto object-contain mx-auto drop-shadow-xs transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>

        {/* Editorial Headline */}
        <div className="space-y-2 px-2">
          <h1
            className="text-4xl md:text-5xl font-medium tracking-tight text-[#122B32] leading-[1.12]"
            style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
          >
            That's a little more<br />about you.
          </h1>

          <p className="text-sm md:text-base text-[#3A4D53] font-sans font-normal max-w-xs mx-auto leading-relaxed">
            Now comes the fun part. Go meet someone new.
          </p>
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-[#EAD0C3]/70 mx-auto my-1" />

        {/* "Your Human Bingo awaits!" Feature Card in Soft Peach/Cream */}
        <div className="p-5 rounded-3xl bg-[#FDF2F0] border border-[#F3BEB5]/60 text-left space-y-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-sm font-bold text-[#122B32]">
            <Sparkles className="w-4 h-4 text-[#D34E2A]" />
            <span>Your Human Bingo awaits!</span>
          </div>

          <div className="space-y-3 text-xs text-[#122B32]/90">
            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#FCEEE8] border border-[#F6DCD1] text-[#D34E2A] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Users className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <p className="leading-snug pt-0.5">
                Find someone whose name starts with the letter on your board.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#FCEEE8] border border-[#F6DCD1] text-[#D34E2A] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Camera className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <p className="leading-snug pt-0.5">
                Meet them, take a selfie together, and complete your Bingo.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#FCEEE8] border border-[#F6DCD1] text-[#D34E2A] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Trophy className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <p className="leading-snug pt-0.5">
                Complete a full line (or the whole board) to see your matches!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="w-full pt-6 pb-2 space-y-2 relative z-10">
        <button
          onClick={onStartBingo}
          className="w-full py-4 px-8 rounded-full bg-[#D34E2A] hover:bg-[#BA3F1E] text-white font-medium text-base shadow-[0_8px_20px_rgba(211,78,42,0.28)] hover:shadow-[0_10px_24px_rgba(211,78,42,0.36)] transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Start Human Bingo</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Bottom organic wave graphics in terracotta */}
      <div className="absolute bottom-0 inset-x-0 h-16 pointer-events-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 500 80"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M0 35C140 10 260 55 500 15V80H0V35Z"
            fill="#FAD4C0"
            fillOpacity="0.7"
          />
          <path
            d="M0 50C160 25 330 65 500 40V80H0V50Z"
            fill="#D34E2A"
          />
        </svg>
      </div>
    </div>
  );
};
