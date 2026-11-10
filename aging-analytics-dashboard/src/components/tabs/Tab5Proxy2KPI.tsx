import React, { useState, useMemo } from 'react';
import {
  DOMAIN_BASELINES,
  PROXY2_PROVINCES,
  OFFICIAL_CONTACTS,
  SUPPORTING_DOCUMENTS,
  Proxy2ProvinceRecord,
  DomainBaseline
} from '../../data/proxy2KpiData';
import { KPICard } from '../KPICard';
import {
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Users,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Sliders,
  Upload,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Search,
  Filter,
  CheckCheck,
  Activity,
  HeartPulse,
  Brain,
  ShieldCheck,
  Phone,
  Mail,
  ExternalLink,
  Info,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

interface Tab5Proxy2KPIProps {
  selectedZone: string;
}

export const Tab5Proxy2KPI: React.FC<Tab5Proxy2KPIProps> = ({ selectedZone }) => {
  const [subView, setSubView] = useState<'overview' | 'regions' | 'domains' | 'simulator' | 'guidelines'>('overview');
  const [provincesList, setProvincesList] = useState<Proxy2ProvinceRecord[]>(PROXY2_PROVINCES);
  const [searchProvince, setSearchProvince] = useState<string>('');
  const [selectedDomainId, setSelectedDomainId] = useState<string>('dementia');
  const [selectedProvDetail, setSelectedProvDetail] = useState<Proxy2ProvinceRecord | null>(null);

  // Simulator States
  const [simCoverageBoost, setSimCoverageBoost] = useState<number>(0);
  const [simDomainRates, setSimDomainRates] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    DOMAIN_BASELINES.forEach(d => {
      init[d.id] = d.baseline_national_pct;
    });
    return init;
  });

  // Filtered provinces based on selectedZone and search
  const filteredProvinces = useMemo(() => {
    return provincesList.filter(p => {
      const matchZone = selectedZone === 'ALL' || p.zone_code === selectedZone || p.zone.includes(selectedZone);
      const matchSearch = !searchProvince || p.province.toLowerCase().includes(searchProvince.toLowerCase());
      return matchZone && matchSearch;
    });
  }, [provincesList, selectedZone, searchProvince]);

  // Aggregated Summary
  const summary = useMemo(() => {
    const totalElderly = filteredProvinces.reduce((acc, p) => acc + p.elderly_total_69, 0);
    const totalScreened = filteredProvinces.reduce((acc, p) => acc + p.screened_total_69, 0);
    const totalTargetB = filteredProvinces.reduce((acc, p) => acc + p.target_population_b, 0);
    const totalCaredA = filteredProvinces.reduce((acc, p) => acc + p.cared_population_a, 0);

    const coveragePct = totalTargetB > 0 ? Math.round((totalCaredA / totalTargetB) * 1000) / 10 : 0;
    const targetGoal70 = Math.round(totalTargetB * 0.70);
    const gapTo70 = Math.max(0, targetGoal70 - totalCaredA);

    const targetGoal20 = Math.round(totalTargetB * 0.20);
    const gapTo20 = Math.max(0, targetGoal20 - totalCaredA);

    const targetGoal40 = Math.round(totalTargetB * 0.40);
    const gapTo40 = Math.max(0, targetGoal40 - totalCaredA);

    const q2MetCount = filteredProvinces.filter(p => p.coverage_pct >= 20).length;
    const q3MetCount = filteredProvinces.filter(p => p.coverage_pct >= 40).length;
    const q4MetCount = filteredProvinces.filter(p => p.coverage_pct >= 70).length;

    return {
      totalElderly,
      totalScreened,
      totalTargetB,
      totalCaredA,
      coveragePct,
      targetGoal70,
      gapTo70,
      gapTo20,
      gapTo40,
      q2MetCount,
      q3MetCount,
      q4MetCount,
      totalProvinces: filteredProvinces.length
    };
  }, [filteredProvinces]);

  // Simulated metrics
  const simulatedSummary = useMemo(() => {
    const baseTargetB = summary.totalTargetB;
    const boostedCoverage = Math.min(100, Math.max(0, summary.coveragePct + simCoverageBoost));
    const simulatedCaredA = Math.round((baseTargetB * boostedCoverage) / 100);
    const simulatedGap70 = Math.max(0, Math.round(baseTargetB * 0.70) - simulatedCaredA);

    return {
      boostedCoverage: Math.round(boostedCoverage * 10) / 10,
      simulatedCaredA,
      simulatedGap70,
      achieves70: boostedCoverage >= 70
    };
  }, [summary, simCoverageBoost]);

  // Top 5 and Bottom 5 provinces by coverage
  const leaderboard = useMemo(() => {
    const sorted = [...filteredProvinces].sort((a, b) => b.coverage_pct - a.coverage_pct);
    return {
      top5: sorted.slice(0, 5),
      bottom5: [...sorted].reverse().slice(0, 5)
    };
  }, [filteredProvinces]);

  // Zone Comparison Chart Data
  const zoneChartData = useMemo(() => {
    const zonesMap: Record<string, { zone: string; code: string; targetB: number; caredA: number }> = {};
    for (let i = 1; i <= 13; i++) {
      const code = i.toString().padStart(2, '0');
      zonesMap[code] = {
        zone: `เขต ${i}`,
        code,
        targetB: 0,
        caredA: 0
      };
    }

    provincesList.forEach(p => {
      if (zonesMap[p.zone_code]) {
        zonesMap[p.zone_code].targetB += p.target_population_b;
        zonesMap[p.zone_code].caredA += p.cared_population_a;
      }
    });

    return Object.values(zonesMap).map(z => {
      const pct = z.targetB > 0 ? Math.round((z.caredA / z.targetB) * 1000) / 10 : 0;
      return {
        name: z.zone,
        code: z.code,
        'กลุ่มเสี่ยง (B)': z.targetB,
        'ได้รับการดูแล (A)': z.caredA,
        'ร้อยละการดูแล (%)': pct,
        'เป้าหมายสิ้นปี 70%': 70,
        'เป้าหมาย 6 เดือน (20%)': 20,
        'เป้าหมาย 9 เดือน (40%)': 40
      };
    });
  }, [provincesList]);

  // Domain Comparison Data
  const domainComparisonData = useMemo(() => {
    return DOMAIN_BASELINES.map(d => {
      let totalRisk = 0;
      let totalCared = 0;
      filteredProvinces.forEach(p => {
        const item = p.domain_risks[d.id];
        if (item) {
          totalRisk += item.risk;
          totalCared += item.cared;
        }
      });
      const currentPct = totalRisk > 0 ? Math.round((totalCared / totalRisk) * 1000) / 10 : 0;
      return {
        id: d.id,
        name: d.shortName,
        fullName: d.name,
        category: d.category,
        'Baseline ประเทศ (%)': d.baseline_national_pct,
        'อัตราการดูแลปัจจุบัน (%)': currentPct,
        'เป้าหมาย 70%': 70,
        riskPersons: totalRisk,
        caredPersons: totalCared
      };
    });
  }, [filteredProvinces]);

  // Handler for CSV Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length < 2) {
          alert('ไฟล์ไม่มีข้อมูลเพียงพอ');
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const provIdx = headers.findIndex(h => h.includes('จังหวัด') || h.includes('province'));
        const bIdx = headers.findIndex(h => h.includes('b') || h.includes('เสี่ยง') || h.includes('target'));
        const aIdx = headers.findIndex(h => h.includes('a') || h.includes('ดูแล') || h.includes('cared'));

        if (provIdx === -1 || (bIdx === -1 && aIdx === -1)) {
          alert('ไม่พบคอลัมน์ จังหวัด หรือ คอลัมน์ A / B กรุณาตรวจสอบหัวตาราง');
          return;
        }

        const updated = [...provincesList];
        let matchedCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/^[\"']|[\"']$/g, ''));
          const provName = cols[provIdx];
          if (!provName) continue;

          const pObj = updated.find(p => p.province === provName || provName.includes(p.province) || p.province.includes(provName));
          if (pObj) {
            matchedCount++;
            if (bIdx !== -1 && cols[bIdx]) {
              const valB = parseInt(cols[bIdx], 10);
              if (!isNaN(valB) && valB > 0) pObj.target_population_b = valB;
            }
            if (aIdx !== -1 && cols[aIdx]) {
              const valA = parseInt(cols[aIdx], 10);
              if (!isNaN(valA) && valA >= 0) pObj.cared_population_a = valA;
            }
            pObj.coverage_pct = pObj.target_population_b > 0
              ? Math.round((pObj.cared_population_a / pObj.target_population_b) * 1000) / 10
              : 0;
            pObj.gap_to_70pct = Math.max(0, Math.round(pObj.target_population_b * 0.70) - pObj.cared_population_a);
          }
        }

        setProvincesList(updated);
        alert(`นำเข้าข้อมูลสำเร็จ! ปรับปรุงข้อมูลจำนวน ${matchedCount} จังหวัด`);
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการอ่านไฟล์ CSV');
      }
    };
    reader.readAsText(file);
  };

  // Export CSV Template or Current Data
  const handleExportCSV = (isTemplate: boolean = false) => {
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += 'รหัสเขต,เขตสุขภาพ,จังหวัด,ประชากรผู้สูงอายุปี69,คัดกรองเสี่ยงปี69 (ฐาน B),ได้รับการดูแลปี70 (A),ร้อยละการดูแล (%),เป้าหมายปี70 (70%),ส่วนต่างที่ต้องเร่งรัด (Gap 70%)\n';

    provincesList.forEach(p => {
      const row = [
        p.zone_code,
        `"${p.zone}"`,
        `"${p.province}"`,
        p.elderly_total_69,
        isTemplate ? Math.round(p.elderly_total_69 * 0.25) : p.target_population_b,
        isTemplate ? Math.round(p.elderly_total_69 * 0.25 * 0.3) : p.cared_population_a,
        isTemplate ? '30.0' : p.coverage_pct,
        Math.round(p.target_population_b * 0.7),
        isTemplate ? 0 : p.gap_to_70pct
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', isTemplate ? 'template_proxy2_elderly_care_FY2570.csv' : 'report_proxy2_elderly_care_FY2570.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: KPI Official Definition */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-blue-700/50">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-blue-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> ตัวชี้วัดคำรับรองการปฏิบัติราชการระดับกระทรวง ปีงบประมาณ 2570
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Proxy 2
            </span>
            <span className="text-slate-400 text-xs">
              แผนที่ 2 การป้องกันควบคุมโรค • สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            ร้อยละของผู้สูงอายุที่มีความเสี่ยงจากการคัดกรองได้รับการดูแล (ร้อยละ 70)
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-4xl leading-relaxed">
            ติดตามและผลักดันผู้สูงอายุอายุ 60 ปีขึ้นไปที่คัดกรองในชุมชน 9 ด้านในปี 2569 แล้วพบความเสี่ยง (ฐาน B)
            ให้เข้าถึงการประเมิน วินิจฉัย ดูแลรักษา ฟื้นฟูสมรรถภาพ และส่งต่อตาม{' '}
            <strong className="text-amber-300 font-semibold">Flow of Management 9 ด้าน อย่างน้อย 1 ขั้นตอน (A)</strong>{' '}
            ผ่านระบบ <strong className="text-emerald-300 font-semibold">DMS Care Tools</strong> เพื่อปิดช่องว่างการดูแลสุขภาพอย่างเป็นรูปธรรม
          </p>

          {/* Quarterly Milestones Bar */}
          <div className="mt-6 pt-5 border-t border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700">
              <div className="text-[11px] font-semibold text-slate-400">รอบ 3 เดือน (31 ธ.ค. 69)</div>
              <div className="text-base font-bold text-blue-300 mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ฐานข้อมูลพร้อม 100%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">ตรวจความครบถ้วนฐาน B จาก HDC</div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700">
              <div className="text-[11px] font-semibold text-slate-400">รอบ 6 เดือน (31 มี.ค. 70)</div>
              <div className="text-base font-bold text-amber-300 mt-0.5">
                เป้าหมายสะสม ร้อยละ 20
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                ผ่านแล้ว {summary.q2MetCount} / {summary.totalProvinces} จว. ({Math.round((summary.q2MetCount / (summary.totalProvinces || 1)) * 100)}%)
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700">
              <div className="text-[11px] font-semibold text-slate-400">รอบ 9 เดือน (30 มิ.ย. 70)</div>
              <div className="text-base font-bold text-indigo-300 mt-0.5">
                เป้าหมายสะสม ร้อยละ 40
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                ผ่านแล้ว {summary.q3MetCount} / {summary.totalProvinces} จว. ({Math.round((summary.q3MetCount / (summary.totalProvinces || 1)) * 100)}%)
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-950/60 to-slate-800 rounded-2xl p-3 border border-emerald-600/40">
              <div className="text-[11px] font-semibold text-emerald-400">รอบ 12 เดือน (30 ก.ย. 70)</div>
              <div className="text-base font-bold text-emerald-300 mt-0.5 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" /> เป้าหมายสุดท้าย ร้อยละ 70
              </div>
              <div className="text-[10px] text-emerald-200/80 mt-1">
                ผ่านแล้ว {summary.q4MetCount} / {summary.totalProvinces} จว. (ขาดอีก {summary.gapTo70.toLocaleString()} คน)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-view Navigation Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSubView('overview')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              subView === 'overview'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" /> ภาพรวมตัวชี้วัด (Executive KPI)
          </button>
          <button
            onClick={() => setSubView('regions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              subView === 'regions'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" /> เจาะลึก 13 เขต & 77 จังหวัด
          </button>
          <button
            onClick={() => setSubView('domains')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              subView === 'domains'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HeartPulse className="w-4 h-4" /> สถานการณ์การดูแล 9 ด้าน
          </button>
          <button
            onClick={() => setSubView('simulator')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              subView === 'simulator'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-4 h-4" /> A/B Simulator & Import Data
          </button>
          <button
            onClick={() => setSubView('guidelines')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              subView === 'guidelines'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> แนวทาง Flow 9 ด้าน & ผู้ประสานงาน
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportCSV(false)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="ร้อยละการได้รับการดูแล (A/B)"
          value={`${summary.coveragePct}%`}
          subtitle={`เป้าหมายสิ้นปี 2570: ร้อยละ 70`}
          badge={summary.coveragePct >= 70 ? 'บรรลุเป้าหมาย 70%' : summary.coveragePct >= 40 ? 'ผ่านเป้า 9 เดือน (40%)' : 'ผ่านเป้า 6 เดือน (20%)'}
          badgeColor={summary.coveragePct >= 70 ? 'emerald' : summary.coveragePct >= 40 ? 'blue' : 'amber'}
          icon={Target}
          variant="navy"
        />

        <KPICard
          title="ประชากรกลุ่มเสี่ยง (ตัวหาร B)"
          value={summary.totalTargetB.toLocaleString()}
          subtitle={`คิดเป็น ${Math.round((summary.totalTargetB / (summary.totalScreened || 1)) * 1000) / 10}% ของผู้คัดกรอง`}
          badge="ฐานข้อมูล HDC ปี 2569"
          badgeColor="slate"
          icon={Users}
          variant="white"
        />

        <KPICard
          title="ได้รับการดูแลตาม Flow (ตัวตั้ง A)"
          value={summary.totalCaredA.toLocaleString()}
          subtitle="บันทึกผ่านระบบ DMS Care Tools"
          badge={`ดูแลแล้ว ${summary.coveragePct}%`}
          badgeColor="emerald"
          icon={CheckCheck}
          variant="white"
        />

        <KPICard
          title="ส่วนต่างที่ต้องดูแลเพิ่ม (Gap to 70%)"
          value={summary.gapTo70.toLocaleString()}
          subtitle={`เพื่อให้แตะเป้า 70% (${summary.targetGoal70.toLocaleString()} คน)`}
          badge={summary.gapTo70 === 0 ? 'ครบตามเป้าแล้ว' : `ต้องการเพิ่มอีก ${Math.round((summary.gapTo70 / (summary.totalTargetB || 1)) * 1000) / 10}%`}
          badgeColor={summary.gapTo70 === 0 ? 'emerald' : 'rose'}
          icon={AlertTriangle}
          variant="white"
        />
      </div>

      {/* VIEW 1: EXECUTIVE KPI OVERVIEW */}
      {subView === 'overview' && (
        <div className="space-y-6">
          {/* Progress Tracker Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  เส้นทางความคืบหน้าสะสมสู่เป้าหมายกระทรวง (Quarterly Milestone Trajectory)
                </h3>
                <p className="text-xs text-slate-500">
                  เปรียบเทียบผลงานปัจจุบัน ({summary.coveragePct}%) กับเกณฑ์เป้าหมายสะสม 4 รอบการประเมิน
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                สูตรคำนวณ: (A × 100) / B
              </span>
            </div>

            {/* Custom Milestone Progress Bar */}
            <div className="relative pt-6 pb-4 px-2">
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200 relative">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-700 relative"
                  style={{ width: `${Math.min(100, (summary.coveragePct / 70) * 100)}%` }}
                />
              </div>

              {/* Threshold Markers */}
              <div className="relative w-full h-8 mt-2 text-xs">
                {/* 0% */}
                <div className="absolute left-0 -translate-x-1/2 text-center">
                  <div className="w-0.5 h-3 bg-slate-300 mx-auto -mt-4 mb-1" />
                  <span className="font-semibold text-slate-400">0%</span>
                </div>
                {/* 20% (Q2) */}
                <div className="absolute text-center" style={{ left: `${(20 / 70) * 100}%` }}>
                  <div className="w-0.5 h-3 bg-amber-400 mx-auto -mt-4 mb-1" />
                  <span className="font-semibold text-amber-600">20% (รอบ 6 เดือน)</span>
                  <div className="text-[10px] text-slate-400">31 มี.ค. 70</div>
                </div>
                {/* 40% (Q3) */}
                <div className="absolute text-center" style={{ left: `${(40 / 70) * 100}%` }}>
                  <div className="w-0.5 h-3 bg-indigo-400 mx-auto -mt-4 mb-1" />
                  <span className="font-semibold text-indigo-600">40% (รอบ 9 เดือน)</span>
                  <div className="text-[10px] text-slate-400">30 มิ.ย. 70</div>
                </div>
                {/* 70% (Q4) */}
                <div className="absolute right-0 translate-x-1/2 text-center">
                  <div className="w-0.5 h-3 bg-emerald-500 mx-auto -mt-4 mb-1" />
                  <span className="font-bold text-emerald-600">70% (เป้าหมาย 12 เดือน)</span>
                  <div className="text-[10px] text-slate-400">30 ก.ย. 70</div>
                </div>
              </div>
            </div>

            {/* Trajectory Insights Banner */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-900">สถานะปัจจุบันระดับประเทศ</div>
                  <div className="text-blue-700 mt-0.5">
                    ปัจจุบันผลงานอยู่ที่ <strong>{summary.coveragePct}%</strong> ซึ่งผ่านเกณฑ์รอบ 6 เดือน (20%) เรียบร้อยแล้ว อยู่ระหว่างเร่งรัดสู่เกณฑ์รอบ 9 เดือน (40%)
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-100 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-900">การขับเคลื่อนในหน่วยบริการ</div>
                  <div className="text-amber-800 mt-0.5">
                    ผู้สูงอายุ 1 คนนับเป็น 1 ราย แม้พบความเสี่ยงหลายด้าน หากได้รับการดูแลตาม Flow อย่างน้อย 1 ด้าน 1 ขั้นตอน จะนับเป็นตัวตั้ง A ทันที
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-emerald-900">การเชื่อมต่อ HDC & DMS Care Tools</div>
                  <div className="text-emerald-800 mt-0.5">
                    ระบบดึงฐานคัดกรองปี 2569 ผ่านกระบวนการ Data Cleansing (ตัดซ้ำ/ตัดตาย) พร้อมให้สถานพยาบาล รพศ./รพท./รพช./รพ.สต. ดึงไปให้บริการต่อ
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Regional Performance Comparison Chart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  เปรียบเทียบอัตราการดูแลผู้สูงอายุที่มีความเสี่ยง รายเขตสุขภาพ (13 เขต)
                </h3>
                <p className="text-xs text-slate-500">
                  แสดงร้อยละการดูแล (% A/B) เทียบกับเป้าหมายขั้นต่ำ 20% (เส้นประเหลือง) และเป้าหมาย 70% (เส้นประเขียว)
                </p>
              </div>
              <span className="text-xs text-slate-500">หน่วย: ร้อยละ (%)</span>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={zoneChartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: any, name: string) => [
                      typeof val === 'number' ? (name.includes('%') ? `${val}%` : val.toLocaleString()) : val,
                      name
                    ]}
                  />
                  <Legend />
                  <ReferenceLine y={20} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'เป้า 6 เดือน (20%)', fill: '#d97706', fontSize: 10, position: 'top' }} />
                  <ReferenceLine y={40} stroke="#6366f1" strokeDasharray="3 3" label={{ value: 'เป้า 9 เดือน (40%)', fill: '#4f46e5', fontSize: 10, position: 'top' }} />
                  <ReferenceLine y={70} stroke="#10b981" strokeDasharray="4 4" strokeWidth={2} label={{ value: 'เป้ากระทรวง 70%', fill: '#059669', fontSize: 11, position: 'top' }} />
                  <Bar dataKey="ร้อยละการดูแล (%)" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                    {zoneChartData.map((entry, index) => {
                      const color = entry['ร้อยละการดูแล (%)'] >= 70
                        ? '#10b981'
                        : entry['ร้อยละการดูแล (%)'] >= 40
                        ? '#3b82f6'
                        : entry['ร้อยละการดูแล (%)'] >= 20
                        ? '#f59e0b'
                        : '#ef4444';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Leaderboard Cards: Top & Bottom Performers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top 5 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    🏆
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">5 จังหวัดที่มีอัตราการดูแลสูงสุด (Top 5)</h4>
                    <p className="text-[11px] text-slate-500">จังหวัดที่ขับเคลื่อนตาม Flow of Management ได้ก้าวหน้าที่สุด</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  ความก้าวหน้าสูง
                </span>
              </div>

              <div className="space-y-3">
                {leaderboard.top5.map((p, idx) => (
                  <div
                    key={p.province}
                    onClick={() => setSelectedProvDetail(p)}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-200 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-slate-300 text-slate-700' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{p.province}</div>
                        <div className="text-[11px] text-slate-500">{p.zone} • กลุ่มเสี่ยง B: {p.target_population_b.toLocaleString()} คน</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-extrabold text-emerald-600">{p.coverage_pct}%</div>
                      <div className="text-[10px] text-slate-400">ดูแลแล้ว {p.cared_population_a.toLocaleString()} ราย</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom 5 / Gap to Target */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
                    ⚠️
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">5 จังหวัดที่ต้องเร่งรัดการดูแล (Needs Acceleration)</h4>
                    <p className="text-[11px] text-slate-500">จังหวัดที่มีสัดส่วนผู้สูงอายุเสี่ยงค้างในระบบและต้องเร่งดูแล</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                  เฝ้าระวังพิเศษ
                </span>
              </div>

              <div className="space-y-3">
                {leaderboard.bottom5.map((p, idx) => (
                  <div
                    key={p.province}
                    onClick={() => setSelectedProvDetail(p)}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-rose-50/60 border border-slate-100 hover:border-rose-200 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{p.province}</div>
                        <div className="text-[11px] text-slate-500">{p.zone} • กลุ่มเสี่ยง B: {p.target_population_b.toLocaleString()} คน</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-extrabold text-rose-600">{p.coverage_pct}%</div>
                      <div className="text-[10px] text-rose-500 font-medium">ขาดอีก {p.gap_to_70pct.toLocaleString()} คนสู่ 70%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: GEOGRAPHIC & DRILL-DOWN TABLE */}
      {subView === 'regions' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  ตารางติดตามผลการดำเนินงานรายจังหวัด 77 จังหวัด
                </h3>
                <p className="text-xs text-slate-500">
                  คลิกที่แถวของจังหวัดเพื่อดูรายละเอียดเจาะลึก 9 ด้าน และขั้นตอนที่ต้องดำเนินการต่อ
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อจังหวัด..."
                    value={searchProvince}
                    onChange={(e) => setSearchProvince(e.target.value)}
                    className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-64"
                  />
                </div>
              </div>
            </div>

            {/* Provinces Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">จังหวัด</th>
                    <th className="py-3 px-4">เขตสุขภาพ</th>
                    <th className="py-3 px-4 text-right">ผู้สูงอายุปี 69</th>
                    <th className="py-3 px-4 text-right">กลุ่มเสี่ยง (B)</th>
                    <th className="py-3 px-4 text-right">ได้รับการดูแล (A)</th>
                    <th className="py-3 px-4 text-right">ร้อยละการดูแล (%)</th>
                    <th className="py-3 px-4 text-center">สถานะเป้าหมาย</th>
                    <th className="py-3 px-4 text-right">ต้องดูแลเพิ่มสู่ 70% (คน)</th>
                    <th className="py-3 px-4 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProvinces.map((p) => {
                    const is70 = p.coverage_pct >= 70;
                    const is40 = p.coverage_pct >= 40;
                    const is20 = p.coverage_pct >= 20;

                    return (
                      <tr
                        key={p.province}
                        onClick={() => setSelectedProvDetail(p)}
                        className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                          {p.province}
                          {is70 && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">บรรลุ 70%</span>}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{p.zone}</td>
                        <td className="py-3 px-4 text-right text-slate-600">{p.elderly_total_69.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-800">{p.target_population_b.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-semibold text-emerald-600">{p.cared_population_a.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-block font-extrabold text-xs px-2 py-0.5 rounded-full ${
                            is70 ? 'bg-emerald-100 text-emerald-800' : is40 ? 'bg-blue-100 text-blue-800' : is20 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {p.coverage_pct}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {is70 ? (
                            <span className="text-emerald-600 font-semibold flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> ผ่านเกณฑ์ปี 70
                            </span>
                          ) : is40 ? (
                            <span className="text-blue-600 font-semibold flex items-center justify-center gap-1">
                              <CheckCheck className="w-3.5 h-3.5" /> ผ่านรอบ 9 เดือน
                            </span>
                          ) : is20 ? (
                            <span className="text-amber-600 font-semibold flex items-center justify-center gap-1">
                              <CheckCheck className="w-3.5 h-3.5" /> ผ่านรอบ 6 เดือน
                            </span>
                          ) : (
                            <span className="text-rose-600 font-semibold flex items-center justify-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> ต้องเร่งรัด (&lt;20%)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-slate-700">
                          {p.gap_to_70pct > 0 ? p.gap_to_70pct.toLocaleString() : '0 (บรรลุแล้ว)'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProvDetail(p);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-[11px] underline"
                          >
                            ดูรายละเอียด
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: 9 DOMAINS ANALYSIS & FLOW COVERAGE */}
      {subView === 'domains' && (
        <div className="space-y-6">
          {/* Domains Overview Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-rose-500" />
                  อัตราการได้รับการดูแลจำแนกตามปัญหาสุขภาพ 9 ด้าน (Flow of Management 9 Domains)
                </h3>
                <p className="text-xs text-slate-500">
                  เปรียบเทียบสถิติ Baseline ทั้งประเทศ (เอกสารหน้า 6) กับอัตราการเข้าถึงการดูแลปัจจุบันในพื้นที่ที่เลือก
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                เกณฑ์เป้าหมายภาพรวม: ร้อยละ 70
              </span>
            </div>

            {/* Bar Chart comparing Baseline vs Current */}
            <div className="h-80 w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainComparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: any, name: string) => [`${val}%`, name]}
                  />
                  <Legend />
                  <ReferenceLine y={70} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'เป้าหมาย 70%', fill: '#059669', fontSize: 11, position: 'top' }} />
                  <Bar dataKey="Baseline ประเทศ (%)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="อัตราการดูแลปัจจุบัน (%)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 9 Domains Interactive Cards */}
            <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" /> รายละเอียด Flow การดูแลและสถิติรายด้านทั้ง 9 ด้าน
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DOMAIN_BASELINES.map(dom => {
                const isSelected = selectedDomainId === dom.id;
                const dData = domainComparisonData.find(d => d.id === dom.id);

                return (
                  <div
                    key={dom.id}
                    onClick={() => setSelectedDomainId(dom.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-slate-50/70 hover:bg-white border-slate-200/80 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase">{dom.category}</span>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                        Baseline {dom.baseline_national_pct}%
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 text-sm mb-1">{dom.name}</div>
                    <div className="text-xs text-slate-600 mb-3 line-clamp-2">{dom.service_desc}</div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                      <span className="text-slate-500">อัตราดูแลปัจจุบัน:</span>
                      <span className="font-extrabold text-blue-700">{dData ? dData['อัตราการดูแลปัจจุบัน (%)'] : 0}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Selected Domain Flow */}
            {selectedDomainId && (() => {
              const dom = DOMAIN_BASELINES.find(d => d.id === selectedDomainId);
              if (!dom) return null;

              return (
                <div className="mt-6 p-6 rounded-3xl bg-slate-900 text-white border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        {dom.category} • ลำดับขั้นตอนการดูแล
                      </span>
                      <h4 className="text-lg font-bold text-white mt-0.5">{dom.name}</h4>
                    </div>
                    <div className="text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                      <strong>เกณฑ์นับตัวตั้ง A:</strong> ได้รับการดูแลตาม Flow อย่างน้อย 1 ขั้นตอน
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
                    {dom.flow_steps.map((step, idx) => (
                      <div key={idx} className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 relative">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-2">
                          {idx + 1}
                        </div>
                        <div className="text-xs font-semibold text-slate-200">{step}</div>
                        {idx < dom.flow_steps.length - 1 && (
                          <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10">
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                    <div><strong>บริการที่ได้รับ:</strong> {dom.service_desc}</div>
                    <div><strong>ฐานการคัดกรอง:</strong> {dom.screening_base_desc}</div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* VIEW 4: A/B SIMULATOR & DATA IMPORT */}
      {subView === 'simulator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Simulator Controls */}
            <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                  What-If Scenario Simulator
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  ปรับสัดส่วนการให้บริการหรือเร่งรัดเพื่อดูการบรรลุเป้าหมาย 70%
                </p>
              </div>

              {/* Slider: Overall Care Acceleration Boost */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>เร่งรัดอัตราการดูแลรวม (% Boost)</span>
                  <span className="text-indigo-600 font-extrabold">{simCoverageBoost >= 0 ? `+${simCoverageBoost}%` : `${simCoverageBoost}%`}</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="60"
                  step="1"
                  value={simCoverageBoost}
                  onChange={(e) => setSimCoverageBoost(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>-20%</span>
                  <span>ฐานเดิม (0%)</span>
                  <span>+60%</span>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => setSimCoverageBoost(0)}
                className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> รีเซ็ตค่าจำลอง
              </button>

              {/* CSV Upload Box */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-blue-600" /> นำเข้าข้อมูลจริง (Upload CSV)
                </h4>
                <p className="text-[11px] text-slate-500 mb-3">
                  อัปโหลดไฟล์สรุปข้อมูล HDC หรือ DMS Care Tools เพื่ออัปเดตตัวเลขในหน้านี้ทันที
                </p>
                <label className="block w-full border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/30">
                  <FileSpreadsheet className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-blue-600">คลิกเลือกไฟล์ CSV</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">รองรับไฟล์ .csv (UTF-8)</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">ต้องการไฟล์ตัวอย่าง?</span>
                  <button
                    onClick={() => handleExportCSV(true)}
                    className="text-blue-600 hover:text-blue-800 font-semibold underline flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> โหลดเทมเพลต CSV
                  </button>
                </div>
              </div>
            </div>

            {/* Simulation Results Display */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> ผลลัพธ์จากการจำลองฉากทัศน์ (Simulation Outcome)
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    simulatedSummary.achieves70 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-900'
                  }`}>
                    {simulatedSummary.achieves70 ? '✅ บรรลุเป้าหมาย 70%' : '⚠️ ยังไม่บรรลุเป้าหมาย 70%'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <div className="text-xs text-slate-400">อัตราการดูแลจำลอง</div>
                    <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                      {simulatedSummary.boostedCoverage}%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      เดิม: {summary.coveragePct}% ({simCoverageBoost >= 0 ? `+${simCoverageBoost}%` : `${simCoverageBoost}%`})
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <div className="text-xs text-slate-400">ผู้ได้รับการดูแลจำลอง (A)</div>
                    <div className="text-2xl font-bold text-white mt-1">
                      {simulatedSummary.simulatedCaredA.toLocaleString()} คน
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      เพิ่มขึ้น {(simulatedSummary.simulatedCaredA - summary.totalCaredA).toLocaleString()} คน
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <div className="text-xs text-slate-400">ส่วนต่างที่ยังขาดสู่ 70%</div>
                    <div className={`text-2xl font-bold mt-1 ${simulatedSummary.simulatedGap70 === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {simulatedSummary.simulatedGap70.toLocaleString()} คน
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {simulatedSummary.simulatedGap70 === 0 ? 'บรรลุเกินเกณฑ์แล้ว' : 'ยังต้องดูแลเพิ่ม'}
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80 text-xs text-slate-300 space-y-2">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-blue-400" /> คำแนะนำเชิงนโยบายเพื่อบรรลุเป้าหมายกระทรวง:
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li>
                      <strong>มุ่งเน้นด้านที่มีฐานเสี่ยงสูงแต่ดูแลต่ำ:</strong> เช่น ด้านหกล้ม (Baseline ปัจจุบันเพียง 0.91%) และการมองเห็น (6.26%) หากเปิด Fast-track คัดกรอง Sarcopenia และตรวจตาใน รพ. จะเพิ่มตัวตั้ง A ได้รวดเร็ว
                    </li>
                    <li>
                      <strong>กระจายสิทธิ์ User DMS Care Tools:</strong> ให้ รพ.สต. และหน่วยบริการปฐมภูมิมี User เพื่อบันทึกข้อมูลได้แบบ Real-time โดยไม่ต้องรอส่งข้อมูลต่อมายังอำเภอ
                    </li>
                    <li>
                      <strong>บูรณาการ 43 แฟ้มเข้าสู่ HDC:</strong> ตรวจสอบว่าระบบ HIS ของโรงพยาบาลได้แมปฟิลด์การส่งต่อเพื่อดูแลสุขภาพผู้สูงอายุเข้าสู่ HDC สมบูรณ์ตามโครงสร้างมาตรฐาน
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: GUIDELINES, OFFICIAL MANUALS & CONTACTS */}
      {subView === 'guidelines' && (
        <div className="space-y-6">
          {/* Documents Grid */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              เอกสารสนับสนุนและช่องทางดาวน์โหลดทางการ (Official Documentation)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUPPORTING_DOCUMENTS.map((doc, idx) => (
                <a
                  key={idx}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded-full">
                        {doc.category}
                      </span>
                      <span className="text-xs font-medium text-slate-400 group-hover:text-blue-600 flex items-center gap-1">
                        เปิดเอกสาร <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 leading-snug">
                      {doc.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{doc.badge}</span>
                    <span className="text-blue-600 font-semibold group-hover:underline">คลิกดาวน์โหลด</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Official Contacts */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  ผู้ให้ข้อมูลทางวิชาการและผู้ประสานงานตัวชี้วัด (กรมการแพทย์)
                </h3>
                <p className="text-xs text-slate-500">
                  สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์ กระทรวงสาธารณสุข
                </p>
              </div>
              <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                โทรศัพท์กลาง: 0 2024 8481
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {OFFICIAL_CONTACTS.map((c, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{c.name}</div>
                    <div className="text-xs text-indigo-700 font-medium mt-0.5">{c.role}</div>
                    <div className="text-[11px] text-slate-500 mt-1">{c.division}</div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{c.mobile || c.phone}</span>
                    </div>
                    {c.email && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{c.email}</span>
                      </div>
                    )}
                    {c.lineId && (
                      <div className="text-[11px] text-emerald-600 font-medium">
                        Line ID: {c.lineId}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected Province Drill-Down Modal / Drawer */}
      {selectedProvDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{selectedProvDetail.zone}</span>
                <h3 className="text-xl font-extrabold text-slate-900">จังหวัด{selectedProvDetail.province}</h3>
              </div>
              <button
                onClick={() => setSelectedProvDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <div className="text-[11px] text-slate-500">กลุ่มเสี่ยงปี 69 (B)</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">{selectedProvDetail.target_population_b.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                <div className="text-[11px] text-blue-700">ดูแลแล้วปี 70 (A)</div>
                <div className="text-lg font-bold text-blue-700 mt-0.5">{selectedProvDetail.cared_population_a.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                <div className="text-[11px] text-emerald-700">ร้อยละการดูแล (%)</div>
                <div className="text-lg font-bold text-emerald-700 mt-0.5">{selectedProvDetail.coverage_pct}%</div>
              </div>
            </div>

            {/* Gap and Targets */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-2">
              <div className="font-bold text-slate-800 flex items-center justify-between">
                <span>เกณฑ์เป้าหมาย 70% สิ้นปีงบ 2570:</span>
                <span className="text-emerald-700 font-extrabold">{Math.round(selectedProvDetail.target_population_b * 0.7).toLocaleString()} คน</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>จำนวนที่ต้องดูแลเพิ่มเพื่อให้ผ่าน 70%:</span>
                <span className={`font-bold ${selectedProvDetail.gap_to_70pct === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {selectedProvDetail.gap_to_70pct === 0 ? 'บรรลุเป้าหมายแล้ว' : `ต้องการเพิ่มอีก ${selectedProvDetail.gap_to_70pct.toLocaleString()} คน`}
                </span>
              </div>
            </div>

            {/* 9 Domains in this province */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">ผลการดำเนินงานรายด้าน 9 ด้าน</h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {DOMAIN_BASELINES.map(d => {
                  const dItem = selectedProvDetail.domain_risks[d.id];
                  if (!dItem) return null;

                  return (
                    <div key={d.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-900">{d.name}</div>
                        <div className="text-[10px] text-slate-500">เสี่ยง {dItem.risk.toLocaleString()} คน • ดูแล {dItem.cared.toLocaleString()} คน</div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-indigo-600 text-sm">{dItem.pct}%</span>
                        <div className="text-[9px] text-slate-400">Baseline {d.baseline_national_pct}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedProvDetail(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
