import React, { useMemo } from 'react';
import type { ScreeningMetricKey } from './ThailandScreeningMap';
import type { ScreeningProvinceData } from '../types';
import './ranked-domain-list.css';

export interface RankedDomainListProps {
  selectedProvince: ScreeningProvinceData | null;
  activeMetric: ScreeningMetricKey;
  onSelectMetric: (metric: ScreeningMetricKey) => void;
  className?: string;
}

interface DomainDefinition {
  key: ScreeningMetricKey;
  name: string;
  shortLabel: string;
  nationalAvg: number;
  maxScale: number;
  icon3d: string;
}

export const DOMAIN_3D_ICONS: Record<ScreeningMetricKey, string> = {
  vision: '/images/icons3d/icon-eye.webp',
  oral: '/images/icons3d/icon-tooth.webp',
  movement: '/images/icons3d/icon-fall.webp',
  adl: '/images/icons3d/icon-adl.webp',
  hearing: '/images/icons3d/icon-ear.webp',
  cognition: '/images/icons3d/icon-memory.webp',
  urine: '/images/icons3d/icon-bladder.webp',
  nutrition: '/images/icons3d/icon-nutrition.webp',
  depression: '/images/icons3d/icon-mood.webp',
};

const DOMAIN_DEFINITIONS: DomainDefinition[] = [
  { key: 'vision', name: 'สายตาและการมองเห็น', shortLabel: 'สายตา', nationalAvg: 14.9, maxScale: 30, icon3d: DOMAIN_3D_ICONS.vision },
  { key: 'oral', name: 'สุขภาพช่องปาก/การเคี้ยว', shortLabel: 'ช่องปาก', nationalAvg: 11.9, maxScale: 25, icon3d: DOMAIN_3D_ICONS.oral },
  { key: 'movement', name: 'การเคลื่อนไหว/หกล้ม', shortLabel: 'หกล้ม', nationalAvg: 8.9, maxScale: 20, icon3d: DOMAIN_3D_ICONS.movement },
  { key: 'adl', name: 'ติดบ้าน/ติดเตียง (ADL)', shortLabel: 'ADL', nationalAvg: 6.2, maxScale: 15, icon3d: DOMAIN_3D_ICONS.adl },
  { key: 'hearing', name: 'การได้ยิน (หูตึง)', shortLabel: 'การได้ยิน', nationalAvg: 5.2, maxScale: 15, icon3d: DOMAIN_3D_ICONS.hearing },
  { key: 'cognition', name: 'ความคิดความจำ/สมองเสื่อม', shortLabel: 'ความจำ', nationalAvg: 5.1, maxScale: 15, icon3d: DOMAIN_3D_ICONS.cognition },
  { key: 'urine', name: 'การกลั้นปัสสาวะ', shortLabel: 'ปัสสาวะ', nationalAvg: 4.5, maxScale: 15, icon3d: DOMAIN_3D_ICONS.urine },
  { key: 'nutrition', name: 'ภาวะโภชนาการ/ผอมลีบ', shortLabel: 'โภชนาการ', nationalAvg: 4.1, maxScale: 15, icon3d: DOMAIN_3D_ICONS.nutrition },
  { key: 'depression', name: 'ภาวะซึมเศร้า (2Q)', shortLabel: 'ซึมเศร้า', nationalAvg: 1.4, maxScale: 10, icon3d: DOMAIN_3D_ICONS.depression },
];

// Ramp: --rank-1 (#5d2a1a) down to --rank-9 (#eed0be) with accessible contrast
export const RANK_RAMP: { rank: number; bg: string; text: string; aurora: string }[] = [
  { rank: 1, bg: '#5d2a1a', text: '#ffffff', aurora: 'rgba(93, 42, 26, 0.45)' },
  { rank: 2, bg: '#723420', text: '#ffffff', aurora: 'rgba(114, 52, 32, 0.42)' },
  { rank: 3, bg: '#883e26', text: '#ffffff', aurora: 'rgba(136, 62, 38, 0.40)' },
  { rank: 4, bg: '#9f4c30', text: '#ffffff', aurora: 'rgba(159, 76, 48, 0.36)' },
  { rank: 5, bg: '#b55f3e', text: '#ffffff', aurora: 'rgba(181, 95, 62, 0.32)' },
  { rank: 6, bg: '#c97752', text: '#ffffff', aurora: 'rgba(201, 119, 82, 0.28)' },
  { rank: 7, bg: '#d99472', text: '#5d2a1a', aurora: 'rgba(217, 148, 114, 0.25)' },
  { rank: 8, bg: '#e5b398', text: '#5d2a1a', aurora: 'rgba(229, 179, 152, 0.22)' },
  { rank: 9, bg: '#eed0be', text: '#5d2a1a', aurora: 'rgba(238, 208, 190, 0.20)' },
];

export function RankedDomainList({
  selectedProvince,
  activeMetric,
  onSelectMetric,
  className = '',
}: RankedDomainListProps) {
  // Sort domains by % risk prevalence descending (if equal, by risk cases count)
  const rankedCards = useMemo(() => {
    const rawList = DOMAIN_DEFINITIONS.map(def => {
      let riskPct = def.nationalAvg;
      let riskCount = 0;

      if (selectedProvince?.domains && selectedProvince.domains[def.key]) {
        const item = selectedProvince.domains[def.key];
        riskPct = Number(item.risk_pct) || 0;
        riskCount = Number(item.risk) || 0;
      }

      const diff = Number((riskPct - def.nationalAvg).toFixed(1));
      const isHigherThanAvg = diff > 0;
      const diffFormatted = diff > 0
        ? `+${diff.toFixed(1)}%`
        : diff < 0
          ? `−${Math.abs(diff).toFixed(1)}%`
          : '0.0%';
      const diffText = diff > 0
        ? `สูงกว่าค่าเฉลี่ยชาติ ${Math.abs(diff)}`
        : diff < 0
          ? `ต่ำกว่าค่าเฉลี่ยชาติ ${Math.abs(diff)}`
          : 'เท่ากับค่าเฉลี่ยชาติ';

      return {
        key: def.key,
        name: def.name,
        shortLabel: def.shortLabel,
        icon3d: def.icon3d,
        riskPct,
        riskCount,
        nationalAvg: def.nationalAvg,
        diff,
        diffFormatted,
        diffText,
        isHigherThanAvg,
        maxScale: def.maxScale,
      };
    });

    // Sort descending by riskPct, then by riskCount
    rawList.sort((a, b) => {
      if (b.riskPct !== a.riskPct) {
        return b.riskPct - a.riskPct;
      }
      return b.riskCount - a.riskCount;
    });

    return rawList.map((item, idx) => ({
      ...item,
      rank: idx + 1,
      ramp: RANK_RAMP[idx] || RANK_RAMP[RANK_RAMP.length - 1],
    }));
  }, [selectedProvince]);

  const provinceLabel = selectedProvince ? `จ.${selectedProvince.province}` : 'ภาพรวมประเทศ';
  const animationScopeKey = selectedProvince?.province || 'national';

  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Header bar: Title on left, National avg link on right */}
      <div className="flex items-center justify-between text-sm font-medium text-[#17191c] pt-2 border-t border-[#ececec]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate">ความชุก 9 มิติ ({provinceLabel})</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-[#ececec] text-[#5d2a1a] font-normal tabular-nums shrink-0">
            Rank 1 – 9
          </span>
        </div>
        <span className="text-xs text-[#5f6370] shrink-0 font-normal">
          เทียบค่าเฉลี่ยประเทศ
        </span>
      </div>

      {/* Container Query Wrapper */}
      <div className="ranked-domains-container">
        <ol className="ranked-domains-grid" aria-label="ความชุกของภาวะเสี่ยง 9 มิติ เรียงตามอันดับ">
          {rankedCards.map((card) => {
            const isSelected = card.key === activeMetric;

            return (
              <li
                key={`${animationScopeKey}-${card.key}-${card.rank}`}
                className={`ranked-item ranked-item--rank-${card.rank}`}
              >
                <button
                  type="button"
                  onClick={() => onSelectMetric(card.key)}
                  aria-label={`อันดับ ${card.rank} ${card.name} ${card.riskPct} เปอร์เซ็นต์ ${card.diffText}`}
                  aria-pressed={isSelected}
                  data-cursor="hover"
                  className={`rank-card card-clickable ${isSelected ? 'is-active' : ''} ${card.rank === 1 ? 'is-rank-1' : ''}`}
                  style={{
                    '--aurora': card.ramp.aurora,
                    '--rank-bg': card.ramp.bg,
                    '--rank-color': card.ramp.text,
                    animationDelay: `${(card.rank - 1) * 30}ms`,
                  } as React.CSSProperties}
                >
                  {/* Aurora Light Glow Layer behind 3D icon */}
                  <div className="rank-card__aurora" aria-hidden="true" />

                  {/* Card Content Row */}
                  <div className="rank-card__content">
                    {/* 1. Rank Badge */}
                    <div
                      className="rank-badge font-serif"
                      style={{ backgroundColor: card.ramp.bg, color: card.ramp.text }}
                    >
                      <span className="tabular-nums">{card.rank}</span>
                    </div>

                    {/* 2. 3D Icon with float-on-hover effect */}
                    <div className="rank-icon-wrapper">
                      <img
                        src={card.icon3d}
                        alt=""
                        decoding="async"
                        loading="lazy"
                        className="rank-icon-3d"
                      />
                    </div>

                    {/* 3. Middle: Domain Title + Risk Cases Count */}
                    <div className="rank-info">
                      <h4 className="rank-title">
                        {card.name}
                      </h4>
                      <div className="rank-count">
                        <strong className="font-medium text-[#17191c] tabular-nums">
                          {card.riskCount > 0 ? `${card.riskCount.toLocaleString()} คน` : '-'}
                        </strong>
                      </div>
                    </div>

                    {/* 4. Right: Prevalence % + Diff Pill */}
                    <div className="rank-stats">
                      <div className="flex items-baseline gap-1">
                        <span className="rank-pct-val font-serif font-normal tabular-nums">
                          {card.riskPct}%
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`diff-pill tabular-nums ${
                            card.isHigherThanAvg ? 'is-higher' : 'is-lower'
                          }`}
                        >
                          <span>{card.diffFormatted}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 5. Bottom Thin Comparison Bar (Only for Rank 1) */}
                  {card.rank === 1 && (
                    <div className="rank-bar-track" aria-hidden="true">
                      <div
                        className="rank-bar-fill"
                        style={{
                          width: `${Math.min(100, Math.max(3, (card.riskPct / card.maxScale) * 100))}%`,
                          backgroundColor: card.ramp.bg,
                        }}
                      />
                      <div
                        className="rank-bar-marker"
                        style={{
                          left: `${Math.min(98, Math.max(2, (card.nationalAvg / card.maxScale) * 100))}%`,
                        }}
                        title={`ค่าเฉลี่ยชาติ: ${card.nationalAvg}%`}
                      />
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default RankedDomainList;
