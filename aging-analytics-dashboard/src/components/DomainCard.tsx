import React, { useState, useEffect } from 'react';
import { type LucideIcon } from 'lucide-react';

export interface DomainCardProps {
  order?: string;
  name: string;
  slug?: string;
  icon: LucideIcon;
  riskPct: number;
  risk: number;
  screened?: number;
  maxRiskPct?: number; // default 14.9
  isSelected: boolean;
  onClick: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  cardRef?: (el: HTMLButtonElement | null) => void;
  className?: string;
}

export const DomainCard: React.FC<DomainCardProps> = ({
  name,
  icon: Icon,
  riskPct,
  risk,
  maxRiskPct = 14.9,
  isSelected,
  onClick,
  onKeyDown,
  cardRef,
  className = '',
}) => {
  const [animatedWidth, setAnimatedWidth] = useState<number>(0);

  // Clean domain name: remove leading index if present (e.g., "1. สายตา" -> "สายตา")
  const displayName = name.replace(/^\d+\.\s*/, '');

  // Calculate progress bar percentage relative to max domain risk (14.9% = 100%)
  const targetPct = Math.min(100, Math.max(0, (riskPct / maxRiskPct) * 100));

  useEffect(() => {
    // 600ms load animation for progress bar
    const timer = setTimeout(() => {
      setAnimatedWidth(targetPct);
    }, 60);
    return () => clearTimeout(timer);
  }, [targetPct]);

  return (
    <button
      type="button"
      ref={cardRef}
      role="radio"
      aria-checked={isSelected}
      tabIndex={isSelected ? 0 : -1}
      onClick={onClick}
      onKeyDown={onKeyDown}
      data-cursor="hover"
      className={`domain-card card-clickable ${isSelected ? 'is-selected' : ''} ${className}`}
    >
      {/* Icon: 36x36px circle with 20px icon */}
      <div className="domain-icon">
        <Icon className="w-5 h-5 stroke-[1.75]" />
      </div>

      {/* Percentage: serif font, end-aligned */}
      <span className="domain-pct">
        {riskPct}%
      </span>

      {/* Domain Name: 2 lines, no ellipsis */}
      <div className="domain-name">
        {displayName}
      </div>

      {/* Count: formatted with commas */}
      <div className="domain-count">
        {risk.toLocaleString('th-TH')} คน
      </div>

      {/* Mini 3px progress bar inside card */}
      <div className="domain-bar" aria-hidden="true">
        <div
          className="domain-bar-fill"
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
    </button>
  );
};
