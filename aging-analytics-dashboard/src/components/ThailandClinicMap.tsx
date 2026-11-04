import React, { useState, useMemo } from 'react';
import geoData from '../data/thailand_provinces.json';
import { ClinicProvinceData } from '../types';
import { ZoomIn, ZoomOut, RotateCcw, Palette, Compass, Info, CheckCircle2 } from 'lucide-react';

interface ThailandClinicMapProps {
  provinces: ClinicProvinceData[];
  selectedProvinceName: string;
  onSelectProvince: (provName: string) => void;
  activeZone: string;
}

interface ColorStop {
  pct: number;
  r: number;
  g: number;
  b: number;
}

type PaletteKey = 'emerald' | 'viridis' | 'ocean';

const PALETTES: Record<PaletteKey, {
  name: string;
  stops: ColorStop[];
  cssGradient: string;
}> = {
  emerald: {
    name: 'เขียวมรกต (Emerald Jade)',
    stops: [
      { pct: 0, r: 30, g: 41, b: 59 },      // Slate 800
      { pct: 25, r: 15, g: 76, b: 129 },    // Classic Navy Blue
      { pct: 50, r: 2, g: 132, b: 199 },    // Ocean Sky Blue
      { pct: 70, r: 13, g: 148, b: 136 },   // Deep Teal
      { pct: 85, r: 16, g: 185, b: 129 },   // Fresh Emerald
      { pct: 100, r: 52, g: 211, b: 153 },  // Luminous Mint Green
    ],
    cssGradient: 'linear-gradient(to right, rgb(30,41,59) 0%, rgb(15,76,129) 25%, rgb(2,132,199) 50%, rgb(13,148,136) 70%, rgb(16,185,129) 85%, rgb(52,211,153) 100%)'
  },
  viridis: {
    name: 'ไวริสิส (Viridis สากล)',
    stops: [
      { pct: 0, r: 68, g: 1, b: 84 },       // Deep Purple
      { pct: 25, r: 59, g: 82, b: 139 },    // Indigo Blue
      { pct: 50, r: 33, g: 145, b: 140 },   // Teal
      { pct: 75, r: 94, g: 201, b: 98 },    // Light Green
      { pct: 100, r: 253, g: 231, b: 37 },  // Solar Yellow
    ],
    cssGradient: 'linear-gradient(to right, rgb(68,1,84) 0%, rgb(59,82,139) 25%, rgb(33,145,140) 50%, rgb(94,201,98) 75%, rgb(253,231,37) 100%)'
  },
  ocean: {
    name: 'บลูโอเชียน (Cyan & Ocean)',
    stops: [
      { pct: 0, r: 15, g: 23, b: 42 },      // Dark Slate
      { pct: 30, r: 30, g: 64, b: 175 },    // Royal Blue
      { pct: 60, r: 14, g: 165, b: 233 },   // Cyan Sky
      { pct: 85, r: 6, g: 182, b: 212 },    // Bright Cyan
      { pct: 100, r: 103, g: 232, b: 249 }  // Electric Aqua
    ],
    cssGradient: 'linear-gradient(to right, rgb(15,23,42) 0%, rgb(30,64,175) 30%, rgb(14,165,233) 60%, rgb(6,182,212) 85%, rgb(103,232,249) 100%)'
  }
};

/**
 * Continuous color interpolation along stops array
 */
function getInterpolatedColor(pct: number, stops: ColorStop[]): string {
  const clamped = Math.max(0, Math.min(100, pct));
  for (let i = 0; i < stops.length - 1; i++) {
    const s0 = stops[i];
    const s1 = stops[i + 1];
    if (clamped >= s0.pct && clamped <= s1.pct) {
      const t = (clamped - s0.pct) / (s1.pct - s0.pct);
      const r = Math.round(s0.r + (s1.r - s0.r) * t);
      const g = Math.round(s0.g + (s1.g - s0.g) * t);
      const b = Math.round(s0.b + (s1.b - s0.b) * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  }
  const last = stops[stops.length - 1];
  return `rgb(${last.r}, ${last.g}, ${last.b})`;
}

export const ThailandClinicMap: React.FC<ThailandClinicMapProps> = ({
  provinces,
  selectedProvinceName,
  onSelectProvince,
  activeZone
}) => {
  const [hoveredProvince, setHoveredProvince] = useState<{
    name: string;
    zone: string;
    totalHospitals: number;
    evaluated: number;
    evalPctNum: number;
    evalPct: string;
    excellent: number;
    fillColor: string;
    x: number;
    y: number;
  } | null>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activePalette, setActivePalette] = useState<PaletteKey>('emerald');
  const [showPaletteMenu, setShowPaletteMenu] = useState<boolean>(false);

  // Quick lookup map for province data
  const provMap = useMemo(() => {
    const map = new Map<string, ClinicProvinceData>();
    provinces.forEach(p => {
      map.set(p.province, p);
      if (p.province === 'กรุงเทพฯ') {
        map.set('กรุงเทพมหานคร', p);
      }
    });
    return map;
  }, [provinces]);

  // Project longitude/latitude to SVG coordinates
  // Thailand bounds: Lon 97.2 to 105.85, Lat 5.5 to 20.6
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

  // Graticule grid lines (Latitudes & Longitudes)
  const graticules = useMemo(() => {
    const lines: { d: string; label?: string; x?: number; y?: number }[] = [];
    const lats = [6, 8, 10, 12, 14, 16, 18, 20];
    const lons = [98, 100, 102, 104];

    lats.forEach(lat => {
      const [x1, y1] = project(minLon, lat);
      const [x2, y2] = project(maxLon, lat);
      lines.push({
        d: `M ${x1},${y1} L ${x2},${y2}`,
        label: `${lat}°N`,
        x: 10,
        y: y1 + 3
      });
    });

    lons.forEach(lon => {
      const [x1, y1] = project(lon, minLat);
      const [x2, y2] = project(lon, maxLat);
      lines.push({
        d: `M ${x1},${y1} L ${x2},${y2}`,
        label: `${lon}°E`,
        x: x1 - 10,
        y: svgHeight - 8
      });
    });

    return lines;
  }, []);

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

  const currentStops = PALETTES[activePalette].stops;
  const currentGradientCss = PALETTES[activePalette].cssGradient;

  // Selected province percentage for indicator
  const selectedProvData = selectedProvinceName ? provMap.get(selectedProvinceName) : null;
  const selectedPctNum = selectedProvData && selectedProvData.total_hospitals > 0
    ? (selectedProvData.total_evaluated / selectedProvData.total_hospitals) * 100
    : null;

  const activePctIndicator = hoveredProvince ? hoveredProvince.evalPctNum : selectedPctNum;

  return (
    <div className="relative flex flex-col justify-between items-center bg-gradient-to-b from-slate-900 via-slate-925 to-slate-950 rounded-2xl border border-slate-700/80 p-3.5 overflow-hidden min-h-[600px] shadow-2xl">
      {/* Top Header: Title & Continuous Gradient Bar */}
      <div className="w-full pb-3 mb-2 border-b border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Title & Pulse */}
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div>
              <div className="font-bold text-white tracking-wide text-xs">
                แผนผังภูมิศาสตร์ความครอบคลุมคลินิกผู้สูงอายุ
              </div>
              <div className="text-[10px] text-slate-400">
                ไล่เฉดสีตามร้อยละการประเมินมาตรฐานคลินิก (Choropleth Gradient)
              </div>
            </div>
          </div>

          {/* Palette Selector Button */}
          <div className="relative">
            <button
              onClick={() => setShowPaletteMenu(!showPaletteMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-[11px] text-slate-200 transition-all shadow-xs"
            >
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>{PALETTES[activePalette].name}</span>
            </button>

            {showPaletteMenu && (
              <div className="absolute right-0 top-8 z-40 w-52 bg-slate-850 border border-slate-700 rounded-xl shadow-2xl p-1.5 backdrop-blur-md">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  เลือกโทนสีการไล่ระดับ
                </div>
                {(Object.keys(PALETTES) as PaletteKey[]).map(key => (
                  <button
                    key={key}
                    onClick={() => {
                      setActivePalette(key);
                      setShowPaletteMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      activePalette === key
                        ? 'bg-blue-600/30 text-cyan-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{PALETTES[key].name}</span>
                    <div
                      className="w-12 h-2.5 rounded-full border border-white/20"
                      style={{ background: PALETTES[key].cssGradient }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Continuous Gradient Legend Scale Bar */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/50 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium px-0.5">
            <span>0% (รอนโยบาย/ยังไม่ประเมิน)</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span className="text-emerald-400 font-bold">100% (เป้าหมายสมบูรณ์)</span>
          </div>

          {/* Continuous Gradient Bar Container with Active Indicator */}
          <div className="relative w-full h-3 rounded-full overflow-visible border border-slate-700/60 shadow-inner">
            <div
              className="w-full h-full rounded-full"
              style={{ background: currentGradientCss }}
            />

            {/* Sliding Pointer for active or hovered province */}
            {activePctIndicator !== null && activePctIndicator !== undefined && (
              <div
                className="absolute top-0 -mt-1.5 transition-all duration-200 pointer-events-none"
                style={{ left: `calc(${Math.min(99, Math.max(1, activePctIndicator))}% - 5px)` }}
              >
                <div className="w-2.5 h-6 border-2 border-white bg-slate-900 rounded-sm shadow-md ring-1 ring-cyan-400" />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[9px] text-slate-500 mt-0.5">
            <span>ไล่ระดับสีแบบต่อเนื่อง (Continuous Color Ramp)</span>
            {activePctIndicator !== null && (
              <span className="text-cyan-300 font-semibold">
                ค่าที่โฟกัส: {activePctIndicator.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Floating Interactive Tooltip */}
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

          {/* Coverage Bar inside Tooltip */}
          <div className="mb-2">
            <div className="flex justify-between text-[11px] text-slate-300 mb-1">
              <span>ความครอบคลุมคลินิก:</span>
              <span className="font-bold text-emerald-400 text-sm">
                {hoveredProvince.evalPct}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${hoveredProvince.evalPctNum}%`,
                  backgroundColor: hoveredProvince.fillColor
                }}
              />
            </div>
          </div>

          <div className="flex justify-between gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span>มีคลินิกประเมิน: <strong className="text-white">{hoveredProvince.evaluated}</strong> แห่ง</span>
            <span>รพ.ทั้งหมด: <strong className="text-white">{hoveredProvince.totalHospitals}</strong> แห่ง</span>
          </div>

          {hoveredProvince.excellent > 0 && (
            <div className="mt-1.5 text-[10px] text-emerald-400 font-medium flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-800/40">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>ผ่านเกณฑ์มาตรฐานดีเด่น {hoveredProvince.excellent} แห่ง</span>
            </div>
          )}

          <div className="mt-1.5 text-[10px] text-cyan-400 text-right font-medium">
            คลิกเพื่อดูรายชื่อ รพ. ด้านข้าง ↗
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
            {/* Subtle glow filter for selected province */}
            <filter id="selected-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Outer shadow for Thailand landmass */}
            <filter id="land-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Graticule Latitude/Longitude subtle background grid */}
          <g opacity="0.4" pointerEvents="none">
            {graticules.map((g, i) => (
              <g key={`graticule-${i}`}>
                <path d={g.d} stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 4" strokeWidth="0.75" />
                {g.label && (
                  <text
                    x={g.x}
                    y={g.y}
                    fill="rgba(148, 163, 184, 0.25)"
                    fontSize="7"
                    fontFamily="monospace"
                  >
                    {g.label}
                  </text>
                )}
              </g>
            ))}
          </g>

          {/* Compass Rose (North Arrow) */}
          <g transform="translate(450, 60)" opacity="0.65" pointerEvents="none">
            <circle r="13" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <path d="M 0,-10 L 3.5,0 L 0,-2.5 L -3.5,0 Z" fill="#38bdf8" />
            <path d="M 0,10 L 3.5,0 L 0,-2.5 L -3.5,0 Z" fill="#475569" />
            <text x="0" y="-13" fontSize="8" fill="#94a3b8" textAnchor="middle" fontWeight="bold">N</text>
          </g>

          {/* All Thailand Province Polygons with continuous gradient coloring */}
          <g filter="url(#land-shadow)">
            {provincePaths.map(p => {
              const data = provMap.get(p.thName);
              const isSelected = selectedProvinceName === p.thName ||
                (selectedProvinceName === 'กรุงเทพฯ' && p.thName === 'กรุงเทพมหานคร') ||
                (selectedProvinceName === 'กรุงเทพมหานคร' && p.thName === 'กรุงเทพฯ');

              const zoneNum = activeZone.replace(/^0+/, '');
              const isZoneMatch = activeZone === 'ALL' || (data && (data.zone.includes(`ที่ ${zoneNum}`) || data.zone.includes(`เขต ${zoneNum}`)));

              const evalPctNum = data && data.total_hospitals > 0
                ? (data.total_evaluated / data.total_hospitals) * 100
                : 0;

              // Calculate continuous smooth color from gradient stops
              const smoothColor = getInterpolatedColor(evalPctNum, currentStops);

              // Non-matching zone provinces are subdued
              const finalFill = !isZoneMatch ? '#1e293b' : smoothColor;
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
                  filter={isSelected ? 'url(#selected-glow)' : undefined}
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
                        totalHospitals: data.total_hospitals,
                        evaluated: data.total_evaluated,
                        evalPctNum,
                        evalPct: evalPctNum.toFixed(1),
                        excellent: data.excellent || 0,
                        fillColor: smoothColor,
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
                        onSelectProvince(''); // Toggle deselect
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

      {/* Map Footer Bar with Zoom Controls & Instructions */}
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
            <span>ชี้เมาส์เพื่อดูสถิติย่อ หรือคลิกเพื่อเจาะลึก รพ. รายจังหวัด</span>
          </span>
        </div>
      </div>
    </div>
  );
};
