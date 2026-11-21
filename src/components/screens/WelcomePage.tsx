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
    <div className="relative h-[100dvh] max-h-[100dvh] w-full select-none overflow-hidden bg-[#FDF8F4] flex flex-col justify-between">
      {/* Top-right organic wave background decoration */}
      <div className="fixed top-0 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 pointer-events-none z-0 overflow-hidden">
        <svg
          viewBox="0 0 300 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M50 0C130 35 210 55 300 18V0H50Z"
            fill="#FBE0D3"
            fillOpacity="0.75"
          />
          <path
            d="M90 0C150 60 220 110 300 145V0H90Z"
            fill="#F6B89D"
            fillOpacity="0.55"
          />
          <path
            d="M160 0C210 50 255 80 300 98V0H160Z"
            fill="#E87656"
            fillOpacity="0.35"
          />
        </svg>
      </div>

      {/* Bottom organic wave graphics */}
      <div className="fixed bottom-0 inset-x-0 h-12 sm:h-16 md:h-20 pointer-events-none z-0 overflow-hidden">
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
            fillOpacity="0.75"
          />
          <path
            d="M0 50C160 25 330 65 500 40V80H0V50Z"
            fill="#D34E2A"
          />
        </svg>
      </div>

      {/* ======================================================== */}
      {/* MOBILE LAYOUT (< md): Perfectly fits within 100dvh       */}
      {/* ======================================================== */}
      <div className="md:hidden relative z-10 w-full h-full max-w-sm mx-auto px-4 py-3 flex flex-col justify-between items-center text-center">
        {/* Top Brand Logo & Title */}
        <div className="flex flex-col items-center shrink-0">
          <div className="w-14 h-11 relative flex items-center justify-center mb-0.5">
            <img
              src="/top-foxes-heart-mark.png"
              alt="Two of Us Arctic Fox Heart Logo"
              className="w-full h-full object-contain drop-shadow-2xs"
            />
          </div>
          <h2
            className="text-2xl font-normal tracking-tight text-[#122B32] leading-none"
            style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
          >
            Two of Us
          </h2>
          <span className="text-[9px] tracking-[0.25em] uppercase font-sans mt-1 font-semibold text-[#D34E2A]">
            LIVE EVENT
          </span>
        </div>

        {/* Editorial Headline */}
        <div className="space-y-1 px-1 shrink-0">
          <h1
            className="text-2xl sm:text-[26px] font-medium tracking-tight text-[#122B32] leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
          >
            Better connections<br />
            start with a little curiosity.
          </h1>
          <p className="text-xs font-normal text-[#3A4D53] font-sans leading-snug">
            Meet people. Discover stories. Find your people.
          </p>
        </div>

        {/* Center Mascot: Red Foxes with Soft Cloud and Floating Heart */}
        <div className="relative w-full flex-1 flex items-center justify-center min-h-0 my-1 py-1">
          <img
            src="/mascot-red-foxes-clean.png"
            alt="Two of Us Reddish Foxes"
            className="max-h-[22vh] sm:max-h-[26vh] max-w-[280px] w-auto h-auto object-contain mx-auto"
          />
        </div>

        {/* 3-Column Feature Badges */}
        <div className="grid grid-cols-3 w-full max-w-xs mx-auto text-center shrink-0 py-1">
          <div className="flex flex-col items-center justify-start space-y-1 px-1">
            <div className="w-9 h-9 rounded-full bg-[#FCEEE8] border border-[#F6DCD1] flex items-center justify-center text-[#D34E2A] shadow-2xs">
              <Users className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-[10px] font-semibold text-[#122B32] leading-tight font-sans">
              9 Quirky<br />Questions
            </span>
          </div>

          <div className="flex flex-col items-center justify-start space-y-1 px-1 border-x border-[#EAD0C3]/70">
            <div className="w-9 h-9 rounded-full bg-[#FCEEE8] border border-[#F6DCD1] flex items-center justify-center text-[#D34E2A] shadow-2xs">
              <Grid3X3 className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-[10px] font-semibold text-[#122B32] leading-tight font-sans">
              5×5 Human<br />Bingo
            </span>
          </div>

          <div className="flex flex-col items-center justify-start space-y-1 px-1">
            <div className="w-9 h-9 rounded-full bg-[#FCEEE8] border border-[#F6DCD1] flex items-center justify-center text-[#D34E2A] shadow-2xs">
              <Heart className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-[10px] font-semibold text-[#122B32] leading-tight font-sans">
              Real<br />Connections
            </span>
          </div>
        </div>

        {/* Bottom CTA & Resume Action */}
        <div className="w-full shrink-0 pt-2 pb-1 space-y-2 max-w-xs mx-auto">
          {!showLogin ? (
            <>
              <button
                onClick={onStartRegistration}
                className="w-full py-3 px-6 rounded-full bg-[#D34E2A] hover:bg-[#BA3F1E] text-white font-medium text-sm shadow-[0_6px_18px_rgba(211,78,42,0.28)] hover:shadow-[0_8px_22px_rgba(211,78,42,0.36)] transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Let's Get Started</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div>
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-xs font-medium text-[#122B32] hover:text-[#D34E2A] transition-colors py-0.5 inline-block underline decoration-[#122B32]/60 hover:decoration-[#D34E2A] underline-offset-4 font-sans cursor-pointer"
                >
                  Already registered? Resume your game
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleResumeLogin} className="space-y-2 bg-white p-3 rounded-2xl border border-[#F6DCD1] shadow-xs text-left">
              <div>
                <label className="text-[11px] font-semibold text-[#122B32] block mb-1">
                  Registered mobile number:
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#D34E2A]" />
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 bg-[#FDF8F4] rounded-xl border border-[#EAD0C3] text-xs text-[#122B32] placeholder-[#A3C4CB] focus:outline-none focus:border-[#D34E2A]"
                    maxLength={13}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {loginError && (
                <p className="text-[11px] text-red-600">{loginError}</p>
              )}

              <div className="flex gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowLogin(false)}
                  className="w-1/3 py-1.5 rounded-xl border border-[#EAD0C3] text-xs font-medium text-[#122B32] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-1.5 rounded-xl bg-[#D34E2A] hover:bg-[#BA3F1E] text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  {isSubmitting ? 'Resuming...' : 'Resume Game'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* DESKTOP LAYOUT (md: and above): Spacious 2-Column Hero  */}
      {/* ======================================================== */}
      <div className="hidden md:flex relative z-10 w-full h-full max-w-5xl mx-auto px-8 py-6 items-center">
        <div className="grid grid-cols-2 gap-10 items-center w-full">
          {/* Left Column: Brand, Editorial Copy, Badges, CTA */}
          <div className="text-left space-y-5">
            {/* Top Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-11 relative flex items-center justify-center">
                <img
                  src="/top-foxes-heart-mark.png"
                  alt="Two of Us Arctic Fox Heart Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2
                  className="text-3xl font-medium tracking-tight text-[#122B32] leading-none"
                  style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
                >
                  Two of Us
                </h2>
                <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold text-[#D34E2A]">
                  LIVE EVENT
                </span>
              </div>
            </div>

            {/* Editorial Headline */}
            <div className="space-y-2">
              <h1
                className="text-4xl lg:text-5xl font-medium tracking-tight text-[#122B32] leading-[1.12]"
                style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
              >
                Better connections<br />
                start with a little<br />
                curiosity.
              </h1>
              <p className="text-base text-[#3A4D53] font-sans leading-relaxed">
                Meet people. Discover stories. Find your people.
              </p>
            </div>

            {/* 3 Feature Highlights in clean row */}
            <div className="grid grid-cols-3 gap-3 py-2 border-y border-[#EAD0C3]/60 max-w-md">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#FCEEE8] border border-[#F6DCD1] flex items-center justify-center text-[#D34E2A] shrink-0">
                  <Users className="w-4 h-4 stroke-[2]" />
                </div>
                <span className="text-xs font-semibold text-[#122B32] leading-tight font-sans">
                  9 Quirky<br />Questions
                </span>
              </div>

              <div className="flex items-center gap-2.5 border-l border-[#EAD0C3]/60 pl-3">
                <div className="w-10 h-10 rounded-full bg-[#FCEEE8] border border-[#F6DCD1] flex items-center justify-center text-[#D34E2A] shrink-0">
                  <Grid3X3 className="w-4 h-4 stroke-[2]" />
                </div>
                <span className="text-xs font-semibold text-[#122B32] leading-tight font-sans">
                  5×5 Human<br />Bingo
                </span>
              </div>

              <div className="flex items-center gap-2.5 border-l border-[#EAD0C3]/60 pl-3">
                <div className="w-10 h-10 rounded-full bg-[#FCEEE8] border border-[#F6DCD1] flex items-center justify-center text-[#D34E2A] shrink-0">
                  <Heart className="w-4 h-4 stroke-[2]" />
                </div>
                <span className="text-xs font-semibold text-[#122B32] leading-tight font-sans">
                  Real<br />Connections
                </span>
              </div>
            </div>

            {/* Desktop Action & Resume */}
            <div className="space-y-3 pt-1 max-w-sm">
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
                      className="text-xs font-medium text-[#122B32] hover:text-[#D34E2A] transition-colors inline-block underline decoration-[#122B32]/60 hover:decoration-[#D34E2A] underline-offset-4 font-sans cursor-pointer"
                    >
                      Already registered? Resume your game
                    </button>
                  </div>
                </>
              ) : (
                <form onSubmit={handleResumeLogin} className="space-y-3 bg-white p-4 rounded-2xl border border-[#F6DCD1] shadow-sm">
                  <div>
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
                        className="w-full pl-9 pr-3 py-2 bg-[#FDF8F4] rounded-xl border border-[#EAD0C3] text-sm text-[#122B32] placeholder-[#A3C4CB] focus:outline-none focus:border-[#D34E2A]"
                        maxLength={13}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {loginError && (
                    <p className="text-xs text-red-600">{loginError}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowLogin(false)}
                      className="w-1/3 py-2 rounded-xl border border-[#EAD0C3] text-xs font-medium text-[#122B32] cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2 rounded-xl bg-[#D34E2A] hover:bg-[#BA3F1E] text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      {isSubmitting ? 'Resuming...' : 'Resume Game'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Large Fox Mascot Illustration */}
          <div className="flex items-center justify-center p-4">
            <div className="relative w-full max-w-md">
              <img
                src="/mascot-red-foxes-clean.png"
                alt="Two of Us Reddish Foxes"
                className="w-full h-auto object-contain mx-auto drop-shadow-md transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
