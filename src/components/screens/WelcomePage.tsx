import React, { useState } from 'react';
import { ArrowRight, Phone, Users, Grid3X3, Heart } from 'lucide-react';
import { AppDataStore } from '../../lib/store';
import type { Participant } from '../../types';

interface WelcomePageProps {
  onStartRegistration: () => void;
  onLoginSuccess: (participant: Participant) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onStartRegistration,
  onLoginSuccess,
}) => {
  const [showLogin, setShowLogin] = useState(false);
  const [mobileInput, setMobileInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResumeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmitting(true);

    try {
      const result = await AppDataStore.loginByMobile(mobileInput);
      if (result.success && result.participant) {
        onLoginSuccess(result.participant);
      } else {
        setLoginError(result.error || 'Failed to locate registration.');
      }
    } catch {
      setLoginError('An error occurred. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex-1 flex flex-col justify-between items-center px-5 pt-8 pb-10 text-center max-w-md mx-auto w-full select-none overflow-hidden bg-[#FDF8F4] isolate">
      {/* Top right organic wave background decoration */}
      <div className="absolute top-0 right-0 w-56 h-56 pointer-events-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 250 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Soft peach layer */}
          <path
            d="M50 0C110 30 180 45 250 15V0H50Z"
            fill="#FBE0D3"
            fillOpacity="0.7"
          />
          {/* Terracotta curve */}
          <path
            d="M80 0C130 50 190 90 250 120V0H80Z"
            fill="#F6B89D"
            fillOpacity="0.5"
          />
          <path
            d="M140 0C180 40 215 65 250 80V0H140Z"
            fill="#E87656"
            fillOpacity="0.3"
          />
        </svg>
      </div>

      {/* Main Content Flow */}
      <div className="w-full space-y-4 pt-4 relative z-10">
        {/* Top Logo: Pale Blue Arctic Fox Heart Mark */}
        <div className="flex flex-col items-center select-none">
          <div className="w-24 h-16 relative flex items-center justify-center mb-1 transition-transform duration-300 hover:scale-105">
            <img
              src="/top-foxes-heart-mark.png"
              alt="Two of Us Arctic Fox Heart Logo"
              className="w-full h-full object-contain drop-shadow-2xs"
            />
          </div>

          {/* Wordmark */}
          <h2
            className="text-4xl font-normal tracking-tight text-[#122B32] leading-none"
            style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
          >
            Two of Us
          </h2>

          {/* Tagline */}
          <span className="text-[11px] tracking-[0.3em] uppercase font-sans mt-2 font-semibold text-[#D34E2A]">
            LIVE EVENT
          </span>
        </div>

        {/* Editorial Headline */}
        <div className="space-y-2 px-1 pt-1">
          <h1
            className="text-4xl sm:text-[42px] font-medium tracking-tight text-[#122B32] leading-[1.15]"
            style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
          >
            Better connections<br />
            start with a little<br />
            curiosity.
          </h1>

          <p className="text-sm font-normal text-[#3A4D53] font-sans max-w-xs mx-auto leading-relaxed pt-0.5">
            Meet people. Discover stories. Find your people.
          </p>
        </div>

        {/* Center Mascot: Red Foxes with Soft Cloud and Floating Heart */}
        <div className="relative w-full max-w-[340px] mx-auto py-0">
          <img
            src="/mascot-red-foxes-clean.png"
            alt="Two of Us Reddish Foxes"
            className="w-full h-auto object-contain mx-auto transition-transform duration-500 hover:scale-[1.01]"
          />
        </div>

        {/* 3-Column Feature Badges with Soft Peach Circles and Dividers */}
        <div className="grid grid-cols-3 max-w-xs mx-auto text-center pt-1">
          {/* Col 1 */}
          <div className="flex flex-col items-center justify-start space-y-2 px-1">
            <div className="w-12 h-12 rounded-full bg-[#FCEEE8] border border-[#F6DCD1] flex items-center justify-center text-[#D34E2A] shadow-2xs">
              <Users className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-[#122B32] leading-tight font-sans">
              9 Quirky<br />Questions
            </span>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col items-center justify-start space-y-2 px-1 border-x border-[#EAD0C3]/70">
            <div className="w-12 h-12 rounded-full bg-[#FCEEE8] border border-[#F6DCD1] flex items-center justify-center text-[#D34E2A] shadow-2xs">
              <Grid3X3 className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-[#122B32] leading-tight font-sans">
              5×5 Human<br />Bingo
            </span>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col items-center justify-start space-y-2 px-1">
            <div className="w-12 h-12 rounded-full bg-[#FCEEE8] border border-[#F6DCD1] flex items-center justify-center text-[#D34E2A] shadow-2xs">
              <Heart className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-[#122B32] leading-tight font-sans">
              Real<br />Connections
            </span>
          </div>
        </div>
      </div>

      {/* Bottom CTA & Resume Action */}
      <div className="w-full pt-6 pb-2 space-y-3 relative z-10 max-w-xs mx-auto">
        {!showLogin ? (
          <>
            <button
              onClick={onStartRegistration}
              className="w-full py-4 px-8 rounded-full bg-[#D34E2A] hover:bg-[#BA3F1E] text-white font-medium text-base shadow-[0_8px_20px_rgba(211,78,42,0.28)] hover:shadow-[0_10px_24px_rgba(211,78,42,0.36)] transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Let's Get Started</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <div>
              <button
                onClick={() => setShowLogin(true)}
                className="text-xs font-medium text-[#122B32] hover:text-[#D34E2A] transition-colors py-1 inline-block underline decoration-[#122B32]/60 hover:decoration-[#D34E2A] underline-offset-4 font-sans"
              >
                Already registered? Resume your game
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleResumeLogin} className="space-y-3 bg-white p-4 rounded-2xl border border-[#F6DCD1] shadow-xs">
            <div className="text-left">
              <label className="text-xs font-semibold text-[#122B32] block mb-1">
                Enter your registered mobile number:
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-[#D34E2A]" />
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={mobileInput}
                  onChange={(e) => setMobileInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FDF8F4] rounded-xl border border-[#EAD0C3] text-sm text-[#122B32] placeholder-[#A3C4CB] focus:outline-none focus:border-[#D34E2A]"
                  maxLength={13}
                  required
                  autoFocus
                />
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-red-600 text-left">{loginError}</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="w-1/3 py-2.5 rounded-xl border border-[#EAD0C3] text-xs font-medium text-[#122B32]"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#D34E2A] hover:bg-[#BA3F1E] text-white text-xs font-semibold transition-all cursor-pointer"
              >
                {isSubmitting ? 'Resuming...' : 'Resume Game'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Bottom organic wave graphics in terracotta matching the reference image */}
      <div className="absolute bottom-0 inset-x-0 h-16 pointer-events-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 500 80"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Peach undertone layer */}
          <path
            d="M0 35C140 10 260 55 500 15V80H0V35Z"
            fill="#FAD4C0"
            fillOpacity="0.75"
          />
          {/* Main terracotta curve */}
          <path
            d="M0 50C160 25 330 65 500 40V80H0V50Z"
            fill="#D34E2A"
          />
        </svg>
      </div>
    </div>
  );
};
