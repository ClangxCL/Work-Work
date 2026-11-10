import React, { useState, useMemo } from 'react';
import { ChronicTop10, PatientCauseItem, DeathCauseItem, DeathGenderItem } from '../../types';
import { KPICard } from '../KPICard';
import { TabSourceReference } from '../TabSourceReference';
import {
  Activity, Skull, Stethoscope, ShieldAlert, HeartPulse,
  Brain, Bone, Wind, Eye, Sparkles, HeartHandshake, Droplets,
  Users, Info
} from 'lucide-react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { CHART_PALETTE, rechartsTooltipStyle } from '../../theme/chartTheme';

interface Tab4MorbidityProps {
  chronicTop10: ChronicTop10[];
  opdByYear: Record<string, PatientCauseItem[]>;
  ipdByYear: Record<string, PatientCauseItem[]>;
  deathCauses: DeathCauseItem[];
  deathGender: DeathGenderItem[];
  selectedYear: string;
  forceSection?: 'illness' | 'mortality';
}

export const Tab4Morbidity: React.FC<Tab4MorbidityProps> = ({
  chronicTop10,
  opdByYear,
  ipdByYear,
  deathCauses,
  deathGender,
  selectedYear,
  forceSection
}) => {
  const [internalSection, setInternalSection] = useState<'all' | 'illness' | 'mortality'>('all');
  const activeSection = forceSection || internalSection;

  // OPD & IPD Data for selected year
  const currentOpd = useMemo(() => {
    return opdByYear[selectedYear] || opdByYear['2569'] || [];
  }, [opdByYear, selectedYear]);

  const currentIpd = useMemo(() => {
    return ipdByYear[selectedYear] || ipdByYear['2569'] || [];
  }, [ipdByYear, selectedYear]);

  // Mortality Chart Data sorted descending
  const mortalityChartData = useMemo(() => {
    const yearKey = `y${selectedYear}` as keyof DeathCauseItem;
    return deathCauses
      .map(d => ({
        name: d.cause,
        icd: d.icd,
        deaths: (d[yearKey] as number) || d.y2569,
        ratio: d.ratio_pct
      }))
      .sort((a, b) => b.deaths - a.deaths);
  }, [deathCauses, selectedYear]);

  // Icon mapping for 10 chronic diseases
  const getChronicIcon = (rank: number) => {
    switch (rank) {
      case 1: return HeartPulse;       // ความดันโลหิตสูง
      case 2: return Activity;         // เบาหวาน
      case 3: return Droplets;         // ไขมันในเลือดสูง
      case 4: return Bone;             // ข้อเข่าเสื่อม
      case 5: return ShieldAlert;      // ไตวายเรื้อรัง
      case 6: return Wind;             // ปอดอุดกั้นเรื้อรัง (COPD)
      case 7: return Brain;            // หลอดเลือดสมอง (Stroke)
      case 8: return Sparkles;         // สมองเสื่อม (Dementia)
      case 9: return Eye;              // ต้อกระจก
      case 10: return HeartHandshake;  // ซึมเศร้า
      default: return Activity;
    }
  };

  // OPD vs IPD Top 5 comparative chart data
  const comparativeChartData = useMemo(() => {
    const top5Opd = currentOpd.slice(0, 5).map(item => ({
      name: item.disease_th.length > 18 ? item.disease_th.substring(0, 18) + '...' : item.disease_th,
      fullName: item.disease_th,
      icd: item.icd,
      type: 'ผู้ป่วยนอก (OPD)',
      count: item.total,
      pct: item.pct,
    }));

    const top5Ipd = currentIpd.slice(0, 5).map(item => ({
      name: item.disease_th.length > 18 ? item.disease_th.substring(0, 18) + '...' : item.disease_th,
      fullName: item.disease_th,
      icd: item.icd,
      type: 'ผู้ป่วยใน (IPD)',
      count: item.total,
      pct: item.pct,
    }));

    return { top5Opd, top5Ipd };
  }, [currentOpd, currentIpd]);

  return (
    <div className="space-y-12 text-[#17191c]">
      {/* Editorial Section Header */}
      <div className="space-y-2 mb-6">
        <span className="text-xs text-[#6b6f7a] uppercase block font-medium">
          Morbidity & Mortality Statistics · สถิติสุขภาพระดับชาติ · ปีงบประมาณ {selectedYear}
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-normal text-[#17191c] leading-[1.4] mb-2">
          สถิติสาเหตุการป่วยและสาเหตุการตาย
        </h2>
        <p className="text-base text-[#5f6370] w-full leading-[1.6] mb-6">
          วิเคราะห์ภาพรวมการรับบริการสุขภาพ (OPD/IPD 10 อันดับแรก), กลุ่ม 10 โรคเรื้อรังสำคัญ และสถิติสาเหตุการเสียชีวิต (Mortality Causes) ตามรหัสสากล ICD-10
        </p>
      </div>

      {/* Top Level KPIs: auto-fit full row width */}
      <div className="kpi-grid">
        {activeSection === 'illness' ? (
          <>
            <KPICard
              title="บริการผู้ป่วยนอก (OPD)"
              value=">38 ล้านครั้ง"
              subtitle="ตรวจรักษาในสถานพยาบาล สธ."
              badge="OPD Visits"
              icon={Stethoscope}
              variant="peach" // Accent card
            />
            <KPICard
              title="สาเหตุครอง รพ. IPD: ปอดบวม"
              value="437,946 ครั้ง"
              subtitle="อันดับ 1 การนอนโรงพยาบาล"
              badge="ติดเชื้อทางเดินหายใจ"
              icon={Activity}
              variant="neutral"
            />
            <KPICard
              title="ความดันโลหิตสูง (HT)"
              value="48.5%"
              subtitle="โรคเรื้อรังอันดับ 1 ในผู้สูงอายุ"
              badge="ความดันสูง"
              icon={HeartPulse}
              variant="neutral"
            />
            <KPICard
              title="เบาหวาน (DM)"
              value="22.8%"
              subtitle="โรคเรื้อรังอันดับ 2"
              badge="เบาหวาน"
              icon={Activity}
              variant="neutral"
            />
            <KPICard
              title="ไขมันในเลือดสูง (DLP)"
              value="34.2%"
              subtitle="เสี่ยงหลอดเลือดหัวใจและสมอง"
              badge="ไขมันเลือดสูง"
              icon={Droplets}
              variant="neutral"
            />
          </>
        ) : activeSection === 'mortality' ? (
          <>
            <KPICard
              title="สาเหตุการตายอันดับ 1: มะเร็ง"
              value="68,500 ราย/ปี"
              subtitle="14.7% ของการเสียชีวิตรวม"
              badge="อันดับ 1 มรณกรรม"
              icon={Skull}
              variant="peach" // Accent card
            />
            <KPICard
              title="สาเหตุการตายอันดับ 2: สโตรก"
              value="52,100 ราย/ปี"
              subtitle="หลอดเลือดสมอง 11.2%"
              badge="Stroke"
              icon={HeartPulse}
              variant="neutral"
            />
            <KPICard
              title="โรคหัวใจขาดเลือด"
              value="36,400 ราย/ปี"
              subtitle="7.8% ของการเสียชีวิตรวม"
              badge="IHD"
              icon={Activity}
              variant="neutral"
            />
            <KPICard
              title="ปอดอักเสบ/ปอดบวม"
              value="31,200 ราย/ปี"
              subtitle="6.7% ของการเสียชีวิตรวม"
              badge="Pneumonia"
              icon={Wind}
              variant="neutral"
            />
            <KPICard
              title="ความต่างตามเพศ"
              value="ชาย 58% : หญิง 42%"
              subtitle="เพศชายเสียชีวิตจากมะเร็งและอุบัติเหตุสูงกว่า"
              badge="Gender Ratio"
              icon={ShieldAlert}
              variant="neutral"
            />
          </>
        ) : (
          <>
            <KPICard
              title="บริการผู้ป่วยนอก (OPD)"
              value=">38 ล้านครั้ง"
              subtitle="ตรวจรักษาในสถานพยาบาล สธ."
              badge="OPD Visits"
              icon={Stethoscope}
              variant="peach" // 1 Accent card
            />
            <KPICard
              title="สาเหตุนอน รพ. (IPD): ปอดบวม"
              value="437,946 ครั้ง"
              subtitle="อันดับ 1 ครองเตียง รพ."
              badge="Admissions"
              icon={Activity}
              variant="neutral"
            />
            <KPICard
              title="โรคเรื้อรังอันดับ 1: ความดันสูง"
              value="48.5%"
              subtitle="พบในผู้สูงอายุเกือบครึ่งหนึ่ง"
              badge="Prevalence"
              icon={HeartPulse}
              variant="neutral"
            />
            <KPICard
              title="สาเหตุการตายอันดับ 1: มะเร็ง"
              value="68,500 ราย/ปี"
              subtitle="14.7% ของมรณกรรมรวม"
              badge="Mortality #1"
              icon={Skull}
              variant="neutral"
            />
            <KPICard
              title="สัดส่วนการตายแยกเพศ"
              value="ชาย 58% : หญิง 42%"
              subtitle="เพศชายมีความเสี่ยงสูงกว่า"
              badge="Gender Ratio"
              icon={ShieldAlert}
              variant="neutral"
            />
          </>
        )}
      </div>

      {/* Sub-view Switcher if not forced */}
      {!forceSection && (
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setInternalSection('all')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] ${
              activeSection === 'all'
                ? 'bg-[#17191c] text-white shadow-none'
                : 'bg-transparent border border-[#ececec] text-[#17191c] hover:bg-[#fafafb]'
            }`}
          >
            ภาพรวมทั้งหมด (ทั้งการป่วยและตาย)
          </button>
          <button
            onClick={() => setInternalSection('illness')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] ${
              activeSection === 'illness'
                ? 'bg-[#17191c] text-white shadow-none'
                : 'bg-transparent border border-[#ececec] text-[#17191c] hover:bg-[#fafafb]'
            }`}
          >
            สถิติการเจ็บป่วย (OPD / IPD 10 อันดับแรก)
          </button>
          <button
            onClick={() => setInternalSection('mortality')}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all min-h-[44px] ${
              activeSection === 'mortality'
                ? 'bg-[#17191c] text-white shadow-none'
                : 'bg-transparent border border-[#ececec] text-[#17191c] hover:bg-[#fafafb]'
            }`}
          >
            สถิติสาเหตุการเสียชีวิต (Mortality Causes)
          </button>
        </div>
      )}

      {/* Section 1: Top 10 Illnesses (OPD & IPD) */}
      {(activeSection === 'all' || activeSection === 'illness') && (
        <div className="space-y-8">
          {/* Top 10 Chronic Diseases Card Grid with Icons */}
          <div className="bg-[#f2f2f3] p-6 rounded-[24px] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-[#17191c] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#17191c]" />
                  10 อันดับโรคและปัญหาสุขภาพสำคัญเฉพาะผู้สูงอายุ 60 ปีขึ้นไป
                </h3>
                <p className="text-sm text-[#5f6370]">
                  สรุปอัตราความชุก (%) ลักษณะอาการและความสำคัญทางการแพทย์ (ข้อมูล มส.ผส. และ สธ.)
                </p>
              </div>
              <span className="text-xs px-3.5 py-1.5 rounded-full bg-white text-[#5f6370] border border-[#ececec] hidden sm:inline font-medium">
                ICD-10 Clinical Profile
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {chronicTop10.map(c => {
                const Icon = getChronicIcon(c.rank);

                return (
                  <div
                    key={c.rank}
                    className="p-4 rounded-2xl bg-white border border-[#ececec] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium bg-[#f2f2f3] text-[#17191c] tabular-nums">
                          {c.rank}
                        </span>
                        <span className="text-xs font-mono text-[#5f6370] bg-[#f2f2f3] px-2.5 py-0.5 rounded-full font-medium">
                          {c.icd}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-7 h-7 rounded-full bg-[#f2f2f3] flex items-center justify-center text-[#17191c] shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="font-medium text-[#17191c] text-base leading-snug break-words">
                          {c.disease}
                        </h4>
                      </div>

                      <div className="text-sm mb-1.5 flex items-center gap-1.5">
                        <span className="text-[#5f6370]">ความชุก:</span>
                        <span className="font-medium text-[#5d2a1a] text-base tabular-nums leading-[1.35]">{c.prevalence}</span>
                      </div>

                      <p className="text-sm text-[#5f6370] leading-[1.6]">
                        {c.clinical_significance}
                      </p>
                    </div>

                    <div className="mt-3.5 pt-2.5 border-t border-[#ececec] flex items-center justify-between text-xs text-[#6b6f7a]">
                      <span>กลุ่มผู้สูงอายุไทย</span>
                      <span className="text-[#17191c] tabular-nums font-medium">อันดับ {c.rank}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comparative Bar Chart Visualization for Top OPD vs IPD in #5d2a1a */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Left: OPD Chart */}
            <div className="bg-[#f2f2f3] p-6 rounded-[24px] space-y-4 min-w-0 w-full">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-[#17191c] text-base flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-[#17191c]" />
                    5 อันดับบริการผู้ป่วยนอก (OPD) สูงสุด ปี {selectedYear}
                  </h4>
                  <p className="text-xs text-[#5f6370] mt-1">จำนวนครั้งที่มารับบริการในสถานพยาบาล สธ. (Visits)</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-white text-[#5f6370] border border-[#ececec]">OPD Top 5</span>
              </div>

              <div className="h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparativeChartData.top5Opd} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ececec" />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 14, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 14, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} width={160} />
                    <Tooltip
                      contentStyle={rechartsTooltipStyle}
                      formatter={(val: any, _name: any, item: any) => [
                        `${Number(val).toLocaleString()} ครั้ง (${item.payload.pct}%)`,
                        item.payload.fullName
                      ]}
                    />
                    <Bar dataKey="count" fill="#5d2a1a" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: IPD Chart */}
            <div className="bg-[#f2f2f3] p-6 rounded-[24px] space-y-4 min-w-0 w-full">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-[#17191c] text-base flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#17191c]" />
                    5 อันดับสาเหตุนอนโรงพยาบาล (IPD) สูงสุด ปี {selectedYear}
                  </h4>
                  <p className="text-xs text-[#5f6370] mt-1">จำนวนครั้งการนอนโรงพยาบาลในสถานพยาบาล สธ. (Admissions)</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-white text-[#5f6370] border border-[#ececec]">IPD Top 5</span>
              </div>

              <div className="h-72 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparativeChartData.top5Ipd} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ececec" />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 14, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 14, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} width={160} />
                    <Tooltip
                      contentStyle={rechartsTooltipStyle}
                      formatter={(val: any, _name: any, item: any) => [
                        `${Number(val).toLocaleString()} ครั้ง (${item.payload.pct}%)`,
                        item.payload.fullName
                      ]}
                    />
                    <Bar dataKey="count" fill="#5d2a1a" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* OPD vs IPD Full 10 Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Left: OPD Top 10 Table */}
            <div className="bg-white rounded-[24px] border border-[#ececec] overflow-hidden min-w-0 w-full shadow-sm">
              <div className="p-5 bg-[#fafafb] border-b border-[#ececec] flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-[#17191c] text-base">
                    สาเหตุการป่วยผู้ป่วยนอก (OPD) 10 อันดับแรก ปี {selectedYear}
                  </h4>
                  <p className="text-xs text-[#5f6370] mt-0.5">จำแนกตามจำนวนครั้งที่มารับบริการ (HDC)</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-white text-[#5f6370] border border-[#ececec]">10 อันดับ</span>
              </div>
              <div className="overflow-x-auto max-h-[560px]">
                <table className="w-full text-left text-base text-[#17191c]">
                  <thead className="bg-[#fafafb] text-[#5f6370] font-medium text-sm border-b border-[#ececec] sticky top-0 z-10">
                    <tr>
                      <th className="py-3.5 px-4 text-center w-16">อันดับ</th>
                      <th className="py-3.5 px-4">กลุ่มโรค (ICD-10)</th>
                      <th className="py-3.5 px-4 text-right">จำนวนรวม (ครั้ง)</th>
                      <th className="py-3.5 px-4 text-right">สัดส่วน (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ececec]">
                    {currentOpd.map(item => (
                      <tr key={`opd-${item.rank}`} className="hover:bg-[#fafafb] transition-colors h-[54px]">
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium bg-[#f2f2f3] text-[#17191c] tabular-nums">
                            {item.rank}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-[#17191c]">{item.disease_th}</div>
                          <div className="text-xs font-mono text-[#5f6370] mt-0.5">{item.icd} • {item.disease_en}</div>
                        </td>
                        <td className="py-3.5 px-4 text-right tabular-nums text-[#17191c]">
                          {item.total.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-[#5d2a1a] tabular-nums">{item.pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: IPD Top 10 Table */}
            <div className="bg-white rounded-[24px] border border-[#ececec] overflow-hidden min-w-0 w-full shadow-sm">
              <div className="p-5 bg-[#fafafb] border-b border-[#ececec] flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-[#17191c] text-base">
                    สาเหตุการป่วยผู้ป่วยใน (IPD) 10 อันดับแรก ปี {selectedYear}
                  </h4>
                  <p className="text-xs text-[#5f6370] mt-0.5">จำแนกตามจำนวนครั้งที่นอนโรงพยาบาล (HDC)</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-white text-[#5f6370] border border-[#ececec]">10 อันดับ</span>
              </div>
              <div className="overflow-x-auto max-h-[560px]">
                <table className="w-full text-left text-base text-[#17191c]">
                  <thead className="bg-[#fafafb] text-[#5f6370] font-medium text-sm border-b border-[#ececec] sticky top-0 z-10">
                    <tr>
                      <th className="py-3.5 px-4 text-center w-16">อันดับ</th>
                      <th className="py-3.5 px-4">กลุ่มโรค (ICD-10)</th>
                      <th className="py-3.5 px-4 text-right">จำนวนรวม (ครั้ง)</th>
                      <th className="py-3.5 px-4 text-right">สัดส่วน (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ececec]">
                    {currentIpd.map(item => (
                      <tr key={`ipd-${item.rank}`} className="hover:bg-[#fafafb] transition-colors h-[54px]">
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium bg-[#f2f2f3] text-[#17191c] tabular-nums">
                            {item.rank}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-[#17191c]">{item.disease_th}</div>
                          <div className="text-xs font-mono text-[#5f6370] mt-0.5">{item.icd} • {item.disease_en}</div>
                        </td>
                        <td className="py-3.5 px-4 text-right tabular-nums text-[#17191c]">
                          {item.total.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-[#5d2a1a] tabular-nums">{item.pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: 10 Mortality Causes */}
      {(activeSection === 'all' || activeSection === 'mortality') && (
        <div className="space-y-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
            {/* Left: Mortality Bar Chart in #5d2a1a (7 cols) */}
            <div className="lg:col-span-7 bg-[#f2f2f3] p-6 rounded-[24px] space-y-4 min-w-0 w-full">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-[#17191c] flex items-center gap-2">
                    <Skull className="w-5 h-5 text-[#17191c]" />
                    10 อันดับสาเหตุการเสียชีวิตของประชากรสูงอายุไทย (ปี {selectedYear})
                  </h3>
                  <p className="text-sm text-[#5f6370] mt-1">จำนวนผู้เสียชีวิต (คน/ปี) และสัดส่วนต่อการตายรวม อ้างอิงใบมรณบัตร</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-white text-[#5f6370] border border-[#ececec]">
                  สถิติมรณกรรม
                </span>
              </div>

              <div className="h-96 w-full min-w-0">
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={mortalityChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ececec" />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 14, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 14, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} width={180} />
                    <Tooltip
                      contentStyle={rechartsTooltipStyle}
                      formatter={(val: any, _name: any, item: any) => [
                        `${Number(val).toLocaleString()} ราย (${item.payload.ratio}% ของการตายรวม)`,
                        'จำนวนผู้เสียชีวิต'
                      ]}
                    />
                    <Bar dataKey="deaths" fill="#5d2a1a" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#ececec] text-sm text-[#5f6370] flex items-start gap-2.5">
                <Info className="w-5 h-5 text-[#17191c] shrink-0 mt-0.5" />
                <span>
                  โรคมะเร็งทุกชนิดและโรคหลอดเลือดสมองเป็น 2 สาเหตุหลัก คิดเป็นมากกว่า <strong className="text-[#17191c] font-medium">1 ใน 4 (25.9%)</strong> ของการเสียชีวิตทั้งหมดในผู้สูงอายุไทย
                </span>
              </div>
            </div>

            {/* Right: Gender Differences in Mortality (5 cols) */}
            <div className="lg:col-span-5 bg-[#f2f2f3] p-6 rounded-[24px] flex flex-col justify-between min-w-0 w-full">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-medium text-[#17191c] flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#17191c]" />
                    เปรียบเทียบสาเหตุการตาย: ชาย vs หญิง
                  </h3>
                  <span className="text-xs text-[#6b6f7a]">สัดส่วนแยกเพศ</span>
                </div>
                <p className="text-sm text-[#5f6370] mb-4">วิเคราะห์ความแตกต่างทางระบาดวิทยาและพฤติกรรมเสี่ยง</p>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {deathGender.map(g => {
                    const mNum = parseFloat(g.male_pct.replace('%', '')) || 50;
                    const fNum = parseFloat(g.female_pct.replace('%', '')) || 50;

                    return (
                      <div key={g.cause} className="p-4 rounded-2xl bg-white border border-[#ececec] text-sm space-y-2.5">
                        <div className="flex items-center justify-between font-medium text-[#17191c]">
                          <span className="text-base">{g.cause}</span>
                          <div className="flex items-center gap-2 text-sm tabular-nums">
                            <span className="text-[#5d2a1a] font-medium">ชาย {g.male_pct}</span>
                            <span className="text-[#ececec]">|</span>
                            <span className="text-[#5f6370] font-medium">หญิง {g.female_pct}</span>
                          </div>
                        </div>

                        {/* Dual colored visual progress bar: #5d2a1a (male) & #b9826a (female) */}
                        <div className="w-full h-2 rounded-full overflow-hidden flex bg-[#f2f2f3]">
                          <div
                            className="bg-[#5d2a1a] h-full transition-all"
                            style={{ width: `${mNum}%` }}
                            title={`ชาย ${g.male_pct}`}
                          />
                          <div
                            className="bg-[#b9826a] h-full transition-all"
                            style={{ width: `${fNum}%` }}
                            title={`หญิง ${g.female_pct}`}
                          />
                        </div>

                        <p className="text-sm text-[#5f6370] leading-relaxed">{g.epi_diff}</p>
                        <span className="text-xs text-[#6b6f7a] block">ปัจจัย: {g.behavior_factors}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Dedicated Data Sources */}
      <TabSourceReference
        tabTitle="สถิติสาเหตุการป่วยและสาเหตุการตาย"
        lastUpdated="ปีงบประมาณ 2566–2569"
        sources={[
          {
            title: 'ระบบคลังข้อมูลด้านการแพทย์และสุขภาพ (HDC) แฟ้ม OPD, IPD',
            dept: 'สำนักงานปลัดกระทรวงสาธารณสุข (สป.สธ.)',
            description: 'สถิติ 10 อันดับโรคที่มารับบริการในสถานพยาบาล จำแนกตามจำนวนครั้งที่มารับบริการ (Visits) และจำนวนครั้งการนอนโรงพยาบาล (Admissions)'
          },
          {
            title: 'กองยุทธศาสตร์และแผนงาน สป.สธ. & สำนักบริหารการทะเบียน กรมการปกครอง',
            dept: 'กระทรวงสาธารณสุข & กระทรวงมหาดไทย',
            description: 'สถิติสาเหตุการตายของประชากรไทย อ้างอิงจากใบมรณบัตร (Death Certificate) ผ่านการตรวจประมวลรหัสสาเหตุการตายสากล ICD-10'
          }
        ]}
      />
    </div>
  );
};
