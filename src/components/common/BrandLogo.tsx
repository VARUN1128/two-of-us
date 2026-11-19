import React from 'react';

interface BrandLogoProps {
  variant?: 'dark' | 'light' | 'teal';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showSubtitle = false,
  className = '',
}) => {
  const isLight = variant === 'light';

  const markSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    hero: 'w-16 h-16 md:w-20 md:h-20',
  };

  const textSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    hero: 'text-4xl md:text-5xl',
  };

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {/* Arctic Fox Heart Mark */}
      <div className={`relative flex items-center justify-center shrink-0 ${markSizes[size]} mb-1.5 transition-transform duration-300 hover:scale-105`}>
        <img
          src="/brand-heart-clean.png"
          alt="Two of Us Logo Mark"
          className="w-full h-full object-contain drop-shadow-xs"
        />
      </div>

      {/* Didone Serif Wordmark */}
      <div className="flex flex-col items-center text-center">
        <span
          className={`font-serif font-normal tracking-tight leading-none ${textSizes[size]} ${
            isLight ? 'text-white' : 'text-[#0B3B3D]'
          }`}
          style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
        >
          Two of Us
        </span>
        {showSubtitle && (
          <span
            className={`text-[11px] tracking-[0.28em] uppercase font-sans mt-1.5 font-semibold ${
              isLight ? 'text-[#A3C4CB]' : 'text-[#088F87]'
            }`}
          >
            LIVE EVENT
          </span>
        )}
      </div>
    </div>
  );
};
