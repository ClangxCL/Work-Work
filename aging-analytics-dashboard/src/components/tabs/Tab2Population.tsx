import React, { useState, useMemo, useEffect } from 'react';
import { PopSummaryZone, PopYearZone, PopProvinceData, DemographicProjection } from '../../types';
import { KPICard } from '../KPICard';
import { ThailandPopulationMap } from '../ThailandPopulationMap';
import { TabSourceReference } from '../TabSourceReference';
import {
  Users, TrendingUp, AlertTriangle, Scale, Calendar, Play, Pause,
  RotateCcw, Sparkles, MapPin, Activity,
  BarChart3, Lightbulb, HeartPulse
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, ReferenceLine
} from 'recharts';
import { CHART_PALETTE, rechartsTooltipStyle } from '../../theme/chartTheme';

interface Tab2PopulationProps {
  summaryZones: PopSummaryZone[];
  byYearZones: Record<string, PopYearZone[]>;
  byProvinceYears?: Record<string, PopProvinceData[]>;
  projections?: DemographicProjection[];
  selectedZone: string;
  selectedYear: string;
}

export const Tab2Population: React.FC<Tab2PopulationProps> = ({
  summaryZones,
  byYearZones,
  byProvinceYears = {},
  projections = [],
  selectedZone,
  selectedYear
}) => {
  // Navigation & Sub-views
  const initialSubView = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const sv = params.get('subview');
    if (sv === 'forecast' || sv === 'infographics' || sv === 'table') return sv;
    return 'map';
  }, []);

  const [activeSubView, setActiveSubView] = useState<'map' | 'forecast' | 'infographics' | 'table'>(initialSubView);
  
  // Year & Timeline animation
  const [currentYear, setCurrentYear] = useState<string>(selectedYear || '2569');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('');
  const [forecastScenario, setForecastScenario] = useState<'baseline' | 'high' | 'low'>('baseline');

  // Side Panel internal view (Ranking vs Pyramid) and ranking metric (% vs headcount)
  const [panelView, setPanelView] = useState<'ranking' | 'pyramid'>('ranking');
  const [rankMetric, setRankMetric] = useState<'pct' | 'total'>('pct');

  const availableYears = useMemo(() => ['2566', '2567', '2568', '2569'], []);

  // Auto-play timer for animated population growth
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentYear(prev => {
          const idx = availableYears.indexOf(prev);
          if (idx === -1 || idx >= availableYears.length - 1) {
            return availableYears[0];
          }
          return availableYears[idx + 1];
        });
      }, 2000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, availableYears]);

  // Provincial data for currently selected year
  const provincesInYear = useMemo(() => {
    return byProvinceYears[currentYear] || byProvinceYears['2569'] || [];
  }, [byProvinceYears, currentYear]);

  // Selected province details if any
  const selectedProvince = useMemo(() => {
    if (!selectedProvinceName) return null;
    return provincesInYear.find(p => p.province === selectedProvinceName) || null;
  }, [provincesInYear, selectedProvinceName]);

  // Ranked provinces for the Leaderboard (Top 10 by % or by total headcount)
  const rankedProvinces = useMemo(() => {
    const list = [...provincesInYear].filter(p => p.total_pop > 0);
    if (rankMetric === 'pct') {
      return list.sort((a, b) => b.elderly_pct - a.elderly_pct).slice(0, 10);
    } else {
      return list.sort((a, b) => b.elderly_total - a.elderly_total).slice(0, 10);
    }
  }, [provincesInYear, rankMetric]);

  const top3 = useMemo(() => rankedProvinces.slice(0, 3), [rankedProvinces]);
  const ranks4to10 = useMemo(() => rankedProvinces.slice(3, 10), [rankedProvinces]);

  // National Trend 2566-2569 (Historical actuals)
  const nationalTrend = useMemo(() => [
    { year: '2566', total: 11241940, ratio: 17.02, male: 4946440, female: 6295500, growth: 0 },
    { year: '2567', total: 11733912, ratio: 17.81, male: 5162920, female: 6570992, growth: 4.38 },
    { year: '2568', total: 12201858, ratio: 18.55, male: 5368810, female: 6833048, growth: 3.99 },
    { year: '2569', total: 12567576, ratio: 19.14, male: 5529730, female: 7037846, growth: 3.00 },
  ], []);

  // Current year national KPI metric
  const currentMetric = useMemo(() => {
    return nationalTrend.find(t => t.year === currentYear) || nationalTrend[3];
  }, [nationalTrend, currentYear]);

  // Age group breakdown (either for selected province OR for selected zone / nation)
  const ageDistribution = useMemo(() => {
    const groups = ['60-64', '65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-99', '100+'];

    if (selectedProvince && selectedProvince.age_groups) {
      return groups.map(g => {
        const item = selectedProvince.age_groups[g] || { male: 0, female: 0, total: 0 };
        return {
          age: `${g} ปี`,
          ชาย: item.male,
          หญิง: item.female,
          รวม: item.total
        };
      });
    }

    // Default: Aggregate across active zone or nation
    const yearList = byYearZones[currentYear] || byYearZones['2569'] || [];
    const filtered = selectedZone === 'ALL'
      ? yearList
      : yearList.filter(z => z.zone_code === selectedZone || z.zone_code === selectedZone.padStart(2, '0'));

    return groups.map(g => {
      let male = 0;
      let female = 0;
      let total = 0;
      filtered.forEach(z => {
        if (z.age_groups && z.age_groups[g]) {
          male += z.age_groups[g].male;
          female += z.age_groups[g].female;
          total += z.age_groups[g].total;
        }
      });
      return {
        age: `${g} ปี`,
        ชาย: male,
        หญิง: female,
        รวม: total
      };
    });
  }, [selectedProvince, currentYear, byYearZones, selectedZone]);

  // Forecast data 2566–2580
  const forecastChartData = useMemo(() => {
    const actuals = [
      { year: '2566', ผู้สูงอายุจริง: 11.24, อัตราส่วนจริง: 17.0, วัยต้น_60_69: 6.1, วัยกลาง_70_79: 3.6, วัยปลาย_80ขึ้นไป: 1.5 },
      { year: '2567', ผู้สูงอายุจริง: 11.73, อัตราส่วนจริง: 17.8, วัยต้น_60_69: 6.3, วัยกลาง_70_79: 3.8, วัยปลาย_80ขึ้นไป: 1.6 },
      { year: '2568', ผู้สูงอายุจริง: 12.20, อัตราส่วนจริง: 18.6, วัยต้น_60_69: 6.5, วัยกลาง_70_79: 4.0, วัยปลาย_80ขึ้นไป: 1.7 },
      { year: '2569', ผู้สูงอายุจริง: 12.57, อัตราส่วนจริง: 19.1, วัยต้น_60_69: 6.7, วัยกลาง_70_79: 4.1, วัยปลาย_80ขึ้นไป: 1.8 },
    ];

    const projectionsList = [
      { year: '2570', baseline: 12.98, high: 13.15, low: 12.82, วัยต้น_60_69: 6.8, วัยกลาง_70_79: 4.3, วัยปลาย_80ขึ้นไป: 1.9 },
      { year: '2571', baseline: 13.41, high: 13.68, low: 13.18, วัยต้น_60_69: 7.0, วัยกลาง_70_79: 4.4, วัยปลาย_80ขึ้นไป: 2.0 },
      { year: '2572', baseline: 13.84, high: 14.20, low: 13.52, วัยต้น_60_69: 7.1, วัยกลาง_70_79: 4.6, วัยปลาย_80ขึ้นไป: 2.1 },
      { year: '2573', baseline: 14.28, high: 14.75, low: 13.88, วัยต้น_60_69: 7.2, วัยกลาง_70_79: 4.8, วัยปลาย_80ขึ้นไป: 2.3 },
      { year: '2574', baseline: 14.71, high: 15.30, low: 14.22, วัยต้น_60_69: 7.3, วัยกลาง_70_79: 5.0, วัยปลาย_80ขึ้นไป: 2.4 },
      { year: '2575', baseline: 15.15, high: 15.85, low: 14.56, วัยต้น_60_69: 7.3, วัยกลาง_70_79: 5.3, วัยปลาย_80ขึ้นไป: 2.5 },
      { year: '2580', baseline: 17.20, high: 18.10, low: 16.35, วัยต้น_60_69: 7.5, วัยกลาง_70_79: 6.6, วัยปลาย_80ขึ้นไป: 3.1 },
    ];

    return [
      ...actuals.map(a => ({
        year: a.year,
        ผู้สูงอายุจริง: a.ผู้สูงอายุจริง,
        ผู้สูงอายุทำนาย: null,
        วัยต้น_60_69: a.วัยต้น_60_69,
        วัยกลาง_70_79: a.วัยกลาง_70_79,
        วัยปลาย_80ขึ้นไป: a.วัยปลาย_80ขึ้นไป,
      })),
      ...projectionsList.map(p => ({
        year: p.year,
        ผู้สูงอายุจริง: null,
        ผู้สูงอายุทำนาย: forecastScenario === 'baseline' ? p.baseline : forecastScenario === 'high' ? p.high : p.low,
        วัยต้น_60_69: p.วัยต้น_60_69,
        วัยกลาง_70_79: p.วัยกลาง_70_79,
        วัยปลาย_80ขึ้นไป: p.วัยปลาย_80ขึ้นไป,
      }))
    ];
  }, [forecastScenario]);

  return (
    <div className="space-y-12 text-[#17191c]">
      {/* Editorial Section Header */}
      <div className="space-y-2 mb-6">
        <span className="text-xs uppercase tracking-wider text-[#6b6f7a] block font-medium">
          Demographic Profile & Aging Trends · ข้อมูลประชากร/แนวโน้ม ผส. · ปีงบประมาณ {currentYear}
        </span>
        <h2 className="font-serif font-normal text-2xl sm:text-3xl lg:text-4xl text-[#17191c] leading-[1.35] mb-2">
          ข้อมูลประชากรและแนวโน้มผู้สูงอายุไทย
        </h2>
        <p className="text-base text-[#5f6370] w-full leading-[1.6]">
          วิเคราะห์โครงสร้างประชากรผู้สูงอายุรายจังหวัด (77 จังหวัด) การกระจายตัวตามกลุ่มอายุ และแบบจำลองการทำนายแนวโน้มสู่อนาคต (2570–2580)
        </p>
      </div>

      {/* 1. TIMELINE & SUB-VIEW CONTROLS (Pill shaped buttons) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-[20px] bg-white border border-[#ececec] w-full shadow-sm">
        {/* Left: Play/Pause and Timeline */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-all ${
              isPlaying
                ? 'bg-[#17191c] text-white'
                : 'bg-white border border-[#ececec] text-[#17191c] hover:bg-[#fafafb]'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'หยุดเล่น' : 'เล่นไทม์ไลน์'}</span>
          </button>

          {/* Year Buttons */}
          <div className="flex items-center space-x-1.5">
            {availableYears.map(yr => (
              <button
                key={yr}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentYear(yr);
                }}
                className={`px-4 py-2 min-h-[44px] rounded-full text-sm font-medium tabular-nums transition-all ${
                  currentYear === yr
                    ? 'bg-[#17191c] text-white'
                    : 'bg-white border border-[#ececec] text-[#5f6370] hover:text-[#17191c] hover:bg-[#fafafb]'
                }`}
              >
                ปี {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Sub-View Switcher */}
        <div className="flex items-center space-x-2 text-sm font-medium">
          <button
            onClick={() => setActiveSubView('map')}
            className={`px-4 py-2 min-h-[44px] rounded-full transition-all ${
              activeSubView === 'map'
                ? 'bg-[#17191c] text-white'
                : 'bg-white border border-[#ececec] text-[#5f6370] hover:text-[#17191c] hover:bg-[#fafafb]'
            }`}
          >
            แผนที่รายจังหวัด
          </button>
          <button
            onClick={() => setActiveSubView('forecast')}
            className={`px-4 py-2 min-h-[44px] rounded-full transition-all flex items-center gap-1.5 ${
              activeSubView === 'forecast'
                ? 'bg-[#17191c] text-white'
                : 'bg-white border border-[#ececec] text-[#5f6370] hover:text-[#17191c] hover:bg-[#fafafb]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#5d2a1a]" />
            <span>โมเดลทำนาย 2570–2580</span>
          </button>
          <button
            onClick={() => setActiveSubView('infographics')}
            className={`px-4 py-2 min-h-[44px] rounded-full transition-all ${
              activeSubView === 'infographics'
                ? 'bg-[#17191c] text-white'
                : 'bg-white border border-[#ececec] text-[#5f6370] hover:text-[#17191c] hover:bg-[#fafafb]'
            }`}
          >
            อินโฟกราฟฟิก
          </button>
        </div>
      </div>

      {/* 2. TOP KPI CARDS: auto-fit full row width */}
      <div className="kpi-grid">
        <KPICard
          title={`ผู้สูงอายุปี ${currentYear}`}
          value={`${(currentMetric.total / 1000000).toFixed(2)}M คน`}
          subtitle={`ประชากร 60 ปีขึ้นไป (${currentMetric.total.toLocaleString()} คน)`}
          badge={`ปี ${currentYear}`}
          icon={Users}
          variant="peach" // 1 single accent peach card
        />
        <KPICard
          title="สัดส่วนผู้สูงอายุ (Aging Ratio)"
          value={`${currentMetric.ratio}%`}
          subtitle="สัดส่วนต่อประชากรทุกช่วงอายุ"
          badge="สังคมสูงวัยสมบูรณ์"
          icon={AlertTriangle}
          variant="neutral"
        />
        <KPICard
          title="การเติบโต 4 ปี (2566–2569)"
          value="+11.79%"
          subtitle="เพิ่มขึ้น +1,325,636 คน"
          badge="+3.9% ต่อปี"
          icon={TrendingUp}
          variant="neutral"
        />
        <KPICard
          title="สัดส่วนประชากรหญิงสูงวัย"
          value="56.0%"
          subtitle="หญิง 7.04M คน / ชาย 5.53M คน"
          badge="หญิงอายุยืนกว่าชาย"
          icon={Scale}
          variant="neutral"
        />
        <KPICard
          title="จังหวัดสัดส่วนสูงสุด"
          value="ลำปาง (33.2%)"
          subtitle="แพร่ (32.8%), สิงห์บุรี (31.5%)"
          badge="Super-Aged Zone"
          icon={AlertTriangle}
          variant="neutral"
        />
      </div>

      {/* 3. CONDITIONAL MAIN CONTENT BASED ON ACTIVE SUB-VIEW */}

      {/* SUB-VIEW 1: GEOGRAPHIC POPULATION MAP & PROVINCIAL DEMOGRAPHICS */}
      {activeSubView === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          {/* Left: Interactive Thailand Population Map (7 cols) */}
          <div className="lg:col-span-7 bg-[#f2f2f3] p-5 rounded-[24px] flex flex-col justify-between min-w-0 w-full">
            <ThailandPopulationMap
              provinces={provincesInYear}
              year={currentYear}
              selectedProvinceName={selectedProvinceName}
              onSelectProvince={(pName) => setSelectedProvinceName(pName)}
              activeZone={selectedZone}
            />

            <div className="mt-4 pt-3.5 border-t border-[#ececec] flex items-center justify-between text-sm text-[#5f6370]">
              <span>
                กำลังแสดงข้อมูลประชากรผู้สูงอายุ: <strong className="text-[#17191c] font-medium">ปีงบประมาณ {currentYear} (ทั้ง 77 จังหวัด)</strong>
              </span>
              <span className="text-[#17191c] font-medium">
                {selectedProvince ? `โฟกัส: จังหวัด${selectedProvince.province}` : 'แสดงภาพรวมทั้งประเทศ'}
              </span>
            </div>
          </div>

          {/* Right: Dedicated Demographic Side Panel (5 cols) */}
          <div className="lg:col-span-5 bg-[#f2f2f3] p-6 rounded-[24px] flex flex-col justify-between min-w-0 w-full">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-3.5 border-b border-[#ececec] mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-[#5f6370] bg-white border border-[#ececec] px-3 py-1 rounded-full">
                      {selectedProvince ? selectedProvince.zone : 'ภาพรวมทั้งประเทศ (13 เขตสุขภาพ)'}
                    </span>
                    <span className="text-xs text-[#6b6f7a]">
                      ปีงบประมาณ {currentYear}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[#17191c] mt-2 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-[#17191c]" />
                    {selectedProvince ? `จังหวัด${selectedProvince.province}` : 'โครงสร้างประชากรผู้สูงอายุไทย'}
                  </h3>
                </div>

                {selectedProvince && (
                  <button
                    onClick={() => setSelectedProvinceName('')}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-white hover:bg-[#fafafb] text-[#17191c] border border-[#ececec] transition-colors font-medium min-h-[38px] flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> ภาพรวม
                  </button>
                )}
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                <div className="bg-white rounded-2xl p-3.5 text-center border border-[#ececec]">
                  <div className="text-xs text-[#5f6370] font-medium">ผู้สูงอายุ (60+)</div>
                  <div className="text-xl sm:text-2xl font-serif font-normal text-[#17191c] tabular-nums mt-0.5">
                    {selectedProvince
                      ? `${selectedProvince.elderly_total.toLocaleString()} คน`
                      : `${(currentMetric.total / 1000000).toFixed(2)}M คน`}
                  </div>
                </div>
                <div className="bg-[#fbe1d1] rounded-2xl p-3.5 text-center border-0 text-[#5d2a1a]">
                  <div className="text-xs text-[#5d2a1a] font-medium">สัดส่วนผู้สูงอายุ</div>
                  <div className="text-xl sm:text-2xl font-serif font-normal text-[#5d2a1a] tabular-nums mt-0.5">
                    {selectedProvince
                      ? `${selectedProvince.elderly_pct.toFixed(1)}%`
                      : `${currentMetric.ratio}%`}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-3.5 text-center border border-[#ececec]">
                  <div className="text-xs text-[#5f6370] font-medium">สถานะสังคมสูงวัย</div>
                  <div className="text-xs font-medium text-[#17191c] mt-1.5">
                    {(selectedProvince ? selectedProvince.elderly_pct : currentMetric.ratio) >= 28
                      ? 'Super-Aged 28%+'
                      : (selectedProvince ? selectedProvince.elderly_pct : currentMetric.ratio) >= 20
                      ? 'Complete Aged'
                      : 'Aging Society'}
                  </div>
                </div>
              </div>

              {/* Panel View Switcher (Only when viewing national overview) */}
              {!selectedProvince && (
                <div className="flex items-center justify-between mb-4 bg-white p-1.5 rounded-full border border-[#ececec]">
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setPanelView('ranking')}
                      className={`px-3.5 py-1.5 rounded-full text-xs min-h-[38px] transition-all flex items-center gap-1.5 ${
                        panelView === 'ranking'
                          ? 'bg-[#17191c] text-white font-medium'
                          : 'text-[#5f6370] hover:text-[#17191c]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#5d2a1a]" />
                      <span>10 อันดับจังหวัด</span>
                    </button>
                    <button
                      onClick={() => setPanelView('pyramid')}
                      className={`px-3.5 py-1.5 rounded-full text-xs min-h-[38px] transition-all flex items-center gap-1.5 ${
                        panelView === 'pyramid'
                          ? 'bg-[#17191c] text-white font-medium'
                          : 'text-[#5f6370] hover:text-[#17191c]'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>ปิรามิดประชากร</span>
                    </button>
                  </div>

                  {panelView === 'ranking' && (
                    <div className="flex items-center space-x-1 text-xs pr-1">
                      <button
                        onClick={() => setRankMetric('pct')}
                        className={`px-3 py-1 rounded-full transition-all min-h-[32px] ${
                          rankMetric === 'pct' ? 'bg-[#f2f2f3] text-[#17191c] font-medium' : 'text-[#5f6370]'
                        }`}
                      >
                        สัดส่วน (%)
                      </button>
                      <button
                        onClick={() => setRankMetric('total')}
                        className={`px-3 py-1 rounded-full transition-all min-h-[32px] ${
                          rankMetric === 'total' ? 'bg-[#f2f2f3] text-[#17191c] font-medium' : 'text-[#5f6370]'
                        }`}
                      >
                        จำนวนคน
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW A: IF PROVINCE IS SELECTED -> SHOW PROVINCE PROFILE & PROVINCIAL PYRAMID */}
              {selectedProvince ? (
                <div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2.5 text-sm">
                      <span className="font-medium text-[#17191c] flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-[#17191c]" />
                        ปิรามิดประชากร จังหวัด{selectedProvince.province} (ปี {currentYear})
                      </span>
                      <div className="flex items-center gap-2.5 text-xs text-[#5f6370]">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#5d2a1a]"></span> ชาย
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#b9826a]"></span> หญิง
                        </span>
                      </div>
                    </div>

                    <div className="h-68 w-full bg-white p-3.5 rounded-2xl border border-[#ececec]">
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart
                          data={ageDistribution}
                          layout="vertical"
                          margin={{ top: 5, right: 15, left: 15, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ececec" />
                          <XAxis type="number" tick={{ fontSize: 13, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                          <YAxis dataKey="age" type="category" tick={{ fontSize: 13, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} width={65} />
                          <Tooltip
                            contentStyle={rechartsTooltipStyle}
                            formatter={(val: any, name: any) => [`${Number(val).toLocaleString()} คน`, name]}
                          />
                          <Bar dataKey="ชาย" fill="#5d2a1a" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                          <Bar dataKey="หญิง" fill="#b9826a" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-[#ececec] text-sm text-[#5f6370] leading-relaxed">
                    <div className="font-medium text-[#17191c] flex items-center gap-1.5 mb-1">
                      <Lightbulb className="w-4 h-4 text-[#5d2a1a]" />
                      <span>สถิติประชากรศาสตร์เฉพาะจังหวัด{selectedProvince.province}:</span>
                    </div>
                    <div>
                      ประชากรผู้สูงอายุรวม <strong className="text-[#17191c] font-medium tabular-nums">{selectedProvince.elderly_total.toLocaleString()} คน</strong> คิดเป็น{' '}
                      <strong className="text-[#5d2a1a] font-medium tabular-nums">{selectedProvince.elderly_pct.toFixed(1)}%</strong> ของประชากรทั้งจังหวัด
                    </div>
                  </div>
                </div>
              ) : panelView === 'ranking' ? (
                /* VIEW B: TOP 10 VISUAL LEADERBOARD */
                <div>
                  <div className="grid grid-cols-3 gap-2.5 mb-3.5">
                    {top3.map((p, idx) => (
                      <button
                        key={p.province}
                        onClick={() => setSelectedProvinceName(p.province)}
                        className="p-3.5 rounded-2xl bg-white border border-[#ececec] hover:border-[#17191c] text-left transition-all relative"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="w-6 h-6 rounded-full bg-[#f2f2f3] text-[#17191c] text-xs font-medium flex items-center justify-center tabular-nums">
                            {idx + 1}
                          </span>
                          <span className="text-xs text-[#6b6f7a]">
                            {p.zone.replace('เขตสุขภาพที่ ', 'เขต ')}
                          </span>
                        </div>
                        <div className="font-medium text-[#17191c] text-base truncate">
                          {p.province}
                        </div>
                        <div className="text-lg font-serif font-normal text-[#5d2a1a] mt-0.5 tabular-nums">
                          {rankMetric === 'pct' ? `${p.elderly_pct.toFixed(1)}%` : `${(p.elderly_total / 1000).toFixed(0)}k คน`}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Ranks 4 to 10 Rows */}
                  <div className="space-y-2 mb-3">
                    {ranks4to10.map((p, idx) => {
                      const rankNum = idx + 4;
                      return (
                        <button
                          key={p.province}
                          onClick={() => setSelectedProvinceName(p.province)}
                          className="w-full p-3 rounded-2xl bg-white hover:bg-[#fafafb] border border-[#ececec] transition-all text-left flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-[#f2f2f3] text-[#17191c] text-xs font-medium flex items-center justify-center shrink-0 tabular-nums">
                              {rankNum}
                            </span>
                            <div>
                              <span className="font-medium text-[#17191c] text-sm">{p.province}</span>
                              <span className="text-xs text-[#6b6f7a] ml-2">{p.zone.replace('เขตสุขภาพที่ ', 'เขต ')}</span>
                            </div>
                          </div>
                          <span className="text-sm font-serif font-normal text-[#5d2a1a] tabular-nums">
                            {rankMetric === 'pct' ? `${p.elderly_pct.toFixed(1)}%` : `${p.elderly_total.toLocaleString()} คน`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* VIEW C: FULL AGE PYRAMID CHART */
                <div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2.5 text-sm">
                      <span className="font-medium text-[#17191c] flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-[#17191c]" />
                        ปิรามิดประชากรรายช่วงอายุ (60 – 100+ ปี) ภาพรวมประเทศ
                      </span>
                      <div className="flex items-center gap-2.5 text-xs text-[#5f6370]">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#5d2a1a]"></span> ชาย
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#b9826a]"></span> หญิง
                        </span>
                      </div>
                    </div>

                    <div className="h-72 w-full bg-white p-3.5 rounded-2xl border border-[#ececec]">
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart
                          data={ageDistribution}
                          layout="vertical"
                          margin={{ top: 5, right: 15, left: 15, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ececec" />
                          <XAxis type="number" tick={{ fontSize: 13, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                          <YAxis dataKey="age" type="category" tick={{ fontSize: 13, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} width={65} />
                          <Tooltip
                            contentStyle={rechartsTooltipStyle}
                            formatter={(val: any, name: any) => [`${Number(val).toLocaleString()} คน`, name]}
                          />
                          <Bar dataKey="ชาย" fill="#5d2a1a" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                          <Bar dataKey="หญิง" fill="#b9826a" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 3 Life Stages Summary */}
                  <div className="grid grid-cols-3 gap-2.5 text-center text-xs pt-3.5 border-t border-[#ececec]">
                    <div className="p-3.5 rounded-2xl bg-white border border-[#ececec]">
                      <div className="text-xs text-[#5f6370] font-medium">วัยต้น (60-69 ปี)</div>
                      <div className="font-serif font-normal text-base text-[#17191c] mt-0.5 tabular-nums">54.2%</div>
                      <div className="text-xs text-[#6b6f7a] mt-0.5">กลุ่มติดสังคม</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-[#ececec]">
                      <div className="text-xs text-[#5f6370] font-medium">วัยกลาง (70-79 ปี)</div>
                      <div className="font-serif font-normal text-base text-[#17191c] mt-0.5 tabular-nums">31.3%</div>
                      <div className="text-xs text-[#6b6f7a] mt-0.5">กลุ่มติดบ้าน</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white border border-[#ececec]">
                      <div className="text-xs text-[#5f6370] font-medium">วัยปลาย (80+ ปี)</div>
                      <div className="font-serif font-normal text-base text-[#5d2a1a] mt-0.5 tabular-nums">14.5%</div>
                      <div className="text-xs text-[#6b6f7a] mt-0.5">เสี่ยงติดเตียง</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: DEMOGRAPHIC FORECASTING MODEL (2570–2580) */}
      {activeSubView === 'forecast' && (
        <div className="space-y-6 w-full">
          <div className="bg-[#f2f2f3] p-6 rounded-[24px] w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-medium text-[#17191c] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#5d2a1a]" />
                  โมเดลทำนายการเติบโตและโครงสร้างประชากรผู้สูงอายุไทย (2566 – 2580)
                </h3>
                <p className="text-sm text-[#5f6370] mt-1">
                  พัฒนาจากแบบจำลองการถดถอยพหุคูณและการคาดประมาณประชากรของสำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ (สศช./NESDC)
                </p>
              </div>

              {/* Scenario Toggle */}
              <div className="flex items-center space-x-1.5 text-sm font-medium">
                <button
                  onClick={() => setForecastScenario('baseline')}
                  className={`px-4 py-2 min-h-[44px] rounded-full transition-all ${
                    forecastScenario === 'baseline'
                      ? 'bg-[#17191c] text-white'
                      : 'bg-white border border-[#ececec] text-[#5f6370] hover:text-[#17191c] hover:bg-[#fafafb]'
                  }`}
                >
                  แนวโน้มฐาน (Baseline)
                </button>
                <button
                  onClick={() => setForecastScenario('high')}
                  className={`px-4 py-2 min-h-[44px] rounded-full transition-all ${
                    forecastScenario === 'high'
                      ? 'bg-[#17191c] text-white'
                      : 'bg-white border border-[#ececec] text-[#5f6370] hover:text-[#17191c] hover:bg-[#fafafb]'
                  }`}
                >
                  สูงวัยเร่งด่วน (High)
                </button>
                <button
                  onClick={() => setForecastScenario('low')}
                  className={`px-4 py-2 min-h-[44px] rounded-full transition-all ${
                    forecastScenario === 'low'
                      ? 'bg-[#17191c] text-white'
                      : 'bg-white border border-[#ececec] text-[#5f6370] hover:text-[#17191c] hover:bg-[#fafafb]'
                  }`}
                >
                  อนุรักษ์นิยม (Low)
                </button>
              </div>
            </div>

            {/* Projection Area Chart in Steep palette */}
            <div className="h-96 w-full mb-4 bg-white p-4 rounded-2xl border border-[#ececec]">
              <ResponsiveContainer width="100%" height={340}>
                <AreaChart data={forecastChartData} margin={{ top: 15, right: 25, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ececec" />
                  <XAxis dataKey="year" tick={{ fontSize: 14, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} />
                  <YAxis domain={[9, 19]} tick={{ fontSize: 14, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} tickFormatter={(v) => `${v}M คน`} />
                  <Tooltip contentStyle={rechartsTooltipStyle} formatter={(val: any, name: any) => [`${val} ล้านคน`, name]} />
                  <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                  <ReferenceLine x="2569" stroke="#5d2a1a" strokeDasharray="3 3" label={{ value: 'จุดเริ่มทำนาย ➔', position: 'top', fill: '#5d2a1a', fontSize: 12 }} />
                  <Area
                    type="monotone"
                    dataKey="ผู้สูงอายุจริง"
                    stroke="#5d2a1a"
                    strokeWidth={2.5}
                    fillOpacity={0.15}
                    fill="#5d2a1a"
                    name="ข้อมูลจริง (2566–2569)"
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="ผู้สูงอายุทำนาย"
                    stroke="#17191c"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={0.1}
                    fill="#17191c"
                    name="ค่าทำนายอนาคต (2570–2580)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Milestone Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 pt-3.5 border-t border-[#ececec]">
              <div className="p-4 rounded-2xl bg-white border border-[#ececec]">
                <span className="text-xs uppercase tracking-wider text-[#6b6f7a] block font-medium">หมุดหมายที่ 1 (2567)</span>
                <span className="text-base font-medium text-[#17191c] block mt-1">ก้าวข้าม 20% สูงวัยสมบูรณ์</span>
                <p className="text-sm text-[#5f6370] mt-1">ผู้สูงอายุทะลุ 11.7 ล้านคน (1 ใน 5 ของประชากร)</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#ececec]">
                <span className="text-xs uppercase tracking-wider text-[#6b6f7a] block font-medium">หมุดหมายที่ 2 (2572)</span>
                <span className="text-base font-medium text-[#17191c] block mt-1">ผู้สูงอายุทะลุ 13.8 ล้านคน</span>
                <p className="text-sm text-[#5f6370] mt-1">คิดเป็น 1 ใน 4 ของประชากรไทย</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#ececec]">
                <span className="text-xs uppercase tracking-wider text-[#6b6f7a] block font-medium">หมุดหมายที่ 3 (2576)</span>
                <span className="text-base font-medium text-[#17191c] block mt-1">แตะระดับ 28% (Hyper-Aged)</span>
                <p className="text-sm text-[#5f6370] mt-1">เข้าสู่สังคมสูงวัยระดับยิ่งยวดเทียบเท่าญี่ปุ่น</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#ececec]">
                <span className="text-xs uppercase tracking-wider text-[#6b6f7a] block font-medium">หมุดหมายที่ 4 (2580)</span>
                <span className="text-base font-medium text-[#17191c] block mt-1">วิกฤตพึ่งพิง 1 : 1.7</span>
                <p className="text-sm text-[#5f6370] mt-1">วัยแรงงานเหลือเพียง 1.7 คน ต่อผู้สูงอายุ 1 คน</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: INFOGRAPHICS & HEALTH DEMOGRAPHICS */}
      {activeSubView === 'infographics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* Card 1: Super-Aged Gauge */}
          <div className="bg-[#fbe1d1] text-[#5d2a1a] p-6 rounded-[24px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-[#5d2a1a]/80 font-medium">ระดับสังคมสูงวัย</span>
                <span className="px-3 py-1 rounded-full border border-[#5d2a1a]/30 text-xs font-medium tabular-nums">ปี {currentYear}</span>
              </div>
              <h3 className="text-2xl font-serif font-normal text-[#5d2a1a]">Complete Aged Society</h3>
              <p className="text-sm text-[#5d2a1a]/90 mt-1.5 leading-[1.6]">
                ประเทศไทยก้าวข้ามเกณฑ์ 20% ของประชากรผู้สูงอายุอย่างเป็นทางการ
              </p>
            </div>

            <div className="my-6">
              <div className="flex justify-between text-sm mb-1.5">
                <span>สัดส่วนปัจจุบัน</span>
                <span className="font-serif font-normal text-2xl tabular-nums">{currentMetric.ratio}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#5d2a1a]/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#5d2a1a] rounded-full"
                  style={{ width: `${Math.min(100, (currentMetric.ratio / 28) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[#5d2a1a]/70 mt-1.5 tabular-nums">
                <span>10% Aging</span>
                <span>20% Aged</span>
                <span>28% Super-Aged</span>
              </div>
            </div>

            <div className="text-xs text-[#5d2a1a]/90 border-t border-[#5d2a1a]/15 pt-3">
              เป้าหมาย: ขยายการบริการคลินิกผู้สูงอายุให้ครอบคลุมโรงพยาบาลชุมชนทั่วประเทศ →
            </div>
          </div>

          {/* Card 2: Old-Age Dependency Ratio */}
          <div className="bg-[#f2f2f3] p-6 rounded-[24px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-[#6b6f7a] font-medium">อัตราส่วนการพึ่งพิง</span>
                <Scale className="w-5 h-5 text-[#17191c]" />
              </div>
              <h3 className="text-2xl font-serif font-normal text-[#17191c]">1 : 3.0 คน</h3>
              <p className="text-sm text-[#5f6370] mt-1.5 leading-[1.6]">
                ประชากรวัยแรงงาน (15-59 ปี) ทุก 3.0 คน ต้องดูแลผู้สูงอายุ 1 คน
              </p>
            </div>

            <div className="my-4 py-3.5 border-y border-[#ececec] flex items-center justify-around text-center">
              <div>
                <span className="text-xs text-[#6b6f7a] block">ปี 2566</span>
                <span className="text-lg font-serif font-normal text-[#17191c] tabular-nums">1 : 3.6</span>
              </div>
              <div className="text-[#ececec]">→</div>
              <div>
                <span className="text-xs text-[#5d2a1a] block font-medium">ปี 2569</span>
                <span className="text-2xl font-serif font-normal text-[#5d2a1a] tabular-nums">1 : 3.0</span>
              </div>
              <div className="text-[#ececec]">→</div>
              <div>
                <span className="text-xs text-[#5f6370] block">ปี 2580 (ทำนาย)</span>
                <span className="text-lg font-serif font-normal text-[#5f6370] tabular-nums">1 : 1.7</span>
              </div>
            </div>

            <div className="text-sm text-[#5f6370] leading-[1.6]">
              ภาระการพึ่งพิงเพิ่มขึ้นอย่างต่อเนื่อง ส่งผลต่องบประมาณหลักประกันสุขภาพและกองทุน LTC
            </div>
          </div>

          {/* Card 3: Gender Longevity Gap */}
          <div className="bg-[#f2f2f3] p-6 rounded-[24px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-[#6b6f7a] font-medium">ความต่างอายุขัย ชาย - หญิง</span>
                <HeartPulse className="w-5 h-5 text-[#17191c]" />
              </div>
              <h3 className="text-2xl font-serif font-normal text-[#17191c]">หญิง 56% / ชาย 44%</h3>
              <p className="text-sm text-[#5f6370] mt-1.5 leading-[1.6]">
                เพศหญิงอายุยืนกว่าเพศชายอย่างมีนัยสำคัญในทุกเขตสุขภาพ
              </p>
            </div>

            <div className="my-4 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#17191c] font-medium">หญิง (7.04M คน)</span>
                  <span className="font-serif font-normal text-lg text-[#5d2a1a] tabular-nums">56.0%</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-[#5d2a1a] rounded-full" style={{ width: '56%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#5f6370]">ชาย (5.53M คน)</span>
                  <span className="font-serif font-normal text-lg text-[#5f6370] tabular-nums">44.0%</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-[#b9826a] rounded-full" style={{ width: '44%' }} />
                </div>
              </div>
            </div>

            <div className="text-sm text-[#5f6370] leading-[1.6]">
              ในกลุ่มอายุ 80 ปีขึ้นไป ผู้หญิงครองสัดส่วนสูงถึง <strong className="text-[#17191c] font-medium">63.4%</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tab Dedicated Data Sources */}
      <TabSourceReference
        tabTitle="ข้อมูลประชากรผู้สูงอายุ (Aging Population & Projections)"
        lastUpdated="ปีงบประมาณ 2566–2569"
        sources={[
          {
            title: 'ระบบคลังข้อมูลด้านการแพทย์และสุขภาพ (Health Data Center: HDC)',
            dept: 'สำนักงานปลัดกระทรวงสาธารณสุข (สป.สธ.)',
            description: 'สถิติจำนวนประชากรและสัดส่วนผู้สูงอายุ 60 ปีขึ้นไป ปี 2566–2569 ครอบคลุม 12 เขตสุขภาพ 76 จังหวัด และจำแนกตามกลุ่มอายุย่อย'
          },
          {
            title: 'สำนักบริหารการทะเบียน กรมการปกครอง (DOPA)',
            dept: 'กระทรวงมหาดไทย',
            description: 'สถิติจำนวนประชากรและสัดส่วนผู้สูงอายุตามทะเบียนราษฎรรายจังหวัด และข้อมูลของกรุงเทพมหานคร (เขตสุขภาพที่ 13)'
          },
          {
            title: 'สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ (สศช. / NESDC)',
            dept: 'สำนักนายกรัฐมนตรี',
            description: 'รายงานการคาดประมาณประชากรของประเทศไทย พ.ศ. 2553–2583 ที่นำมาใช้สอบเทียบอัตราการเติบโตของแบบจำลองพยากรณ์ประชากร 2570–2580'
          }
        ]}
      />
    </div>
  );
};
