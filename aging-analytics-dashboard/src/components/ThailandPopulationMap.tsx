import React, { useState, useMemo } from 'react';
import geoData from '../data/thailand_provinces.json';
import { PopProvinceData } from '../types';
import { ZoomIn, ZoomOut, RotateCcw, Users, Percent, Compass } from 'lucide-react';
import { getChoroplethColor } from '../theme/chartTheme';

interface ThailandPopulationMapProps {
  provinces: PopProvinceData[];
  year: string;
  selectedProvinceName: string;
  onSelectProvince: (provName: string) => void;
  activeZone: string;
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
    containerWidth: number;
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

  // Continuous color interpolation from #fbe1d1 (min) to #5d2a1a (max)
  const getProvinceColor = (pData?: PopProvinceData) => {
    if (!pData) return '#f2f2f3';
    if (metricMode === 'pct') {
      return getChoroplethColor(pData.elderly_pct, 12, 34);
    } else {
      return getChoroplethColor(pData.elderly_total, 20000, 1000000);
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
      return Math.min(100, Math.max(0, ((currentIndicator - 20000) / (1000000 - 20000)) * 100));
    }
  }, [currentIndicator, metricMode]);

  return (
    <div className="relative flex flex-col justify-between items-center bg-[#f2f2f3] rounded-[24px] p-5 overflow-hidden shadow-none min-h-[600px] text-[#17191c]">
      {/* Top Header: Title, Metric Switcher, Continuous Legend Bar */}
      <div className="w-full pb-3 mb-2 border-b border-[#ececec]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Title */}
          <div>
            <div className="font-medium text-[#17191c] text-sm">
              แผนผังภูมิศาสตร์ประชากรผู้สูงอายุประเทศไทย (ปีงบฯ {year})
            </div>
            <div className="text-xs text-[#5f6370] mt-0.5">
              {metricMode === 'pct'
                ? 'แสดงสัดส่วนผู้สูงอายุ 60 ปีขึ้นไป (Choropleth สเกล #fbe1d1 → #5d2a1a)'
                : 'แสดงจำนวนประชากรผู้สูงอายุรวมรายจังหวัด'}
            </div>
          </div>

          {/* Metric Mode Switcher */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setMetricMode('pct')}
              className={`flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-full text-sm transition-all ${
                metricMode === 'pct'
                  ? 'bg-[#17191c] text-white shadow-none font-medium'
                  : 'bg-white text-[#17191c] hover:bg-[#fafafb] border border-[#ececec]'
              }`}
            >
              <Percent className="w-4 h-4" />
              <span>สัดส่วน (%)</span>
            </button>
            <button
              onClick={() => setMetricMode('total')}
              className={`flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-full text-sm transition-all ${
                metricMode === 'total'
                  ? 'bg-[#17191c] text-white shadow-none font-medium'
                  : 'bg-white text-[#17191c] hover:bg-[#fafafb] border border-[#ececec]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>จำนวนคน</span>
            </button>
          </div>
        </div>

        {/* Continuous Gradient Bar */}
        <div className="mt-3 pt-2.5 border-t border-[#ececec] flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-[#5f6370] font-normal px-0.5 tabular-nums">
            {metricMode === 'pct' ? (
              <>
                <span>12%</span>
                <span>20% (สังคมสูงวัยสมบูรณ์)</span>
                <span>28% (Super-Aged)</span>
                <span className="text-[#5d2a1a] font-medium">&gt;34%</span>
              </>
            ) : (
              <>
                <span>20,000 คน</span>
                <span>150,000 คน</span>
                <span>350,000 คน</span>
                <span className="text-[#5d2a1a] font-medium">&gt;1,000,000 คน</span>
              </>
            )}
          </div>

          {/* Gradient Track with Sliding Pointer */}
          <div className="relative w-full h-2.5 rounded-full overflow-visible border border-[#ececec] bg-white">
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'linear-gradient(to right, #fbe1d1 0%, #e8b9a0 25%, #b9826a 50%, #8a5a45 75%, #5d2a1a 100%)'
              }}
            />

            {/* Indicator Marker */}
            {indicatorPercent !== null && (
              <div
                className="absolute top-0 -mt-1 transition-all duration-150 pointer-events-none"
                style={{ left: `calc(${Math.min(99, Math.max(1, indicatorPercent))}% - 4px)` }}
              >
                <div className="w-2.5 h-4.5 border border-[#17191c] bg-[#5d2a1a] rounded-xs shadow-sm" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="map-canvas-container relative w-full flex justify-center items-center py-1 overflow-hidden min-w-0">
        {/* Floating Tooltip */}
        {hoveredProvince && (
          <div
            className="absolute z-30 pointer-events-none bg-white rounded-2xl p-4 shadow-[0_0_0_1px_rgba(4,23,43,0.05),0_8px_16px_rgba(0,0,0,0.08)] border border-[#ececec] text-sm max-w-sm transition-all duration-100"
            style={{
              left: `${Math.min(hoveredProvince.containerWidth - 260, Math.max(12, hoveredProvince.x))}px`,
              top: `${Math.max(12, hoveredProvince.y - 130)}px`
            }}
          >
            <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-[#ececec]">
              <div className="flex items-center gap-2">
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

            <div className="mb-2">
              <div className="flex justify-between text-xs text-[#5f6370] mb-1">
                <span>สัดส่วนผู้สูงอายุ (60+):</span>
                <span className="font-medium text-[#5d2a1a] text-base tabular-nums leading-[1.35]">
                  {hoveredProvince.elderlyPct.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs text-[#5f6370] pt-1.5 border-t border-[#ececec]">
              <div>ผู้สูงอายุ: <strong className="text-[#17191c] font-medium tabular-nums">{hoveredProvince.elderlyTotal.toLocaleString()}</strong> คน</div>
              <div>ประชากรทั้งหมด: <strong className="text-[#17191c] font-medium tabular-nums">{hoveredProvince.totalPop.toLocaleString()}</strong> คน</div>
            </div>
          </div>
        )}

        {/* SVG Map of Thailand */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto max-h-[720px] 2xl:max-h-[820px] select-none transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Province Polygons */}
          <g>
            {provincePaths.map(p => {
              const data = provMap.get(p.thName);
              const isSelected = selectedProvinceName === p.thName ||
                (selectedProvinceName === 'กรุงเทพฯ' && p.thName === 'กรุงเทพมหานคร') ||
                (selectedProvinceName === 'กรุงเทพมหานคร' && p.thName === 'กรุงเทพฯ');

              const zoneNum = activeZone.replace(/^0+/, '');
              const isZoneMatch = activeZone === 'ALL' || (data && (data.zone.includes(`ที่ ${zoneNum}`) || data.zone.includes(`เขต ${zoneNum}`)));

              const color = getProvinceColor(data);
              const finalFill = !isZoneMatch ? '#f2f2f3' : color;
              const opacity = !isZoneMatch ? 0.3 : 1;

              return (
                <path
                  key={p.id}
                  d={p.d}
                  fill={isSelected ? '#17191c' : finalFill}
                  opacity={opacity}
                  stroke={isSelected ? '#17191c' : '#ffffff'}
                  strokeWidth={isSelected ? '2.5' : '0.7'}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="transition-opacity duration-150 cursor-pointer hover:opacity-90"
                  onMouseEnter={e => {
                    if (data) {
                      const container = e.currentTarget.closest('.map-canvas-container') as HTMLElement | null;
                      const rect = container?.getBoundingClientRect() || e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                      const clientX = rect ? e.clientX - rect.left : e.clientX;
                      const clientY = rect ? e.clientY - rect.top : e.clientY;
                      const containerWidth = rect?.width || 500;
                      setHoveredProvince({
                        name: data.province,
                        zone: data.zone,
                        totalPop: data.total_pop,
                        elderlyTotal: data.elderly_total,
                        elderlyMale: data.elderly_male,
                        elderlyFemale: data.elderly_female,
                        elderlyPct: data.elderly_pct,
                        fillColor: color,
                        x: clientX,
                        y: clientY,
                        containerWidth
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
      <div className="w-full flex items-center justify-between pt-3 border-t border-[#ececec] text-xs text-[#5f6370]">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.6))}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white hover:bg-[#fafafb] text-[#17191c] border border-[#ececec] transition-colors"
            title="ซูมเข้า"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white hover:bg-[#fafafb] text-[#17191c] border border-[#ececec] transition-colors"
            title="ซูมออก"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white hover:bg-[#fafafb] text-[#17191c] border border-[#ececec] transition-colors"
            title="รีเซ็ตขนาด"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {selectedProvinceName && (
            <button
              onClick={() => onSelectProvince('')}
              className="text-xs text-[#17191c] bg-white border border-[#ececec] px-3.5 py-1.5 rounded-full hover:bg-[#fafafb] transition-all font-medium"
            >
              <span>✕ ดูภาพรวม</span>
            </button>
          )}
          <span className="text-xs text-[#5f6370] flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#17191c]" />
            <span>คลิกที่จังหวัดเพื่อเจาะลึกปิรามิดประชากรรายจังหวัด →</span>
          </span>
        </div>
      </div>
    </div>
  );
};
