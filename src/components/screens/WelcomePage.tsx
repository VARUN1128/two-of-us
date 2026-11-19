import React, { useState } from 'react';
import { BrandLogo } from '../common/BrandLogo';
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
    <div className="relative min-h-[90vh] flex-1 flex flex-col justify-between items-center px-6 pt-4 pb-12 text-center max-w-md mx-auto w-full select-none overflow-hidden">
      {/* Top right organic wave background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none -z-10 overflow-hidden">
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

      {/* Main Hero Section */}
      <div className="w-full space-y-6 pt-2">
        {/* Brand Logo & Live Event Badge */}
        <div className="flex flex-col items-center">
          <BrandLogo size="md" showSubtitle={true} />
        </div>

        {/* Headline exactly matching reference design */}
        <div className="space-y-3 px-2">
          <h1
            className="text-4xl md:text-5xl font-medium tracking-tight text-[#0B3B3D] leading-[1.14]"
            style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
          >
            Better connections<br />
            start with a little<br />
            curiosity.
          </h1>

          <p className="text-sm md:text-base text-[#0B3B3D]/80 font-sans font-normal max-w-xs mx-auto leading-relaxed">
            Meet people. Discover stories. Find your people.
          </p>
        </div>

        {/* Arctic Foxes Illustration */}
        <div className="relative w-full max-w-[280px] mx-auto py-1">
          <img
            src="/mascot-foxes-clean.png"
            alt="Two of Us Arctic Foxes Mascot"
            className="w-full h-auto object-contain mx-auto drop-shadow-xs transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>

        {/* 3-Column Feature Summary Grid with Vertical Dividers */}
        <div className="grid grid-cols-3 border-t border-[#A3C4CB]/30 pt-4 max-w-xs mx-auto text-center">
          {/* Col 1 */}
          <div className="flex flex-col items-center justify-start space-y-1 px-1">
            <div className="text-[#088F87] mb-0.5">
              <Users className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span className="text-xs font-semibold text-[#0B3B3D] leading-tight">
              9 Quirky<br />Questions
            </span>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col items-center justify-start space-y-1 px-1 border-x border-[#A3C4CB]/40">
            <div className="text-[#088F87] mb-0.5">
              <Grid3X3 className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span className="text-xs font-semibold text-[#0B3B3D] leading-tight">
              5×5 Human<br />Bingo
            </span>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col items-center justify-start space-y-1 px-1">
            <div className="text-[#088F87] mb-0.5">
              <Heart className="w-5 h-5 stroke-[1.75]" />
            </div>
            <span className="text-xs font-semibold text-[#0B3B3D] leading-tight">
              Real<br />Connections
            </span>
          </div>
        </div>
      </div>

      {/* Bottom CTA & Resume Action */}
      <div className="w-full pt-8 pb-4 space-y-3.5 z-10">
        {!showLogin ? (
          <>
            <button
              onClick={onStartRegistration}
              className="w-full py-4 px-8 rounded-full bg-[#088F87] hover:bg-[#06726B] text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Let's Get Started</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <div>
              <button
                onClick={() => setShowLogin(true)}
                className="text-xs font-normal text-[#0B3B3D] hover:text-[#088F87] transition-colors py-1 inline-block underline decoration-[#0B3B3D]/40 hover:decoration-[#088F87] underline-offset-4"
              >
                Already registered? Resume your game
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleResumeLogin} className="space-y-3 bg-[#F4F8F9] p-4 rounded-2xl border border-[#A3C4CB]/40 shadow-xs">
            <div className="text-left">
              <label className="text-xs font-semibold text-[#0B3B3D] block mb-1">
                Enter your registered mobile number:
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-[#088F87]" />
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={mobileInput}
                  onChange={(e) => setMobileInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white rounded-xl border border-[#A3C4CB] text-sm text-[#0B3B3D] placeholder-[#A3C4CB] focus:outline-none focus:border-[#088F87]"
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
                className="w-1/3 py-2.5 rounded-xl border border-[#A3C4CB] text-xs font-medium text-[#0B3B3D]"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#088F87] hover:bg-[#06726B] text-white text-xs font-semibold transition-all cursor-pointer"
              >
                {isSubmitting ? 'Resuming...' : 'Resume Game'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Bottom organic wave graphics matching reference */}
      <div className="absolute bottom-0 inset-x-0 h-14 pointer-events-none -z-10 overflow-hidden">
        <svg
          viewBox="0 0 500 80"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Pale blue layer */}
          <path
            d="M0 40C120 10 240 60 500 20V80H0V40Z"
            fill="#A3C4CB"
            fillOpacity="0.4"
          />
          {/* Deep Ink wave */}
          <path
            d="M0 55C150 25 320 65 500 45V80H0V55Z"
            fill="#0B3B3D"
          />
        </svg>
      </div>
    </div>
  );
};
