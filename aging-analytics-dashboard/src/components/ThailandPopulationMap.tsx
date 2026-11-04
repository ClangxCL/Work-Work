import React, { useState, useMemo } from 'react';
import geoData from '../data/thailand_provinces.json';
import { PopProvinceData } from '../types';
import { ZoomIn, ZoomOut, RotateCcw, Palette, Users, Percent, Compass, ChevronRight } from 'lucide-react';

interface ThailandPopulationMapProps {
  provinces: PopProvinceData[];
  year: string;
  selectedProvinceName: string;
  onSelectProvince: (provName: string) => void;
  activeZone: string;
}

interface ColorStop {
  val: number;
  r: number;
  g: number;
  b: number;
}

export const ThailandPopulationMap: React.FC<ThailandPopulationMapProps> = ({
  provinces,
  year,
  selectedProvinceName,
  onSelectProvince,
  activeZone
}) => {
  const [metricMode, setMetricMode] = useState<'pct' | 'total'>('pct');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredProvince, setHoveredProvince] = useState<{
    name: string;
    zone: string;
    totalPop: number;
    elderlyTotal: number;
    elderlyMale: number;
    elderlyFemale: number;
    elderlyPct: number;
    fillColor: string;
    x: number;
    y: number;
  } | null>(null);

  // Quick lookup map for province data
  const provMap = useMemo(() => {
    const map = new Map<string, PopProvinceData>();
    provinces.forEach(p => {
      map.set(p.province, p);
      if (p.province === 'กรุงเทพฯ') {
        map.set('กรุงเทพมหานคร', p);
      }
      if (p.province === 'กรุงเทพมหานคร') {
        map.set('กรุงเทพฯ', p);
      }
    });
    return map;
  }, [provinces]);

  // Project longitude/latitude to SVG coordinates
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

  // Convert GeoJSON geometries into SVG paths
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

  // Continuous color stops
  const stopsPct: ColorStop[] = [
    { val: 12, r: 30, g: 41, b: 59 },     // 12% Slate 800 (ต่ำสุด)
    { val: 18, r: 15, g: 76, b: 129 },    // 18% Navy Blue
    { val: 20, r: 2, g: 132, b: 199 },    // 20% Sky Blue (เกณฑ์สังคมสูงวัยสมบูรณ์)
    { val: 24, r: 13, g: 148, b: 136 },   // 24% Teal
    { val: 28, r: 16, g: 185, b: 129 },   // 28% Emerald
    { val: 34, r: 74, g: 222, b: 128 },   // 34%+ Glowing Mint (Super-Aged สูงสุด)
  ];

  const stopsTotal: ColorStop[] = [
    { val: 20000, r: 30, g: 41, b: 59 },     // 20k Slate
    { val: 80000, r: 29, g: 78, b: 216 },    // 80k Ocean Blue
    { val: 180000, r: 14, g: 165, b: 233 },  // 180k Sky
    { val: 350000, r: 13, g: 148, b: 136 },  // 350k Teal
    { val: 500000, r: 16, g: 185, b: 129 },  // 500k Emerald
    { val: 1200000, r: 74, g: 222, b: 128 }  // 1.2M+ Glowing Mint
  ];

  const interpolate = (val: number, stops: ColorStop[]) => {
    const minVal = stops[0].val;
    const maxVal = stops[stops.length - 1].val;
    const clamped = Math.max(minVal, Math.min(maxVal, val));

    for (let i = 0; i < stops.length - 1; i++) {
      const s0 = stops[i];
      const s1 = stops[i + 1];
      if (clamped >= s0.val && clamped <= s1.val) {
        const t = (clamped - s0.val) / (s1.val - s0.val);
        const r = Math.round(s0.r + (s1.r - s0.r) * t);
        const g = Math.round(s0.g + (s1.g - s0.g) * t);
        const b = Math.round(s0.b + (s1.b - s0.b) * t);
        return `rgb(${r}, ${g}, ${b})`;
      }
    }
    const last = stops[stops.length - 1];
    return `rgb(${last.r}, ${last.g}, ${last.b})`;
  };

  const getProvinceColor = (pData?: PopProvinceData) => {
    if (!pData) return '#1e293b';
    if (metricMode === 'pct') {
      return interpolate(pData.elderly_pct, stopsPct);
    } else {
      return interpolate(pData.elderly_total, stopsTotal);
    }
  };

  // Active indicator calculation
  const selectedData = selectedProvinceName ? provMap.get(selectedProvinceName) : null;
  const currentIndicator = hoveredProvince
    ? (metricMode === 'pct' ? hoveredProvince.elderlyPct : hoveredProvince.elderlyTotal)
    : selectedData
    ? (metricMode === 'pct' ? selectedData.elderly_pct : selectedData.elderly_total)
    : null;

  const indicatorPercent = useMemo(() => {
    if (currentIndicator === null) return null;
    if (metricMode === 'pct') {
      return Math.min(100, Math.max(0, ((currentIndicator - 12) / (34 - 12)) * 100));
    } else {
      return Math.min(100, Math.max(0, ((currentIndicator - 20000) / (1200000 - 20000)) * 100));
    }
  }, [currentIndicator, metricMode]);

  return (
    <div className="relative flex flex-col justify-between items-center bg-gradient-to-b from-slate-900 via-slate-925 to-slate-950 rounded-2xl border border-slate-700/80 p-3.5 overflow-hidden min-h-[600px] shadow-2xl">
      {/* Top Header: Title, Metric Switcher, Continuous Legend Bar */}
      <div className="w-full pb-3 mb-2 border-b border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Title */}
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div>
              <div className="font-bold text-white tracking-wide text-xs">
                แผนผังภูมิศาสตร์ประชากรผู้สูงอายุประเทศไทย (ปีงบฯ {year})
              </div>
              <div className="text-[10px] text-slate-400">
                {metricMode === 'pct'
                  ? 'แสดงสัดส่วนผู้สูงอายุ 60 ปีขึ้นไป ต่อประชากรทั้งหมด (Choropleth Aging Ratio)'
                  : 'แสดงจำนวนประชากรผู้สูงอายุรวมรายจังหวัด (Total Elderly Count)'}
              </div>
            </div>
          </div>

          {/* Metric Mode Switcher */}
          <div className="flex items-center bg-slate-850 p-1 rounded-xl border border-slate-700/80 self-start sm:self-auto shrink-0 shadow-inner">
            <button
              onClick={() => setMetricMode('pct')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                metricMode === 'pct'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>สัดส่วน (%)</span>
            </button>
            <button
              onClick={() => setMetricMode('total')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                metricMode === 'total'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>จำนวนคน</span>
            </button>
          </div>
        </div>

        {/* Continuous Gradient Bar */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/50 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium px-0.5">
            {metricMode === 'pct' ? (
              <>
                <span>12% (วัยเด็ก/แรงงานสูง)</span>
                <span>20% (สังคมสูงวัยสมบูรณ์)</span>
                <span>28% (Super-Aged)</span>
                <span className="text-emerald-400 font-bold">&gt;34% (สูงวัยขั้นสุดยอด)</span>
              </>
            ) : (
              <>
                <span>20,000 คน</span>
                <span>150,000 คน</span>
                <span>350,000 คน</span>
                <span className="text-emerald-400 font-bold">&gt;1,000,000 คน</span>
              </>
            )}
          </div>

          {/* Gradient Track with Sliding Pointer */}
          <div className="relative w-full h-3 rounded-full overflow-visible border border-slate-700/60 shadow-inner">
            <div
              className="w-full h-full rounded-full"
              style={{
                background: metricMode === 'pct'
                  ? 'linear-gradient(to right, rgb(30,41,59) 0%, rgb(15,76,129) 25%, rgb(2,132,199) 45%, rgb(13,148,136) 70%, rgb(16,185,129) 85%, rgb(74,222,128) 100%)'
                  : 'linear-gradient(to right, rgb(30,41,59) 0%, rgb(29,78,216) 20%, rgb(14,165,233) 45%, rgb(13,148,136) 70%, rgb(16,185,129) 85%, rgb(74,222,128) 100%)'
              }}
            />

            {/* Indicator Marker */}
            {indicatorPercent !== null && (
              <div
                className="absolute top-0 -mt-1.5 transition-all duration-200 pointer-events-none"
                style={{ left: `calc(${Math.min(99, Math.max(1, indicatorPercent))}% - 5px)` }}
              >
                <div className="w-2.5 h-6 border-2 border-white bg-slate-900 rounded-sm shadow-md ring-1 ring-cyan-400" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[9px] text-slate-500 mt-0.5">
            <span>การกระจายตัวของโครงสร้างประชากรรายจังหวัด</span>
            {currentIndicator !== null && (
              <span className="text-cyan-300 font-semibold">
                ค่าที่โฟกัส:{' '}
                {metricMode === 'pct'
                  ? `${currentIndicator.toFixed(1)}%`
                  : `${currentIndicator.toLocaleString()} คน`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredProvince && (
        <div
          className="absolute z-30 pointer-events-none bg-slate-900/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-slate-700/80 ring-1 ring-cyan-500/30 text-xs max-w-xs transition-all duration-150"
          style={{
            left: `${Math.min(svgWidth - 190, Math.max(15, hoveredProvince.x))}px`,
            top: `${Math.max(15, hoveredProvince.y - 120)}px`
          }}
        >
          <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full border border-white/40 shadow-xs"
                style={{ backgroundColor: hoveredProvince.fillColor }}
              />
              <span className="font-bold text-white text-sm">จ.{hoveredProvince.name}</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-cyan-300 text-[10px] font-semibold border border-blue-500/30">
              {hoveredProvince.zone}
            </span>
          </div>

          {/* Aging Ratio */}
          <div className="mb-2">
            <div className="flex justify-between text-[11px] text-slate-300 mb-1">
              <span>สัดส่วนผู้สูงอายุ (60+):</span>
              <span className="font-bold text-emerald-400 text-sm">
                {hoveredProvince.elderlyPct.toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (hoveredProvince.elderlyPct / 35) * 100)}%`,
                  backgroundColor: hoveredProvince.fillColor
                }}
              />
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 mb-1.5">
            <div>ผู้สูงอายุ: <strong className="text-white">{hoveredProvince.elderlyTotal.toLocaleString()}</strong> คน</div>
            <div>ประชากรทั้งหมด: <strong className="text-white">{hoveredProvince.totalPop.toLocaleString()}</strong> คน</div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 bg-slate-800/60 p-1.5 rounded-lg">
            <span>ชาย 60+: <strong className="text-blue-300">{hoveredProvince.elderlyMale.toLocaleString()}</strong></span>
            <span>หญิง 60+: <strong className="text-rose-300">{hoveredProvince.elderlyFemale.toLocaleString()}</strong></span>
          </div>

          <div className="mt-1.5 text-[10px] text-cyan-400 text-right font-medium">
            คลิกเพื่อดูปิรามิดประชากรรายจังหวัด ↗
          </div>
        </div>
      )}

      {/* SVG Map of Thailand */}
      <div className="relative w-full flex justify-center items-center py-1">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-[430px] h-auto max-h-[640px] select-none transition-transform duration-300"
          style={{
            transform: `scale(${zoomLevel})`,
            filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.45))'
          }}
        >
          <defs>
            <filter id="pop-selected-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="pop-land-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Compass */}
          <g transform="translate(450, 60)" opacity="0.65" pointerEvents="none">
            <circle r="13" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <path d="M 0,-10 L 3.5,0 L 0,-2.5 L -3.5,0 Z" fill="#38bdf8" />
            <path d="M 0,10 L 3.5,0 L 0,-2.5 L -3.5,0 Z" fill="#475569" />
            <text x="0" y="-13" fontSize="8" fill="#94a3b8" textAnchor="middle" fontWeight="bold">N</text>
          </g>

          {/* Province Polygons */}
          <g filter="url(#pop-land-shadow)">
            {provincePaths.map(p => {
              const data = provMap.get(p.thName);
              const isSelected = selectedProvinceName === p.thName ||
                (selectedProvinceName === 'กรุงเทพฯ' && p.thName === 'กรุงเทพมหานคร') ||
                (selectedProvinceName === 'กรุงเทพมหานคร' && p.thName === 'กรุงเทพฯ');

              const zoneNum = activeZone.replace(/^0+/, '');
              const isZoneMatch = activeZone === 'ALL' || (data && (data.zone.includes(`ที่ ${zoneNum}`) || data.zone.includes(`เขต ${zoneNum}`)));

              const color = getProvinceColor(data);
              const finalFill = !isZoneMatch ? '#1e293b' : color;
              const opacity = !isZoneMatch ? 0.2 : isSelected ? 1 : 0.92;

              return (
                <path
                  key={p.id}
                  d={p.d}
                  fill={isSelected ? '#38bdf8' : finalFill}
                  opacity={opacity}
                  stroke={isSelected ? '#ffffff' : '#090d16'}
                  strokeWidth={isSelected ? '2.5' : '0.65'}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter={isSelected ? 'url(#pop-selected-glow)' : undefined}
                  className="transition-all duration-200 cursor-pointer hover:opacity-100 hover:stroke-white hover:stroke-[1.8]"
                  onMouseEnter={e => {
                    if (data) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const parentRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                      const rx = parentRect ? rect.left - parentRect.left + rect.width / 2 : 100;
                      const ry = parentRect ? rect.top - parentRect.top + rect.height / 2 : 100;
                      setHoveredProvince({
                        name: data.province,
                        zone: data.zone,
                        totalPop: data.total_pop,
                        elderlyTotal: data.elderly_total,
                        elderlyMale: data.elderly_male,
                        elderlyFemale: data.elderly_female,
                        elderlyPct: data.elderly_pct,
                        fillColor: color,
                        x: rx,
                        y: ry
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredProvince(null)}
                  onClick={() => {
                    if (data) {
                      if (
                        selectedProvinceName === data.province ||
                        (selectedProvinceName === 'กรุงเทพมหานคร' && data.province === 'กรุงเทพฯ') ||
                        (selectedProvinceName === 'กรุงเทพฯ' && data.province === 'กรุงเทพมหานคร')
                      ) {
                        onSelectProvince('');
                      } else {
                        onSelectProvince(data.province);
                      }
                    }
                  }}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* Footer Bar */}
      <div className="w-full flex items-center justify-between pt-2.5 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.6))}
            className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors shadow-xs"
            title="ซูมเข้า"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
            className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors shadow-xs"
            title="ซูมออก"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors shadow-xs"
            title="รีเซ็ตขนาด"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {selectedProvinceName && (
            <button
              onClick={() => onSelectProvince('')}
              className="text-[10px] text-cyan-300 hover:text-white bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-medium shadow-xs"
            >
              <span>✕ ดูภาพรวม</span>
            </button>
          )}
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>คลิกที่จังหวัดเพื่อเจาะลึกปิรามิดประชากรรายจังหวัด</span>
          </span>
        </div>
      </div>
    </div>
  );
};
