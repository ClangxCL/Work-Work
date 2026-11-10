import React from 'react';
import { LucideIcon } from 'lucide-react';

export type KPICardVariant = 'neutral' | 'peach' | 'floating' | 'white' | 'navy' | 'gradient-blue';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  icon?: LucideIcon;
  variant?: KPICardVariant;
  trend?: {
    value: string;
    isUp?: boolean;
    label?: string;
  };
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  badge,
  icon: Icon,
  variant = 'neutral',
  trend
}) => {
  // 1) Accent Peach Card: Max 1 per tab/page
  // Background #fbe1d1, text & numbers #5d2a1a, radius 24px, no shadow, no border
  if (variant === 'peach' || variant === 'navy' || variant === 'gradient-blue') {
    return (
      <div className="bg-[#fbe1d1] text-[#5d2a1a] p-6 rounded-[24px] border-0 shadow-none flex flex-col justify-between min-h-[168px] transition-all">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#5d2a1a] font-medium">{title}</span>
            {Icon && (
              <div className="w-8 h-8 rounded-full bg-[#5d2a1a]/10 flex items-center justify-center text-[#5d2a1a] shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
          </div>
          <div className="font-serif font-normal text-stat text-[#5d2a1a] tabular-nums leading-[1.1] my-2">
            {value}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#5d2a1a]/20 text-xs text-[#5d2a1a] leading-[1.6]">
          <span className="truncate mr-2 font-normal">{subtitle}</span>
          {badge && (
            <span className="px-3 py-1 rounded-full border border-[#5d2a1a]/30 text-xs whitespace-nowrap font-medium shrink-0">
              {badge}
            </span>
          )}
          {trend && (
            <span className="text-xs tabular-nums font-medium shrink-0">
              {trend.isUp ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      </div>
    );
  }

  // 2) Floating Product Artifact Card: Elevated white card with soft 10% shadow and 20px radius
  if (variant === 'floating') {
    return (
      <div className="bg-white p-6 rounded-[20px] shadow-[0_0_0_1px_rgba(4,23,43,0.05),0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] flex flex-col justify-between min-h-[168px] transition-all">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b6f7a] font-medium">{title}</span>
            {Icon && (
              <div className="w-8 h-8 rounded-full bg-[#f2f2f3] flex items-center justify-center text-[#17191c] shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
          </div>
          <div className="font-serif font-normal text-stat text-[#17191c] tabular-nums leading-[1.1] my-2">
            {value}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#ececec] text-xs leading-[1.6]">
          <span className="text-[#5f6370] truncate mr-2 font-normal">{subtitle}</span>
          {badge && (
            <span className="px-3 py-1 rounded-full bg-[#f2f2f3] text-[#5f6370] border border-[#ececec] text-xs whitespace-nowrap font-medium shrink-0">
              {badge}
            </span>
          )}
        </div>
      </div>
    );
  }

  // 3) Standard Neutral Card: #f2f2f3, radius 24px, NO SHADOW, NO BORDER
  return (
    <div className="bg-[#f2f2f3] p-6 rounded-[24px] border-0 shadow-none flex flex-col justify-between min-h-[168px] transition-all">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#6b6f7a] font-medium">{title}</span>
          {Icon && (
            <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-[#17191c] shrink-0">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="font-serif font-normal text-stat text-[#17191c] tabular-nums leading-[1.1] my-2">
          {value}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#ececec] text-xs leading-[1.6]">
        <span className="text-[#5f6370] truncate mr-2 font-normal">{subtitle}</span>
        {badge && (
          <span className="px-3 py-1 rounded-full bg-white text-[#5f6370] border border-[#ececec] text-xs whitespace-nowrap font-medium shrink-0">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
