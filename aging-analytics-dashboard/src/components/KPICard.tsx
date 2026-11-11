import React from 'react';

export type KPICardVariant = 'neutral' | 'peach' | 'floating' | 'white' | 'navy' | 'gradient-blue' | 'selected';

export interface KPICardProps {
  title: string;
  value?: string | number;
  unit?: string;
  subtitle?: string | React.ReactNode;
  badge?: string;
  badgeColor?: string;
  icon?: any;
  variant?: KPICardVariant;
  alwaysSpin?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  trend?: {
    value: string;
    isUp?: boolean;
    label?: string;
  };
  className?: string;
  customValueElement?: React.ReactNode;
}

/**
 * Helper to split a value string into numeric part and unit
 */
export function splitValueAndUnit(val?: string | number, explicitUnit?: string): { num: string; unit: string } {
  if (explicitUnit) {
    return { num: String(val ?? ''), unit: explicitUnit };
  }
  if (val === undefined || val === null) {
    return { num: '', unit: '' };
  }
  const str = String(val).trim();
  const match = str.match(/^([><~]?\s*[\d,]+(?:\.\d+)?)\s*(ล้านครั้ง|ครั้ง|ราย\/ปี|ราย|ล้านคน|คน|แห่ง|%)$/);
  if (match) {
    return { num: match[1].trim(), unit: match[2].trim() };
  }
  return { num: str, unit: '' };
}

/**
 * Helper to wrap numbers and units in a nowrap span so Thai typography
 * never cuts statistics mid-number (e.g. "585,267 คน")
 */
function formatSubtitle(text?: string | React.ReactNode): React.ReactNode {
  if (!text || typeof text !== 'string') return text;

  const match = text.match(/^(.*?)(\d[\d,.]*\s*(?:ล้านคน|คน|แห่ง|%|ราย|พันคน))(.*)$/);
  if (!match) {
    return <span className="text-wrap-pretty">{text}</span>;
  }

  const [, prefix, stat, suffix] = match;
  return (
    <span className="text-wrap-pretty">
      {prefix}
      <span className="nowrap font-medium tabular-nums">{stat}</span>
      {suffix}
    </span>
  );
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  subtitle,
  badge,
  icon: Icon,
  variant = 'neutral',
  alwaysSpin,
  isSelected,
  onClick,
  trend,
  className = '',
  customValueElement
}) => {
  // Rank 1 / Peach card is always spinning by default
  const isAlwaysSpin = alwaysSpin ?? (variant === 'peach' || isSelected);

  // Variant themes
  const isPeach = variant === 'peach' || variant === 'gradient-blue';
  const isDark = isSelected || variant === 'navy';

  // Card Inner Theme Colors
  let innerBg = 'bg-white';
  let titleColor = 'text-[#17191c]';
  let valueColor = 'text-[#17191c]';
  let dividerColor = 'border-[#ececec]';
  let subtitleColor = 'text-[#5f6370]';
  let iconCircleBg = 'bg-[#fbe1d1] text-[#5d2a1a]';
  let badgeClass = 'bg-[#f2f2f3] text-[#5f6370] border border-[#ececec]';
  let badgeDotClass = 'bg-[#5d2a1a]';

  if (isPeach) {
    innerBg = 'bg-[#fbe1d1]';
    titleColor = 'text-[#5d2a1a]';
    valueColor = 'text-[#5d2a1a]';
    dividerColor = 'border-[#5d2a1a]/15';
    subtitleColor = 'text-[#5d2a1a]';
    iconCircleBg = 'bg-white/70 text-[#5d2a1a]';
    badgeClass = 'bg-white/80 text-[#5d2a1a] border border-[#5d2a1a]/25';
    badgeDotClass = 'bg-[#5d2a1a]';
  } else if (isDark) {
    innerBg = 'bg-[#17191c]';
    titleColor = 'text-white';
    valueColor = 'text-[#fbe1d1]';
    dividerColor = 'border-white/15';
    subtitleColor = 'text-white/80';
    iconCircleBg = 'bg-[#fbe1d1] text-[#5d2a1a]';
    badgeClass = 'bg-white/10 text-white border border-white/20';
    badgeDotClass = 'bg-[#fbe1d1]';
  }

  const { num: numPart, unit: unitPart } = splitValueAndUnit(value, unit);
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      {...(onClick ? { type: 'button', onClick, role: 'button', tabIndex: 0, 'data-cursor': 'hover' } : { tabIndex: 0 })}
      className={`kpi-card ${onClick ? 'card-clickable' : ''} ${isAlwaysSpin ? 'is-always-spin' : ''} ${className}`}
    >
      <div className={`kpi-card__inner ${innerBg}`}>
        {/* Row 1: [label] Title Left + 44px Circle Icon Right (min-height for alignment) */}
        <div className="flex items-start justify-between gap-3 min-w-0" style={{ minHeight: 'calc(1.4rem * 2 + 4px)' }}>
          <span className={`text-base font-medium leading-[1.4] line-clamp-2 min-w-0 flex-1 text-wrap-pretty ${titleColor}`}>
            {title}
          </span>
          {Icon && (
            <div
              className={`w-11 h-11 min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center shrink-0 ${iconCircleBg}`}
              aria-hidden="true"
            >
              <Icon className="w-5 h-5 stroke-[1.75]" />
            </div>
          )}
        </div>

        {/* Row 2: [value] Main Number + Unit on same line, or custom visualization */}
        {customValueElement ? (
          <div className="w-full flex items-center min-w-0">
            {customValueElement}
          </div>
        ) : (
          <div className="flex items-baseline gap-2 flex-nowrap whitespace-nowrap min-w-0 overflow-hidden">
            <span
              className={`kpi-stat-value font-serif font-normal tabular-nums leading-none ${valueColor}`}
              style={{ fontSize: 'clamp(2rem, 1.2rem + 1.8vw, 3rem)' }}
            >
              {numPart}
            </span>
            {unitPart && (
              <span className={`kpi-stat-unit font-sans font-normal text-base leading-none shrink-0 ${isPeach ? 'text-[#5d2a1a]/80' : isDark ? 'text-white/70' : 'text-[#5f6370]'}`}>
                {unitPart}
              </span>
            )}
          </div>
        )}

        {/* Row 3: [desc] Thin separator line on top + subtitle text at top of area */}
        <div className={`w-full pt-2.5 border-t ${dividerColor} flex flex-col justify-start`}>
          {subtitle && (
            <div className={`text-[0.9375rem] leading-relaxed font-normal ${subtitleColor}`}>
              {formatSubtitle(subtitle)}
            </div>
          )}
        </div>

        {/* Row 4: [tag] Pill badge pinned to bottom of the card */}
        <div className="w-full flex items-center justify-between gap-2 self-end">
          {badge && (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.875rem] font-medium leading-tight whitespace-nowrap shrink-0 ${badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${badgeDotClass}`} aria-hidden="true" />
              <span>{badge}</span>
            </div>
          )}

          {trend && (
            <span className={`text-xs tabular-nums font-medium shrink-0 ${isPeach ? 'text-[#5d2a1a]' : isDark ? 'text-white/80' : 'text-[#5f6370]'}`}>
              {trend.isUp ? '↑' : '↓'} {trend.value} {trend.label || ''}
            </span>
          )}
        </div>
      </div>
    </Tag>
  );
};
