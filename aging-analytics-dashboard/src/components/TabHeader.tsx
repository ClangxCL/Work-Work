import React, { useState, useMemo } from 'react';
import { formatThaiText } from '../utils/thaiTypography';

export interface TabHeaderProps {
  badge?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  illustrationSrc: string;
  illustrationAlt?: string;
  className?: string;
  children?: React.ReactNode;
}

export const TabHeader: React.FC<TabHeaderProps> = ({
  badge,
  title,
  subtitle,
  illustrationSrc,
  illustrationAlt = '',
  className = '',
  children,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const formattedTitle = useMemo(() => {
    return typeof title === 'string' ? formatThaiText(title) : title;
  }, [title]);

  const formattedSubtitle = useMemo(() => {
    return typeof subtitle === 'string' ? formatThaiText(subtitle) : subtitle;
  }, [subtitle]);

  return (
    <div className={`tab-hero hero flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8 mb-8 w-full min-w-0 ${className}`}>
      {/* Left Column: Category Badge + H1 + Subtitle (max-width: min(62%, 860px) on desktop, full width on <=1024px) */}
      <div className="tab-hero__text flex-1 min-w-0 w-full lg:max-w-[min(62%,860px)]">
        {badge && (
          <span className="text-xs text-[#6b6f7a] uppercase block font-medium mb-1.5 tracking-wider">
            {badge}
          </span>
        )}
        <h1
          className="font-serif font-normal text-[#17191c] leading-[1.25]"
          style={{ fontSize: 'clamp(1.75rem, 1.2rem + 1.8vw, 2.75rem)' }}
        >
          {formattedTitle}
        </h1>
        {subtitle && (
          <p className="text-[1rem] text-[#5f6370] leading-relaxed mt-2">
            {formattedSubtitle}
          </p>
        )}
        {children}
      </div>

      {/* Right Column: Illustration (flex: none; align-items: center) */}
      <div className="tab-illustration-wrapper">
        <div className="relative aspect-[3/2] flex items-center justify-center">
          {/* Skeleton placeholder shown while loading to avoid layout shift */}
          {!isLoaded && (
            <div
              className="tab-illustration-skeleton aspect-[3/2] rounded-2xl bg-[#f2f2f3] animate-pulse"
              aria-hidden="true"
            />
          )}
          <img
            src={illustrationSrc}
            alt={illustrationAlt}
            aria-hidden="true"
            loading="eager"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            className={`tab-illustration-img select-none pointer-events-none transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
