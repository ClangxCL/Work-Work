import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'emerald' | 'blue' | 'amber' | 'rose' | 'slate';
  icon?: LucideIcon;
  variant?: 'navy' | 'emerald' | 'blue' | 'amber' | 'white';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  badge,
  badgeColor = 'blue',
  icon: Icon,
  variant = 'white'
}) => {
  const badgeClasses = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  }[badgeColor];

  if (variant === 'navy') {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-md flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">{title}</span>
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-blue-400">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="text-3xl font-bold tracking-tight text-white mb-1">{value}</div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/60 text-xs">
          <span className="text-slate-400">{subtitle}</span>
          {badge && <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold">{badge}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow transition-shadow flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-1">{value}</div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-500 truncate mr-2">{subtitle}</span>
        {badge && (
          <span className={`px-2 py-0.5 rounded-full border text-[11px] font-medium whitespace-nowrap ${badgeClasses}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
