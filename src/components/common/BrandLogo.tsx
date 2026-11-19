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
    sm: 'w-7 h-6',
    md: 'w-9 h-8',
    lg: 'w-12 h-10',
    hero: 'w-16 h-14 md:w-20 md:h-18',
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    hero: 'text-4xl md:text-5xl',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Arctic Fox Heart Silhouette Visual Mark */}
      <div className={`relative flex items-center justify-center shrink-0 ${markSizes[size]}`}>
        <svg
          viewBox="0 0 100 88"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform duration-300 hover:scale-105"
        >
          {/* Stylized paired arctic foxes forming heart silhouette */}
          <path
            d="M50 82C48 80 14 55 14 30C14 17 23 8 36 8C43 8 47 12 50 16C53 12 57 8 64 8C77 8 86 17 86 30C86 55 52 80 50 82Z"
            fill={isLight ? '#FFFFFF' : '#088F87'}
            opacity={isLight ? '0.95' : '1'}
          />
          {/* Subtle inner fox body curve details */}
          <path
            d="M36 12C26 12 18 19 18 30C18 48 42 68 50 75C58 68 82 48 82 30C82 19 74 12 64 12C58 12 53 15 50 20C47 15 42 12 36 12Z"
            fill={isLight ? '#0B3B3D' : '#A3C4CB'}
            opacity="0.35"
          />
          {/* Fox nose & ear accent points */}
          <circle cx="37" cy="27" r="2.2" fill={isLight ? '#0B3B3D' : '#0B3B3D'} />
          <circle cx="63" cy="27" r="2.2" fill={isLight ? '#0B3B3D' : '#0B3B3D'} />
          {/* Center heart union */}
          <path
            d="M50 26C47 21 41 21 41 27C41 33 50 40 50 40C50 40 59 33 59 27C59 21 53 21 50 26Z"
            fill={isLight ? '#FFFFFF' : '#FFFFFF'}
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Didone Serif Wordmark */}
      <div className="flex flex-col text-left">
        <span
          className={`font-serif font-medium tracking-tight leading-none ${textSizes[size]} ${
            isLight ? 'text-white' : 'text-[#0B3B3D]'
          }`}
          style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }}
        >
          Two of Us
        </span>
        {showSubtitle && (
          <span
            className={`text-[10px] tracking-widest uppercase font-sans mt-0.5 font-medium ${
              isLight ? 'text-[#A3C4CB]' : 'text-[#088F87]'
            }`}
          >
            Live Event
          </span>
        )}
      </div>
    </div>
  );
};
