import React, { useState, useMemo, useRef } from 'react';
import { ScreeningByYear, ScreeningProvinceData } from '../../types';
import rawScreeningProvinces from '../../data/screeningProvinces.json';
import { KPICard } from '../KPICard';
import { ThailandScreeningMap, ScreeningMetricKey, METRIC_CONFIG } from '../ThailandScreeningMap';
import { MobileBottomSheet } from '../MobileBottomSheet';
import { DomainCard } from '../DomainCard';
import { RankedDomainList } from '../RankedDomainList';
import { DOMAIN_META } from '../../constants/domainIcons';
import { TabHeader } from '../TabHeader';
import { EmptyState, TableEmptyRow } from '../EmptyState';
import {
  ShieldAlert, Eye, Stethoscope, Activity, HeartHandshake,
  Sparkles, Layers, Search, X, MapPin, ArrowUpDown,
  Flame, CheckCircle2, ListFilter, Map, Info, Filter
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const activeFilterCount = (zoneFilter !== 'ALL' ? 1 : 0) + (riskLevelFilter !== 'ALL' ? 1 : 0) + (sortBy !== 'risk_desc' ? 1 : 0);

  const activeMetricCfg = METRIC_CONFIG[activeMetric];

  // Domain card ref list for accessible arrow-key focus management
  const domainRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // National 9 domains overview
  const national9Domains = useMemo(() => [
    { name: '1. สายตา/การมองเห็น', screened: 9182964, risk: 1372196, riskPct: 14.9, icon: DOMAIN_META.vision.icon, color: '#5d2a1a', key: 'vision', desc: 'ต้อกระจก สายตาเลือนราง เสี่ยงต่ออุบัติเหตุ' },
    { name: '2. สุขภาพช่องปาก', screened: 9201193, risk: 1099281, riskPct: 11.9, icon: DOMAIN_META.oral.icon, color: '#17191c', key: 'oral', desc: 'มีฟันเคี้ยวอาหารน้อยกว่า 20 ซี่ กระทบภาวะโภชนาการ' },
    { name: '3. การเคลื่อนไหว/หกล้ม', screened: 9191600, risk: 815769, riskPct: 8.9, icon: DOMAIN_META.movement.icon, color: '#b9826a', key: 'movement', desc: 'ทดสอบ TUG ลุกยืนเดิน ทรงตัวบกพร่อง เสี่ยงต่อการหกล้ม' },
    { name: '4. กิจวัตรประจำวัน (ADL)', screened: 9379648, risk: 585267, riskPct: 6.2, icon: DOMAIN_META.adl.icon, color: '#777b86', key: 'adl', desc: 'กลุ่มติดบ้านและติดเตียง ต้องการผู้ดูแล (Caregiver)' },
    { name: '5. การได้ยิน (หูตึง/หนวก)', screened: 8962342, risk: 467799, riskPct: 5.2, icon: DOMAIN_META.hearing.icon, color: '#e8b9a0', key: 'hearing', desc: 'ได้ยินไม่ชัดเจน นำไปสู่ภาวะแยกตัวจากสังคม' },
    { name: '6. ความคิดความจำ', screened: 8768736, risk: 442860, riskPct: 5.1, icon: DOMAIN_META.cognition.icon, color: '#a3a6af', key: 'cognition', desc: 'สงสัยสมองเสื่อม (Dementia) จากแบบประเมิน Mini-Cog' },
    { name: '7. การกลั้นปัสสาวะ', screened: 9071493, risk: 407193, riskPct: 4.5, icon: DOMAIN_META.urine.icon, color: '#8a5a45', key: 'urine', desc: 'ปัสสาวะเล็ดราด กระทบสุขอนามัยและคุณภาพชีวิต' },
    { name: '8. ภาวะโภชนาการ', screened: 8962399, risk: 371156, riskPct: 4.1, icon: DOMAIN_META.nutrition.icon, color: '#d9d9dc', key: 'nutrition', desc: 'ภาวะขาดสารอาหาร/น้ำหนักลดผิดปกติในผู้สูงอายุ' },
    { name: '9. ภาวะซึมเศร้า (2Q)', screened: 9214935, risk: 131179, riskPct: 1.4, icon: DOMAIN_META.depression.icon, color: '#c9a18d', key: 'depression', desc: 'คัดกรองเบื้องต้นด้วยแบบคัดกรอง 2 คำถาม (2Q)' },
  ], []);

  const handleDomainKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let targetIndex = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = (index + 1) % national9Domains.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = (index - 1 + national9Domains.length) % national9Domains.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = national9Domains.length - 1;
    }

    if (targetIndex >= 0) {
      const nextDomain = national9Domains[targetIndex];
      setActiveMetric(nextDomain.key as ScreeningMetricKey);
      domainRefs.current[targetIndex]?.focus();
    }
  };

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
      <TabHeader
        badge={`Health Risk Screening · การคัดกรองสุขภาพผู้สูงอายุ 9 ด้าน · ปีงบประมาณ ${selectedYear}`}
        title="ความเสี่ยงต่อปัญหาสุขภาพ ผู้สูงอายุ 9 ด้าน"
        subtitle="วิเคราะห์ความชุกและตรวจจับพื้นที่เสี่ยงสูง (Risk Hotspots) ราย 77 จังหวัด จำแนกตาม 9 มิติสุขภาพสำคัญ"
        illustrationSrc={`${import.meta.env.BASE_URL}images/illustrations/tab-screening.webp`}
      />

      {/* Top 5 Risk KPI Cards: auto-fit full row width with rotating gradient ring light */}
      <div className="kpi-grid">
        <KPICard
          title="ความเสี่ยงอันดับ 1: สายตา"
          value="14.9%"
          subtitle="พบความเสี่ยง 1.37 ล้านคน"
          badge="ต้อกระจก/เลือนราง"
          icon={DOMAIN_META.vision.icon}
          variant="peach"
          alwaysSpin={true}
          onClick={() => setActiveMetric('vision')}
        />
        <KPICard
          title="ความเสี่ยงอันดับ 2: ช่องปาก"
          value="11.9%"
          subtitle="ปัญหาเคี้ยวอาหาร 1.10 ล้านคน"
          badge="ฟันแท้ < 20 ซี่"
          icon={DOMAIN_META.oral.icon}
          variant={activeMetric === 'oral' ? 'selected' : 'neutral'}
          onClick={() => setActiveMetric('oral')}
        />
        <KPICard
          title="ความเสี่ยงอันดับ 3: การเคลื่อนไหว"
          value="8.9%"
          subtitle="เสี่ยงต่อการหกล้ม 815,769 คน"
          badge="TUG ผิดปกติ"
          icon={DOMAIN_META.movement.icon}
          variant={activeMetric === 'movement' ? 'selected' : 'neutral'}
          onClick={() => setActiveMetric('movement')}
        />
        <KPICard
          title="กลุ่มติดบ้าน/ติดเตียง (ADL)"
          value="6.2%"
          subtitle="พึ่งพิงผู้อื่น 585,267 คน"
          badge="ต้องการ Caregiver"
          icon={DOMAIN_META.adl.icon}
          variant={activeMetric === 'adl' ? 'selected' : 'neutral'}
          onClick={() => setActiveMetric('adl')}
        />
        <KPICard
          title="ความเสี่ยงความคิดความจำ"
          value="5.1%"
          subtitle="สงสัยสมองเสื่อม 442,860 คน"
          badge="Mini-Cog ผิดปกติ"
          icon={DOMAIN_META.cognition.icon}
          variant={activeMetric === 'cognition' ? 'selected' : 'neutral'}
          onClick={() => setActiveMetric('cognition')}
        />
      </div>

      {/* 9 DOMAINS SELECTOR SECTION (Compact) */}
      <section
        className="bg-[#f2f2f3] rounded-[24px] p-4 sm:p-6 space-y-4"
        style={{ overflow: 'visible', height: 'auto' }}
        aria-labelledby="domains-heading"
      >
        {/* Section Header: 32px Peach circle + serif title clamp(1.25rem, 1rem + 0.6vw, 1.625rem) */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#fbe1d1] flex items-center justify-center text-[#5d2a1a] shrink-0 mt-0.5">
            <Layers className="w-4 h-4 stroke-[1.75]" />
          </div>
          <div className="space-y-0.5">
            <h3
              id="domains-heading"
              className="font-serif font-normal text-[#17191c] leading-[1.3]"
              style={{ fontSize: 'clamp(1.25rem, 1rem + 0.6vw, 1.625rem)' }}
            >
              เลือกมิติสุขภาพที่ต้องการเฝ้าระวังความเสี่ยง (9 ด้าน)
            </h3>
            <p className="text-[0.9375rem] text-[#5f6370] leading-[1.4]">
              คลิกเลือกมิติเพื่อเปลี่ยนการแสดงผลบนแผนที่ ตาราง และอันดับ Hotspot
            </p>
          </div>
        </div>

        {/* 9 Domains Responsive Grid / Horizontal Snap Scroll with Radiogroup accessibility */}
        <div
          role="radiogroup"
          aria-label="เลือกมิติสุขภาพที่ต้องการเฝ้าระวังความเสี่ยง 9 ด้าน"
          className="domain-grid"
        >
          {national9Domains.map((d, index) => {
            const isSelected = activeMetric === d.key;
            const meta = DOMAIN_META[d.key as ScreeningMetricKey];
            return (
              <div key={d.key} className="domain-card-item">
                <DomainCard
                  name={d.name}
                  slug={meta?.slug || d.key}
                  icon={meta?.icon || d.icon}
                  riskPct={d.riskPct}
                  risk={d.risk}
                  screened={d.screened}
                  maxRiskPct={14.9}
                  isSelected={isSelected}
                  onClick={() => setActiveMetric(d.key as ScreeningMetricKey)}
                  onKeyDown={(e) => handleDomainKeyDown(e, index)}
                  cardRef={(el) => { domainRefs.current[index] = el; }}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* SEARCH & RISK FILTERS TOOLBAR: Floating Product Artifact Card */}
      <div className="bg-white rounded-[20px] shadow-[0_0_0_1px_rgba(4,23,43,0.05),0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] p-4 sm:p-5 space-y-4">
        {/* Search input: Always full width on mobile/tablet */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px] w-full">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5f6370] hover:text-[#17191c] min-h-[32px] min-w-[32px] flex items-center justify-center"
                aria-label="ล้างคำค้นหา"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Desktop Only Filter Selectors (>=1024px) */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Zone Selector */}
            <div className="flex items-center bg-white border border-[#ececec] rounded-[16px] px-3.5 py-2 text-sm text-[#17191c] min-h-[44px]">
              <MapPin className="w-4 h-4 text-[#5f6370] mr-2 shrink-0" />
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="bg-transparent text-[#17191c] font-normal focus:outline-none cursor-pointer max-w-[210px] text-sm min-h-[36px]"
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
                className="bg-transparent text-[#17191c] font-normal focus:outline-none cursor-pointer text-sm min-h-[36px]"
              >
                <option value="risk_desc">ความเสี่ยงสูงสุด ➔ ต่ำสุด</option>
                <option value="risk_cases_desc">จำนวนผู้พบเสี่ยงมากสุด</option>
                <option value="name_asc">ชื่อจังหวัด (ก-ฮ)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tablet Filter Row (640px-1023px): Wraps into 2 rows */}
        <div className="hidden sm:flex lg:hidden flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#ececec] text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-white border border-[#ececec] rounded-[16px] px-3 py-1.5 text-xs text-[#17191c] min-h-[44px]">
              <MapPin className="w-3.5 h-3.5 text-[#5f6370] mr-1.5 shrink-0" />
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="bg-transparent text-[#17191c] font-normal focus:outline-none cursor-pointer text-xs"
              >
                {zoneOptions.map(z => (
                  <option key={z.code} value={z.code}>{z.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center bg-white border border-[#ececec] rounded-[16px] px-3 py-1.5 text-xs text-[#17191c] min-h-[44px]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#5f6370] mr-1.5 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[#17191c] font-normal focus:outline-none cursor-pointer text-xs"
              >
                <option value="risk_desc">ความเสี่ยงสูงสุด ➔ ต่ำสุด</option>
                <option value="risk_cases_desc">จำนวนผู้พบเสี่ยงมากสุด</option>
                <option value="name_asc">ชื่อจังหวัด (ก-ฮ)</option>
              </select>
            </div>
          </div>

          {/* View Mode Toggle Tablet */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs transition-all min-h-[44px] ${
                viewMode === 'map' ? 'bg-[#17191c] text-white font-medium' : 'text-[#5f6370] hover:text-[#17191c]'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>แผนที่</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs transition-all min-h-[44px] ${
                viewMode === 'table' ? 'bg-[#17191c] text-white font-medium' : 'text-[#5f6370] hover:text-[#17191c]'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>ตาราง ({filteredProvinces.length})</span>
            </button>
            <button
              onClick={() => setViewMode('ranking')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs transition-all min-h-[44px] ${
                viewMode === 'ranking' ? 'bg-[#17191c] text-white font-medium' : 'text-[#5f6370] hover:text-[#17191c]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>5 Hotspot</span>
            </button>
          </div>
        </div>

        {/* Desktop Filter Row (>=1024px) */}
        <div className="hidden lg:flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#ececec] text-sm">
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

          {/* View Mode Toggle Desktop */}
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

        {/* Mobile Filter Controls (<640px): "ตัวกรอง" Button + View Mode Toggle */}
        <div className="flex sm:hidden items-center justify-between gap-2 pt-3 border-t border-[#ececec]">
          {/* Mobile Filter Trigger Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-[#17191c] text-white text-xs font-medium shadow-sm transition-all"
          >
            <Filter className="w-4 h-4" />
            <span>ตัวกรอง</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#5d2a1a] text-white text-[11px] flex items-center justify-center font-bold tabular-nums">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* View Mode Toggle Mobile */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('map')}
              className={`p-2.5 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-all ${
                viewMode === 'map' ? 'bg-[#17191c] text-white' : 'border border-[#ececec] text-[#5f6370]'
              }`}
              title="แผนที่"
              aria-label="แผนที่"
            >
              <Map className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2.5 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-all ${
                viewMode === 'table' ? 'bg-[#17191c] text-white' : 'border border-[#ececec] text-[#5f6370]'
              }`}
              title="ตาราง"
              aria-label="ตาราง"
            >
              <ListFilter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('ranking')}
              className={`p-2.5 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center transition-all ${
                viewMode === 'ranking' ? 'bg-[#17191c] text-white' : 'border border-[#ececec] text-[#5f6370]'
              }`}
              title="Hotspot"
              aria-label="Hotspot"
            >
              <Flame className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Bottom Sheet for Filters */}
        <MobileBottomSheet
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          title="ตัวกรองความเสี่ยง 9 ด้าน"
          activeCount={activeFilterCount}
          onClear={() => {
            setZoneFilter('ALL');
            setRiskLevelFilter('ALL');
            setSortBy('risk_desc');
          }}
          onApply={() => setIsMobileFilterOpen(false)}
        >
          {/* Zone Selector in Sheet */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#5f6370] font-medium block">เขตสุขภาพ:</label>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="w-full bg-[#f2f2f3] text-[#17191c] border border-[#ececec] rounded-[16px] px-3.5 py-2.5 text-sm min-h-[44px] focus:outline-none"
            >
              {zoneOptions.map(z => (
                <option key={z.code} value={z.code}>{z.name}</option>
              ))}
            </select>
          </div>

          {/* Sort Selector in Sheet */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#5f6370] font-medium block">การจัดเรียงลำดับ:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#f2f2f3] text-[#17191c] border border-[#ececec] rounded-[16px] px-3.5 py-2.5 text-sm min-h-[44px] focus:outline-none"
            >
              <option value="risk_desc">ความเสี่ยงสูงสุด ➔ ต่ำสุด</option>
              <option value="risk_cases_desc">จำนวนผู้พบเสี่ยงมากสุด</option>
              <option value="name_asc">ชื่อจังหวัด (ก-ฮ)</option>
            </select>
          </div>

          {/* Risk Level Pills in Sheet */}
          <div className="space-y-1.5">
            <label className="text-xs text-[#5f6370] font-medium block">ระดับความเสี่ยง:</label>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setRiskLevelFilter('ALL')}
                className={`w-full min-h-[44px] px-4 py-2.5 rounded-2xl text-left text-sm font-medium transition-all ${
                  riskLevelFilter === 'ALL'
                    ? 'bg-[#17191c] text-white'
                    : 'bg-[#f2f2f3] text-[#17191c] border border-[#ececec]'
                }`}
              >
                ทั้งหมด ({currentProvinces.length} จังหวัด)
              </button>
              <button
                onClick={() => setRiskLevelFilter('HOTSPOT')}
                className={`w-full min-h-[44px] px-4 py-2.5 rounded-2xl text-left text-sm font-medium transition-all ${
                  riskLevelFilter === 'HOTSPOT'
                    ? 'bg-[#17191c] text-white'
                    : 'bg-[#f2f2f3] text-[#17191c] border border-[#ececec]'
                }`}
              >
                เสี่ยงสูงกว่าค่าเฉลี่ย (&gt;{activeMetricCfg.nationalAvg}%)
              </button>
              <button
                onClick={() => setRiskLevelFilter('LOW')}
                className={`w-full min-h-[44px] px-4 py-2.5 rounded-2xl text-left text-sm font-medium transition-all ${
                  riskLevelFilter === 'LOW'
                    ? 'bg-[#17191c] text-white'
                    : 'bg-[#f2f2f3] text-[#17191c] border border-[#ececec]'
                }`}
              >
                เสี่ยงต่ำกว่าค่าเฉลี่ย
              </button>
            </div>
          </div>
        </MobileBottomSheet>
      </div>

      {/* VIEW MODE 1: RISK HEATMAP & PROVINCE RISK INSPECTOR */}
      {viewMode === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-5 items-stretch w-full">
          {/* Left: Risk Heatmap Map */}
          <div className="min-w-0 w-full h-full flex flex-col">
            <ThailandScreeningMap
              provinces={currentProvinces}
              selectedProvinceName={selectedProvinceName}
              onSelectProvince={(pName) => setSelectedProvinceName(pName)}
              activeZone={zoneFilter}
              activeMetric={activeMetric}
              onChangeMetric={(m) => setActiveMetric(m)}
            />
          </div>

          {/* Right: Selected Province Risk Inspector */}
          <div className="min-w-0 w-full h-full flex flex-col">
            {selectedProvince ? (
              <div className="bg-[#f2f2f3] rounded-[24px] p-3 sm:p-3.5 flex flex-col justify-between gap-2 h-full">
                {/* Province Header */}
                <div className="flex items-start justify-between border-b border-[#ececec] pb-2 mb-0.5">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white text-[#5f6370] border border-[#ececec]">
                        {selectedProvince.zone}
                      </span>
                      <span className="text-xs text-[#6b6f7a]">รหัส {selectedProvince.province_code}</span>
                    </div>
                    <h3 className="text-[20px] sm:text-[22px] font-serif font-normal text-[#17191c] flex items-center gap-1.5 leading-tight">
                      <MapPin className="w-4 h-4 text-[#17191c]" />
                      จังหวัด{selectedProvince.province}
                    </h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-[#ececec] bg-white text-[#5d2a1a] shrink-0">
                    เสี่ยงสูงสุด: {selectedProvince.top_risk_name}
                  </span>
                </div>

                {/* Key Risk Statistics for Selected Province */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 sm:px-3 sm:py-2.5 rounded-2xl bg-white border border-[#ececec]">
                    <span className="text-xs text-[#5f6370] block font-medium">ผู้พบความเสี่ยงรวมทุกมิติ</span>
                    <strong className="text-[19px] sm:text-[21px] font-serif font-normal text-[#17191c] tabular-nums block mt-0.5 leading-tight">
                      {selectedProvince.total_risk_cases.toLocaleString()} ราย
                    </strong>
                    <span className="text-[11px] text-[#6b6f7a] block mt-0.5">รวมทุกภาวะที่ตรวจพบ</span>
                  </div>

                  <div className="p-2.5 sm:px-3 sm:py-2.5 rounded-2xl bg-[#fbe1d1] text-[#5d2a1a] border-0">
                    <span className="text-xs text-[#5d2a1a] block font-medium">ความเสี่ยง ({activeMetricCfg.shortName.split(' ')[1]})</span>
                    <strong className="text-[19px] sm:text-[21px] font-serif font-normal text-[#5d2a1a] tabular-nums block mt-0.5 leading-tight">
                      {getMetricRiskPct(selectedProvince)}%
                    </strong>
                    <span className="text-[11px] text-[#5d2a1a]/90 block mt-0.5 truncate">
                      {getMetricRiskPct(selectedProvince) > activeMetricCfg.nationalAvg
                        ? `สูงกว่าค่าเฉลี่ยชาติ (+${(getMetricRiskPct(selectedProvince) - activeMetricCfg.nationalAvg).toFixed(1)}%)`
                        : `ต่ำกว่าค่าเฉลี่ยชาติ (-${(activeMetricCfg.nationalAvg - getMetricRiskPct(selectedProvince)).toFixed(1)}%)`}
                    </span>
                  </div>
                </div>

                {/* Ranked 1-9 Grid List for 9 Risk Domains */}
                <div className="flex-1 flex flex-col justify-center">
                  <RankedDomainList
                    selectedProvince={selectedProvince}
                    activeMetric={activeMetric}
                    onSelectMetric={(metric) => setActiveMetric(metric)}
                  />
                </div>

                <div className="text-xs text-[#5f6370] bg-white p-2 sm:p-2.5 rounded-xl border border-[#ececec] flex items-center gap-2 mt-auto">
                  <Info className="w-4 h-4 text-[#17191c] shrink-0" />
                  <span>คลิกเลือกจังหวัดอื่น ๆ บนแผนที่ฮีทแมพเพื่อตรวจดูสถานการณ์ความเสี่ยงรายพื้นที่</span>
                </div>
              </div>
            ) : (
              <div className="bg-[#f2f2f3] rounded-[24px] p-3 sm:p-3.5 flex flex-col justify-between gap-2 h-full">
                <div className="flex items-start justify-between border-b border-[#ececec] pb-2 mb-0.5">
                  <div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white text-[#5f6370] border border-[#ececec] inline-block mb-1">
                      ทั่วประเทศ
                    </span>
                    <h3 className="text-[20px] sm:text-[22px] font-serif font-normal text-[#17191c] flex items-center gap-1.5 leading-tight">
                      <MapPin className="w-4 h-4 text-[#17191c]" />
                      ภาพรวมสุขภาพผู้สูงอายุไทย
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium border border-[#ececec] bg-white text-[#5d2a1a] shrink-0">
                    77 จังหวัด
                  </span>
                </div>

                {/* Ranked 1-9 Grid List (National Overview Fallback) */}
                <div className="flex-1 flex flex-col justify-center">
                  <RankedDomainList
                    selectedProvince={null}
                    activeMetric={activeMetric}
                    onSelectMetric={(metric) => setActiveMetric(metric)}
                  />
                </div>

                <div className="text-xs text-[#5f6370] bg-white p-2 sm:p-2.5 rounded-xl border border-[#ececec] flex items-center gap-2 mt-auto">
                  <Info className="w-4 h-4 text-[#17191c] shrink-0" />
                  <span>คลิกเลือกจังหวัดอื่น ๆ บนแผนที่ฮีทแมพเพื่อตรวจดูสถานการณ์ความเสี่ยงรายพื้นที่</span>
                </div>
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

          {/* Mobile Scroll Hint */}
          <div className="flex sm:hidden items-center justify-end px-4 py-2 text-xs text-[#5f6370] bg-[#fafafb] border-b border-[#ececec]">
            <span>เลื่อนดูเพิ่มเติม →</span>
          </div>

          <div className="overflow-x-auto touch-scroll">
            <table className="w-full text-left text-base text-[#17191c] min-w-[760px]">
              <thead className="bg-[#fafafb] text-[#5f6370] font-medium text-sm border-b border-[#ececec] sticky top-0 z-20">
                <tr>
                  <th className="py-3.5 px-3 text-center sticky left-0 bg-[#fafafb] z-20 w-[60px]">อันดับ</th>
                  <th className="py-3.5 px-4 text-left sticky left-[60px] bg-[#fafafb] z-20 w-[120px] border-r border-[#ececec] shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]">จังหวัด</th>
                  <th className="py-3.5 px-4">เขตสุขภาพ</th>
                  <th className="py-3.5 px-4 text-right">ผู้พบเสี่ยง (คน)</th>
                  <th className="py-3.5 px-4 text-right">อัตราความเสี่ยง (%)</th>
                  <th className="py-3.5 px-4">ระดับความรุนแรงเทียบค่าเฉลี่ยชาติ</th>
                  <th className="py-3.5 px-4">มิติเสี่ยงสูงสุดประจำจังหวัด</th>
                  <th className="py-3.5 px-4 text-center">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ececec]">
                {filteredProvinces.length > 0 ? (
                  filteredProvinces.map((p, idx) => {
                    const rPct = getMetricRiskPct(p);
                    const rCount = getMetricRiskCount(p);
                    const isHigh = rPct > activeMetricCfg.nationalAvg;
                    const isSelected = selectedProvinceName === p.province;

                    return (
                      <tr
                        key={p.province}
                        className={`hover:bg-[#fafafb] transition-colors h-[54px] group ${
                          isSelected ? 'bg-[#f2f2f3]' : ''
                        }`}
                      >
                        <td className={`py-3.5 px-3 text-center sticky left-0 z-10 w-[60px] ${isSelected ? 'bg-[#f2f2f3]' : 'bg-white group-hover:bg-[#fafafb]'}`}>
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium tabular-nums bg-[#f2f2f3] text-[#17191c]">
                            {idx + 1}
                          </span>
                        </td>
                        <td className={`py-3.5 px-4 font-medium text-[#17191c] text-base text-left sticky left-[60px] z-10 w-[120px] border-r border-[#ececec] shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)] ${isSelected ? 'bg-[#f2f2f3]' : 'bg-white group-hover:bg-[#fafafb]'}`}>
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
                            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#fafafb] text-[#17191c] border border-[#ececec] text-xs font-medium transition-colors min-h-[44px]"
                          >
                            เจาะลึก →
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <TableEmptyRow
                    colSpan={8}
                    message="ไม่พบข้อมูลตามตัวกรองที่เลือก"
                    description="ลองปรับเปลี่ยนคำค้นหา หรือล้างตัวกรองเขตสุขภาพและระดับความเสี่ยง"
                    onReset={() => {
                      setSearchTerm('');
                      setZoneFilter('ALL');
                      setRiskLevelFilter('ALL');
                      setSortBy('risk_desc');
                    }}
                  />
                )}
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

          <div className="h-[380px] sm:h-[400px] w-full mt-4 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={national9Domains} layout="vertical" margin={{ top: 5, right: 25, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ececec" />
                <XAxis type="number" unit="%" tick={{ fontSize: 13, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} domain={[0, 18]} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 13, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} width={150} />
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
    </div>
  );
};
