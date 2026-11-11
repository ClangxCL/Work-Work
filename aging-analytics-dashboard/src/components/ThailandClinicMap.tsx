import React, { useState, useMemo } from 'react';
import geoData from '../data/thailand_provinces.json';
import { ClinicProvinceData } from '../types';
import { ZoomIn, ZoomOut, RotateCcw, Compass, CheckCircle2 } from 'lucide-react';
import { getChoroplethColor } from '../theme/chartTheme';

interface ThailandClinicMapProps {
  provinces: ClinicProvinceData[];
  selectedProvinceName: string;
  onSelectProvince: (provName: string) => void;
  activeZone: string;
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
    containerWidth: number;
  } | null>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(1);

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

  // Selected province percentage for indicator
  const selectedProvData = selectedProvinceName ? provMap.get(selectedProvinceName) : null;
  const selectedPctNum = selectedProvData && selectedProvData.total_hospitals > 0
    ? (selectedProvData.total_evaluated / selectedProvData.total_hospitals) * 100
    : null;

  const activePctIndicator = hoveredProvince ? hoveredProvince.evalPctNum : selectedPctNum;

  return (
    <div className="relative flex flex-col justify-between items-center w-full flex-1 min-h-0 text-[#17191c]">
      {/* Top Header: Continuous Gradient Bar */}
      <div className="w-full pb-3 mb-2 shrink-0">
        {/* Continuous Gradient Legend Scale Bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-[#5f6370] font-normal px-0.5 tabular-nums">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span className="text-[#5d2a1a] font-medium">100% (เป้าหมายสมบูรณ์)</span>
          </div>

          <div className="relative w-full h-2.5 rounded-full overflow-visible border border-[#ececec] bg-white">
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'linear-gradient(to right, #fbe1d1 0%, #e8b9a0 25%, #b9826a 50%, #8a5a45 75%, #5d2a1a 100%)'
              }}
            />

            {/* Sliding Pointer for active or hovered province */}
            {activePctIndicator !== null && activePctIndicator !== undefined && (
              <div
                className="absolute top-0 -mt-1 transition-all duration-150 pointer-events-none"
                style={{ left: `calc(${Math.min(99, Math.max(1, activePctIndicator))}% - 4px)` }}
              >
                <div className="w-2.5 h-4.5 border border-[#17191c] bg-[#5d2a1a] rounded-xs shadow-sm" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SVG Canvas Container with Responsive Min-Height */}
      <div className="map-canvas-container relative w-full flex-1 min-h-[380px] sm:min-h-[460px] flex justify-center items-center py-1 overflow-hidden min-w-0 touch-manipulation">
        {/* Floating Interactive Tooltip */}
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
                <span>ความครอบคลุมคลินิก:</span>
                <span className="font-medium text-[#5d2a1a] text-base tabular-nums leading-[1.35]">
                  {hoveredProvince.evalPct}%
                </span>
              </div>
            </div>

            <div className="flex justify-between gap-3 text-xs text-[#5f6370] pt-1.5 border-t border-[#ececec]">
              <span>มีคลินิกประเมิน: <strong className="text-[#17191c] font-medium tabular-nums">{hoveredProvince.evaluated}</strong> แห่ง</span>
              <span>รพ.ทั้งหมด: <strong className="text-[#17191c] font-medium tabular-nums">{hoveredProvince.totalHospitals}</strong> แห่ง</span>
            </div>

            {hoveredProvince.excellent > 0 && (
              <div className="mt-2 text-xs text-[#5d2a1a] flex items-center gap-1.5 bg-[#fbe1d1]/50 px-2.5 py-1 rounded-full font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#5d2a1a] shrink-0" />
                <span>เกณฑ์มาตรฐานดีเด่น {hoveredProvince.excellent} แห่ง</span>
              </div>
            )}
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

              const evalPctNum = data && data.total_hospitals > 0
                ? (data.total_evaluated / data.total_hospitals) * 100
                : 0;

              const smoothColor = getChoroplethColor(evalPctNum, 0, 100);
              const finalFill = !isZoneMatch ? '#f2f2f3' : smoothColor;
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
                        totalHospitals: data.total_hospitals,
                        evaluated: data.total_evaluated,
                        evalPctNum,
                        evalPct: evalPctNum.toFixed(1),
                        excellent: data.excellent || 0,
                        fillColor: smoothColor,
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

      {/* Map Footer Bar with Zoom Controls & Instructions */}
      <div className="w-full flex items-center justify-between pt-3 border-t border-[#ececec] text-xs text-[#5f6370] shrink-0 mt-auto">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.6))}
            className="w-10 h-10 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full bg-white hover:bg-[#fafafb] text-[#17191c] border border-[#ececec] transition-colors"
            title="ซูมเข้า"
            aria-label="ซูมเข้า"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
            className="w-10 h-10 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full bg-white hover:bg-[#fafafb] text-[#17191c] border border-[#ececec] transition-colors"
            title="ย่อแผนที่"
            aria-label="ย่อแผนที่"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="w-10 h-10 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full bg-white hover:bg-[#fafafb] text-[#17191c] border border-[#ececec] transition-colors"
            title="รีเซ็ตขนาด"
            aria-label="รีเซ็ตขนาด"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="text-xs text-[#5f6370] ml-2 hidden sm:inline">
            แสดง: <strong className="text-[#17191c] font-medium">{activeZone === 'ALL' ? 'ทั้ง 77 จังหวัด' : `เขต ${activeZone.replace(/^0+/, '')}`}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {selectedProvinceName ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[#17191c] font-medium">จ.{selectedProvinceName}</span>
              <button
                onClick={() => onSelectProvince('')}
                className="text-xs text-[#17191c] bg-white border border-[#ececec] px-3 py-1 rounded-full hover:bg-[#fafafb] transition-all font-medium"
              >
                ✕ ภาพรวม
              </button>
            </div>
          ) : (
            <span className="text-xs text-[#5f6370] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#17191c]" />
              <span>คลิกที่จังหวัดเพื่อเจาะลึก รพ. →</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
