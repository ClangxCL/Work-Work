import React, { useState, useMemo, useRef, useEffect } from 'react';
import geoData from '../data/thailand_provinces.json';
import { ScreeningProvinceData } from '../types';
import { ZoomIn, ZoomOut, RotateCcw, AlertTriangle, MapPin } from 'lucide-react';
import { DOMAIN_META, DomainIcon } from '../constants/domainIcons';
import { getChoroplethColor } from '../theme/chartTheme';

export type ScreeningMetricKey =
  | 'vision'
  | 'oral'
  | 'movement'
  | 'adl'
  | 'hearing'
  | 'cognition'
  | 'urine'
  | 'nutrition'
  | 'depression';

export const METRIC_KEYS: ScreeningMetricKey[] = [
  'vision',
  'oral',
  'movement',
  'adl',
  'hearing',
  'cognition',
  'urine',
  'nutrition',
  'depression',
];

interface ThailandScreeningMapProps {
  provinces: ScreeningProvinceData[];
  selectedProvinceName: string;
  onSelectProvince: (provName: string) => void;
  activeZone: string;
  activeMetric: ScreeningMetricKey;
  onChangeMetric: (metric: ScreeningMetricKey) => void;
}

// Continuous interpolation from Blush Peach (#fbe1d1) to Sienna Brown (#5d2a1a)
function interpolateRiskColor(value: number, maxVal: number): string {
  return getChoroplethColor(value, 0, maxVal || 1);
}

export const METRIC_CONFIG: Record<ScreeningMetricKey, {
  name: string;
  shortName: string;
  shortLabel: string;
  icon: any;
  nationalAvg: number;
  maxScale: number;
}> = {
  vision: {
    name: 'ความเสี่ยงสายตาและการมองเห็น',
    shortName: '1. สายตา (14.9%)',
    shortLabel: DOMAIN_META.vision.shortLabel,
    icon: DOMAIN_META.vision.icon,
    nationalAvg: 14.9,
    maxScale: 30,
  },
  oral: {
    name: 'ความเสี่ยงสุขภาพช่องปาก',
    shortName: '2. ช่องปาก (11.9%)',
    shortLabel: DOMAIN_META.oral.shortLabel,
    icon: DOMAIN_META.oral.icon,
    nationalAvg: 11.9,
    maxScale: 25,
  },
  movement: {
    name: 'ความเสี่ยงการเคลื่อนไหวและการหกล้ม',
    shortName: '3. เคลื่อนไหว/หกล้ม (8.9%)',
    shortLabel: DOMAIN_META.movement.shortLabel,
    icon: DOMAIN_META.movement.icon,
    nationalAvg: 8.9,
    maxScale: 20,
  },
  adl: {
    name: 'กลุ่มพึ่งพิง/ติดบ้านติดเตียง (ADL)',
    shortName: '4. ADL ติดบ้าน/เตียง (6.2%)',
    shortLabel: DOMAIN_META.adl.shortLabel,
    icon: DOMAIN_META.adl.icon,
    nationalAvg: 6.2,
    maxScale: 15,
  },
  hearing: {
    name: 'ความเสี่ยงการได้ยิน',
    shortName: '5. ได้ยิน (5.2%)',
    shortLabel: DOMAIN_META.hearing.shortLabel,
    icon: DOMAIN_META.hearing.icon,
    nationalAvg: 5.2,
    maxScale: 12,
  },
  cognition: {
    name: 'ความเสี่ยงความคิดความจำ/สมองเสื่อม',
    shortName: '6. ความคิดความจำ (5.1%)',
    shortLabel: DOMAIN_META.cognition.shortLabel,
    icon: DOMAIN_META.cognition.icon,
    nationalAvg: 5.1,
    maxScale: 12,
  },
  urine: {
    name: 'ความเสี่ยงการกลั้นปัสสาวะ',
    shortName: '7. กลั้นปัสสาวะ (4.5%)',
    shortLabel: DOMAIN_META.urine.shortLabel,
    icon: DOMAIN_META.urine.icon,
    nationalAvg: 4.5,
    maxScale: 10,
  },
  nutrition: {
    name: 'ความเสี่ยงภาวะโภชนาการ/ขาดสารอาหาร',
    shortName: '8. โภชนาการ (4.1%)',
    shortLabel: DOMAIN_META.nutrition.shortLabel,
    icon: DOMAIN_META.nutrition.icon,
    nationalAvg: 4.1,
    maxScale: 10,
  },
  depression: {
    name: 'ความเสี่ยงภาวะซึมเศร้า (2Q)',
    shortName: '9. ซึมเศร้า 2Q (1.4%)',
    shortLabel: DOMAIN_META.depression.shortLabel,
    icon: DOMAIN_META.depression.icon,
    nationalAvg: 1.4,
    maxScale: 6,
  }
};

export const ThailandScreeningMap: React.FC<ThailandScreeningMapProps> = ({
  provinces,
  selectedProvinceName,
  onSelectProvince,
  activeZone,
  activeMetric,
  onChangeMetric
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredProvince, setHoveredProvince] = useState<{
    name: string;
    zone: string;
    riskCount: number;
    screenedCount: number;
    riskPct: number;
    topRiskName: string;
    topRiskPct: number;
    fillColor: string;
    isHigherThanAvg: boolean;
    x: number;
    y: number;
  } | null>(null);

  // Province lookup map
  const provMap = useMemo(() => {
    const map = new Map<string, ScreeningProvinceData>();
    provinces.forEach(p => {
      map.set(p.province, p);
      if (p.province === 'กรุงเทพฯ') map.set('กรุงเทพมหานคร', p);
      if (p.province === 'กรุงเทพมหานคร') map.set('กรุงเทพฯ', p);
    });
    return map;
  }, [provinces]);

  const cfg = METRIC_CONFIG[activeMetric];

  const buttonScrollRef = useRef<HTMLDivElement>(null);
  const activePillRef = useRef<HTMLButtonElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollState = () => {
    const el = buttonScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  useEffect(() => {
    checkScrollState();
    const el = buttonScrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScrollState, { passive: true });
    window.addEventListener('resize', checkScrollState);
    return () => {
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, []);

  useEffect(() => {
    if (activePillRef.current && buttonScrollRef.current) {
      const container = buttonScrollRef.current;
      if (container.scrollWidth > container.clientWidth) {
        activePillRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
      if (document.activeElement && container.contains(document.activeElement)) {
        activePillRef.current.focus();
      }
    }
    checkScrollState();
  }, [activeMetric]);

  const handlePillKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % METRIC_KEYS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + METRIC_KEYS.length) % METRIC_KEYS.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = METRIC_KEYS.length - 1;
    } else {
      return;
    }
    const nextKey = METRIC_KEYS[nextIndex];
    onChangeMetric(nextKey);
  };

  // Helper to extract risk percentage for selected metric
  const getProvinceRiskPct = (p: ScreeningProvinceData | undefined): number => {
    if (!p) return 0;
    const domainItem = p.domains[activeMetric];
    return domainItem ? domainItem.risk_pct : 0;
  };

  const getProvinceColor = (p: ScreeningProvinceData | undefined): string => {
    if (!p) return '#f2f2f3';
    const val = getProvinceRiskPct(p);
    if (val === 0) return '#f2f2f3';
    return interpolateRiskColor(val, cfg.maxScale);
  };

  // Dimensions & Projection
  const svgWidth = 500;
  const svgHeight = 780;
  const minLon = 97.2;
  const maxLon = 105.85;
  const minLat = 5.5;
  const maxLat = 20.6;
  const pad = 20;

  const project = (lon: number, lat: number): [number, number] => {
    const w = svgWidth - pad * 2;
    const h = svgHeight - pad * 2;
    const x = pad + ((lon - minLon) / (maxLon - minLon)) * w;
    const y = svgHeight - pad - ((lat - minLat) / (maxLat - minLat)) * h;
    return [x, y];
  };

  // GeoJSON to SVG paths
  const provincePaths = useMemo(() => {
    return geoData.features.map(f => {
      const thName = f.properties.name_th || f.properties.name;
      const enName = f.properties.name_en || f.properties.name;
      const geom = f.geometry;

      let d = '';
      if (geom.type === 'Polygon') {
        const rings = geom.coordinates as number[][][];
        d = rings
          .map(ring => {
            return ring
              .map(([lon, lat], i) => {
                const [px, py] = project(lon, lat);
                return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`;
              })
              .join(' ') + 'Z';
          })
          .join(' ');
      } else if (geom.type === 'MultiPolygon') {
        const multi = geom.coordinates as number[][][][];
        d = multi
          .map(poly => {
            return poly
              .map(ring => {
                return ring
                  .map(([lon, lat], i) => {
                    const [px, py] = project(lon, lat);
                    return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`;
                  })
                  .join(' ');
              })
              .join(' ');
          })
          .join(' ');
      }

      return {
        id: enName,
        thName,
        enName,
        d
      };
    });
  }, []);

  const handleProvinceHover = (
    e: React.MouseEvent<SVGPathElement>,
    pName: string,
    provData: ScreeningProvinceData | undefined,
    fillColor: string
  ) => {
    const container = e.currentTarget.closest('.map-canvas-container') as HTMLElement | null;
    const rect = container?.getBoundingClientRect() || e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    const clientX = rect ? e.clientX - rect.left : e.clientX;
    const clientY = rect ? e.clientY - rect.top : e.clientY;
    const containerWidth = rect?.width || 500;

    const riskPct = provData ? getProvinceRiskPct(provData) : 0;
    const domainObj = provData?.domains[activeMetric];

    setHoveredProvince({
      name: pName,
      zone: provData?.zone || 'ไม่ระบุ',
      riskCount: domainObj?.risk || 0,
      screenedCount: domainObj?.screened || 0,
      riskPct,
      topRiskName: provData?.top_risk_name || '-',
      topRiskPct: provData?.top_risk_pct || 0,
      fillColor,
      isHigherThanAvg: riskPct > cfg.nationalAvg,
      x: Math.min(containerWidth - 270, Math.max(15, clientX - 80)),
      y: Math.max(15, clientY - 140)
    });
  };

  const selectedProvData = selectedProvinceName ? provMap.get(selectedProvinceName) : null;
  const selectedMetricVal = selectedProvData ? getProvinceRiskPct(selectedProvData) : null;

  const avgPosPct = Math.min(95, Math.max(5, (cfg.nationalAvg / cfg.maxScale) * 100));

  return (
    <div className="relative flex flex-col justify-between items-center bg-[#f2f2f3] rounded-[24px] p-3.5 sm:p-4 overflow-hidden shadow-none h-full text-[#17191c] w-full">
      {/* Top Controls: 9 Risk Domains Selector & Risk Scale */}
      <div className="w-full pb-2.5 border-b border-[#ececec]">
        {/* Header Row: Title & Subtitle Left, National Avg Badge Right */}
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2.5">
          <div className="space-y-0.5">
            <h3
              className="font-serif font-normal text-[#17191c] leading-tight"
              style={{ fontSize: 'clamp(1.0625rem, 0.95rem + 0.35vw, 1.25rem)' }}
            >
              แผนที่ฮีทแมพพื้นที่เสี่ยงสุขภาพ 77 จังหวัด
            </h3>
            <p className="text-xs sm:text-[0.875rem] text-[#5f6370] leading-normal font-normal">
              แสดงความชุกของภาวะเสี่ยงรายจังหวัด ยิ่งสีน้ำตาลเข้ม = พื้นที่เสี่ยงสูง
            </p>
          </div>

          <span className="inline-flex items-center text-xs sm:text-[0.875rem] font-medium px-3 py-1 rounded-full border border-[#ececec] bg-white text-[#17191c] self-start sm:self-auto tabular-nums whitespace-nowrap shadow-none shrink-0">
            ค่าเฉลี่ยประเทศ: {cfg.nationalAvg}%
          </span>
        </div>

        {/* 9 Risk Metric Buttons: Header -> Buttons 10px (mb-2.5), Buttons -> Scale 12px (mb-3) */}
        <div className="map-metric-scroll-wrapper relative w-full mb-2.5">
          {/* Subtle scroll shadow left indicator (mobile only) */}
          <div
            className={`pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#f2f2f3] to-transparent z-10 transition-opacity duration-200 sm:hidden ${
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />

          {/* Button Group: flex-wrap on >=640px, horizontal scroll on <640px */}
          <div
            ref={buttonScrollRef}
            role="radiogroup"
            aria-label="เลือกมิติสุขภาพที่ต้องการแสดงบนแผนที่"
            className="map-metric-group scrollbar-none"
          >
            {METRIC_KEYS.map((key, index) => {
              const meta = DOMAIN_META[key];
              const isSelected = activeMetric === key;
              return (
                <button
                  key={key}
                  ref={isSelected ? activePillRef : undefined}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  title={meta.name}
                  aria-label={meta.name}
                  onClick={() => onChangeMetric(key)}
                  onKeyDown={(e) => handlePillKeyDown(e, index)}
                  className={`map-metric-pill ${isSelected ? 'is-selected' : ''}`}
                >
                  <DomainIcon size={16} variant="plain" icon={meta.icon} />
                  <span>{meta.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Subtle scroll shadow right indicator (mobile only) */}
          <div
            className={`pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#f2f2f3] to-transparent z-10 transition-opacity duration-200 sm:hidden ${
              canScrollRight ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />
        </div>

        {/* Continuous Risk Scale Bar: #fbe1d1 -> #5d2a1a (Legend) */}
        <div className="map-legend-container w-full flex flex-col pt-2 border-t border-[#ececec]">
          {/* National Avg Pointer Label Above Bar */}
          <div className="relative w-full h-4 select-none pointer-events-none">
            <div
              className="absolute top-0 text-[0.8125rem] font-medium text-[#17191c] whitespace-nowrap transform -translate-x-1/2 transition-all duration-300"
              style={{ left: `${avgPosPct}%` }}
            >
              ค่าเฉลี่ยชาติ {cfg.nationalAvg}%
            </div>
          </div>

          {/* Bar track and vertical pointer (height 16px) */}
          <div className="relative w-full h-[16px] flex items-center">
            {/* 8px Gradient Bar */}
            <div
              className="w-full h-[8px] rounded-full"
              style={{
                background: 'linear-gradient(to right, #fbe1d1 0%, #e8b9a0 25%, #b9826a 50%, #8a5a45 75%, #5d2a1a 100%)'
              }}
            />

            {/* National Avg Vertical Tick (#17191c, height 16px) */}
            <div
              className="absolute top-0 w-[2px] h-[16px] bg-[#17191c] rounded-full transform -translate-x-1/2 pointer-events-none transition-all duration-300"
              style={{ left: `${avgPosPct}%` }}
              aria-hidden="true"
            />

            {/* Active Hover / Selected Province Indicator */}
            {(hoveredProvince || selectedMetricVal !== null) && (
              <div
                className="absolute top-0 -mt-1 transition-all duration-150 pointer-events-none"
                style={{
                  left: `calc(${Math.min(99, Math.max(1, ((hoveredProvince?.riskPct ?? selectedMetricVal ?? 0) / cfg.maxScale) * 100))}% - 4px)`
                }}
                title={`จ.${hoveredProvince?.name || selectedProvinceName}: ${(hoveredProvince?.riskPct ?? selectedMetricVal ?? 0)}%`}
              >
                <div className="w-2 h-5 border-2 border-white bg-[#5d2a1a] rounded-xs shadow-md" />
              </div>
            )}
          </div>

          {/* 4-Column Grid Below Bar */}
          <div className="map-legend-grid mt-1 text-[0.8125rem] text-[#5f6370] font-normal tabular-nums">
            <span className="text-left whitespace-nowrap">0% (เสี่ยงต่ำ)</span>
            <span className="text-center whitespace-nowrap map-legend-mid">
              {Math.round(cfg.maxScale * 0.25)}%
            </span>
            <span className="text-center whitespace-nowrap map-legend-mid">
              {Math.round(cfg.maxScale * 0.75)}%
            </span>
            <span className="text-right whitespace-nowrap">{cfg.maxScale}%+ (เสี่ยงสูง)</span>
          </div>
        </div>
      </div>

      {/* SVG Map Canvas with Responsive Min-Height */}
      <div className="relative w-full flex-1 min-h-[clamp(380px,60vw,560px)] lg:min-h-[clamp(520px,62vh,760px)] flex items-center justify-center my-0.5 map-canvas-container touch-manipulation overflow-hidden">
        {/* Floating Tooltip */}
        {hoveredProvince && (
          <div
            className="absolute z-40 pointer-events-none bg-white rounded-[12px] p-4 shadow-[0_0_0_1px_rgba(4,23,43,0.05),0_8px_16px_rgba(0,0,0,0.08)] border border-[#ececec] text-sm w-72 transition-all duration-75"
            style={{
              left: `${hoveredProvince.x}px`,
              top: `${hoveredProvince.y}px`
            }}
          >
            <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-[#ececec]">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-[#ececec]"
                  style={{ backgroundColor: hoveredProvince.fillColor }}
                />
                <span className="font-medium text-[#17191c] text-base">จ.{hoveredProvince.name}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#f2f2f3] text-[#5f6370] text-xs border border-[#ececec]">
                {hoveredProvince.zone}
              </span>
            </div>

            <div className="space-y-1.5 text-sm text-[#5f6370]">
              <div className="flex justify-between items-center">
                <span>{cfg.name}:</span>
                <strong className="text-lg text-[#5d2a1a] font-medium tabular-nums leading-[1.35]">{hoveredProvince.riskPct}%</strong>
              </div>
              <div className="flex justify-between">
                <span>ผู้พบเสี่ยง:</span>
                <span className="text-[#17191c] tabular-nums">{hoveredProvince.riskCount.toLocaleString()} คน</span>
              </div>
              <div className="flex justify-between text-xs text-[#6b6f7a] pt-1.5 border-t border-[#ececec]">
                <span>ปัญหาเสี่ยงสูงสุด:</span>
                <span className="text-[#17191c] font-medium">
                  {hoveredProvince.topRiskName} ({hoveredProvince.topRiskPct}%)
                </span>
              </div>
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full select-none transition-transform duration-300 pointer-events-auto"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <g>
            {provincePaths.map(p => {
              const provData = provMap.get(p.thName);
              const fillColor = getProvinceColor(provData);
              const isSelected = selectedProvinceName === p.thName;
              const zNum = activeZone.replace(/^0+/, '');
              const isZoneMatch = activeZone === 'ALL' || (provData && (
                provData.zone_code === activeZone ||
                provData.zone_code === activeZone.padStart(2, '0') ||
                provData.zone.includes(`ที่ ${zNum}`) ||
                provData.zone.includes(`เขต ${zNum}`)
              ));
              const opacity = isZoneMatch ? 1 : 0.3;

              return (
                <path
                  key={p.id}
                  d={p.d}
                  fill={fillColor}
                  fillOpacity={opacity}
                  stroke={isSelected ? '#17191c' : '#ffffff'}
                  strokeWidth={isSelected ? 2.5 : 0.7}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="cursor-pointer transition-opacity duration-150 hover:opacity-90"
                  onClick={() => onSelectProvince(p.thName)}
                  onMouseEnter={(e) => handleProvinceHover(e, p.thName, provData, fillColor)}
                  onMouseMove={(e) => handleProvinceHover(e, p.thName, provData, fillColor)}
                  onMouseLeave={() => setHoveredProvince(null)}
                />
              );
            })}
          </g>
        </svg>

        {/* Zoom Controls: min 44px touch targets */}
        <div className="absolute right-2 bottom-3 flex flex-col gap-1.5 bg-white p-1 rounded-full border border-[#ececec] shadow-[0_0_0_1px_rgba(4,23,43,0.05),0_4px_12px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))}
            className="w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#777b86] hover:text-[#17191c] hover:bg-[#f2f2f3] transition-colors"
            title="ขยายแผนที่ (Zoom In)"
            aria-label="ขยายแผนที่"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.8))}
            className="w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#777b86] hover:text-[#17191c] hover:bg-[#f2f2f3] transition-colors"
            title="ย่อแผนที่ (Zoom Out)"
            aria-label="ย่อแผนที่"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#777b86] hover:text-[#17191c] hover:bg-[#f2f2f3] transition-colors"
            title="รีเซ็ตมุมมอง (Reset Zoom)"
            aria-label="รีเซ็ตมุมมอง"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Status / Selection Reminder */}
      <div className="w-full pt-2 border-t border-[#ececec] flex items-center justify-between text-xs text-[#5f6370]">
        <span className="flex items-center gap-1.5">
          คลิกที่จังหวัดเพื่อดูประวัติความเสี่ยงครบ 9 ด้านในพื้นที่นั้น →
        </span>
        {selectedProvinceName ? (
          <span className="text-[#17191c] font-medium tabular-nums text-xs">
            เลือกดู: จ.{selectedProvinceName} ({cfg.shortName}: {selectedMetricVal}%)
          </span>
        ) : (
          <span className="text-[#6b6f7a] text-xs">ยังไม่ได้เลือกจังหวัด</span>
        )}
      </div>
    </div>
  );
};
