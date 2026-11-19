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
            fill="#EBF2F4"
          />
          <path
            d="M120 0C180 60 250 120 300 160V0H120Z"
            fill="#A3C4CB"
            fillOpacity="0.25"
          />
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="w-full space-y-4 pt-1 relative z-10">
        {/* Brand Logo & LIVE EVENT */}
        <div className="flex flex-col items-center">
          <BrandLogo size="md" showSubtitle={true} />
        </div>

        {/* Celebratory Transition Mascot Foxes */}
        <div className="relative w-full max-w-[290px] mx-auto py-1">
          <img
            src="/mascot-foxes-transition.png"
            alt="Celebrating Foxes"
            className="w-full h-auto object-contain mx-auto drop-shadow-xs transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>

        {/* Editorial Headline */}
        <div className="space-y-2 px-2">
          <h1
            className="text-4xl md:text-5xl font-medium tracking-tight text-[#0B3B3D] leading-[1.12]"
            style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
          >
            That's a little more<br />about you.
          </h1>

          <p className="text-sm md:text-base text-[#0B3B3D]/80 font-sans font-normal max-w-xs mx-auto leading-relaxed">
            Now comes the fun part. Go meet someone new.
          </p>
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-[#A3C4CB]/60 mx-auto my-1" />

        {/* "Your Human Bingo awaits!" Feature Card */}
        <div className="p-5 rounded-3xl bg-[#EBF4F5] border border-[#A3C4CB]/40 text-left space-y-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0B3B3D]">
            <Sparkles className="w-4 h-4 text-[#E05A47]" />
            <span>Your Human Bingo awaits!</span>
          </div>

          <div className="space-y-3 text-xs text-[#0B3B3D]/85">
            {/* Step 1 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#A3C4CB]/30 text-[#E05A47] flex items-center justify-center shrink-0 mt-0.5">
                <Users className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <p className="leading-snug pt-0.5">
                Find someone whose name starts with the letter on your board.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#A3C4CB]/30 text-[#E05A47] flex items-center justify-center shrink-0 mt-0.5">
                <Camera className="w-3.5 h-3.5 stroke-[2]" />
              </div>
              <p className="leading-snug pt-0.5">
                Meet them, take a selfie together, and complete your Bingo.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#A3C4CB]/30 text-[#E05A47] flex items-center justify-center shrink-0 mt-0.5">
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
          className="w-full py-4 px-8 rounded-full bg-[#E05A47] hover:bg-[#C44633] text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Start Human Bingo</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Bottom organic wave graphics */}
      <div className="absolute bottom-0 inset-x-0 h-16 pointer-events-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 500 80"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M0 40C120 10 240 60 500 20V80H0V40Z"
            fill="#A3C4CB"
            fillOpacity="0.4"
          />
          <path
            d="M0 55C150 25 320 65 500 45V80H0V55Z"
            fill="#0B3B3D"
          />
        </svg>
      </div>
    </div>
  );
};
