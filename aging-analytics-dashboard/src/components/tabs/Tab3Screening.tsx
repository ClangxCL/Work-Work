import React, { useState, useMemo } from 'react';
import { ScreeningByYear, ScreeningProvinceData } from '../../types';
import rawScreeningProvinces from '../../data/screeningProvinces.json';
import { KPICard } from '../KPICard';
import { TabSourceReference } from '../TabSourceReference';
import { ThailandScreeningMap, ScreeningMetricKey, METRIC_CONFIG } from '../ThailandScreeningMap';
import {
  ShieldAlert, Eye, Stethoscope, Activity, HeartHandshake,
  Sparkles, Layers, Search, X, MapPin, ArrowUpDown,
  Flame, CheckCircle2, ListFilter, Map, Info
} from 'lucide-react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { CHART_PALETTE, rechartsTooltipStyle } from '../../theme/chartTheme';

interface Tab3ScreeningProps {
  screeningByYear?: Record<string, any>;
  selectedZone?: string;
  selectedYear: string;
}

export const Tab3Screening: React.FC<Tab3ScreeningProps> = ({
  screeningByYear,
  selectedZone = 'ALL',
  selectedYear
}) => {
  const provincesByYearRecord = rawScreeningProvinces as unknown as Record<string, any>;

  const currentProvinces: ScreeningProvinceData[] = useMemo(() => {
    const raw = provincesByYearRecord[selectedYear] || provincesByYearRecord['2569'] || provincesByYearRecord['2568'];
    if (Array.isArray(raw) && raw.length > 0) return raw as ScreeningProvinceData[];
    if (raw?.provinces && Array.isArray(raw.provinces) && raw.provinces.length > 0) return raw.provinces as ScreeningProvinceData[];
    const currentData = screeningByYear?.[selectedYear] || screeningByYear?.['2569'] || screeningByYear?.['2568'];
    if (Array.isArray(currentData) && currentData.length > 0) return currentData as ScreeningProvinceData[];
    return (currentData as any)?.provinces || [];
  }, [selectedYear, screeningByYear, provincesByYearRecord]);

  // Active risk metric filter
  const [activeMetric, setActiveMetric] = useState<ScreeningMetricKey>('vision');
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('เชียงใหม่');
  const [viewMode, setViewMode] = useState<'map' | 'table' | 'ranking'>('map');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [zoneFilter, setZoneFilter] = useState<string>(selectedZone || 'ALL');
  const [riskLevelFilter, setRiskLevelFilter] = useState<'ALL' | 'HOTSPOT' | 'LOW'>('ALL');
  const [sortBy, setSortBy] = useState<'risk_desc' | 'risk_cases_desc' | 'name_asc'>('risk_desc');

  const activeMetricCfg = METRIC_CONFIG[activeMetric];

  // National 9 domains overview
  const national9Domains = useMemo(() => [
    { name: '1. สายตา/การมองเห็น', screened: 9182964, risk: 1372196, riskPct: 14.9, icon: Eye, color: '#5d2a1a', key: 'vision', desc: 'ต้อกระจก สายตาเลือนราง เสี่ยงต่ออุบัติเหตุ' },
    { name: '2. สุขภาพช่องปาก', screened: 9201193, risk: 1099281, riskPct: 11.9, icon: Stethoscope, color: '#17191c', key: 'oral', desc: 'มีฟันเคี้ยวอาหารน้อยกว่า 20 ซี่ กระทบภาวะโภชนาการ' },
    { name: '3. การเคลื่อนไหว/หกล้ม', screened: 9191600, risk: 815769, riskPct: 8.9, icon: Activity, color: '#b9826a', key: 'movement', desc: 'ทดสอบ TUG ลุกยืนเดิน ทรงตัวบกพร่อง เสี่ยงต่อการหกล้ม' },
    { name: '4. กิจวัตรประจำวัน (ADL)', screened: 9379648, risk: 585267, riskPct: 6.2, icon: HeartHandshake, color: '#777b86', key: 'adl', desc: 'กลุ่มติดบ้านและติดเตียง ต้องการผู้ดูแล (Caregiver)' },
    { name: '5. การได้ยิน (หูตึง/หนวก)', screened: 8962342, risk: 467799, riskPct: 5.2, icon: Sparkles, color: '#e8b9a0', key: 'hearing', desc: 'ได้ยินไม่ชัดเจน นำไปสู่ภาวะแยกตัวจากสังคม' },
    { name: '6. ความคิดความจำ', screened: 8768736, risk: 442860, riskPct: 5.1, icon: ShieldAlert, color: '#a3a6af', key: 'cognition', desc: 'สงสัยสมองเสื่อม (Dementia) จากแบบประเมิน Mini-Cog' },
    { name: '7. การกลั้นปัสสาวะ', screened: 9071493, risk: 407193, riskPct: 4.5, icon: Activity, color: '#8a5a45', key: 'urine', desc: 'ปัสสาวะเล็ดราด กระทบสุขอนามัยและคุณภาพชีวิต' },
    { name: '8. ภาวะโภชนาการ', screened: 8962399, risk: 371156, riskPct: 4.1, icon: HeartHandshake, color: '#d9d9dc', key: 'nutrition', desc: 'ภาวะขาดสารอาหาร/น้ำหนักลดผิดปกติในผู้สูงอายุ' },
    { name: '9. ภาวะซึมเศร้า (2Q)', screened: 9214935, risk: 131179, riskPct: 1.4, icon: ShieldAlert, color: '#c9a18d', key: 'depression', desc: 'คัดกรองเบื้องต้นด้วยแบบคัดกรอง 2 คำถาม (2Q)' },
  ], []);

  const getMetricRiskPct = (p: ScreeningProvinceData): number => {
    return p.domains[activeMetric]?.risk_pct || 0;
  };

  const getMetricRiskCount = (p: ScreeningProvinceData): number => {
    return p.domains[activeMetric]?.risk || 0;
  };

  const filteredProvinces = useMemo(() => {
    let list = [...currentProvinces];

    if (zoneFilter !== 'ALL') {
      const zNum = zoneFilter.replace(/^0+/, '');
      list = list.filter(p => p.zone_code === zoneFilter || p.zone.includes(zNum));
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      list = list.filter(p =>
        p.province.toLowerCase().includes(term) ||
        p.zone.toLowerCase().includes(term) ||
        p.top_risk_name.toLowerCase().includes(term)
      );
    }

    if (riskLevelFilter === 'HOTSPOT') {
      list = list.filter(p => getMetricRiskPct(p) > activeMetricCfg.nationalAvg);
    } else if (riskLevelFilter === 'LOW') {
      list = list.filter(p => getMetricRiskPct(p) <= activeMetricCfg.nationalAvg);
    }

    list.sort((a, b) => {
      if (sortBy === 'risk_desc') {
        return getMetricRiskPct(b) - getMetricRiskPct(a);
      }
      if (sortBy === 'risk_cases_desc') {
        return getMetricRiskCount(b) - getMetricRiskCount(a);
      }
      if (sortBy === 'name_asc') {
        return a.province.localeCompare(b.province, 'th');
      }
      return 0;
    });

    return list;
  }, [currentProvinces, zoneFilter, searchTerm, riskLevelFilter, sortBy, activeMetric, activeMetricCfg.nationalAvg]);

  const top5RiskProvinces = useMemo(() => {
    return [...currentProvinces]
      .sort((a, b) => getMetricRiskPct(b) - getMetricRiskPct(a))
      .slice(0, 5);
  }, [currentProvinces, activeMetric]);

  const bottom5RiskProvinces = useMemo(() => {
    return [...currentProvinces]
      .filter(p => getMetricRiskPct(p) > 0)
      .sort((a, b) => getMetricRiskPct(a) - getMetricRiskPct(b))
      .slice(0, 5);
  }, [currentProvinces, activeMetric]);

  const selectedProvince = useMemo(() => {
    if (!selectedProvinceName) return null;
    return currentProvinces.find(p =>
      p.province === selectedProvinceName ||
      (selectedProvinceName === 'กรุงเทพฯ' && p.province === 'กรุงเทพมหานคร') ||
      (selectedProvinceName === 'กรุงเทพมหานคร' && p.province === 'กรุงเทพฯ')
    );
  }, [currentProvinces, selectedProvinceName]);

  const zoneOptions = [
    { code: 'ALL', name: 'ทุกเขตสุขภาพ (ทั่วประเทศ)' },
    { code: '01', name: 'เขตสุขภาพที่ 1 (ภาคเหนือตอนบน)' },
    { code: '02', name: 'เขตสุขภาพที่ 2 (ภาคเหนือตอนล่าง 1)' },
    { code: '03', name: 'เขตสุขภาพที่ 3 (ภาคเหนือตอนล่าง 2)' },
    { code: '04', name: 'เขตสุขภาพที่ 4 (ภาคกลางตอนบน)' },
    { code: '05', name: 'เขตสุขภาพที่ 5 (ภาคกลางตอนล่าง)' },
    { code: '06', name: 'เขตสุขภาพที่ 6 (ภาคตะวันออก)' },
    { code: '07', name: 'เขตสุขภาพที่ 7 (ภาคอีสานตอนกลาง)' },
    { code: '08', name: 'เขตสุขภาพที่ 8 (ภาคอีสานตอนบน)' },
    { code: '09', name: 'เขตสุขภาพที่ 9 (ภาคอีสานตอนล่าง 1)' },
    { code: '10', name: 'เขตสุขภาพที่ 10 (ภาคอีสานตอนล่าง 2)' },
    { code: '11', name: 'เขตสุขภาพที่ 11 (ภาคใต้ตอนบน)' },
    { code: '12', name: 'เขตสุขภาพที่ 12 (ภาคใต้ตอนล่าง)' },
    { code: '13', name: 'เขตสุขภาพที่ 13 (กรุงเทพมหานคร)' },
  ];

  return (
    <div className="space-y-12 text-[#17191c]">
      {/* Editorial Section Header */}
      <div className="space-y-2 mb-6">
        <span className="text-xs text-[#6b6f7a] uppercase block font-medium">
          Basic & Community Health Screening · ปีงบประมาณ {selectedYear}
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-[#17191c] leading-[1.4] mb-2">
          การคัดกรองผู้สูงอายุ 9 ด้าน (Basic/Community Screen)
        </h2>
        <p className="text-base text-[#5f6370] w-full leading-[1.6] mb-6">
          วิเคราะห์ความชุกและตรวจจับพื้นที่เสี่ยงสูง (Risk Hotspots) ราย 77 จังหวัด อ้างอิงผลคัดกรองตามแนวทาง WHO ICOPE
        </p>
      </div>

      {/* Top 5 Risk KPI Cards: auto-fit full row width */}
      <div className="kpi-grid">
        <KPICard
          title="ความเสี่ยงอันดับ 1: สายตา"
          value="14.9%"
          subtitle="พบความเสี่ยง 1.37 ล้านคน"
          badge="ต้อกระจก/เลือนราง"
          icon={Eye}
          variant="peach" // 1 single accent peach card per tab
        />
        <KPICard
          title="ความเสี่ยงอันดับ 2: ช่องปาก"
          value="11.9%"
          subtitle="ปัญหาเคี้ยวอาหาร 1.10 ล้านคน"
          badge="ฟันแท้ < 20 ซี่"
          icon={Stethoscope}
          variant="neutral"
        />
        <KPICard
          title="ความเสี่ยงอันดับ 3: การเคลื่อนไหว"
          value="8.9%"
          subtitle="เสี่ยงต่อการหกล้ม 815,769 คน"
          badge="TUG ผิดปกติ"
          icon={Activity}
          variant="neutral"
        />
        <KPICard
          title="กลุ่มติดบ้าน/ติดเตียง (ADL)"
          value="6.2%"
          subtitle="พึ่งพิงผู้อื่น 585,267 คน"
          badge="ต้องการ Caregiver"
          icon={HeartHandshake}
          variant="neutral"
        />
        <KPICard
          title="ความเสี่ยงความคิดความจำ"
          value="5.1%"
          subtitle="สงสัยสมองเสื่อม 442,860 คน"
          badge="Mini-Cog ผิดปกติ"
          icon={ShieldAlert}
          variant="neutral"
        />
      </div>

      {/* INTERACTIVE 9 DOMAINS SELECTOR PILLS BAR */}
      <div className="bg-[#f2f2f3] rounded-[24px] p-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 font-medium text-[#17191c]">
            <Layers className="w-4 h-4 text-[#17191c]" />
            <span>เลือกมิติสุขภาพที่ต้องการเฝ้าระวังความเสี่ยง (9 ด้าน):</span>
          </div>
          <span className="text-xs text-[#5f6370] hidden sm:inline">
            คลิกเลือกมิติเพื่อเปลี่ยนการแสดงผลบนแผนที่ ตาราง และอันดับ Hotspot
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
          {national9Domains.map(d => {
            const isActive = activeMetric === d.key;
            const Icon = d.icon;
            return (
              <button
                key={d.key}
                onClick={() => setActiveMetric(d.key as ScreeningMetricKey)}
                className={`p-3.5 rounded-2xl text-left transition-all flex flex-col justify-between min-h-[96px] ${
                  isActive
                    ? 'bg-[#17191c] text-white shadow-none'
                    : 'bg-white text-[#17191c] hover:bg-[#fafafb] border border-[#ececec]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-[#f2f2f3] text-[#17191c]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-base font-medium tabular-nums leading-[1.35] ${isActive ? 'text-[#fbe1d1]' : 'text-[#5d2a1a]'}`}>
                    {d.riskPct}%
                  </span>
                </div>
                <div className="leading-[1.4]">
                  <div className={`text-sm font-medium break-words ${isActive ? 'text-white' : 'text-[#17191c]'}`}>
                    {d.name.split('. ')[1]}
                  </div>
                  <span className={`text-xs block mt-0.5 tabular-nums font-normal ${isActive ? 'text-[#e8b9a0]' : 'text-[#5f6370]'}`}>
                    {(d.risk / 1000).toFixed(0)}k คน
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEARCH & RISK FILTERS TOOLBAR: Floating Product Artifact Card */}
      <div className="bg-white rounded-[20px] shadow-[0_0_0_1px_rgba(4,23,43,0.05),0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-[#5f6370] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อจังหวัดที่ต้องการเฝ้าระวังความเสี่ยง (เช่น เชียงใหม่, ขอนแก่น)..."
              className="w-full pl-10 pr-9 py-2.5 text-sm sm:text-base rounded-[16px] border border-[#ececec] focus:outline-none focus:border-[#17191c] bg-white transition-all text-[#17191c] placeholder-[#a3a6af] min-h-[44px]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6370] hover:text-[#17191c]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filters on the right */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Zone Selector */}
            <div className="flex items-center bg-white border border-[#ececec] rounded-[16px] px-3.5 py-2 text-sm text-[#17191c] min-h-[44px]">
              <MapPin className="w-4 h-4 text-[#5f6370] mr-2 shrink-0" />
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="bg-transparent text-[#17191c] font-normal focus:outline-none cursor-pointer max-w-[210px] text-sm"
              >
                {zoneOptions.map(z => (
                  <option key={z.code} value={z.code}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center bg-white border border-[#ececec] rounded-[16px] px-3.5 py-2 text-sm text-[#17191c] min-h-[44px]">
              <ArrowUpDown className="w-4 h-4 text-[#5f6370] mr-2 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[#17191c] font-normal focus:outline-none cursor-pointer text-sm"
              >
                <option value="risk_desc">ความเสี่ยงสูงสุด ➔ ต่ำสุด</option>
                <option value="risk_cases_desc">จำนวนผู้พบเสี่ยงมากสุด</option>
                <option value="name_asc">ชื่อจังหวัด (ก-ฮ)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Risk Level Filter Pills & View Mode */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#ececec] text-sm">
          {/* Risk Level Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#5f6370] text-xs mr-1 font-medium">ระดับความเสี่ยง:</span>
            <button
              onClick={() => setRiskLevelFilter('ALL')}
              className={`px-4 py-2 rounded-full transition-all min-h-[44px] flex items-center ${
                riskLevelFilter === 'ALL'
                  ? 'bg-[#17191c] text-white font-medium'
                  : 'bg-transparent border border-[#ececec] text-[#17191c] hover:bg-[#fafafb] font-medium'
              }`}
            >
              ทั้งหมด ({currentProvinces.length})
            </button>
            <button
              onClick={() => setRiskLevelFilter('HOTSPOT')}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 min-h-[44px] ${
                riskLevelFilter === 'HOTSPOT'
                  ? 'bg-[#17191c] text-white font-medium'
                  : 'bg-transparent border border-[#ececec] text-[#17191c] hover:bg-[#fafafb] font-medium'
              }`}
            >
              <span>เสี่ยงสูงกว่าค่าเฉลี่ย (&gt;{activeMetricCfg.nationalAvg}%)</span>
            </button>
            <button
              onClick={() => setRiskLevelFilter('LOW')}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 min-h-[44px] ${
                riskLevelFilter === 'LOW'
                  ? 'bg-[#17191c] text-white font-medium'
                  : 'bg-transparent border border-[#ececec] text-[#17191c] hover:bg-[#fafafb] font-medium'
              }`}
            >
              <span>เสี่ยงต่ำกว่าค่าเฉลี่ย</span>
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all min-h-[44px] ${
                viewMode === 'map'
                  ? 'bg-[#17191c] text-white font-medium'
                  : 'text-[#5f6370] hover:text-[#17191c] border border-transparent font-medium'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>แผนที่ฮีทแมพ</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all min-h-[44px] ${
                viewMode === 'table'
                  ? 'bg-[#17191c] text-white font-medium'
                  : 'text-[#5f6370] hover:text-[#17191c] border border-transparent font-medium'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span>ตาราง 77 จังหวัด ({filteredProvinces.length})</span>
            </button>
            <button
              onClick={() => setViewMode('ranking')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all min-h-[44px] ${
                viewMode === 'ranking'
                  ? 'bg-[#17191c] text-white font-medium'
                  : 'text-[#5f6370] hover:text-[#17191c] border border-transparent font-medium'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>5 อันดับ Hotspot</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: RISK HEATMAP & PROVINCE RISK INSPECTOR */}
      {viewMode === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          {/* Left: Risk Heatmap Map (7 cols) */}
          <div className="lg:col-span-7 min-w-0 w-full">
            <ThailandScreeningMap
              provinces={currentProvinces}
              selectedProvinceName={selectedProvinceName}
              onSelectProvince={(pName) => setSelectedProvinceName(pName)}
              activeZone={zoneFilter}
              activeMetric={activeMetric}
              onChangeMetric={(m) => setActiveMetric(m)}
            />
          </div>

          {/* Right: Selected Province Risk Inspector (5 cols) */}
          <div className="lg:col-span-5 min-w-0 w-full space-y-4">
            {selectedProvince ? (
              <div className="bg-[#f2f2f3] rounded-[24px] p-6 space-y-4">
                {/* Province Header */}
                <div className="flex items-start justify-between border-b border-[#ececec] pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-white text-[#5f6370] border border-[#ececec]">
                        {selectedProvince.zone}
                      </span>
                      <span className="text-xs text-[#6b6f7a]">รหัส {selectedProvince.province_code}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[#17191c] flex items-center gap-2 leading-[1.35]">
                      <MapPin className="w-5 h-5 text-[#17191c]" />
                      จังหวัด{selectedProvince.province}
                    </h3>
                  </div>

                  <span className="px-3.5 py-1.5 rounded-full text-xs font-medium border border-[#ececec] bg-white text-[#5d2a1a]">
                    เสี่ยงสูงสุด: {selectedProvince.top_risk_name}
                  </span>
                </div>

                {/* Key Risk Statistics for Selected Province */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white border border-[#ececec]">
                    <span className="text-sm text-[#5f6370] block font-medium">ผู้พบความเสี่ยงรวมทุกมิติ</span>
                    <strong className="text-2xl font-serif font-normal text-[#17191c] tabular-nums block mt-1 leading-[1.35]">
                      {selectedProvince.total_risk_cases.toLocaleString()} ราย
                    </strong>
                    <span className="text-xs text-[#6b6f7a] block mt-0.5">รวมทุกภาวะที่ตรวจพบ</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#fbe1d1] text-[#5d2a1a] border-0">
                    <span className="text-sm text-[#5d2a1a] block font-medium">ความเสี่ยง ({activeMetricCfg.shortName.split(' ')[1]})</span>
                    <strong className="text-2xl font-serif font-normal text-[#5d2a1a] tabular-nums block mt-1 leading-[1.35]">
                      {getMetricRiskPct(selectedProvince)}%
                    </strong>
                    <span className="text-xs text-[#5d2a1a]/90 block mt-0.5">
                      {getMetricRiskPct(selectedProvince) > activeMetricCfg.nationalAvg
                        ? `สูงกว่าค่าเฉลี่ยชาติ (+${(getMetricRiskPct(selectedProvince) - activeMetricCfg.nationalAvg).toFixed(1)}%)`
                        : `ต่ำกว่าค่าเฉลี่ยชาติ (-${(activeMetricCfg.nationalAvg - getMetricRiskPct(selectedProvince)).toFixed(1)}%)`}
                    </span>
                  </div>
                </div>

                {/* 9 Risk Domains Detailed Breakdown for Selected Province */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium text-[#17191c] pt-2 border-t border-[#ececec]">
                    <span>ความชุกของภาวะเสี่ยง 9 มิติ (จ.{selectedProvince.province})</span>
                    <span className="text-xs text-[#5f6370]">เทียบค่าเฉลี่ยประเทศ</span>
                  </div>

                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                    {[
                      { key: 'vision', label: '1. สายตาและการมองเห็น', item: selectedProvince.domains.vision, avg: 14.9, icon: Eye },
                      { key: 'oral', label: '2. สุขภาพช่องปาก/การเคี้ยว', item: selectedProvince.domains.oral, avg: 11.9, icon: Stethoscope },
                      { key: 'movement', label: '3. การเคลื่อนไหว/หกล้ม', item: selectedProvince.domains.movement, avg: 8.9, icon: Activity },
                      { key: 'adl', label: '4. ติดบ้าน/ติดเตียง (ADL)', item: selectedProvince.domains.adl, avg: 6.2, icon: HeartHandshake },
                      { key: 'hearing', label: '5. การได้ยิน (หูตึง)', item: selectedProvince.domains.hearing, avg: 5.2, icon: Sparkles },
                      { key: 'cognition', label: '6. ความคิดความจำ/สมองเสื่อม', item: selectedProvince.domains.cognition, avg: 5.1, icon: ShieldAlert },
                      { key: 'urine', label: '7. การกลั้นปัสสาวะ', item: selectedProvince.domains.urine, avg: 4.5, icon: Activity },
                      { key: 'nutrition', label: '8. ภาวะโภชนาการ/ผอมลีบ', item: selectedProvince.domains.nutrition, avg: 4.1, icon: HeartHandshake },
                      { key: 'depression', label: '9. ภาวะซึมเศร้า (2Q)', item: selectedProvince.domains.depression, avg: 1.4, icon: ShieldAlert },
                    ].map(d => {
                      const riskPct = d.item?.risk_pct || 0;
                      const riskCount = d.item?.risk || 0;
                      const isHigh = riskPct > d.avg;

                      return (
                        <div
                          key={d.key}
                          onClick={() => setActiveMetric(d.key as ScreeningMetricKey)}
                          className={`p-3.5 rounded-2xl border text-sm transition-all cursor-pointer ${
                            d.key === activeMetric
                              ? 'bg-[#17191c] text-white border-[#17191c]'
                              : 'bg-white border-[#ececec] text-[#17191c] hover:bg-[#fafafb]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{d.label}</span>
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold tabular-nums ${d.key === activeMetric ? 'text-[#fbe1d1]' : 'text-[#5d2a1a]'}`}>
                                {riskPct}%
                              </span>
                              <span className={`text-xs px-2.5 py-0.5 rounded-full border ${
                                d.key === activeMetric
                                  ? 'border-white/20 text-white'
                                  : isHigh ? 'border-[#ececec] text-[#5d2a1a]' : 'border-[#ececec] text-[#5f6370]'
                              }`}>
                                {isHigh ? `+${(riskPct - d.avg).toFixed(1)}%` : 'ต่ำกว่าเฉลี่ย'}
                              </span>
                            </div>
                          </div>

                          <div className={`flex justify-between text-xs tabular-nums ${d.key === activeMetric ? 'text-[#e8b9a0]' : 'text-[#5f6370]'}`}>
                            <span>พบกลุ่มเสี่ยง: {riskCount.toLocaleString()} คน</span>
                            <span>ค่าเฉลี่ยชาติ: {d.avg}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-xs text-[#5f6370] bg-white p-3.5 rounded-2xl border border-[#ececec] flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#17191c] shrink-0" />
                  <span>คลิกเลือกจังหวัดอื่น ๆ บนแผนที่ฮีทแมพเพื่อตรวจดูสถานการณ์ความเสี่ยงรายพื้นที่</span>
                </div>
              </div>
            ) : (
              <div className="bg-[#f2f2f3] rounded-[24px] p-10 text-center text-[#5f6370]">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-[#6b6f7a]" />
                <p className="text-base font-normal">คลิกเลือกจังหวัดบนแผนที่ฮีทแมพเพื่อดูรายงานความเสี่ยง</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: FULL 77-PROVINCE RISK SURVEILLANCE TABLE */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-[24px] border border-[#ececec] overflow-hidden w-full min-w-0">
          <div className="p-5 bg-[#fafafb] border-b border-[#ececec] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-normal text-[#17191c]">
                ตารางเฝ้าระวังพื้นที่เสี่ยงสุขภาพ 77 จังหวัด ({filteredProvinces.length} จังหวัด)
              </h3>
              <p className="text-xs text-[#777b86]">
                จัดอันดับตามความชุกของภาวะเสี่ยงในมิติ: <strong className="text-[#17191c] font-normal">{activeMetricCfg.name}</strong> (ค่าเฉลี่ยประเทศ: {activeMetricCfg.nationalAvg}%)
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-white border border-[#ececec] text-[#777b86] tabular-nums">
              ปีงบประมาณ {selectedYear}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-base text-[#17191c]">
              <thead className="bg-[#fafafb] text-[#5f6370] font-medium text-sm border-b border-[#ececec] sticky top-0 z-10">
                <tr>
                  <th className="py-3.5 px-4 text-center">อันดับเสี่ยง</th>
                  <th className="py-3.5 px-4 text-left">จังหวัด</th>
                  <th className="py-3.5 px-4">เขตสุขภาพ</th>
                  <th className="py-3.5 px-4 text-right">ผู้พบเสี่ยง (คน)</th>
                  <th className="py-3.5 px-4 text-right">อัตราความเสี่ยง (%)</th>
                  <th className="py-3.5 px-4">ระดับความรุนแรงเทียบค่าเฉลี่ยชาติ</th>
                  <th className="py-3.5 px-4">มิติเสี่ยงสูงสุดประจำจังหวัด</th>
                  <th className="py-3.5 px-4 text-center">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ececec]">
                {filteredProvinces.map((p, idx) => {
                  const rPct = getMetricRiskPct(p);
                  const rCount = getMetricRiskCount(p);
                  const isHigh = rPct > activeMetricCfg.nationalAvg;
                  const isSelected = selectedProvinceName === p.province;

                  return (
                    <tr
                      key={p.province}
                      className={`hover:bg-[#fafafb] transition-colors h-[54px] ${
                        isSelected ? 'bg-[#f2f2f3]' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium tabular-nums bg-[#f2f2f3] text-[#17191c]">
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#17191c] text-base text-left">
                        จ.{p.province}
                      </td>
                      <td className="py-3.5 px-4 text-[#5f6370] text-sm">
                        {p.zone}
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-[#17191c] text-base">
                        {rCount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-[#5d2a1a] text-base tabular-nums">
                        {rPct}%
                      </td>
                      <td className="py-3.5 px-4 min-w-[150px]">
                        <div className="flex items-center gap-2">
                          <div className="w-full h-2 bg-[#f2f2f3] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#5d2a1a]"
                              style={{ width: `${Math.min(100, (rPct / activeMetricCfg.maxScale) * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs whitespace-nowrap text-[#5f6370] tabular-nums">
                            {isHigh ? 'สูงกว่าชาติ' : 'ต่ำกว่าชาติ'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#5f6370] text-sm">
                        <span>{p.top_risk_name}</span>{' '}
                        <span className="text-xs text-[#6b6f7a]">({p.top_risk_pct}%)</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedProvinceName(p.province);
                            setViewMode('map');
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#fafafb] text-[#17191c] border border-[#ececec] text-xs font-medium transition-colors min-h-[36px]"
                        >
                          เจาะลึก →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: TOP 5 RISK HOTSPOTS */}
      {viewMode === 'ranking' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Top 5 Risk Hotspot Provinces in Active Domain */}
          <div className="bg-[#f2f2f3] p-6 rounded-[24px] space-y-4 min-w-0 w-full">
            <div className="flex items-center justify-between pb-3 border-b border-[#ececec]">
              <h3 className="font-medium text-[#17191c] text-base flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#5d2a1a]" />
                5 จังหวัดที่มีความเสี่ยงสูงสุด: {activeMetricCfg.name}
              </h3>
              <span className="text-xs text-[#5d2a1a] font-medium">พื้นที่เฝ้าระวังเข้มข้น</span>
            </div>

            <div className="space-y-3">
              {top5RiskProvinces.map((p, i) => {
                const rPct = getMetricRiskPct(p);
                const rCount = getMetricRiskCount(p);

                return (
                  <div
                    key={p.province}
                    onClick={() => {
                      setSelectedProvinceName(p.province);
                      setViewMode('map');
                    }}
                    className="p-4 rounded-2xl bg-white border border-[#ececec] hover:border-[#17191c] transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#17191c] text-white text-xs flex items-center justify-center shrink-0 tabular-nums font-medium">
                        {i + 1}
                      </span>
                      <div>
                        <div className="font-medium text-[#17191c] text-base">จ.{p.province}</div>
                        <span className="text-sm text-[#5f6370] tabular-nums">{p.zone} • พบกลุ่มเสี่ยง {rCount.toLocaleString()} คน</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-[#5d2a1a] text-lg tabular-nums leading-[1.35]">{rPct}%</span>
                      <span className="text-xs text-[#5f6370] block tabular-nums">
                        สูงกว่าค่าเฉลี่ย +{(rPct - activeMetricCfg.nationalAvg).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5 Lowest Risk Provinces in Active Domain */}
          <div className="bg-[#f2f2f3] p-6 rounded-[24px] space-y-4 min-w-0 w-full">
            <div className="flex items-center justify-between pb-3 border-b border-[#ececec]">
              <h3 className="font-medium text-[#17191c] text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#17191c]" />
                5 จังหวัดที่มีความเสี่ยงต่ำสุด: {activeMetricCfg.name}
              </h3>
              <span className="text-xs text-[#5f6370] font-medium">ความชุกต่ำสุด</span>
            </div>

            <div className="space-y-3">
              {bottom5RiskProvinces.map((p, i) => {
                const rPct = getMetricRiskPct(p);
                const rCount = getMetricRiskCount(p);

                return (
                  <div
                    key={p.province}
                    onClick={() => {
                      setSelectedProvinceName(p.province);
                      setViewMode('map');
                    }}
                    className="p-4 rounded-2xl bg-white border border-[#ececec] hover:border-[#17191c] transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#f2f2f3] text-[#17191c] text-xs flex items-center justify-center shrink-0 tabular-nums font-medium">
                        {i + 1}
                      </span>
                      <div>
                        <div className="font-medium text-[#17191c] text-base">จ.{p.province}</div>
                        <span className="text-sm text-[#5f6370] tabular-nums">{p.zone} • พบกลุ่มเสี่ยง {rCount.toLocaleString()} คน</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-[#17191c] text-lg tabular-nums leading-[1.35]">{rPct}%</span>
                      <span className="text-xs text-[#5f6370] block tabular-nums">
                        ต่ำกว่าค่าเฉลี่ย -{(activeMetricCfg.nationalAvg - rPct).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Top Rank 9 Domains Overview: Horizontal Bars in #5d2a1a in descending order */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        <div className="lg:col-span-7 min-w-0 w-full bg-[#f2f2f3] p-6 rounded-[24px]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-medium text-[#17191c]">
                ความชุกของภาวะเสี่ยง รายมิติการคัดกรอง 9 ด้าน (ระดับชาติ)
              </h3>
              <p className="text-sm text-[#5f6370]">
                แท่งนอนสี #5d2a1a เรียงมากไปน้อย พร้อมตัวเลขกำกับ (% Risk Prevalence)
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-white text-[#5f6370] border border-[#ececec]">
              WHO ICOPE
            </span>
          </div>

          <div className="h-80 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={national9Domains} layout="vertical" margin={{ top: 5, right: 40, left: 15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ececec" />
                <XAxis type="number" unit="%" tick={{ fontSize: 14, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} domain={[0, 18]} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 14, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} width={180} />
                <Tooltip
                  cursor={{ fill: 'rgba(251, 225, 209, 0.4)' }}
                  wrapperStyle={{ zIndex: 1000 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div style={rechartsTooltipStyle} className="min-w-[220px]">
                          <div className="font-medium text-[#17191c] text-base mb-1.5 pb-1 border-b border-[#ececec]">
                            {d.name}
                          </div>
                          <div className="font-medium text-[#5d2a1a] text-base tabular-nums leading-[1.35]">
                            ความชุกของภาวะเสี่ยง: {d.riskPct}%
                          </div>
                          <div className="text-[#5f6370] text-sm mt-1 tabular-nums">
                            ผู้สูงอายุที่พบเสี่ยง: {Number(d.risk).toLocaleString()} คน
                          </div>
                          <div className="text-[#6b6f7a] text-xs mt-0.5 tabular-nums">
                            จากผู้ได้รับการคัดกรอง: {Number(d.screened).toLocaleString()} คน
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Horizontal bar in single color #5d2a1a as requested */}
                <Bar dataKey="riskPct" fill="#5d2a1a" radius={[0, 4, 4, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 min-w-0 w-full bg-[#f2f2f3] p-6 rounded-[24px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-medium text-[#17191c]">สาระสำคัญสถานการณ์ความเสี่ยงระดับชาติ</h3>
              <span className="text-xs text-[#5f6370]">9 มิติหลัก</span>
            </div>
            <p className="text-sm text-[#5f6370] mb-4">สรุปจำนวนผู้สูงอายุที่ต้องได้รับการดูแลตามลำดับความชุก</p>

            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {national9Domains.map((d, index) => (
                <div
                  key={d.name}
                  onClick={() => setActiveMetric(d.key as ScreeningMetricKey)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border text-sm cursor-pointer transition-all ${
                    activeMetric === d.key
                      ? 'bg-[#17191c] text-white border-[#17191c]'
                      : 'bg-white border-[#ececec] text-[#17191c] hover:bg-[#fafafb]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CHART_PALETTE[index % CHART_PALETTE.length] }}></span>
                    <div>
                      <div className="font-medium text-base">{d.name}</div>
                      <div className={`text-xs ${activeMetric === d.key ? 'text-[#e8b9a0]' : 'text-[#5f6370]'}`}>{d.desc}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className={`font-medium text-lg tabular-nums leading-[1.35] ${activeMetric === d.key ? 'text-[#fbe1d1]' : 'text-[#5d2a1a]'}`}>{d.riskPct}%</span>
                    <span className={`text-xs block tabular-nums ${activeMetric === d.key ? 'text-[#e8b9a0]' : 'text-[#5f6370]'}`}>{(d.risk / 1000).toFixed(0)}k คน</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab 1 Dedicated Data Sources (Footnote report format) */}
      <TabSourceReference
        tabTitle="การคัดกรองผู้สูงอายุ 9 ด้าน (Basic/Community Screen)"
        lastUpdated="ปีงบประมาณ 2567–2569"
        sources={[
          {
            title: 'ระบบคลังข้อมูลด้านการแพทย์และสุขภาพ (HDC) & Blue Book Application',
            dept: 'กรมอนามัย และ สำนักงานปลัดกระทรวงสาธารณสุข',
            description: 'ฐานข้อมูลผลการคัดกรองสุขภาพผู้สูงอายุ 9 ด้านตามแนวทาง WHO ICOPE และการประเมินความสามารถในการดำเนินชีวิตประจำวัน (Barthel ADL Index)'
          }
        ]}
      />
    </div>
  );
};
