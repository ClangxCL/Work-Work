import React, { useState, useMemo } from 'react';
import { ClinicZoneData, ClinicProvinceData, HospitalInfo } from '../../types';
import { KPICard } from '../KPICard';
import { ThailandClinicMap } from '../ThailandClinicMap';
import { TabSourceReference } from '../TabSourceReference';
import {
  Hospital, Award, CheckCircle2, Clock, Search, Filter,
  MapPin, Building2, ChevronRight, ArrowUpDown, Globe2,
  Map as MapIcon, LayoutGrid, Info, X, BarChart3, PieChart as PieIcon, Layers
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { CHART_PALETTE, rechartsTooltipStyle } from '../../theme/chartTheme';

interface Tab1ClinicProps {
  zonesData: ClinicZoneData[];
  provincesData: ClinicProvinceData[];
  selectedZone: string;
  setSelectedZone?: (zone: string) => void;
}

export const Tab1Clinic: React.FC<Tab1ClinicProps> = ({
  zonesData,
  provincesData,
  selectedZone,
  setSelectedZone
}) => {
  const [internalZone, setInternalZone] = useState<string>(selectedZone || 'ALL');
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hospitalSearch, setHospitalSearch] = useState<string>('');
  const [sortField, setSortField] = useState<string>('total_hospitals');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(77);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visualMode, setVisualMode] = useState<'map' | 'cards'>('map');

  const activeZone = selectedZone !== 'ALL' ? selectedZone : internalZone;

  const cleanZones = useMemo(() => {
    return zonesData.filter(z => !z.zone.includes('รวม') && z.year !== 'รวม');
  }, [zonesData]);

  const zoneOptions = useMemo(() => [
    { code: 'ALL', name: 'ทุกเขตสุขภาพ (ภาพรวมทั้งประเทศ)' },
    { code: '1', name: 'เขตสุขภาพที่ 1 (ภาคเหนือตอนบน)' },
    { code: '2', name: 'เขตสุขภาพที่ 2 (ภาคเหนือตอนล่าง)' },
    { code: '3', name: 'เขตสุขภาพที่ 3 (ภาคเหนือตอนล่าง/กลาง)' },
    { code: '4', name: 'เขตสุขภาพที่ 4 (ภาคกลางตอนบน)' },
    { code: '5', name: 'เขตสุขภาพที่ 5 (ภาคตะวันตก)' },
    { code: '6', name: 'เขตสุขภาพที่ 6 (ภาคตะวันออก)' },
    { code: '7', name: 'เขตสุขภาพที่ 7 (ภาคอีสานตอนกลาง)' },
    { code: '8', name: 'เขตสุขภาพที่ 8 (ภาคอีสานตอนบน)' },
    { code: '9', name: 'เขตสุขภาพที่ 9 (ภาคอีสานตอนล่าง)' },
    { code: '10', name: 'เขตสุขภาพที่ 10 (ภาคอีสานตะวันออก)' },
    { code: '11', name: 'เขตสุขภาพที่ 11 (ภาคใต้ตอนบน)' },
    { code: '12', name: 'เขตสุขภาพที่ 12 (ภาคใต้ตอนล่าง)' },
    { code: '13', name: 'เขตสุขภาพที่ 13 (กรุงเทพมหานคร)' },
  ], []);

  const filteredProvinces = useMemo(() => {
    return provincesData.filter(p => {
      const zoneNum = activeZone.replace(/^0+/, '');
      const matchZone = activeZone === 'ALL' || p.zone.includes(`ที่ ${zoneNum}`) || p.zone.includes(`เขต ${zoneNum}`);
      const matchSearch = p.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.region && p.region.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchZone && matchSearch;
    });
  }, [provincesData, activeZone, searchTerm]);

  const availableProvinces = useMemo(() => {
    if (activeZone === 'ALL') return provincesData;
    const zoneNum = activeZone.replace(/^0+/, '');
    return provincesData.filter(p => p.zone.includes(`ที่ ${zoneNum}`) || p.zone.includes(`เขต ${zoneNum}`));
  }, [provincesData, activeZone]);

  const scopeSummary = useMemo(() => {
    const list = availableProvinces;
    const totalHospitals = list.reduce((acc, p) => acc + (p.total_hospitals || 0), 0);
    const totalEvaluated = list.reduce((acc, p) => acc + (p.total_evaluated || 0), 0);
    const notEval = list.reduce((acc, p) => acc + (p.not_eval || 0), 0);
    const excellent = list.reduce((acc, p) => acc + (p.excellent || 0), 0);
    const veryGood = list.reduce((acc, p) => acc + (p.very_good || 0), 0);
    const good = list.reduce((acc, p) => acc + (p.good || 0), 0);
    const basic = list.reduce((acc, p) => acc + (p.basic || 0), 0);
    const needDev = list.reduce((acc, p) => acc + (p.need_dev || 0), 0);

    const a = list.reduce((acc, p) => acc + (p.a || 0), 0);
    const s = list.reduce((acc, p) => acc + (p.s || 0), 0);
    const m1 = list.reduce((acc, p) => acc + (p.m1 || 0), 0);
    const m2 = list.reduce((acc, p) => acc + (p.m2 || 0), 0);
    const f1 = list.reduce((acc, p) => acc + (p.f1 || 0), 0);
    const f2 = list.reduce((acc, p) => acc + (p.f2 || 0), 0);
    const f3 = list.reduce((acc, p) => acc + (p.f3 || 0), 0);

    const evalRate = totalHospitals > 0 ? (totalEvaluated / totalHospitals) * 100 : 0;

    return {
      title: activeZone === 'ALL' ? 'ภาพรวมทั้งประเทศ (13 เขตสุขภาพ)' : `เขตสุขภาพที่ ${activeZone.replace(/^0+/, '')}`,
      provinceCount: list.length,
      totalHospitals,
      totalEvaluated,
      notEval,
      evalRate,
      excellent,
      veryGood,
      good,
      basic,
      needDev,
      a, s, m1, m2, f1, f2, f3
    };
  }, [availableProvinces, activeZone]);

  const selectedProvince = useMemo(() => {
    if (!selectedProvinceName) return null;
    return provincesData.find(p => p.province === selectedProvinceName) || null;
  }, [provincesData, selectedProvinceName]);

  const filteredHospitals = useMemo(() => {
    if (!selectedProvince?.hospitals_list) return [];
    if (!hospitalSearch.trim()) return selectedProvince.hospitals_list;
    return selectedProvince.hospitals_list.filter(h =>
      h.name.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
      h.code.includes(hospitalSearch) ||
      h.level.toLowerCase().includes(hospitalSearch.toLowerCase())
    );
  }, [selectedProvince, hospitalSearch]);

  const sortedProvinces = useMemo(() => {
    const sorted = [...filteredProvinces].sort((a, b) => {
      let valA: any = a[sortField as keyof ClinicProvinceData];
      let valB: any = b[sortField as keyof ClinicProvinceData];

      if (sortField === 'eval_pct') {
        valA = a.total_hospitals > 0 ? (a.total_evaluated / a.total_hospitals) : 0;
        valB = b.total_hospitals > 0 ? (b.total_evaluated / b.total_hospitals) : 0;
      }

      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB, 'th') : valB.localeCompare(valA, 'th');
      }
      return sortAsc ? valA - valB : valB - valA;
    });
    return sorted;
  }, [filteredProvinces, sortField, sortAsc]);

  const paginatedProvinces = useMemo(() => {
    if (pageSize >= sortedProvinces.length) return sortedProvinces;
    const startIndex = (currentPage - 1) * pageSize;
    return sortedProvinces.slice(startIndex, startIndex + pageSize);
  }, [sortedProvinces, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedProvinces.length / pageSize) || 1;

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const chartZoneData = useMemo(() => {
    return cleanZones.map(z => ({
      name: z.zone.replace('เขตสุขภาพที่ ', 'เขต '),
      ดีเด่น: z.excellent,
      ดีมาก: z.very_good,
      ดี: z.good,
      ผ่านพื้นฐาน: z.basic,
      ยังไม่ได้ประเมิน: z.not_eval
    }));
  }, [cleanZones]);

  const pieData = useMemo(() => [
    { name: 'ดีเด่น (Excellent)', value: scopeSummary.excellent, color: '#5d2a1a' },
    { name: 'ดีมาก (Very Good)', value: scopeSummary.veryGood, color: '#17191c' },
    { name: 'ดี (Good)', value: scopeSummary.good, color: '#b9826a' },
    { name: 'ผ่านพื้นฐาน (Basic)', value: scopeSummary.basic, color: '#777b86' },
    { name: 'ยังไม่ได้ประเมิน', value: scopeSummary.notEval, color: '#d9d9dc' },
  ], [scopeSummary]);

  return (
    <div className="space-y-12 text-[#17191c]">
      {/* Editorial Section Header */}
      <div className="space-y-2 mb-6">
        <span className="text-xs uppercase tracking-wider text-[#6b6f7a] block font-medium">
          Geriatric Clinic Standards · ภาพรวม รพ. สังกัดกระทรวงสาธารณสุข
        </span>
        <h2 className="font-serif font-normal text-2xl sm:text-3xl lg:text-4xl text-[#17191c] leading-[1.35] mb-2">
          ข้อมูลคลินิกผู้สูงอายุ พร้อมแสดงจำนวนเป้าหมาย รพ. 937 แห่ง
        </h2>
        <p className="text-base text-[#5f6370] w-full leading-[1.6]">
          สรุปผลการประเมินมาตรฐานคลินิกผู้สูงอายุในโรงพยาบาลระดับ A, S, M, F ครอบคลุม 13 เขตสุขภาพ 77 จังหวัด
        </p>
      </div>

      {/* Global Filter Bar: Floating Product Artifact Card */}
      <div className="bg-white rounded-[20px] shadow-[0_0_0_1px_rgba(4,23,43,0.05),0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-[#17191c] text-sm font-medium">
            <Filter className="w-4 h-4 text-[#17191c]" />
            <span>ฟิลเตอร์ข้อมูล:</span>
          </div>

          {/* Health Region Dropdown */}
          <div className="flex items-center bg-white border border-[#ececec] rounded-[16px] px-4 py-2.5 min-h-[44px] text-sm text-[#17191c]">
            <span className="text-[#5f6370] mr-2">เขตสุขภาพ:</span>
            <select
              value={activeZone}
              onChange={(e) => {
                const z = e.target.value;
                setInternalZone(z);
                if (setSelectedZone) setSelectedZone(z);
                setSelectedProvinceName('');
              }}
              className="bg-transparent text-[#17191c] font-medium focus:outline-none cursor-pointer"
            >
              {zoneOptions.map(z => (
                <option key={z.code} value={z.code}>{z.name}</option>
              ))}
            </select>
          </div>

          {/* Province Dropdown */}
          <div className="flex items-center bg-white border border-[#ececec] rounded-[16px] px-4 py-2.5 min-h-[44px] text-sm text-[#17191c]">
            <span className="text-[#5f6370] mr-2">จังหวัด:</span>
            <select
              value={selectedProvinceName}
              onChange={(e) => setSelectedProvinceName(e.target.value)}
              className="bg-transparent text-[#17191c] font-medium focus:outline-none cursor-pointer max-w-[240px]"
            >
              <option value="">
                {activeZone === 'ALL'
                  ? '— ทุกจังหวัด (ยังไม่เลือก) —'
                  : `— ภาพรวมเขต ${activeZone.replace(/^0+/, '')} —`}
              </option>
              {availableProvinces.map(p => (
                <option key={p.province} value={p.province}>
                  {p.province} ({p.total_hospitals} รพ.)
                </option>
              ))}
            </select>
            {selectedProvinceName && (
              <button
                onClick={() => setSelectedProvinceName('')}
                title="ล้างการเลือกจังหวัด"
                className="ml-2 text-[#5f6370] hover:text-[#17191c] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#5f6370] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อจังหวัด หรือ เขต..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 min-h-[44px] text-sm rounded-[16px] border border-[#ececec] bg-white text-[#17191c] placeholder-[#a3a6af] focus:outline-none focus:border-[#17191c] w-full sm:w-72"
          />
        </div>
      </div>

      {/* Top KPI Cards: auto-fit full row width */}
      <div className="kpi-grid">
        <KPICard
          title="รพ. เป้าหมายทั้งหมด"
          value="937 แห่ง"
          subtitle="ระดับ A, S, M, F ทั่วประเทศ"
          badge="13 เขตสุขภาพ"
          icon={Hospital}
          variant="peach" // 1 single accent peach card
        />
        <KPICard
          title="ประเมินแล้ว"
          value="818 แห่ง"
          subtitle="คิดเป็น 87.3% ของ รพ. ทั้งหมด"
          badge="ผ่านเกณฑ์ 99.4%"
          icon={CheckCircle2}
          variant="neutral"
        />
        <KPICard
          title="เกณฑ์ดีเด่น (Excellent)"
          value="84 แห่ง"
          subtitle="10.3% ของ รพ. ที่ประเมิน"
          badge="มาตรฐานสูงสุด 5 ดาว"
          icon={Award}
          variant="neutral"
        />
        <KPICard
          title="เกณฑ์ดีมาก & ดี"
          value="582 แห่ง"
          subtitle="71.1% ของ รพ. ที่ประเมิน"
          badge="ระดับมาตรฐานสูง"
          icon={CheckCircle2}
          variant="neutral"
        />
        <KPICard
          title="ยังไม่ได้ประเมิน"
          value="119 แห่ง"
          subtitle="12.7% รพ.เปิดใหม่/รพช.เล็ก F3"
          badge="รอการติดตาม"
          icon={Clock}
          variant="neutral"
        />
      </div>

      {/* GEOGRAPHIC SECTION: THAILAND MAP + SIDE INFO PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Left: Thailand Visual Map (7 cols) */}
        <div className="lg:col-span-7 bg-[#f2f2f3] p-6 rounded-[24px] flex flex-col justify-between min-w-0 w-full">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-medium text-[#17191c] flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-[#17191c]" />
                  แผนผังภูมิศาสตร์คลินิกผู้สูงอายุประเทศไทย
                </h3>
                <p className="text-sm text-[#5f6370] mt-1">
                  คลิกที่จังหวัดบนแผนที่เพื่อดูรายชื่อโรงพยาบาลและสถิติคลินิกในกรอบด้านข้าง
                </p>
              </div>

              {/* View Switcher: Map vs Cards */}
              <div className="flex items-center space-x-1.5 self-start sm:self-auto shrink-0">
                <button
                  onClick={() => setVisualMode('map')}
                  className={`flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-full text-sm transition-all ${
                    visualMode === 'map'
                      ? 'bg-[#17191c] text-white font-medium'
                      : 'bg-white border border-[#ececec] text-[#17191c] hover:bg-[#fafafb]'
                  }`}
                >
                  <MapIcon className="w-4 h-4" />
                  <span>แผนที่ไทย</span>
                </button>
                <button
                  onClick={() => setVisualMode('cards')}
                  className={`flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-full text-sm transition-all ${
                    visualMode === 'cards'
                      ? 'bg-[#17191c] text-white font-medium'
                      : 'bg-white border border-[#ececec] text-[#17191c] hover:bg-[#fafafb]'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>การ์ดจังหวัด</span>
                </button>
              </div>
            </div>

            {/* Visual View: Thailand SVG Map or Card Matrix */}
            {visualMode === 'map' ? (
              <ThailandClinicMap
                provinces={provincesData}
                selectedProvinceName={selectedProvinceName}
                onSelectProvince={(pName) => setSelectedProvinceName(pName)}
                activeZone={activeZone}
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[580px] overflow-y-auto pr-1 py-1">
                {filteredProvinces.map(p => {
                  const isSelected = selectedProvinceName === p.province;
                  const evalRate = p.total_hospitals > 0 ? (p.total_evaluated / p.total_hospitals) * 100 : 0;

                  return (
                    <button
                      key={p.province}
                      onClick={() => {
                        if (selectedProvinceName === p.province) {
                          setSelectedProvinceName('');
                        } else {
                          setSelectedProvinceName(p.province);
                        }
                      }}
                      className={`text-left p-3.5 rounded-2xl border transition-all text-sm flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#17191c] text-white border-[#17191c]'
                          : 'bg-white border-[#ececec] hover:bg-[#fafafb] text-[#17191c]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <span className="font-medium truncate text-base">{p.province}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full tabular-nums font-medium ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#f2f2f3] text-[#5d2a1a]'
                        }`}>
                          {evalRate.toFixed(0)}%
                        </span>
                      </div>
                      <div className={`text-xs tabular-nums ${isSelected ? 'text-white/80' : 'text-[#5f6370]'}`}>
                        รพ. รวม: {p.total_hospitals} แห่ง
                      </div>
                      <div className={`text-xs mt-1.5 flex items-center justify-between ${isSelected ? 'text-white/60' : 'text-[#6b6f7a]'}`}>
                        <span>{p.zone.replace('เขตสุขภาพที่ ', 'เขต ')}</span>
                        {p.excellent > 0 && (
                          <span className={isSelected ? 'text-[#fbe1d1]' : 'text-[#5d2a1a] font-medium'}>
                            ดีเด่น {p.excellent}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3.5 border-t border-[#ececec] flex items-center justify-between text-sm text-[#5f6370]">
            <span>
              กำลังแสดงพื้นที่: <strong className="text-[#17191c] font-medium">{activeZone === 'ALL' ? 'ทั้ง 77 จังหวัดทั่วประเทศ' : `เฉพาะเขตสุขภาพที่ ${activeZone.replace(/^0+/, '')}`}</strong>
            </span>
            <div className="flex items-center gap-2">
              {selectedProvince ? (
                <>
                  <span className="text-[#17191c] font-medium">
                    เลือกดู: จังหวัด{selectedProvince.province}
                  </span>
                  <button
                    onClick={() => setSelectedProvinceName('')}
                    className="text-xs text-[#5f6370] hover:text-[#17191c] transition-colors"
                  >
                    ✕ ล้างการเลือก
                  </button>
                </>
              ) : (
                <span className="text-[#6b6f7a]">
                  สถานะ: ภาพรวมพื้นที่
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Dedicated Side Info Panel (5 cols) */}
        <div className="lg:col-span-5 bg-[#f2f2f3] p-6 rounded-[24px] flex flex-col justify-between text-[#17191c] min-w-0 w-full">
          {selectedProvince ? (
            <div>
              {/* Header of selected province */}
              <div className="flex items-start justify-between pb-3.5 border-b border-[#ececec] mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-[#5f6370] bg-white border border-[#ececec] px-3 py-1 rounded-full">
                      {selectedProvince.zone}
                    </span>
                    {selectedProvince.region && (
                      <span className="text-xs text-[#6b6f7a]">
                        • {selectedProvince.region}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[#17191c] mt-2 flex items-center gap-2 leading-[1.35]">
                    <MapPin className="w-6 h-6 text-[#17191c]" />
                    จังหวัด{selectedProvince.province}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedProvinceName('')}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-white hover:bg-[#fafafb] text-[#17191c] border border-[#ececec] transition-colors font-medium min-h-[38px] flex items-center gap-1"
                    title="กลับไปดูภาพรวม"
                  >
                    <X className="w-3.5 h-3.5" /> ภาพรวม
                  </button>
                  <div className="text-right">
                    <span className="text-xs text-[#6b6f7a] block font-medium">ความครอบคลุม</span>
                    <span className="text-2xl font-serif font-normal text-[#5d2a1a] tabular-nums leading-[1.35]">
                      {selectedProvince.total_hospitals > 0
                        ? ((selectedProvince.total_evaluated / selectedProvince.total_hospitals) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Metrics of this Province */}
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                <div className="bg-white rounded-2xl p-3.5 text-center border border-[#ececec]">
                  <div className="text-xs text-[#5f6370] font-medium">รพ. ทั้งหมด</div>
                  <div className="text-2xl font-serif font-normal text-[#17191c] tabular-nums mt-0.5 leading-[1.35]">{selectedProvince.total_hospitals}</div>
                  <div className="text-xs text-[#6b6f7a] mt-0.5">แห่ง</div>
                </div>
                <div className="bg-[#fbe1d1] rounded-2xl p-3.5 text-center border-0 text-[#5d2a1a]">
                  <div className="text-xs text-[#5d2a1a] font-medium">มีคลินิกประเมิน</div>
                  <div className="text-2xl font-serif font-normal text-[#5d2a1a] tabular-nums mt-0.5 leading-[1.35]">{selectedProvince.total_evaluated}</div>
                  <div className="text-xs text-[#5d2a1a]/80 mt-0.5">แห่ง</div>
                </div>
                <div className="bg-white rounded-2xl p-3.5 text-center border border-[#ececec]">
                  <div className="text-xs text-[#5f6370] font-medium">ยังไม่ประเมิน</div>
                  <div className="text-2xl font-serif font-normal text-[#5f6370] tabular-nums mt-0.5 leading-[1.35]">{selectedProvince.not_eval}</div>
                  <div className="text-xs text-[#6b6f7a] mt-0.5">แห่ง</div>
                </div>
              </div>

              {/* Evaluation Quality Breakdown */}
              <div className="mb-4">
                <div className="text-xs font-medium text-[#17191c] mb-2 flex items-center justify-between">
                  <span>ผลการประเมินมาตรฐานคลินิก (5 ระดับ):</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                  <div className="p-2.5 rounded-2xl bg-white border border-[#ececec]">
                    <div className="text-xs text-[#5d2a1a] font-medium">ดีเด่น</div>
                    <div className="font-serif font-normal text-base text-[#5d2a1a] tabular-nums mt-0.5 leading-[1.35]">{selectedProvince.excellent || 0}</div>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white border border-[#ececec]">
                    <div className="text-xs text-[#17191c] font-medium">ดีมาก</div>
                    <div className="font-serif font-normal text-base text-[#17191c] tabular-nums mt-0.5 leading-[1.35]">{selectedProvince.very_good || 0}</div>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white border border-[#ececec]">
                    <div className="text-xs text-[#5f6370] font-medium">ดี</div>
                    <div className="font-serif font-normal text-base text-[#5f6370] tabular-nums mt-0.5 leading-[1.35]">{selectedProvince.good || 0}</div>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white border border-[#ececec]">
                    <div className="text-xs text-[#6b6f7a] font-medium">พื้นฐาน</div>
                    <div className="font-serif font-normal text-base text-[#6b6f7a] tabular-nums mt-0.5 leading-[1.35]">{selectedProvince.basic || 0}</div>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white border border-[#ececec]">
                    <div className="text-xs text-[#6b6f7a] font-medium">ควรพัฒนา</div>
                    <div className="font-serif font-normal text-base text-[#6b6f7a] tabular-nums mt-0.5 leading-[1.35]">{selectedProvince.need_dev || 0}</div>
                  </div>
                </div>
              </div>

              {/* List of Hospitals in this Province */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-medium text-[#17191c] flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#17191c]" />
                    รายชื่อโรงพยาบาลในจังหวัด ({filteredHospitals.length} แห่ง):
                  </span>
                  <input
                    type="text"
                    placeholder="ค้นหา รพ...."
                    value={hospitalSearch}
                    onChange={(e) => setHospitalSearch(e.target.value)}
                    className="text-xs px-3 py-1.5 min-h-[36px] rounded-[16px] border border-[#ececec] bg-white text-[#17191c] w-36 focus:outline-none focus:border-[#17191c]"
                  />
                </div>

                <div className="max-h-56 overflow-y-auto space-y-2 pr-1 text-xs">
                  {filteredHospitals.length > 0 ? (
                    filteredHospitals.map((h, i) => (
                      <div
                        key={`${h.name}-${i}`}
                        className="p-3 rounded-2xl bg-white border border-[#ececec] flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-[#f2f2f3] text-[#17191c] text-xs font-medium flex items-center justify-center shrink-0 tabular-nums">
                            {i + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="font-medium text-sm text-[#17191c] truncate">{h.name}</div>
                            {h.code && <div className="text-xs text-[#6b6f7a] font-mono">รหัส: {h.code}</div>}
                          </div>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full bg-[#f2f2f3] text-[#5f6370] border border-[#ececec] font-medium shrink-0 ml-2">
                          {h.level}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-5 text-sm text-[#6b6f7a]">
                      ไม่พบรายชื่อโรงพยาบาลที่ค้นหา
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Header of Area Overview */}
              <div className="flex items-start justify-between pb-3.5 border-b border-[#ececec] mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-[#5f6370] bg-white border border-[#ececec] px-3 py-1 rounded-full">
                      {scopeSummary.title}
                    </span>
                    <span className="text-xs text-[#6b6f7a]">
                      • {scopeSummary.provinceCount} จังหวัด
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-normal text-[#17191c] mt-2 flex items-center gap-2 leading-[1.35]">
                    <Globe2 className="w-6 h-6 text-[#17191c]" />
                    ภาพรวมคลินิกผู้สูงอายุ
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#6b6f7a] block font-medium">ความครอบคลุม</span>
                  <span className="text-2xl font-serif font-normal text-[#5d2a1a] tabular-nums leading-[1.35]">
                    {scopeSummary.evalRate.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Quick Metrics of this Scope */}
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                <div className="bg-white rounded-2xl p-3.5 text-center border border-[#ececec]">
                  <div className="text-xs text-[#5f6370] font-medium">รพ. ทั้งหมด</div>
                  <div className="text-2xl font-serif font-normal text-[#17191c] tabular-nums mt-0.5 leading-[1.35]">{scopeSummary.totalHospitals}</div>
                  <div className="text-xs text-[#6b6f7a] mt-0.5">แห่ง</div>
                </div>
                <div className="bg-[#fbe1d1] rounded-2xl p-3.5 text-center border-0 text-[#5d2a1a]">
                  <div className="text-xs text-[#5d2a1a] font-medium">มีคลินิกประเมิน</div>
                  <div className="text-2xl font-serif font-normal text-[#5d2a1a] tabular-nums mt-0.5 leading-[1.35]">{scopeSummary.totalEvaluated}</div>
                  <div className="text-xs text-[#5d2a1a]/80 mt-0.5">แห่ง</div>
                </div>
                <div className="bg-white rounded-2xl p-3.5 text-center border border-[#ececec]">
                  <div className="text-xs text-[#5f6370] font-medium">ยังไม่ประเมิน</div>
                  <div className="text-2xl font-serif font-normal text-[#5f6370] tabular-nums mt-0.5 leading-[1.35]">{scopeSummary.notEval}</div>
                  <div className="text-xs text-[#6b6f7a] mt-0.5">แห่ง</div>
                </div>
              </div>

              {/* Selection Guide */}
              <div className="p-4 rounded-2xl bg-white border border-[#ececec] mb-3.5 flex items-start gap-3">
                <Info className="w-5 h-5 text-[#17191c] shrink-0 mt-0.5" />
                <div className="text-sm text-[#5f6370]">
                  <span className="font-medium text-[#17191c]">เลือกจังหวัดเพื่อเจาะลึก:</span>
                  <p className="text-xs text-[#5f6370] mt-1">
                    คลิกที่จังหวัดบนแผนที่ประเทศไทย หรือเลือกจากรายการด้านล่างเพื่อดูรายชื่อ รพ. และสถิติเฉพาะพื้นที่
                  </p>
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2 pr-1 text-sm">
                {availableProvinces.map(p => {
                  const pct = p.total_hospitals > 0 ? ((p.total_evaluated / p.total_hospitals) * 100).toFixed(0) : '0';
                  return (
                    <button
                      key={p.province}
                      onClick={() => setSelectedProvinceName(p.province)}
                      className="w-full p-3 rounded-2xl bg-white border border-[#ececec] hover:border-[#17191c] flex items-center justify-between text-left transition-all"
                    >
                      <div>
                        <span className="font-medium text-base text-[#17191c]">{p.province}</span>
                        <span className="text-xs text-[#6b6f7a] ml-2">({p.zone.replace('เขตสุขภาพที่ ', 'เขต ')})</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs text-[#5f6370] tabular-nums">{p.total_hospitals} รพ.</span>
                        <span className="text-xs px-2.5 py-1 rounded-full border border-[#ececec] text-[#5d2a1a] tabular-nums font-medium">
                          ประเมิน {pct}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Macro Charts Row: Zones Stacked Chart & Quality Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Left: Stacked Bar Chart by Zone (2 cols) */}
        <div className="lg:col-span-2 bg-[#f2f2f3] p-6 rounded-[24px] min-w-0 w-full space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-[#17191c] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#17191c]" />
                ผลการประเมินมาตรฐานคลินิกผู้สูงอายุ รายเขตสุขภาพ
              </h3>
              <p className="text-sm text-[#5f6370] mt-1">จำแนกตามระดับผลการประเมินมาตรฐาน รวม 12 เขต + กทม.</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-white text-[#5f6370] border border-[#ececec]">
              937 แห่ง
            </span>
          </div>

          <div className="h-84 w-full bg-white p-4 rounded-2xl border border-[#ececec] min-w-0">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartZoneData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ececec" />
                <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} tick={{ fontSize: 13, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} />
                <YAxis tick={{ fontSize: 14, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} />
                <Tooltip
                  contentStyle={rechartsTooltipStyle}
                  formatter={(value: any, name: any) => [`${value} แห่ง`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '12px' }} />
                <Bar dataKey="ดีเด่น" stackId="a" fill="#5d2a1a" isAnimationActive={false} />
                <Bar dataKey="ดีมาก" stackId="a" fill="#17191c" isAnimationActive={false} />
                <Bar dataKey="ดี" stackId="a" fill="#b9826a" isAnimationActive={false} />
                <Bar dataKey="ผ่านพื้นฐาน" stackId="a" fill="#777b86" isAnimationActive={false} />
                <Bar dataKey="ยังไม่ได้ประเมิน" stackId="a" fill="#d9d9dc" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Proportion of Quality & Hospital Levels */}
        <div className="bg-[#f2f2f3] p-6 rounded-[24px] flex flex-col justify-between min-w-0 w-full">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-medium text-[#17191c] flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-[#17191c]" />
                สัดส่วนคุณภาพคลินิกผู้สูงอายุ
              </h3>
              <span className="text-xs px-3 py-1 rounded-full bg-white text-[#5f6370] border border-[#ececec]">ภาพรวม</span>
            </div>
            <p className="text-sm text-[#5f6370] mb-4">ภาพรวมทั้งประเทศ เป้าหมาย รพ. 937 แห่ง</p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={rechartsTooltipStyle}
                    formatter={(val: any) => [`${val} แห่ง`, 'จำนวน']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-sm mt-3">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                  <span className="text-[#5f6370] truncate text-xs">{d.name.split(' (')[0]}:</span>
                  <span className="font-medium text-[#17191c] tabular-nums text-sm">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-[#ececec] text-sm text-[#5f6370]">
            รพ. ระดับ F2 (รพช. ขนาดกลาง) มีจำนวนมากที่สุดถึง <strong className="text-[#17191c] font-medium">505 แห่ง (53.9%)</strong>
          </div>
        </div>
      </div>

      {/* Complete 77 Provinces Table */}
      <div className="bg-white rounded-[24px] border border-[#ececec] overflow-hidden w-full min-w-0 shadow-sm">
        <div className="p-5 border-b border-[#ececec] flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#fafafb]">
          <div>
            <h3 className="text-lg font-medium text-[#17191c] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#17191c]" />
              ตารางข้อมูลผลประเมินคลินิกผู้สูงอายุ รายจังหวัด (ครบถ้วนทั้ง 77 จังหวัด)
            </h3>
            <p className="text-sm text-[#5f6370] mt-0.5">
              จำแนกตามเขตสุขภาพ ศักยภาพ รพ. (A, S, M, F) และผลการประเมินมาตรฐาน
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-[#5f6370]">แสดงผล:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white text-[#17191c] border border-[#ececec] rounded-[16px] px-3.5 py-1.5 text-xs focus:outline-none min-h-[36px]"
              >
                <option value={77}>ทั้งหมด (77 จังหวัด)</option>
                <option value={25}>25 จังหวัด/หน้า</option>
                <option value={15}>15 จังหวัด/หน้า</option>
                <option value={10}>10 จังหวัด/หน้า</option>
              </select>
            </div>

            <span className="text-xs px-3 py-1 rounded-full bg-white text-[#5f6370] border border-[#ececec] tabular-nums">
              พบ {sortedProvinces.length} จังหวัด
            </span>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[640px]">
          <table className="w-full text-left text-base text-[#17191c]">
            <thead className="bg-[#fafafb] text-[#5f6370] font-medium text-sm border-b border-[#ececec] sticky top-0 z-10">
              <tr>
                <th className="py-3.5 px-3 cursor-pointer hover:text-[#17191c]" onClick={() => handleSort('zone')}>
                  <div className="flex items-center gap-1">เขต <ArrowUpDown className="w-3.5 h-3.5" /></div>
                </th>
                <th className="py-3.5 px-3 cursor-pointer hover:text-[#17191c]" onClick={() => handleSort('province')}>
                  <div className="flex items-center gap-1">จังหวัด <ArrowUpDown className="w-3.5 h-3.5" /></div>
                </th>
                <th className="py-3.5 px-2 text-center cursor-pointer" onClick={() => handleSort('total_hospitals')}>
                  <div className="flex items-center justify-center gap-1">รพ.ทั้งหมด <ArrowUpDown className="w-3.5 h-3.5" /></div>
                </th>
                <th className="py-3.5 px-2 text-center cursor-pointer" onClick={() => handleSort('total_evaluated')}>
                  <div className="flex items-center justify-center gap-1">ประเมินแล้ว <ArrowUpDown className="w-3.5 h-3.5" /></div>
                </th>
                <th className="py-3.5 px-1.5 text-center">A</th>
                <th className="py-3.5 px-1.5 text-center">S</th>
                <th className="py-3.5 px-1.5 text-center">M1</th>
                <th className="py-3.5 px-1.5 text-center">M2</th>
                <th className="py-3.5 px-1.5 text-center">F1</th>
                <th className="py-3.5 px-1.5 text-center">F2</th>
                <th className="py-3.5 px-1.5 text-center">F3</th>
                <th className="py-3.5 px-2 text-center">ดีเด่น</th>
                <th className="py-3.5 px-2 text-center">ดีมาก</th>
                <th className="py-3.5 px-2 text-center">ดี</th>
                <th className="py-3.5 px-2 text-center">พื้นฐาน</th>
                <th className="py-3.5 px-2 text-center">ควรพัฒนา</th>
                <th className="py-3.5 px-2 text-center">ยังไม่ประเมิน</th>
                <th className="py-3.5 px-3 text-center cursor-pointer hover:text-[#17191c]" onClick={() => handleSort('eval_pct')}>
                  <div className="flex items-center justify-center gap-1">% ประเมิน <ArrowUpDown className="w-3.5 h-3.5" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ececec]">
              {paginatedProvinces.map((p, idx) => {
                const isSelected = selectedProvinceName === p.province;
                const evalPct = p.total_hospitals > 0 ? ((p.total_evaluated / p.total_hospitals) * 100).toFixed(1) : '0';

                return (
                  <tr
                    key={`${p.province}-${idx}`}
                    onClick={() => {
                      if (selectedProvinceName === p.province) {
                        setSelectedProvinceName('');
                      } else {
                        setSelectedProvinceName(p.province);
                      }
                    }}
                    className={`cursor-pointer transition-colors h-[54px] ${
                      isSelected ? 'bg-[#f2f2f3]' : 'hover:bg-[#fafafb]'
                    }`}
                  >
                    <td className="py-3.5 px-3 text-[#5f6370] whitespace-nowrap text-sm">
                      {p.zone.replace('เขตสุขภาพที่ ', 'เขต ')}
                    </td>
                    <td className="py-3.5 px-3 font-medium text-[#17191c] whitespace-nowrap text-base">
                      {p.province}
                    </td>
                    <td className="py-3.5 px-2 text-center tabular-nums text-base">{p.total_hospitals}</td>
                    <td className="py-3.5 px-2 text-center font-medium text-[#5d2a1a] tabular-nums text-base">{p.total_evaluated}</td>
                    <td className="py-3.5 px-1.5 text-center text-[#5f6370] tabular-nums text-sm">{p.a || '-'}</td>
                    <td className="py-3.5 px-1.5 text-center text-[#5f6370] tabular-nums text-sm">{p.s || '-'}</td>
                    <td className="py-3.5 px-1.5 text-center text-[#5f6370] tabular-nums text-sm">{p.m1 || '-'}</td>
                    <td className="py-3.5 px-1.5 text-center text-[#5f6370] tabular-nums text-sm">{p.m2 || '-'}</td>
                    <td className="py-3.5 px-1.5 text-center text-[#5f6370] tabular-nums text-sm">{p.f1 || '-'}</td>
                    <td className="py-3.5 px-1.5 text-center text-[#5f6370] tabular-nums text-sm">{p.f2 || '-'}</td>
                    <td className="py-3.5 px-1.5 text-center text-[#5f6370] tabular-nums text-sm">{p.f3 || '-'}</td>
                    <td className="py-3.5 px-2 text-center font-medium text-[#5d2a1a] tabular-nums text-base">{p.excellent || '-'}</td>
                    <td className="py-3.5 px-2 text-center text-[#17191c] tabular-nums text-base">{p.very_good || '-'}</td>
                    <td className="py-3.5 px-2 text-center text-[#5f6370] tabular-nums text-base">{p.good || '-'}</td>
                    <td className="py-3.5 px-2 text-center text-[#6b6f7a] tabular-nums text-base">{p.basic || '-'}</td>
                    <td className="py-3.5 px-2 text-center text-[#6b6f7a] tabular-nums text-base">{p.need_dev || '-'}</td>
                    <td className="py-3.5 px-2 text-center text-[#5f6370] tabular-nums text-base">{p.not_eval || '-'}</td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-14 bg-[#f2f2f3] rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#5d2a1a]"
                            style={{ width: `${evalPct}%` }}
                          />
                        </div>
                        <span className="font-medium text-[#5d2a1a] text-xs w-11 tabular-nums">{evalPct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {pageSize < sortedProvinces.length && (
          <div className="p-4 border-t border-[#ececec] bg-[#fafafb] flex items-center justify-between text-sm text-[#5f6370]">
            <span>
              หน้าที่ {currentPage} จาก {totalPages} หน้า ({sortedProvinces.length} จังหวัด)
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3.5 py-1.5 rounded-full border border-[#ececec] bg-white text-[#17191c] disabled:opacity-40 hover:bg-[#fafafb] text-xs min-h-[36px]"
              >
                ก่อนหน้า
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3.5 py-1.5 rounded-full text-xs min-h-[36px] transition-all ${
                    currentPage === page ? 'bg-[#17191c] text-white font-medium' : 'bg-white text-[#5f6370] border border-[#ececec] hover:bg-[#fafafb]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3.5 py-1.5 rounded-full border border-[#ececec] bg-white text-[#17191c] disabled:opacity-40 hover:bg-[#fafafb] text-xs min-h-[36px]"
              >
                ถัดไป
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tab Dedicated Data Sources */}
      <TabSourceReference
        tabTitle="ข้อมูลคลินิกผู้สูงอายุ พร้อมแสดงจำนวนเป้าหมาย รพ. 937 แห่ง"
        lastUpdated="ปีงบประมาณ 2567–2569"
        sources={[
          {
            title: 'สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ',
            dept: 'กรมการแพทย์ กระทรวงสาธารณสุข',
            description: 'ฐานข้อมูลสรุปผลการประเมินมาตรฐานคลินิกผู้สูงอายุในโรงพยาบาลสังกัดกระทรวงสาธารณสุข 937 แห่ง ครอบคลุม 5 หมวดเกณฑ์คุณภาพ'
          },
          {
            title: 'กรมการแพทย์ กระทรวงสาธารณสุข',
            dept: 'กระทรวงสาธารณสุข',
            description: 'แนวทางการจัดตั้งและการดำเนินงานคลินิกผู้สูงอายุในโรงพยาบาลทุกระดับ (Comprehensive Geriatric Care Guidelines) รพศ./รพท./รพช.'
          }
        ]}
      />
    </div>
  );
};
