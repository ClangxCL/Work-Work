import React, { useState, useMemo } from 'react';
import { ClinicZoneData, ClinicProvinceData, HospitalInfo } from '../../types';
import { KPICard } from '../KPICard';
import { ThailandClinicMap } from '../ThailandClinicMap';
import { TabSourceReference, TabSourceItem, TabNoteItem } from '../TabSourceReference';
import {
  Hospital, Award, CheckCircle2, AlertCircle, Clock, Search, Filter,
  MapPin, Building2, ChevronRight, ArrowUpDown, Globe2, ShieldCheck, Stethoscope,
  Map as MapIcon, LayoutGrid, Info, X
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

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
  const [selectedProvinceName, setSelectedProvinceName] = useState<string>(''); // Default to empty (ยังไม่เลือกจังหวัด)
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hospitalSearch, setHospitalSearch] = useState<string>('');
  const [sortField, setSortField] = useState<string>('total_hospitals');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(77); // Show all 77 or pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [visualMode, setVisualMode] = useState<'map' | 'cards'>('map'); // Default to map view

  // Sync with prop if changes
  const activeZone = selectedZone !== 'ALL' ? selectedZone : internalZone;

  // Clean list of zones (excluding total row)
  const cleanZones = useMemo(() => {
    return zonesData.filter(z => !z.zone.includes('รวม') && z.year !== 'รวม');
  }, [zonesData]);

  // Zone list for dropdown
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

  // Filtered provinces list based on zone and search
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

  // Available province options for select
  const availableProvinces = useMemo(() => {
    if (activeZone === 'ALL') return provincesData;
    const zoneNum = activeZone.replace(/^0+/, '');
    return provincesData.filter(p => p.zone.includes(`ที่ ${zoneNum}`) || p.zone.includes(`เขต ${zoneNum}`));
  }, [provincesData, activeZone]);

  // Scope summary metrics when no specific province is selected
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

  // Selected province details for Side Info Panel (null if no province selected)
  const selectedProvince = useMemo(() => {
    if (!selectedProvinceName) return null;
    return provincesData.find(p => p.province === selectedProvinceName) || null;
  }, [provincesData, selectedProvinceName]);

  // Filtered hospital list inside selected province
  const filteredHospitals = useMemo(() => {
    if (!selectedProvince?.hospitals_list) return [];
    if (!hospitalSearch.trim()) return selectedProvince.hospitals_list;
    return selectedProvince.hospitals_list.filter(h =>
      h.name.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
      h.code.includes(hospitalSearch) ||
      h.level.toLowerCase().includes(hospitalSearch.toLowerCase())
    );
  }, [selectedProvince, hospitalSearch]);

  // Sorted provinces for Table
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

  // Paginated table data
  const paginatedProvinces = useMemo(() => {
    if (pageSize >= sortedProvinces.length) return sortedProvinces;
    const start = (currentPage - 1) * pageSize;
    return sortedProvinces.slice(start, start + pageSize);
  }, [sortedProvinces, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedProvinces.length / pageSize);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Chart data for evaluation levels across zones
  const chartZoneData = useMemo(() => {
    return cleanZones.map(z => ({
      name: z.zone.replace('เขตสุขภาพที่ ', 'เขต '),
      ดีเด่น: z.excellent,
      ดีมาก: z.very_good,
      ดี: z.good,
      ผ่านพื้นฐาน: z.basic,
      ควรพัฒนา: z.need_dev,
      ยังไม่ได้ประเมิน: z.not_eval,
      รวมประเมิน: z.total_evaluated,
      ทั้งหมด: z.total_hospitals
    }));
  }, [cleanZones]);

  // Pie chart data for evaluation status
  const pieData = useMemo(() => [
    { name: 'ดีเด่น (Excellent)', value: 84, color: '#059669' },
    { name: 'ดีมาก (Very Good)', value: 237, color: '#10b981' },
    { name: 'ดี (Good)', value: 345, color: '#3b82f6' },
    { name: 'ผ่าน/พื้นฐาน (Basic)', value: 147, color: '#93c5fd' },
    { name: 'ควรพัฒนา (Need Dev)', value: 5, color: '#f59e0b' },
    { name: 'ยังไม่ได้ประเมิน', value: 119, color: '#cbd5e1' },
  ], []);

  // Hospital Level breakdown
  const hospitalLevelData = useMemo(() => [
    { level: 'ระดับ A (รพศ.)', count: 43, color: '#1e3a8a' },
    { level: 'ระดับ S (รพท.ใหญ่)', count: 55, color: '#1d4ed8' },
    { level: 'ระดับ M1 (รพท.กลาง)', count: 38, color: '#2563eb' },
    { level: 'ระดับ M2 (รพท.เล็ก)', count: 96, color: '#3b82f6' },
    { level: 'ระดับ F1 (รพช.ใหญ่)', count: 101, color: '#60a5fa' },
    { level: 'ระดับ F2 (รพช.กลาง)', count: 505, color: '#93c5fd' },
    { level: 'ระดับ F3 (รพช.เล็ก)', count: 75, color: '#bfdbfe' },
  ], []);

  return (
    <div className="space-y-6">
      {/* 1. Global Filter Bar: Health Region & Province */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-slate-700 font-bold text-sm">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>ฟิลเตอร์ข้อมูล:</span>
          </div>

          {/* Health Region Dropdown */}
          <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-500 mr-2 font-medium">เขตสุขภาพ:</span>
            <select
              value={activeZone}
              onChange={(e) => {
                const z = e.target.value;
                setInternalZone(z);
                if (setSelectedZone) setSelectedZone(z);
                // Reset province selection so it starts as overview
                setSelectedProvinceName('');
              }}
              className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
            >
              {zoneOptions.map(z => (
                <option key={z.code} value={z.code}>{z.name}</option>
              ))}
            </select>
          </div>

          {/* Province Dropdown */}
          <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs">
            <span className="text-slate-500 mr-2 font-medium">จังหวัด:</span>
            <select
              value={selectedProvinceName}
              onChange={(e) => setSelectedProvinceName(e.target.value)}
              className="bg-transparent text-blue-700 font-bold focus:outline-none cursor-pointer max-w-[210px]"
            >
              <option value="">
                {activeZone === 'ALL'
                  ? '— ทุกจังหวัด (ยังไม่เลือก) —'
                  : `— ภาพรวมเขต ${activeZone.replace(/^0+/, '')} (ยังไม่เลือก) —`}
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
                className="ml-1 text-slate-400 hover:text-rose-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="ค้นหาชื่อจังหวัด หรือ เขต..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-60"
          />
        </div>
      </div>

      {/* 2. Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="รพ. เป้าหมายทั้งหมด"
          value="937 แห่ง"
          subtitle="ระดับ A, S, M, F ทั่วประเทศ"
          badge="13 เขตสุขภาพ"
          badgeColor="blue"
          icon={Hospital}
          variant="navy"
        />
        <KPICard
          title="ประเมินแล้ว"
          value="818 แห่ง"
          subtitle="คิดเป็น 87.3% ของ รพ. ทั้งหมด"
          badge="ผ่านเกณฑ์ 99.4%"
          badgeColor="emerald"
          icon={CheckCircle2}
        />
        <KPICard
          title="เกณฑ์ดีเด่น (Excellent)"
          value="84 แห่ง"
          subtitle="10.3% ของ รพ. ที่ประเมิน"
          badge="มาตรฐานสูงสุด"
          badgeColor="emerald"
          icon={Award}
        />
        <KPICard
          title="เกณฑ์ดีมาก & ดี"
          value="582 แห่ง"
          subtitle="71.1% ของ รพ. ที่ประเมิน"
          badge="ระดับมาตรฐานสูง"
          badgeColor="blue"
          icon={CheckCircle2}
        />
        <KPICard
          title="ยังไม่ได้ประเมิน"
          value="119 แห่ง"
          subtitle="12.7% อยู่ระหว่างดำเนินการ"
          badge="รอการติดตาม"
          badgeColor="amber"
          icon={Clock}
        />
      </div>

      {/* 3. GEOGRAPHIC SECTION: THAILAND MAP + SIDE INFO PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Thailand Visual Map or Cards (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-blue-600" />
                  แผนผังภูมิศาสตร์คลินิกผู้สูงอายุประเทศไทย
                </h3>
                <p className="text-xs text-slate-500">
                  คลิกที่จังหวัดบนแผนที่ประเทศไทย เพื่อดูรายชื่อโรงพยาบาลและสถิติคลินิกในกรอบด้านข้าง
                </p>
              </div>

              {/* View Switcher: Map vs Cards */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto shrink-0">
                <button
                  onClick={() => setVisualMode('map')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    visualMode === 'map'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>แผนที่ไทย</span>
                </button>
                <button
                  onClick={() => setVisualMode('cards')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    visualMode === 'cards'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[580px] overflow-y-auto pr-1 py-1">
                {filteredProvinces.map(p => {
                  const isSelected = selectedProvinceName === p.province;
                  const evalRate = p.total_hospitals > 0 ? (p.total_evaluated / p.total_hospitals) * 100 : 0;
                  const statusColor =
                    evalRate >= 95 ? 'bg-emerald-500 text-white' :
                    evalRate >= 70 ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white';

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
                      className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                          : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-bold text-slate-900 truncate">{p.province}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${statusColor}`}>
                          {evalRate.toFixed(0)}%
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        รพ. รวม: <strong className="text-slate-800">{p.total_hospitals}</strong> แห่ง
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                        <span>{p.zone.replace('เขตสุขภาพที่ ', 'เขต ')}</span>
                        {p.excellent > 0 && (
                          <span className="text-emerald-700 font-bold bg-emerald-100 px-1 rounded">
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

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-slate-600">
              กำลังแสดงพื้นที่: <strong>{activeZone === 'ALL' ? 'ทั้ง 77 จังหวัดทั่วประเทศ' : `เฉพาะเขตสุขภาพที่ ${activeZone.replace(/^0+/, '')}`}</strong>
            </span>
            <div className="flex items-center gap-2">
              {selectedProvince ? (
                <>
                  <span className="text-blue-600 font-semibold">
                    เลือกดู: จังหวัด{selectedProvince.province}
                  </span>
                  <button
                    onClick={() => setSelectedProvinceName('')}
                    className="text-[11px] text-slate-500 hover:text-rose-600 underline transition-colors"
                  >
                    ✕ ล้างการเลือก
                  </button>
                </>
              ) : (
                <span className="text-slate-500 font-medium">
                  สถานะ: ภาพรวมพื้นที่ (ยังไม่ได้เลือกจังหวัด)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Dedicated Side Info Panel (กรอบข้อมูลแยกข้างๆ) (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border-2 border-blue-200/90 shadow-md flex flex-col justify-between">
          {selectedProvince ? (
            <div>
              {/* Header of selected province */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {selectedProvince.zone}
                    </span>
                    {selectedProvince.region && (
                      <span className="text-[11px] text-slate-500 font-medium">
                        • {selectedProvince.region}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-rose-500" />
                    จังหวัด{selectedProvince.province}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProvinceName('')}
                    className="text-[11px] px-2 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors flex items-center gap-1 font-medium"
                    title="กลับไปดูภาพรวม"
                  >
                    <X className="w-3 h-3" />
                    <span>ดูภาพรวม</span>
                  </button>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">ความครอบคลุม</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {selectedProvince.total_hospitals > 0
                        ? ((selectedProvince.total_evaluated / selectedProvince.total_hospitals) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Metrics of this Province */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
                  <div className="text-[10px] text-slate-500">รพ. ทั้งหมด</div>
                  <div className="text-lg font-bold text-slate-900">{selectedProvince.total_hospitals}</div>
                  <div className="text-[10px] text-slate-400">แห่ง</div>
                </div>
                <div className="bg-emerald-50/70 rounded-xl p-2.5 text-center border border-emerald-100">
                  <div className="text-[10px] text-emerald-700 font-medium">มีคลินิกประเมิน</div>
                  <div className="text-lg font-bold text-emerald-800">{selectedProvince.total_evaluated}</div>
                  <div className="text-[10px] text-emerald-600">แห่ง</div>
                </div>
                <div className="bg-amber-50/70 rounded-xl p-2.5 text-center border border-amber-100">
                  <div className="text-[10px] text-amber-700 font-medium">ยังไม่ประเมิน</div>
                  <div className="text-lg font-bold text-amber-800">{selectedProvince.not_eval}</div>
                  <div className="text-[10px] text-amber-600">แห่ง</div>
                </div>
              </div>

              {/* Evaluation Quality Breakdown */}
              <div className="mb-3">
                <div className="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>ผลการประเมินมาตรฐานคลินิก:</span>
                  <span className="text-[10px] text-slate-400 font-normal">เกณฑ์ 5 ระดับ</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-emerald-100/70 text-emerald-800">
                    <div className="text-[10px] font-medium">ดีเด่น</div>
                    <div className="font-bold text-sm">{selectedProvince.excellent || 0}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                    <div className="text-[10px] font-medium">ดีมาก</div>
                    <div className="font-bold text-sm">{selectedProvince.very_good || 0}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                    <div className="text-[10px] font-medium">ดี</div>
                    <div className="font-bold text-sm">{selectedProvince.good || 0}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                    <div className="text-[10px] font-medium">พื้นฐาน</div>
                    <div className="font-bold text-sm">{selectedProvince.basic || 0}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                    <div className="text-[10px] font-medium">ควรพัฒนา</div>
                    <div className="font-bold text-sm">{selectedProvince.need_dev || 0}</div>
                  </div>
                </div>
              </div>

              {/* Hospital Level Breakdown in this province */}
              <div className="mb-3">
                <div className="text-xs font-bold text-slate-700 mb-1.5">
                  ระดับศักยภาพ รพ. ในจังหวัด (A, S, M, F):
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {selectedProvince.a > 0 && <span className="px-2 py-0.5 rounded bg-blue-900 text-white font-bold">A: {selectedProvince.a} แห่ง</span>}
                  {selectedProvince.s > 0 && <span className="px-2 py-0.5 rounded bg-blue-800 text-white font-bold">S: {selectedProvince.s} แห่ง</span>}
                  {selectedProvince.m1 > 0 && <span className="px-2 py-0.5 rounded bg-blue-700 text-white font-medium">M1: {selectedProvince.m1} แห่ง</span>}
                  {selectedProvince.m2 > 0 && <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-medium">M2: {selectedProvince.m2} แห่ง</span>}
                  {selectedProvince.f1 > 0 && <span className="px-2 py-0.5 rounded bg-blue-500 text-white font-medium">F1: {selectedProvince.f1} แห่ง</span>}
                  {selectedProvince.f2 > 0 && <span className="px-2 py-0.5 rounded bg-blue-400 text-slate-900 font-semibold">F2: {selectedProvince.f2} แห่ง</span>}
                  {selectedProvince.f3 > 0 && <span className="px-2 py-0.5 rounded bg-blue-200 text-slate-900 font-semibold">F3: {selectedProvince.f3} แห่ง</span>}
                </div>
              </div>

              {/* List of Hospitals in this Province (มี รพ อะไรบ้าง) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    รายชื่อโรงพยาบาลในจังหวัด ({filteredHospitals.length} แห่ง):
                  </span>
                  <input
                    type="text"
                    placeholder="ค้นหา รพ...."
                    value={hospitalSearch}
                    onChange={(e) => setHospitalSearch(e.target.value)}
                    className="text-[10px] px-2 py-0.5 rounded-lg border border-slate-200 bg-slate-50 w-28 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 text-xs">
                  {filteredHospitals.length > 0 ? (
                    filteredHospitals.map((h, i) => (
                      <div
                        key={`${h.name}-${i}`}
                        className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:bg-blue-50/50 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <div>
                            <div className="font-semibold text-slate-900 leading-tight">{h.name}</div>
                            {h.code && <div className="text-[10px] text-slate-400 font-mono">รหัส: {h.code}</div>}
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${
                          h.level.includes('A') ? 'bg-blue-900 text-white' :
                          h.level.includes('S') || h.level.includes('M') ? 'bg-blue-700 text-white' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {h.level}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-slate-400">
                      ไม่พบรายชื่อโรงพยาบาลที่ค้นหา
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Header of Area Overview */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                      {scopeSummary.title}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      • {scopeSummary.provinceCount} จังหวัด
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-blue-600" />
                    ภาพรวมคลินิกผู้สูงอายุ
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">ความครอบคลุม</span>
                  <span className="text-lg font-bold text-emerald-600">
                    {scopeSummary.evalRate.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Quick Metrics of this Scope */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
                  <div className="text-[10px] text-slate-500">รพ. ทั้งหมด</div>
                  <div className="text-lg font-bold text-slate-900">{scopeSummary.totalHospitals}</div>
                  <div className="text-[10px] text-slate-400">แห่ง</div>
                </div>
                <div className="bg-emerald-50/70 rounded-xl p-2.5 text-center border border-emerald-100">
                  <div className="text-[10px] text-emerald-700 font-medium">มีคลินิกประเมิน</div>
                  <div className="text-lg font-bold text-emerald-800">{scopeSummary.totalEvaluated}</div>
                  <div className="text-[10px] text-emerald-600">แห่ง</div>
                </div>
                <div className="bg-amber-50/70 rounded-xl p-2.5 text-center border border-amber-100">
                  <div className="text-[10px] text-amber-700 font-medium">ยังไม่ประเมิน</div>
                  <div className="text-lg font-bold text-amber-800">{scopeSummary.notEval}</div>
                  <div className="text-[10px] text-amber-600">แห่ง</div>
                </div>
              </div>

              {/* Evaluation Quality Breakdown */}
              <div className="mb-3">
                <div className="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>ผลการประเมินมาตรฐานคลินิก (ภาพรวม):</span>
                  <span className="text-[10px] text-slate-400 font-normal">เกณฑ์ 5 ระดับ</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-emerald-100/70 text-emerald-800">
                    <div className="text-[10px] font-medium">ดีเด่น</div>
                    <div className="font-bold text-sm">{scopeSummary.excellent}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                    <div className="text-[10px] font-medium">ดีมาก</div>
                    <div className="font-bold text-sm">{scopeSummary.veryGood}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                    <div className="text-[10px] font-medium">ดี</div>
                    <div className="font-bold text-sm">{scopeSummary.good}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                    <div className="text-[10px] font-medium">พื้นฐาน</div>
                    <div className="font-bold text-sm">{scopeSummary.basic}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                    <div className="text-[10px] font-medium">ควรพัฒนา</div>
                    <div className="font-bold text-sm">{scopeSummary.needDev}</div>
                  </div>
                </div>
              </div>

              {/* Hospital Level Breakdown in scope */}
              <div className="mb-3">
                <div className="text-xs font-bold text-slate-700 mb-1.5">
                  ระดับศักยภาพ รพ. ทั้งหมดในพื้นที่ (A, S, M, F):
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {scopeSummary.a > 0 && <span className="px-2 py-0.5 rounded bg-blue-900 text-white font-bold">A: {scopeSummary.a} แห่ง</span>}
                  {scopeSummary.s > 0 && <span className="px-2 py-0.5 rounded bg-blue-800 text-white font-bold">S: {scopeSummary.s} แห่ง</span>}
                  {scopeSummary.m1 > 0 && <span className="px-2 py-0.5 rounded bg-blue-700 text-white font-medium">M1: {scopeSummary.m1} แห่ง</span>}
                  {scopeSummary.m2 > 0 && <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-medium">M2: {scopeSummary.m2} แห่ง</span>}
                  {scopeSummary.f1 > 0 && <span className="px-2 py-0.5 rounded bg-blue-500 text-white font-medium">F1: {scopeSummary.f1} แห่ง</span>}
                  {scopeSummary.f2 > 0 && <span className="px-2 py-0.5 rounded bg-blue-400 text-slate-900 font-semibold">F2: {scopeSummary.f2} แห่ง</span>}
                  {scopeSummary.f3 > 0 && <span className="px-2 py-0.5 rounded bg-blue-200 text-slate-900 font-semibold">F3: {scopeSummary.f3} แห่ง</span>}
                </div>
              </div>

              {/* Instruction Banner & Province selector */}
              <div>
                <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 mb-2.5 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900">
                    <span className="font-bold">ยังไม่ได้เลือกจังหวัด (แสดงภาพรวม)</span>
                    <p className="text-[11px] text-blue-700 mt-0.5 leading-relaxed">
                      คลิกที่จังหวัดบนแผนที่ประเทศไทย หรือเลือกจากรายการด้านล่าง เพื่อดูรายชื่อโรงพยาบาลและสถิติเฉพาะจังหวัด:
                    </p>
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>เลือกจังหวัดในพื้นที่เพื่อเจาะลึก ({availableProvinces.length} จังหวัด):</span>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 text-xs">
                  {availableProvinces.map(p => {
                    const pct = p.total_hospitals > 0 ? ((p.total_evaluated / p.total_hospitals) * 100).toFixed(0) : '0';
                    return (
                      <button
                        key={p.province}
                        onClick={() => setSelectedProvinceName(p.province)}
                        className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-400 hover:shadow-xs flex items-center justify-between text-left transition-all group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:bg-blue-600" />
                          <span className="font-semibold text-slate-800 group-hover:text-blue-700">{p.province}</span>
                          <span className="text-[10px] text-slate-400">({p.zone.replace('เขตสุขภาพที่ ', 'เขต ')})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-600 font-medium">{p.total_hospitals} รพ.</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                            ประเมิน {pct}%
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Macro Charts Row: Zones Stacked Chart & Quality Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Stacked Bar Chart by Zone (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">ผลการประเมินมาตรฐานคลินิกผู้สูงอายุ รายเขตสุขภาพ</h3>
              <p className="text-xs text-slate-500">ปีงบประมาณ 2567 (จำแนกตามระดับผลการประเมิน)</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
              รวม 12 เขต + กทม.
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartZoneData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(value: any, name: any) => [`${value} แห่ง`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="ดีเด่น" stackId="a" fill="#059669" isAnimationActive={false} />
                <Bar dataKey="ดีมาก" stackId="a" fill="#10b981" isAnimationActive={false} />
                <Bar dataKey="ดี" stackId="a" fill="#3b82f6" isAnimationActive={false} />
                <Bar dataKey="ผ่านพื้นฐาน" stackId="a" fill="#93c5fd" isAnimationActive={false} />
                <Bar dataKey="ยังไม่ได้ประเมิน" stackId="a" fill="#cbd5e1" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Proportion of Quality & Hospital Levels */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-1">สัดส่วนคุณภาพคลินิกผู้สูงอายุ</h3>
            <p className="text-xs text-slate-500 mb-4">ภาพรวมทั้งประเทศ ปีงบประมาณ 2567</p>

            <div className="h-52 w-full">
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
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                    formatter={(val: any) => [`${val} แห่ง`, 'จำนวน']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mt-2">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                  <span className="text-slate-600 truncate">{d.name}:</span>
                  <span className="font-bold text-slate-800">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-xs font-semibold text-slate-700 mb-2">ศักยภาพโรงพยาบาลส่วนใหญ่:</div>
            <div className="text-xs text-slate-600">
              รพ. ระดับ <span className="font-bold text-blue-600">F2 (รพช. ขนาดกลาง)</span> มีจำนวนมากที่สุดถึง <strong>505 แห่ง (53.9%)</strong> ตามด้วย F1 (101 แห่ง) และ M2 (96 แห่ง)
            </div>
          </div>
        </div>
      </div>

      {/* 5. Complete 77 Provinces Table (FULL DATA WITH ALL COLUMNS) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              ตารางข้อมูลผลประเมินคลินิกผู้สูงอายุ รายจังหวัด (ครบถ้วนทั้ง 77 จังหวัด)
            </h3>
            <p className="text-xs text-slate-500">
              จำแนกตามเขตสุขภาพ ศักยภาพ รพ. (A, S, M, F) และผลการประเมินมาตรฐานครบทุกมิติ (คลิกที่หัวตารางเพื่อเรียงลำดับ)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Page Size Selector */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500">แสดงผล:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold focus:outline-none"
              >
                <option value={77}>ทั้งหมด (77 จังหวัด)</option>
                <option value={25}>25 จังหวัด/หน้า</option>
                <option value={15}>15 จังหวัด/หน้า</option>
                <option value={10}>10 จังหวัด/หน้า</option>
              </select>
            </div>

            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              พบ {sortedProvinces.length} จังหวัด
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('zone')}>
                  <div className="flex items-center gap-1">เขต <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-3 cursor-pointer hover:bg-slate-200" onClick={() => handleSort('province')}>
                  <div className="flex items-center gap-1">จังหวัด <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-2 text-center bg-blue-50/80 cursor-pointer" onClick={() => handleSort('total_hospitals')}>
                  <div className="flex items-center justify-center gap-1">รพ.ทั้งหมด <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-2 text-center bg-emerald-50/80 cursor-pointer" onClick={() => handleSort('total_evaluated')}>
                  <div className="flex items-center justify-center gap-1">ประเมินแล้ว <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                {/* Hospital levels */}
                <th className="py-3 px-1.5 text-center text-blue-900 bg-slate-50">A</th>
                <th className="py-3 px-1.5 text-center text-blue-800 bg-slate-50">S</th>
                <th className="py-3 px-1.5 text-center text-blue-700 bg-slate-50">M1</th>
                <th className="py-3 px-1.5 text-center text-blue-600 bg-slate-50">M2</th>
                <th className="py-3 px-1.5 text-center text-blue-500 bg-slate-50">F1</th>
                <th className="py-3 px-1.5 text-center text-blue-400 bg-slate-50">F2</th>
                <th className="py-3 px-1.5 text-center text-blue-300 bg-slate-50">F3</th>
                {/* Evaluation levels */}
                <th className="py-3 px-2 text-center text-emerald-800 bg-emerald-50/40">ดีเด่น</th>
                <th className="py-3 px-2 text-center text-emerald-700 bg-emerald-50/40">ดีมาก</th>
                <th className="py-3 px-2 text-center text-blue-600 bg-blue-50/40">ดี</th>
                <th className="py-3 px-2 text-center text-slate-600">พื้นฐาน</th>
                <th className="py-3 px-2 text-center text-amber-600">ควรพัฒนา</th>
                <th className="py-3 px-2 text-center text-rose-600 bg-rose-50/40">ยังไม่ประเมิน</th>
                <th className="py-3 px-3 text-center cursor-pointer hover:bg-slate-200" onClick={() => handleSort('eval_pct')}>
                  <div className="flex items-center justify-center gap-1">% ประเมิน <ArrowUpDown className="w-3 h-3" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
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
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-100/70 font-semibold text-slate-900 ring-1 ring-inset ring-blue-500'
                        : 'hover:bg-slate-50/90'
                    }`}
                  >
                    <td className="py-2 px-3 font-medium text-slate-500 whitespace-nowrap">
                      {p.zone.replace('เขตสุขภาพที่ ', 'เขต ')}
                    </td>
                    <td className="py-2 px-3 font-bold text-slate-900 whitespace-nowrap flex items-center gap-1">
                      {p.province}
                      {isSelected && <ChevronRight className="w-3 h-3 text-blue-600 inline" />}
                    </td>
                    <td className="py-2 px-2 text-center font-bold bg-blue-50/40">{p.total_hospitals}</td>
                    <td className="py-2 px-2 text-center font-bold text-emerald-700 bg-emerald-50/40">{p.total_evaluated}</td>
                    {/* Levels */}
                    <td className="py-2 px-1.5 text-center text-slate-500">{p.a || '-'}</td>
                    <td className="py-2 px-1.5 text-center text-slate-500">{p.s || '-'}</td>
                    <td className="py-2 px-1.5 text-center text-slate-500">{p.m1 || '-'}</td>
                    <td className="py-2 px-1.5 text-center text-slate-500">{p.m2 || '-'}</td>
                    <td className="py-2 px-1.5 text-center text-slate-500">{p.f1 || '-'}</td>
                    <td className="py-2 px-1.5 text-center text-slate-500">{p.f2 || '-'}</td>
                    <td className="py-2 px-1.5 text-center text-slate-500">{p.f3 || '-'}</td>
                    {/* Evaluation grades */}
                    <td className="py-2 px-2 text-center font-bold text-emerald-800 bg-emerald-50/20">{p.excellent || '-'}</td>
                    <td className="py-2 px-2 text-center font-semibold text-emerald-700 bg-emerald-50/20">{p.very_good || '-'}</td>
                    <td className="py-2 px-2 text-center font-semibold text-blue-600 bg-blue-50/20">{p.good || '-'}</td>
                    <td className="py-2 px-2 text-center text-slate-600">{p.basic || '-'}</td>
                    <td className="py-2 px-2 text-center text-amber-600">{p.need_dev || '-'}</td>
                    <td className="py-2 px-2 text-center font-bold text-rose-600 bg-rose-50/20">{p.not_eval || '-'}</td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <div className="w-12 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              parseFloat(evalPct) >= 95 ? 'bg-emerald-500' :
                              parseFloat(evalPct) >= 70 ? 'bg-blue-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${evalPct}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-slate-700 text-[10px] w-9">{evalPct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pageSize < sortedProvinces.length && (
          <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              แสดงหน้าที่ {currentPage} จาก {totalPages} หน้า (ทั้งหมด {sortedProvinces.length} จังหวัด)
            </span>
            <div className="flex items-center space-x-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-2.5 py-1 rounded border bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
              >
                ก่อนหน้า
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-2.5 py-1 rounded border text-xs font-semibold ${
                    currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-2.5 py-1 rounded border bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
              >
                ถัดไป
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tab 1 Dedicated Data Sources & Important Notes */}
      <TabSourceReference
        tabTitle="แท็บที่ 1: คลินิกผู้สูงอายุ (Geriatric Clinic System)"
        accentColor="blue"
        lastUpdated="พฤศจิกายน 2567"
        sources={[
          {
            title: 'สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ',
            dept: 'กรมการแพทย์ กระทรวงสาธารณสุข',
            url: 'https://agingmed.dms.go.th',
            displayUrl: 'agingmed.dms.go.th',
            badge: 'รายงานผลการประเมินมาตรฐานคลินิกผู้สูงอายุ',
            badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
            description: 'ฐานข้อมูลสรุปผลการประเมินมาตรฐานคลินิกผู้สูงอายุในโรงพยาบาลสังกัดกระทรวงสาธารณสุข 937 แห่ง ครอบคลุม 5 หมวดเกณฑ์คุณภาพ',
            fileName: 'geriatric_clinic_report.xlsx'
          },
          {
            title: 'กรมการแพทย์ กระทรวงสาธารณสุข',
            dept: 'กระทรวงสาธารณสุข',
            url: 'https://dms.go.th',
            displayUrl: 'dms.go.th',
            badge: 'คู่มือและเกณฑ์มาตรฐานบริการ',
            badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
            description: 'แนวทางการจัดตั้งและการดำเนินงานคลินิกผู้สูงอายุในโรงพยาบาลทุกระดับ (Comprehensive Geriatric Care Guidelines) รพศ./รพท./รพช.'
          }
        ]}
        notes={[
          {
            id: 't1-scope',
            title: '1. ขอบเขตโรงพยาบาลเป้าหมาย 937 แห่งทั่วประเทศ',
            content: 'ครอบคลุมโรงพยาบาลสังกัดกระทรวงสาธารณสุขทุกระดับ ได้แก่ ระดับ A (รพ.ศูนย์: 34 แห่ง), ระดับ S (รพ.ทั่วไป: 56 แห่ง), ระดับ M1-M2 (รพ.ชุมชนขนาดใหญ่: 218 แห่ง), และระดับ F1-F3 (รพ.ชุมชนทั่วไปและขนาดเล็ก: 629 แห่ง)'
          },
          {
            id: 't1-levels',
            title: '2. เกณฑ์ระดับผลการประเมินมาตรฐาน 5 ระดับ',
            content: 'แบ่งเป็น ดีเด่น (Excellent - 5 ดาว), ดีมาก (Very Good - 4 ดาว), ดี (Good - 3 ดาว), ผ่านเกณฑ์พื้นฐาน (Basic - 2 ดาว), และ ควรพัฒนา (Need Development - 1 ดาว) โดยประเมิน 5 ด้าน: บุคลากร, สถานที่/สิ่งแวดล้อม, ระบบบริการ, การมีส่วนร่วม, และผลลัพธ์การดูแล'
          },
          {
            id: 't1-not-eval',
            title: '3. สถานะโรงพยาบาลที่ยังไม่ประเมิน (119 แห่ง)',
            content: 'โรงพยาบาลที่ยังไม่มีผลประเมินส่วนใหญ่เป็นโรงพยาบาลชุมชนขนาดเล็กระดับ F3 (เช่น รพ.เปิดใหม่ หรือมีแพทย์ประจำ 1-2 ท่าน) ซึ่งอยู่ระหว่างการพัฒนาศักยภาพบุคลากรและการเตรียมความพร้อมโครงสร้าง'
          },
          {
            id: 't1-calc',
            title: '4. การคำนวณอัตราความครอบคลุม',
            content: 'คิดจากจำนวนโรงพยาบาลที่มีคลินิกผู้สูงอายุ (เปิดแล้ว 818 แห่ง) เทียบกับโรงพยาบาลเป้าหมายทั้งหมด 937 แห่ง คิดเป็นความครอบคลุมภาพรวมร้อยละ 87.30 ทั่วประเทศ'
          }
        ]}
      />
    </div>
  );
};
