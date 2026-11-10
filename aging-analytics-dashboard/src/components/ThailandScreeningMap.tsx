import React, { useState, useMemo } from 'react';
import geoData from '../data/thailand_provinces.json';
import { ScreeningProvinceData } from '../types';
import { ZoomIn, ZoomOut, RotateCcw, Eye, Stethoscope, Activity, HeartHandshake, Sparkles, ShieldAlert, AlertTriangle, MapPin } from 'lucide-react';
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
  icon: any;
  nationalAvg: number;
  maxScale: number;
}> = {
  vision: {
    name: 'ความเสี่ยงสายตาและการมองเห็น',
    shortName: '1. สายตา (14.9%)',
    icon: Eye,
    nationalAvg: 14.9,
    maxScale: 30,
  },
  oral: {
    name: 'ความเสี่ยงสุขภาพช่องปาก',
    shortName: '2. ช่องปาก (11.9%)',
    icon: Stethoscope,
    nationalAvg: 11.9,
    maxScale: 25,
  },
  movement: {
    name: 'ความเสี่ยงการเคลื่อนไหวและการหกล้ม',
    shortName: '3. เคลื่อนไหว/หกล้ม (8.9%)',
    icon: Activity,
    nationalAvg: 8.9,
    maxScale: 20,
  },
  adl: {
    name: 'กลุ่มพึ่งพิง/ติดบ้านติดเตียง (ADL)',
    shortName: '4. ADL ติดบ้าน/เตียง (6.2%)',
    icon: HeartHandshake,
    nationalAvg: 6.2,
    maxScale: 15,
  },
  hearing: {
    name: 'ความเสี่ยงการได้ยิน',
    shortName: '5. ได้ยิน (5.2%)',
    icon: Sparkles,
    nationalAvg: 5.2,
    maxScale: 12,
  },
  cognition: {
    name: 'ความเสี่ยงความคิดความจำ/สมองเสื่อม',
    shortName: '6. ความคิดความจำ (5.1%)',
    icon: ShieldAlert,
    nationalAvg: 5.1,
    maxScale: 12,
  },
  urine: {
    name: 'ความเสี่ยงการกลั้นปัสสาวะ',
    shortName: '7. กลั้นปัสสาวะ (4.5%)',
    icon: Activity,
    nationalAvg: 4.5,
    maxScale: 10,
  },
  nutrition: {
    name: 'ความเสี่ยงภาวะโภชนาการ/ขาดสารอาหาร',
    shortName: '8. โภชนาการ (4.1%)',
    icon: HeartHandshake,
    nationalAvg: 4.1,
    maxScale: 10,
  },
  depression: {
    name: 'ความเสี่ยงภาวะซึมเศร้า (2Q)',
    shortName: '9. ซึมเศร้า 2Q (1.4%)',
    icon: ShieldAlert,
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

  return (
    <div className="relative flex flex-col justify-between items-center bg-[#f2f2f3] rounded-[24px] p-5 overflow-hidden shadow-none min-h-[640px] text-[#17191c]">
      {/* Top Controls: 9 Risk Domains Selector */}
      <div className="w-full pb-3 border-b border-[#ececec]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <div className="font-medium text-[#17191c] text-sm">
              แผนที่ฮีทแมพพื้นที่เสี่ยงสุขภาพ 77 จังหวัด
            </div>
            <div className="text-xs text-[#5f6370]">
              แสดงความชุกของภาวะเสี่ยงรายจังหวัด ยิ่งสีน้ำตาลเข้ม (#5d2a1a) = พื้นที่เสี่ยงสูง
            </div>
          </div>

          <span className="text-xs font-medium px-3 py-1 rounded-full border border-[#ececec] bg-white text-[#5f6370] self-start sm:self-auto tabular-nums">
            ค่าเฉลี่ยประเทศ: {cfg.nationalAvg}%
          </span>
        </div>

        {/* 9 Risk Metric Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-sm">
          {(Object.keys(METRIC_CONFIG) as ScreeningMetricKey[]).map(key => {
            const item = METRIC_CONFIG[key];
            const Icon = item.icon;
            const isSelected = activeMetric === key;
            return (
              <button
                key={key}
                onClick={() => onChangeMetric(key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full whitespace-nowrap transition-all min-h-[44px] ${
                  isSelected
                    ? 'bg-[#17191c] text-white shadow-none font-medium'
                    : 'bg-white text-[#17191c] hover:bg-[#fafafb] border border-[#ececec] font-medium'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Continuous Risk Scale Bar: #fbe1d1 -> #5d2a1a */}
        <div className="mt-3 pt-2.5 border-t border-[#ececec] flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-[#5f6370] font-normal px-0.5 tabular-nums">
            <span>0% (เสี่ยงต่ำ)</span>
            <span>{(cfg.maxScale * 0.25).toFixed(0)}%</span>
            <span className="text-[#17191c] font-medium">
              ค่าเฉลี่ยชาติ {cfg.nationalAvg}%
            </span>
            <span>{(cfg.maxScale * 0.75).toFixed(0)}%</span>
            <span className="text-[#5d2a1a] font-medium">{cfg.maxScale}%+ (เสี่ยงสูง)</span>
          </div>

          <div className="relative w-full h-2 rounded-full overflow-visible border border-[#ececec] bg-white">
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'linear-gradient(to right, #fbe1d1 0%, #e8b9a0 25%, #b9826a 50%, #8a5a45 75%, #5d2a1a 100%)'
              }}
            />

            {/* Active Pointer */}
            {(hoveredProvince || selectedMetricVal !== null) && (
              <div
                className="absolute top-0 -mt-1 transition-all duration-150 pointer-events-none"
                style={{
                  left: `calc(${Math.min(99, Math.max(1, ((hoveredProvince?.riskPct ?? selectedMetricVal ?? 0) / cfg.maxScale) * 100))}% - 4px)`
                }}
              >
                <div className="w-2 h-4 border border-[#17191c] bg-[#5d2a1a] rounded-xs shadow-sm" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full flex-1 flex items-center justify-center my-2 map-canvas-container">
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
          className="w-full h-auto max-h-[720px] 2xl:max-h-[820px] select-none transition-transform duration-300"
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

        {/* Zoom Controls */}
        <div className="absolute right-2 bottom-3 flex flex-col gap-1.5 bg-white p-1 rounded-full border border-[#ececec] shadow-[0_0_0_1px_rgba(4,23,43,0.05),0_4px_12px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.0))}
            className="p-1.5 rounded-full text-[#777b86] hover:text-[#17191c] hover:bg-[#f2f2f3] transition-colors"
            title="ขยายแผนที่ (Zoom In)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.8))}
            className="p-1.5 rounded-full text-[#777b86] hover:text-[#17191c] hover:bg-[#f2f2f3] transition-colors"
            title="ย่อแผนที่ (Zoom Out)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-full text-[#777b86] hover:text-[#17191c] hover:bg-[#f2f2f3] transition-colors"
            title="รีเซ็ตมุมมอง (Reset Zoom)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Status / Selection Reminder */}
      <div className="w-full pt-2.5 border-t border-[#ececec] flex items-center justify-between text-xs text-[#5f6370]">
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
