import React, { useState, useMemo, useEffect } from 'react';
import { PopSummaryZone, PopYearZone, PopProvinceData, DemographicProjection } from '../../types';
import { KPICard } from '../KPICard';
import { ThailandPopulationMap } from '../ThailandPopulationMap';
import { TabSourceReference } from '../TabSourceReference';
import {
  Users, TrendingUp, AlertTriangle, Scale, Calendar, Play, Pause,
  RotateCcw, Sparkles, MapPin, Globe2, Activity, ArrowUpRight,
  ShieldAlert, Clock, Layers, Filter, Compass, ChevronRight, BarChart3,
  Lightbulb, HeartPulse
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, Cell, ReferenceLine
} from 'recharts';

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
  }, [selectedProvince, byYearZones, currentYear, selectedZone]);

  // Forecast data with scenario applied
  const forecastChartData = useMemo(() => {
    return projections.map(p => {
      let eldTotal = p.elderly_total;
      let eldPct = p.elderly_pct;

      if (p.is_forecast) {
        if (forecastScenario === 'high' && p.high_scenario) {
          eldTotal = p.high_scenario.elderly_total;
          eldPct = p.high_scenario.elderly_pct;
        } else if (forecastScenario === 'low' && p.low_scenario) {
          eldTotal = p.low_scenario.elderly_total;
          eldPct = p.low_scenario.elderly_pct;
        }
      }

      return {
        year: p.year,
        isForecast: p.is_forecast,
        ผู้สูงอายุจริง: !p.is_forecast ? Number((eldTotal / 1000000).toFixed(2)) : null,
        ผู้สูงอายุทำนาย: p.is_forecast ? Number((eldTotal / 1000000).toFixed(2)) : null,
        ผู้สูงอายุรวม: Number((eldTotal / 1000000).toFixed(2)),
        สัดส่วนเปอร์เซ็นต์: eldPct,
        วัยต้น_60_69: Number((p.young_old / 1000000).toFixed(2)),
        วัยกลาง_70_79: Number((p.middle_old / 1000000).toFixed(2)),
        วัยปลาย_80ขึ้นไป: Number((p.old_old / 1000000).toFixed(2)),
        อัตราส่วนพึ่งพิง: p.working_ratio,
        ดัชนีสูงวัย: p.aging_index,
        stage: p.stage
      };
    });
  }, [projections, forecastScenario]);

  return (
    <div className="space-y-6">
      {/* 1. TIMELINE CONTROLLER & AUTO-PLAY BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-blue-950 p-4 rounded-2xl border border-slate-700/80 shadow-lg text-white flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Animation Controls */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-300/40 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>หยุดชั่วคราว</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>เล่นแนวโน้มอัตโนมัติ (Auto-Play)</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentYear('2566');
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="รีเซ็ตปีเริ่มต้น"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <span className="text-xs text-slate-300">
            ปีที่กำลังแสดง: <strong className="text-cyan-400 text-sm font-mono ml-1">{currentYear}</strong>
          </span>
        </div>

        {/* Center: Year Pill Buttons */}
        <div className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800 space-x-1">
          {availableYears.map(yr => (
            <button
              key={yr}
              onClick={() => {
                setIsPlaying(false);
                setCurrentYear(yr);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentYear === yr
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              ปี {yr} {yr === '2569' && ' (ล่าสุด)'}
            </button>
          ))}
        </div>

        {/* Right: Sub-View Switcher */}
        <div className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800 space-x-1 text-xs">
          <button
            onClick={() => setActiveSubView('map')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubView === 'map'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            แผนที่รายจังหวัด
          </button>
          <button
            onClick={() => setActiveSubView('forecast')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              activeSubView === 'forecast'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>โมเดลทำนาย 2570–2580</span>
          </button>
          <button
            onClick={() => setActiveSubView('infographics')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubView === 'infographics'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            อินโฟกราฟฟิก
          </button>
        </div>
      </div>

      {/* 2. TOP KPI CARDS (Drives dynamically by current animated year) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title={`ผู้สูงอายุปี ${currentYear}`}
          value={`${(currentMetric.total / 1000000).toFixed(2)}M คน`}
          subtitle={`ประชากร 60 ปีขึ้นไปทั่วประเทศ (${currentMetric.total.toLocaleString()} คน)`}
          badge={`ปีงบฯ ${currentYear}`}
          badgeColor="blue"
          icon={Users}
          variant="navy"
        />
        <KPICard
          title="สัดส่วนผู้สูงอายุ (Aging Ratio)"
          value={`${currentMetric.ratio}%`}
          subtitle="สัดส่วนต่อประชากรทุกช่วงอายุ"
          badge="สังคมสูงวัยสมบูรณ์"
          badgeColor="amber"
          icon={AlertTriangle}
        />
        <KPICard
          title="การเติบโต 4 ปี (2566–2569)"
          value="+11.79%"
          subtitle="เพิ่มขึ้น +1,325,636 คน"
          badge="+3.9% ต่อปี"
          badgeColor="emerald"
          icon={TrendingUp}
        />
        <KPICard
          title="สัดส่วนประชากรหญิงสูงวัย"
          value="56.0%"
          subtitle="หญิง 7.04M คน / ชาย 5.53M คน"
          badge="หญิงอายุยืนกว่าชาย"
          badgeColor="blue"
          icon={Scale}
        />
        <KPICard
          title="จังหวัดสัดส่วนสูงสุด"
          value="ลำปาง (33.2%)"
          subtitle="แพร่ (32.8%), สิงห์บุรี (31.5%)"
          badge="Super-Aged Zone"
          badgeColor="rose"
          icon={AlertTriangle}
        />
      </div>

      {/* 3. CONDITIONAL MAIN CONTENT BASED ON ACTIVE SUB-VIEW */}

      {/* SUB-VIEW 1: GEOGRAPHIC POPULATION MAP & PROVINCIAL DEMOGRAPHICS */}
      {activeSubView === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Thailand Population Map (7 cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <ThailandPopulationMap
              provinces={provincesInYear}
              year={currentYear}
              selectedProvinceName={selectedProvinceName}
              onSelectProvince={(pName) => setSelectedProvinceName(pName)}
              activeZone={selectedZone}
            />

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                กำลังแสดงข้อมูลประชากรผู้สูงอายุ: <strong>ปีงบประมาณ {currentYear} (ทั้ง 77 จังหวัด)</strong>
              </span>
              <span className="text-blue-600 font-semibold">
                {selectedProvince ? `โฟกัส: จังหวัด${selectedProvince.province}` : 'แสดงภาพรวมทั้งประเทศ'}
              </span>
            </div>
          </div>

          {/* Right: Dedicated Demographic Side Panel (Age Pyramid & Breakdown) (5 cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border-2 border-blue-200/90 shadow-md flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                      {selectedProvince ? selectedProvince.zone : 'ภาพรวมทั้งประเทศ (13 เขตสุขภาพ)'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      ปีงบประมาณ {currentYear}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-rose-500" />
                    {selectedProvince ? `จังหวัด${selectedProvince.province}` : 'โครงสร้างประชากรผู้สูงอายุไทย'}
                  </h3>
                </div>

                {selectedProvince && (
                  <button
                    onClick={() => setSelectedProvinceName('')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors font-medium"
                  >
                    ✕ ดูภาพรวม
                  </button>
                )}
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
                  <div className="text-[10px] text-slate-500">ผู้สูงอายุ (60+)</div>
                  <div className="text-base font-bold text-slate-900">
                    {selectedProvince
                      ? `${selectedProvince.elderly_total.toLocaleString()} คน`
                      : `${(currentMetric.total / 1000000).toFixed(2)}M คน`}
                  </div>
                </div>
                <div className="bg-emerald-50/70 rounded-xl p-2.5 text-center border border-emerald-100">
                  <div className="text-[10px] text-emerald-700 font-medium">สัดส่วนผู้สูงอายุ</div>
                  <div className="text-base font-bold text-emerald-800">
                    {selectedProvince
                      ? `${selectedProvince.elderly_pct.toFixed(1)}%`
                      : `${currentMetric.ratio}%`}
                  </div>
                </div>
                <div className="bg-blue-50/70 rounded-xl p-2.5 text-center border border-blue-100">
                  <div className="text-[10px] text-blue-700 font-medium">สถานะสังคมสูงวัย</div>
                  <div className="text-[11px] font-bold text-blue-900 mt-1">
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
                <div className="flex items-center justify-between mb-3 bg-slate-100 p-1 rounded-xl">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setPanelView('ranking')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        panelView === 'ranking'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>10 อันดับจังหวัดสูงวัย (Leaderboard)</span>
                    </button>
                    <button
                      onClick={() => setPanelView('pyramid')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        panelView === 'pyramid'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>ปิรามิดประชากร</span>
                    </button>
                  </div>

                  {panelView === 'ranking' && (
                    <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-200 text-[10px]">
                      <button
                        onClick={() => setRankMetric('pct')}
                        className={`px-2 py-0.5 rounded font-bold transition-all ${
                          rankMetric === 'pct' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        สัดส่วน (%)
                      </button>
                      <button
                        onClick={() => setRankMetric('total')}
                        className={`px-2 py-0.5 rounded font-bold transition-all ${
                          rankMetric === 'total' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:text-slate-800'
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
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                        ปิรามิดประชากรรายช่วงอายุ จังหวัด{selectedProvince.province} (ปี {currentYear})
                      </span>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span> ชาย
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span> หญิง
                        </span>
                      </div>
                    </div>

                    <div className="h-64 w-full bg-slate-50/60 p-2 rounded-xl border border-slate-100">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={ageDistribution}
                          layout="vertical"
                          margin={{ top: 5, right: 15, left: 15, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                          <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                          <YAxis dataKey="age" type="category" tick={{ fontSize: 10 }} width={55} />
                          <Tooltip
                            isAnimationActive={false}
                            formatter={(val: any, name: any) => [`${Number(val).toLocaleString()} คน`, name]}
                          />
                          <Bar dataKey="ชาย" fill="#3b82f6" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                          <Bar dataKey="หญิง" fill="#f43f5e" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Provincial Cohort Highlights */}
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                    <div className="font-bold flex items-center gap-1 mb-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>สถิติประชากรศาสตร์เฉพาะจังหวัด{selectedProvince.province}:</span>
                    </div>
                    <div>
                      ประชากรผู้สูงอายุรวม <strong>{selectedProvince.elderly_total.toLocaleString()} คน</strong> คิดเป็น{' '}
                      <strong>{selectedProvince.elderly_pct.toFixed(1)}%</strong> ของประชากรทั้งจังหวัด{' '}
                      ({selectedProvince.elderly_pct > currentMetric.ratio ? (
                        <span className="text-emerald-700 font-bold">สูงกว่าค่าเฉลี่ยประเทศ +{(selectedProvince.elderly_pct - currentMetric.ratio).toFixed(1)}%</span>
                      ) : (
                        <span className="text-blue-700 font-bold">ใกล้เคียงค่าเฉลี่ยประเทศ</span>
                      )})
                    </div>
                  </div>
                </div>
              ) : panelView === 'ranking' ? (
                /* VIEW B: TOP 10 VISUAL LEADERBOARD & PODIUM */
                <div>
                  {/* Top 3 Podium Cards */}
                  <div className="grid grid-cols-3 gap-2.5 mb-3">
                    {/* Rank 1: Gold Spotlight */}
                    {top3[0] && (
                      <button
                        onClick={() => setSelectedProvinceName(top3[0].province)}
                        className="p-3 rounded-2xl bg-gradient-to-b from-amber-50 via-amber-100/30 to-white border-2 border-amber-400 shadow-sm text-left transition-all hover:scale-[1.02] hover:shadow-md relative overflow-hidden group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 text-xs font-black flex items-center justify-center shadow-xs">
                            🥇
                          </span>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100/90 px-1.5 py-0.5 rounded">
                            {top3[0].zone.replace('เขตสุขภาพที่ ', 'เขต ')}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-sm group-hover:text-blue-700 truncate">
                          {top3[0].province}
                        </div>
                        <div className="text-base font-black text-amber-600 mt-0.5">
                          {rankMetric === 'pct' ? `${top3[0].elderly_pct.toFixed(1)}%` : `${(top3[0].elderly_total / 1000).toFixed(0)}k คน`}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {top3[0].elderly_total.toLocaleString()} คน
                        </div>
                      </button>
                    )}

                    {/* Rank 2: Silver Spotlight */}
                    {top3[1] && (
                      <button
                        onClick={() => setSelectedProvinceName(top3[1].province)}
                        className="p-3 rounded-2xl bg-gradient-to-b from-slate-50 via-slate-100/40 to-white border border-slate-300 shadow-sm text-left transition-all hover:scale-[1.02] hover:shadow-md relative overflow-hidden group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="w-5 h-5 rounded-full bg-slate-300 text-slate-800 text-xs font-black flex items-center justify-center shadow-xs">
                            🥈
                          </span>
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-200/80 px-1.5 py-0.5 rounded">
                            {top3[1].zone.replace('เขตสุขภาพที่ ', 'เขต ')}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-sm group-hover:text-blue-700 truncate">
                          {top3[1].province}
                        </div>
                        <div className="text-base font-black text-slate-700 mt-0.5">
                          {rankMetric === 'pct' ? `${top3[1].elderly_pct.toFixed(1)}%` : `${(top3[1].elderly_total / 1000).toFixed(0)}k คน`}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {top3[1].elderly_total.toLocaleString()} คน
                        </div>
                      </button>
                    )}

                    {/* Rank 3: Bronze Spotlight */}
                    {top3[2] && (
                      <button
                        onClick={() => setSelectedProvinceName(top3[2].province)}
                        className="p-3 rounded-2xl bg-gradient-to-b from-orange-50/70 via-amber-50/30 to-white border border-amber-300 shadow-sm text-left transition-all hover:scale-[1.02] hover:shadow-md relative overflow-hidden group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                            🥉
                          </span>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded">
                            {top3[2].zone.replace('เขตสุขภาพที่ ', 'เขต ')}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 text-sm group-hover:text-blue-700 truncate">
                          {top3[2].province}
                        </div>
                        <div className="text-base font-black text-amber-700 mt-0.5">
                          {rankMetric === 'pct' ? `${top3[2].elderly_pct.toFixed(1)}%` : `${(top3[2].elderly_total / 1000).toFixed(0)}k คน`}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {top3[2].elderly_total.toLocaleString()} คน
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Ranks 4 to 10 Visual Progress Rows */}
                  <div className="space-y-1.5 mb-3">
                    {ranks4to10.map((p, idx) => {
                      const rankNum = idx + 4;
                      const barWidth = rankMetric === 'pct'
                        ? Math.min(100, Math.max(15, (p.elderly_pct / 40) * 100))
                        : Math.min(100, Math.max(15, (p.elderly_total / 1400000) * 100));

                      return (
                        <button
                          key={p.province}
                          onClick={() => setSelectedProvinceName(p.province)}
                          className="w-full p-2 rounded-xl bg-slate-50/80 hover:bg-blue-50/90 border border-slate-200 hover:border-blue-300 transition-all text-left flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-3">
                            <span className="w-5 h-5 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              {rankNum}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-bold text-slate-800 group-hover:text-blue-700 truncate">
                                  {p.province}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {p.zone.replace('เขตสุขภาพที่ ', 'เขต ')} • {p.elderly_total.toLocaleString()} คน
                                </span>
                              </div>
                              {/* Continuous Gradient Progress Bar */}
                              <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-400 rounded-full transition-all"
                                  style={{ width: `${barWidth}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200">
                              {rankMetric === 'pct' ? `${p.elderly_pct.toFixed(1)}%` : `${p.elderly_total.toLocaleString()} คน`}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Strategic Policy Insight Box */}
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200/80 text-xs text-blue-950 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong className="text-blue-900 block mb-0.5">ข้อสังเกตเชิงยุทธศาสตร์ระบบสุขภาพ:</strong>
                      {rankMetric === 'pct' ? (
                        <span>
                          จังหวัดภาคเหนือตอนบน (เขตสุขภาพที่ 1) ครองสัดส่วนผู้สูงอายุเกิน <strong>33%</strong> ถึง 5 ใน 6 อันดับแรก
                          จึงเป็นพื้นที่เป้าหมายเร่งด่วนในการพัฒนาระบบคลินิกผู้สูงอายุ และการส่งต่อการดูแลระยะยาว (Long-Term Care)
                        </span>
                      ) : (
                        <span>
                          พื้นที่ที่มีจำนวนผู้สูงอายุสะสมสูงสุดคือ กรุงเทพฯ และหัวเมืองใหญ่ภาคอีสาน (นครราชสีมา, ขอนแก่น, อุบลฯ)
                          ต้องการขีดความสามารถการรองรับผู้ป่วยนอก (OPD) และเตียงเวชศาสตร์ผู้สูงอายุในปริมาณมาก
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* VIEW C: FULL AGE PYRAMID CHART */
                <div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                        ปิรามิดประชากรรายช่วงอายุ (60 – 100+ ปี) ภาพรวมประเทศ
                      </span>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span> ชาย
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span> หญิง
                        </span>
                      </div>
                    </div>

                    <div className="h-72 w-full bg-slate-50/60 p-2 rounded-xl border border-slate-100">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={ageDistribution}
                          layout="vertical"
                          margin={{ top: 5, right: 15, left: 15, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                          <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                          <YAxis dataKey="age" type="category" tick={{ fontSize: 10 }} width={55} />
                          <Tooltip
                            isAnimationActive={false}
                            formatter={(val: any, name: any) => [`${Number(val).toLocaleString()} คน`, name]}
                          />
                          <Bar dataKey="ชาย" fill="#3b82f6" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                          <Bar dataKey="หญิง" fill="#f43f5e" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* 3 Life Stages Summary */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100">
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-900 border border-blue-100">
                      <div className="text-[10px] text-blue-600 font-medium">วัยต้น (60-69 ปี)</div>
                      <div className="font-bold text-sm mt-0.5">54.2%</div>
                      <div className="text-[10px] text-slate-500">กลุ่มติดสังคม</div>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-100">
                      <div className="text-[10px] text-amber-600 font-medium">วัยกลาง (70-79 ปี)</div>
                      <div className="font-bold text-sm mt-0.5">31.3%</div>
                      <div className="text-[10px] text-slate-500">กลุ่มติดบ้าน</div>
                    </div>
                    <div className="p-2 rounded-xl bg-rose-50 text-rose-900 border border-rose-100">
                      <div className="text-[10px] text-rose-600 font-medium">วัยปลาย (80+ ปี)</div>
                      <div className="font-bold text-sm mt-0.5">14.5%</div>
                      <div className="text-[10px] text-slate-500">เสี่ยงติดเตียง</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: DEMOGRAPHIC FORECASTING MODEL (โมเดลทำนายประชากร 2570–2580) */}
      {activeSubView === 'forecast' && (
        <div className="space-y-6">
          {/* Forecast Header & Scenario Controls */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  โมเดลทำนายการเติบโตและโครงสร้างประชากรผู้สูงอายุไทย (2566 – 2580)
                </h3>
                <p className="text-xs text-slate-500">
                  พัฒนาจากแบบจำลองการถดถอยพหุคูณและการคาดประมาณประชากรของสำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ (สศช./NESDC)
                </p>
              </div>

              {/* Scenario Toggle */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs">
                <span className="text-slate-500 px-2 font-medium">แบบจำลอง:</span>
                <button
                  onClick={() => setForecastScenario('baseline')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    forecastScenario === 'baseline'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  แนวโน้มฐาน (Baseline)
                </button>
                <button
                  onClick={() => setForecastScenario('high')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    forecastScenario === 'high'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  สูงวัยเร่งด่วน (High Aging)
                </button>
                <button
                  onClick={() => setForecastScenario('low')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    forecastScenario === 'low'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  อนุรักษ์นิยม (Conservative)
                </button>
              </div>
            </div>

            {/* Projection Main Area Chart */}
            <div className="h-80 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastChartData} margin={{ top: 15, right: 25, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="actualArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="forecastArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis
                    domain={[9, 18]}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}M คน`}
                  />
                  <Tooltip
                    isAnimationActive={false}
                    formatter={(val: any, name: any) => [`${val} ล้านคน`, name]}
                  />
                  <Legend />
                  <ReferenceLine x="2569" stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'จุดเริ่มโมเดลทำนาย ➔', position: 'top', fill: '#f43f5e', fontSize: 10 }} />
                  <Area
                    type="monotone"
                    dataKey="ผู้สูงอายุจริง"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#actualArea)"
                    name="ข้อมูลจริง (2566–2569)"
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="ผู้สูงอายุทำนาย"
                    stroke="#9333ea"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#forecastArea)"
                    name="ค่าทำนายอนาคต (2570–2580)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Key Milestone Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
              <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200">
                <span className="text-[10px] font-bold text-blue-700 uppercase block">หมุดหมายที่ 1 (2567)</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">ก้าวข้าม 20% สูงวัยสมบูรณ์</span>
                <p className="text-[11px] text-slate-600 mt-1">ผู้สูงอายุทะลุ 11.7 ล้านคน (1 ใน 5 ของประชากรไทย)</p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200">
                <span className="text-[10px] font-bold text-purple-700 uppercase block">หมุดหมายที่ 2 (2572)</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">ผู้สูงอายุทะลุ 13.8 ล้านคน</span>
                <p className="text-[11px] text-slate-600 mt-1">คิดเป็น 1 ใน 4 ของประชากรไทย ต้องการเตียงคลินิกเพิ่ม 28%</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-700 uppercase block">หมุดหมายที่ 3 (2576)</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">แตะระดับ 28% (Hyper-Aged)</span>
                <p className="text-[11px] text-slate-600 mt-1">เข้าสู่สังคมสูงวัยระดับยิ่งยวดเทียบเท่าญี่ปุ่น</p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200">
                <span className="text-[10px] font-bold text-rose-700 uppercase block">หมุดหมายที่ 4 (2580)</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">วิกฤตพึ่งพิง 1 : 1.7</span>
                <p className="text-[11px] text-slate-600 mt-1">วัยแรงงานเหลือเพียง 1.7 คน ต้องดูแลผู้สูงอายุ 1 คน</p>
              </div>
            </div>
          </div>

          {/* Age Cohort Shift: Old-Old (80+) Explosive Growth */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" />
              การเปลี่ยนแปลง 3 ช่วงวัยผู้สูงอายุ: กลุ่มวัยปลาย (80 ปีขึ้นไป) ขยายตัวเร็วที่สุด
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              ประชากรกลุ่มอายุ 80 ปีขึ้นไป (กลุ่มเสี่ยงติดบ้านและติดเตียง) จะเพิ่มขึ้นจาก 1.49 ล้านคน (ปี 2566) สู่ 3.05 ล้านคน (ปี 2580) เพิ่มขึ้นกว่า 104%
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastChartData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}M`} />
                  <Tooltip
                    isAnimationActive={false}
                    formatter={(val: any, name: any) => [`${val} ล้านคน`, name]}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="วัยต้น_60_69" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="วัยต้น (60-69 ปี: ติดสังคม)" isAnimationActive={false} />
                  <Area type="monotone" dataKey="วัยกลาง_70_79" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="วัยกลาง (70-79 ปี: ติดบ้าน)" isAnimationActive={false} />
                  <Area type="monotone" dataKey="วัยปลาย_80ขึ้นไป" stackId="1" stroke="#ef4444" fill="#ef4444" name="วัยปลาย (80+ ปี: เสี่ยงติดเตียง)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: INFOGRAPHICS & HEALTH DEMOGRAPHICS */}
      {activeSubView === 'infographics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Super-Aged Gauge */}
          <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-blue-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-bold tracking-wider text-blue-300">
                  ระดับการเข้าสู่สังคมสูงวัย
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  ปี {currentYear}
                </span>
              </div>
              <h3 className="text-2xl font-black text-white">Super-Aged Society</h3>
              <p className="text-xs text-blue-200 mt-1">
                ประเทศไทยก้าวข้ามเกณฑ์ 20% ของประชากรผู้สูงอายุอย่างเป็นทางการ
              </p>
            </div>

            <div className="my-6">
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span>สัดส่วนปัจจุบัน</span>
                <span className="text-emerald-400 font-bold text-lg">{currentMetric.ratio}%</span>
              </div>
              <div className="w-full h-3 bg-blue-950 rounded-full overflow-hidden border border-blue-700/50">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-emerald-400 to-amber-400 rounded-full"
                  style={{ width: `${Math.min(100, (currentMetric.ratio / 28) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-blue-300 mt-1">
                <span>10% สังคมสูงวัย</span>
                <span>20% สูงวัยสมบูรณ์</span>
                <span>28% สูงวัยระดับสุดยอด</span>
              </div>
            </div>

            <div className="text-[11px] text-blue-200 bg-blue-950/60 p-2.5 rounded-xl border border-blue-800/40">
              💡 <strong>เป้าหมายระบบสุขภาพ:</strong> เน้นการขยายคลินิกผู้สูงอายุทุก รพช. ทั่วประเทศเพื่อรองรับกลุ่ม 70+
            </div>
          </div>

          {/* Card 2: Old-Age Dependency Ratio */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                  อัตราส่วนการพึ่งพิงวัยแรงงาน
                </span>
                <Scale className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">1 : 3.0 คน</h3>
              <p className="text-xs text-slate-500 mt-1">
                ประชากรวัยแรงงาน (15-59 ปี) ทุก 3.0 คน ต้องดูแลผู้สูงอายุ 1 คน
              </p>
            </div>

            <div className="my-4 py-3 border-y border-slate-100 flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">ปี 2566</span>
                <span className="text-base font-bold text-slate-800">1 : 3.6</span>
              </div>
              <div className="text-slate-300">➔</div>
              <div>
                <span className="text-[10px] text-blue-600 font-bold block">ปี 2569</span>
                <span className="text-xl font-bold text-blue-600">1 : 3.0</span>
              </div>
              <div className="text-slate-300">➔</div>
              <div>
                <span className="text-[10px] text-rose-500 font-bold block">ปี 2580 (ทำนาย)</span>
                <span className="text-base font-bold text-rose-600">1 : 1.7</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
              ภาระการพึ่งพิงเพิ่มขึ้นอย่างรวดเร็ว ส่งผลต่องบประมาณหลักประกันสุขภาพและกองทุนดูแลระยะยาว (LTC)
            </div>
          </div>

          {/* Card 3: Gender Longevity Gap */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                  ความเหลื่อมล้ำอายุขัย ชาย - หญิง
                </span>
                <HeartPulse className="w-4 h-4 text-rose-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">หญิง 56% / ชาย 44%</h3>
              <p className="text-xs text-slate-500 mt-1">
                เพศหญิงอายุยืนกว่าเพศชายอย่างมีนัยสำคัญในทุกเขตสุขภาพ
              </p>
            </div>

            <div className="my-4 space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-rose-600 font-bold">หญิง (7,037,846 คน)</span>
                  <span className="text-rose-600 font-bold">56.0%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '56%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-blue-600 font-bold">ชาย (5,529,730 คน)</span>
                  <span className="text-blue-600 font-bold">44.0%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '44%' }} />
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-rose-50/60 p-2.5 rounded-xl border border-rose-100">
              ในกลุ่มอายุ 80 ปีขึ้นไป ผู้หญิงครองสัดส่วนสูงถึง <strong>63.4%</strong> (หญิงอยู่คนเดียวมากกว่าชาย 1.7 เท่า)
            </div>
          </div>
        </div>
      )}

      {/* Tab 2 Dedicated Data Sources & Important Notes */}
      <TabSourceReference
        tabTitle="แท็บที่ 2: ข้อมูลประชากรผู้สูงอายุ (Aging Population & Projections)"
        accentColor="emerald"
        lastUpdated="พฤศจิกายน 2569"
        sources={[
          {
            title: 'ระบบคลังข้อมูลด้านการแพทย์และสุขภาพ (Health Data Center: HDC)',
            dept: 'สำนักงานปลัดกระทรวงสาธารณสุข (สป.สธ.)',
            url: 'https://hdcdev.moph.go.th/center/public/standard-report-detail/f83d0cd8b830706dab4cd3cb09afa584',
            displayUrl: 'hdcdev.moph.go.th',
            badge: 'ฐานข้อมูลประชากรรายเขต/รายจังหวัด',
            badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
            description: 'สถิติจำนวนประชากรและสัดส่วนผู้สูงอายุ 60 ปีขึ้นไป ปี 2566–2569 ครอบคลุม 12 เขตสุขภาพ 76 จังหวัด และจำแนกตามกลุ่มอายุย่อย',
            fileName: 'ข้อมูลประชากรผู้สูงอายุ_60ปีขึ้นไป_2566-2569_รายเขต_รายจังหวัด.xlsx'
          },
          {
            title: 'สำนักบริหารการทะเบียน กรมการปกครอง (DOPA)',
            dept: 'กระทรวงมหาดไทย',
            url: 'https://stat.bora.dopa.go.th',
            displayUrl: 'stat.bora.dopa.go.th',
            badge: 'สถิติทะเบียนราษฎร & กทม.',
            badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
            description: 'สถิติจำนวนประชากรและสัดส่วนผู้สูงอายุตามทะเบียนราษฎรรายจังหวัด และข้อมูลของกรุงเทพมหานคร (เขตสุขภาพที่ 13)'
          },
          {
            title: 'สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ (สศช. / NESDC)',
            dept: 'สำนักนายกรัฐมนตรี',
            url: 'https://www.nesdc.go.th',
            displayUrl: 'nesdc.go.th',
            badge: 'การคาดประมาณประชากรไทย',
            badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
            description: 'รายงานการคาดประมาณประชากรของประเทศไทย พ.ศ. 2553–2583 ที่นำมาใช้สอบเทียบอัตราการเติบโตของแบบจำลองพยากรณ์ประชากร 2570–2580'
          }
        ]}
        notes={[
          {
            id: 't2-typearea',
            title: '1. เงื่อนไขประชากรในระบบ HDC (Type Area 1, 3 และ Nation = 099)',
            content: 'ข้อมูลประชากรผู้สูงอายุ HDC ยึดเกณฑ์ Type Area 1 (มีชื่อในทะเบียนบ้านและตัวอยู่จริง) และ Type Area 3 (ตัวอยู่จริงแต่ไม่มีชื่อในทะเบียนบ้าน) ร่วมกับสัญชาติไทย (รหัส 099) เพื่อสะท้อนกลุ่มเป้าหมายผู้รับบริการสุขภาพจริงในพื้นที่'
          },
          {
            id: 't2-bkk',
            title: '2. ข้อมูลพื้นที่กรุงเทพมหานคร (เขตสุขภาพที่ 13)',
            content: 'สป.สธ. ไม่มีสถานพยาบาลสังกัดใน กทม. จึงไม่มีข้อมูล 43 แฟ้มใน HDC ดังนั้นข้อมูลประชากร กทม. ในแดชบอร์ดนี้จึงนำเข้าจากฐานข้อมูลสถิติทะเบียนราษฎร กรมการปกครอง (DOPA) ณ สิ้นปีของแต่ละปีงบประมาณ'
          },
          {
            id: 't2-aging-level',
            title: '3. นิยามระดับสังคมสูงวัย (Aging Classification)',
            content: 'สังคมสูงวัย (Aging) ผู้สูงอายุ 60+ เกิน 10%, สังคมสูงวัยอย่างสมบูรณ์ (Aged) เกิน 20% (ประเทศไทยก้าวเข้าสู่ขั้นนี้ตั้งแต่ปี 2564 โดยปี 2569 อยู่ที่ 20.91%), และสังคมสูงวัยระดับสุดยอด (Super-Aged) เกิน 28% (คาดการณ์ปี 2572-2574)'
          },
          {
            id: 't2-forecast',
            title: '4. แบบจำลองการทำนายแนวโน้มประชากร (2570–2580)',
            content: 'พัฒนาด้วยเทคนิค CAGR และ Modified Cohort Survival Ratio อิงฐานข้อมูลจริง 2566–2569 ร่วมกับสมมติฐานการคาดประมาณของ สศช. ภายใต้ 3 ฉากทัศน์ เพื่อสนับสนุนการวางแผนนโยบายกำลังคนและระบบบริการระยะยาว'
          }
        ]}
      />
    </div>
  );
};
