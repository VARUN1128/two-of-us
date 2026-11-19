import React from 'react';

interface BrandLogoProps {
  variant?: 'dark' | 'light' | 'teal' | 'orange';
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
    sm: 'w-8 h-8',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    hero: 'w-24 h-24 md:w-28 md:h-28',
  };

  const textSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    hero: 'text-4xl md:text-5xl',
  };

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      {/* Official Arctic Fox Heart Logo Mark */}
      <div className={`relative flex items-center justify-center shrink-0 ${markSizes[size]} mb-2 transition-transform duration-300 hover:scale-105`}>
        <img
          src="/brand-fox-heart-logo.png"
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
            className={`text-[11px] tracking-[0.28em] uppercase font-sans mt-2 font-semibold ${
              isLight ? 'text-[#F3BEB5]' : 'text-[#E05A47]'
            }`}
          >
            LIVE EVENT
          </span>
        )}
      </div>
    </div>
  );
};
