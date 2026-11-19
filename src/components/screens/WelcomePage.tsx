import React, { useState } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { Sparkles, ArrowRight, Phone, Heart } from 'lucide-react';
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
    <div className="flex-1 flex flex-col justify-between items-center px-6 py-8 md:py-14 text-center max-w-md mx-auto w-full animate-in fade-in duration-300">
      {/* Top Brand Logo */}
      <div className="pt-2">
        <BrandLogo size="hero" showSubtitle={true} />
      </div>

      {/* Main Editorial Hero */}
      <div className="my-auto py-8 space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E6F6F5] border border-[#088F87]/20 text-[#088F87] text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-[#088F87]" />
          <span>Live Social Experience</span>
        </div>

        <h1 
          className="text-4xl md:text-5xl font-medium tracking-tight text-[#0B3B3D] leading-[1.12]"
          style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
        >
          Better connections start with a little curiosity.
        </h1>

        <p className="text-base md:text-lg text-[#0B3B3D]/80 font-sans font-normal max-w-xs mx-auto leading-relaxed">
          Meet people. Discover stories. Find your people.
        </p>

        {/* Playful mini badge */}
        <div className="flex items-center justify-center gap-4 text-xs font-medium text-[#088F87]">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 fill-[#088F87]" /> 9 Quirky Questions
          </span>
          <span className="text-[#A3C4CB]">•</span>
          <span>5×5 Human Bingo</span>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="w-full space-y-4 pb-4">
        {!showLogin ? (
          <>
            <button
              onClick={onStartRegistration}
              className="w-full py-4 px-6 rounded-2xl bg-[#088F87] hover:bg-[#06726B] text-white font-medium text-base shadow-md hover:shadow-lg transition-all duration-200 active:scale-98 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Let's Get Started</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => setShowLogin(true)}
              className="text-xs text-[#0B3B3D]/70 hover:text-[#088F87] transition-colors py-2 block mx-auto underline decoration-[#A3C4CB] underline-offset-4"
            >
              Already registered? Resume your game
            </button>
          </>
        ) : (
          <form onSubmit={handleResumeLogin} className="space-y-3 bg-[#F4F8F9] p-4 rounded-2xl border border-[#A3C4CB]/40">
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
                className="flex-1 py-2.5 rounded-xl bg-[#088F87] hover:bg-[#06726B] text-white text-xs font-semibold transition-all"
              >
                {isSubmitting ? 'Resuming...' : 'Resume Game'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
