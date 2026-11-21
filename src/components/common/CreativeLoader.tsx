import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface CreativeLoaderProps {
  message?: string;
  subtitle?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PLAYFUL_MESSAGES = [
  "Pairing two curious souls...",
  "Foxes whispering secrets...",
  "Finding your kindred spirits in the room...",
  "Setting the stage for sparks...",
  "Brewing conversation starters...",
  "Aligning the constellations...",
];

export const CreativeLoader: React.FC<CreativeLoaderProps> = ({
  message,
  subtitle,
  fullScreen = false,
  size = 'md',
}) => {
  const [messageIndex, setMessageIndex] = useState(0);

  // If no static message is provided, cycle through playful Two of Us lines
  useEffect(() => {
    if (message) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % PLAYFUL_MESSAGES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [message]);

  const activeMessage = message || PLAYFUL_MESSAGES[messageIndex];

  const logoSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const containerPadding = fullScreen ? 'min-h-screen px-6 py-12' : 'py-10 px-4';

  return (
    <div
      className={`flex flex-col items-center justify-center text-center font-sans ${containerPadding} ${
        fullScreen ? 'fixed inset-0 z-50 bg-[#FDF8F4]/95 backdrop-blur-md animate-in fade-in duration-300' : 'w-full'
      }`}
    >
      {/* Animated Fox Heart Illustration with Radar Rings */}
      <div className="relative flex items-center justify-center mb-6">
        {/* Outer Pulsing Wave Ring 1 */}
        <div className="absolute w-28 h-28 rounded-full bg-[#E05A47]/10 animate-ping duration-1000" />
        
        {/* Soft Breathing Halo Ring 2 */}
        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-[#E05A47]/20 via-[#F3BEB5]/30 to-[#A3C4CB]/20 animate-pulse duration-700" />

        {/* Floating Heart Accent Top Right */}
        <div className="absolute -top-2 -right-2 text-[#E05A47] animate-bounce duration-500">
          <Heart className="w-5 h-5 fill-[#E05A47] drop-shadow-xs" />
        </div>

        {/* Floating Sparkle Accent Bottom Left */}
        <div className="absolute -bottom-1 -left-2 text-amber-500 animate-pulse duration-700">
          <Sparkles className="w-4 h-4" />
        </div>

        {/* Fox Heart Logo Icon */}
        <div className="relative z-10 w-20 h-20 rounded-full bg-white shadow-lg border-2 border-[#E05A47]/20 flex items-center justify-center p-3 transition-transform hover:scale-105">
          <img
            src="/brand-fox-heart-logo.png"
            alt="Two of Us"
            className={`${logoSizes[size]} object-contain animate-pulse`}
          />
        </div>
      </div>

      {/* Brand Title */}
      <h3
        className="font-serif text-2xl sm:text-3xl font-medium text-[#0B3B3D] tracking-tight leading-tight mb-1"
        style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
      >
        Two of Us
      </h3>

      {/* Dynamic Animated Status Text */}
      <div className="h-6 flex items-center justify-center">
        <p className="text-sm font-semibold text-[#D34E2A] transition-all duration-300 animate-in fade-in flex items-center gap-1.5">
          <span>{activeMessage}</span>
        </p>
      </div>

      {/* Subtitle / Context Note */}
      {subtitle ? (
        <p className="text-xs text-[#0B3B3D]/70 max-w-xs mt-1 leading-relaxed">
          {subtitle}
        </p>
      ) : (
        <p className="text-xs text-[#0B3B3D]/60 max-w-xs mt-1">
          Two people. One spark. Endless possibilities.
        </p>
      )}

      {/* Dancing Dots Progress Indicator */}
      <div className="flex items-center gap-1.5 mt-5">
        <div className="w-2 h-2 rounded-full bg-[#E05A47] animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-[#E05A47] animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-[#E05A47] animate-bounce" />
      </div>
    </div>
  );
};
