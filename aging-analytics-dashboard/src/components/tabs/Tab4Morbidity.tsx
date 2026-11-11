import React, { useState, useMemo } from 'react';
import { ChronicTop10, PatientCauseItem, DeathCauseItem, DeathGenderItem } from '../../types';
import { KPICard } from '../KPICard';
import { TabSourceReference } from '../TabSourceReference';
import { TabHeader } from '../TabHeader';
import { EmptyState } from '../EmptyState';
import {
  Activity, Skull, Stethoscope, ShieldAlert, HeartPulse,
  Brain, Bone, Wind, Eye, Sparkles, HeartHandshake, Droplets,
  Users, Info, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { CHART_PALETTE, rechartsTooltipStyle } from '../../theme/chartTheme';
import { UsersThree, GenderMale, GenderFemale } from '@phosphor-icons/react';

interface Tab4MorbidityProps {
  chronicTop10: ChronicTop10[];
  opdByYear: Record<string, PatientCauseItem[]>;
  ipdByYear: Record<string, PatientCauseItem[]>;
  deathCauses: DeathCauseItem[];
  deathGender: DeathGenderItem[];
  selectedYear: string;
  forceSection?: 'illness' | 'mortality';
}

// Helper to parse min-max prevalence numbers from string like "46.0% - 52.0%"
function parsePrevalenceRange(prevStr: string, maxScale = 60) {
  const nums = prevStr.match(/\d+(\.\d+)?/g);
  if (!nums || nums.length === 0) {
    return { leftPct: 0, widthPct: 10 };
  }
  const minVal = parseFloat(nums[0]);
  const maxVal = nums.length > 1 ? parseFloat(nums[1]) : minVal;

  const leftPct = Math.max(0, Math.min(100, (minVal / maxScale) * 100));
  const rightPct = Math.max(leftPct, Math.min(100, (maxVal / maxScale) * 100));
  const widthPct = Math.max(3, rightPct - leftPct);

  return { leftPct, widthPct, minVal, maxVal };
}

// Helper to parse Thai and English cause names
function parseCauseName(fullCause: string) {
  const match = fullCause.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return { th: match[1].trim(), en: match[2].trim() };
  }
  return { th: fullCause.trim(), en: '' };
}

// Helper to calculate gender difference pill text and style
function getGenderDiffPill(malePctStr: string, femalePctStr: string) {
  const m = parseFloat(malePctStr.replace('%', '')) || 0;
  const f = parseFloat(femalePctStr.replace('%', '')) || 0;
  const maxVal = Math.max(m, f);
  const minVal = Math.min(m, f);
  const ratio = minVal > 0 ? maxVal / minVal : 1;

  if (ratio < 1.1) {
    return {
      text: 'ใกล้เคียงกัน',
      className: 'bg-[#f2f2f3] text-[#5f6370] border border-[#ececec]'
    };
  }
  if (m > f) {
    return {
      text: `ชายสูงกว่า ${ratio.toFixed(1)} เท่า`,
      className: 'bg-[#fbe1d1] text-[#5d2a1a] border border-[#eed0be]'
    };
  }
  return {
    text: `หญิงสูงกว่า ${ratio.toFixed(1)} เท่า`,
    className: 'bg-[#fbe1d1]/80 text-[#74371f] border border-[#eed0be]'
  };
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

  // Max percentages for proportional bars
  const maxOpdPct = useMemo(() => {
    if (!currentOpd.length) return 1;
    return Math.max(...currentOpd.map(i => i.pct), 1);
  }, [currentOpd]);

  const maxIpdPct = useMemo(() => {
    if (!currentIpd.length) return 1;
    return Math.max(...currentIpd.map(i => i.pct), 1);
  }, [currentIpd]);

  // Mortality Chart Data sorted descending
  const mortalityChartData = useMemo(() => {
    const yearKey = `y${selectedYear}` as keyof DeathCauseItem;
    return deathCauses
      .map(d => ({
        rank: d.rank,
        name: d.cause,
        icd: d.icd,
        deaths: (d[yearKey] as number) || d.y2569,
        ratio: d.ratio_pct,
        note: d.note
      }))
      .sort((a, b) => b.deaths - a.deaths);
  }, [deathCauses, selectedYear]);

  const maxMortalityDeaths = useMemo(() => {
    if (!mortalityChartData.length) return 1;
    return Math.max(...mortalityChartData.map(d => d.deaths), 1);
  }, [mortalityChartData]);

  const maxGenderPct = useMemo(() => {
    if (!deathGender.length) return 20;
    const all = deathGender.flatMap(g => [
      parseFloat(g.male_pct.replace('%', '')) || 0,
      parseFloat(g.female_pct.replace('%', '')) || 0
    ]);
    return Math.max(...all, 18);
  }, [deathGender]);

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

  // Derive gender mortality ratio (58% male vs 42% female) from original card representation / deathGender data
  const genderRatio = useMemo(() => {
    const originalStr = 'ชาย 58% : หญิง 42%';
    const match = originalStr.match(/(\d+(?:\.\d+)?)\s*%.*?(\d+(?:\.\d+)?)\s*%/);
    let malePct = match ? parseFloat(match[1]) : 58;
    let femalePct = match ? parseFloat(match[2]) : 42;

    if (deathGender && deathGender.length > 0) {
      const sumM = deathGender.reduce((acc, g) => acc + (parseFloat(g.male_pct) || 0), 0);
      const sumF = deathGender.reduce((acc, g) => acc + (parseFloat(g.female_pct) || 0), 0);
      const total = sumM + sumF;
      if (total > 0 && match) {
        malePct = parseFloat(match[1]);
        femalePct = parseFloat(match[2]);
      }
    }
    return { malePct, femalePct };
  }, [deathGender]);

  return (
    <div className="space-y-12 text-[#17191c]">
      {/* Editorial Section Header */}
      <TabHeader
        badge={`Morbidity & Mortality Statistics · สถิติสุขภาพระดับชาติ · ปีงบประมาณ ${selectedYear}`}
        title="สถิติสาเหตุการป่วยและสาเหตุการตาย"
        subtitle="วิเคราะห์ภาพรวมการรับบริการสุขภาพ (OPD/IPD 10 อันดับแรก), กลุ่ม 10 โรคเรื้อรังสำคัญ และสถิติสาเหตุการเสียชีวิต (Mortality Causes) ตามรหัสสากล ICD-10"
        illustrationSrc={`${import.meta.env.BASE_URL}images/illustrations/tab-illness.webp`}
      />

      {/* Top Level KPIs: auto-fit full row width */}
      <div className="kpi-grid">
        {activeSection === 'illness' ? (
          <>
            <KPICard
              title="บริการผู้ป่วยนอก (OPD)"
              value=">38"
              unit="ล้านครั้ง"
              subtitle="ตรวจรักษาในสถานพยาบาล สธ."
              badge="OPD Visits"
              icon={Stethoscope}
              variant="peach" // Accent card
            />
            <KPICard
              title="สาเหตุครอง รพ. IPD: ปอดบวม"
              value="437,946"
              unit="ครั้ง"
              subtitle="อันดับ 1 การนอนโรงพยาบาล"
              badge="ติดเชื้อทางเดินหายใจ"
              icon={Activity}
              variant="neutral"
            />
            <KPICard
              title="ความดันโลหิตสูง (HT)"
              value="48.5"
              unit="%"
              subtitle="โรคเรื้อรังอันดับ 1 ในผู้สูงอายุ"
              badge="ความดันสูง"
              icon={HeartPulse}
              variant="neutral"
            />
            <KPICard
              title="เบาหวาน (DM)"
              value="22.8"
              unit="%"
              subtitle="โรคเรื้อรังอันดับ 2"
              badge="เบาหวาน"
              icon={Activity}
              variant="neutral"
            />
            <KPICard
              title="ไขมันในเลือดสูง (DLP)"
              value="34.2"
              unit="%"
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
              value="68,500"
              unit="ราย/ปี"
              subtitle="14.7% ของการเสียชีวิตรวม"
              badge="อันดับ 1 มรณกรรม"
              icon={Skull}
              variant="peach" // Accent card
            />
            <KPICard
              title="สาเหตุการตายอันดับ 2: สโตรก"
              value="52,100"
              unit="ราย/ปี"
              subtitle="หลอดเลือดสมอง 11.2%"
              badge="Stroke"
              icon={HeartPulse}
              variant="neutral"
            />
            <KPICard
              title="โรคหัวใจขาดเลือด"
              value="36,400"
              unit="ราย/ปี"
              subtitle="7.8% ของการเสียชีวิตรวม"
              badge="IHD"
              icon={Activity}
              variant="neutral"
            />
            <KPICard
              title="ปอดอักเสบ/ปอดบวม"
              value="31,200"
              unit="ราย/ปี"
              subtitle="6.7% ของการเสียชีวิตรวม"
              badge="Pneumonia"
              icon={Wind}
              variant="neutral"
            />
            <KPICard
              title="สัดส่วนการตายแยกเพศ"
              subtitle="เพศชายเสียชีวิตจากมะเร็งและอุบัติเหตุสูงกว่า"
              badge="Gender Ratio"
              icon={ShieldAlert}
              variant="neutral"
              customValueElement={
                <div className="w-full flex flex-col gap-1.5">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col items-start">
                      <div className="font-serif font-normal tabular-nums text-[1.75rem] leading-none text-[#5d2a1a]">
                        {genderRatio.malePct}%
                      </div>
                      <div className="text-[0.875rem] text-[#5f6370] font-sans flex items-center gap-1 mt-0.5">
                        <GenderMale size={16} weight="bold" className="text-[#5d2a1a] shrink-0" />
                        <span>ชาย</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end text-right">
                      <div className="font-serif font-normal tabular-nums text-[1.75rem] leading-none text-[#74371f]">
                        {genderRatio.femalePct}%
                      </div>
                      <div className="text-[0.875rem] text-[#5f6370] font-sans flex items-center gap-1 mt-0.5">
                        <span>หญิง</span>
                        <GenderFemale size={16} weight="bold" className="text-[#c48a72] shrink-0" />
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full h-[12px] rounded-full overflow-hidden flex bg-[#f2f2f3]">
                    <div
                      className="h-full bg-[#5d2a1a] transition-all duration-500 rounded-l-full"
                      style={{ width: `${genderRatio.malePct}%` }}
                    />
                    <div className="w-[2px] h-full bg-white shrink-0" />
                    <div
                      className="h-full bg-[#c48a72] transition-all duration-500 rounded-r-full"
                      style={{ width: `${genderRatio.femalePct}%` }}
                    />
                  </div>
                </div>
              }
            />
          </>
        ) : (
          <>
            <KPICard
              title="บริการผู้ป่วยนอก (OPD)"
              value=">38"
              unit="ล้านครั้ง"
              subtitle="ตรวจรักษาในสถานพยาบาล สธ."
              badge="OPD Visits"
              icon={Stethoscope}
              variant="peach" // 1 Accent card
            />
            <KPICard
              title="สาเหตุนอน รพ. (IPD): ปอดบวม"
              value="437,946"
              unit="ครั้ง"
              subtitle="อันดับ 1 ครองเตียง รพ."
              badge="Admissions"
              icon={Activity}
              variant="neutral"
            />
            <KPICard
              title="โรคเรื้อรังอันดับ 1: ความดันสูง"
              value="48.5"
              unit="%"
              subtitle="พบในผู้สูงอายุเกือบครึ่งหนึ่ง"
              badge="Prevalence"
              icon={HeartPulse}
              variant="neutral"
            />
            <KPICard
              title="สาเหตุการตายอันดับ 1: มะเร็ง"
              value="68,500"
              unit="ราย/ปี"
              subtitle="14.7% ของมรณกรรมรวม"
              badge="Mortality #1"
              icon={Skull}
              variant="neutral"
            />
            <KPICard
              title="สัดส่วนการตายแยกเพศ"
              subtitle="เพศชายมีความเสี่ยงสูงกว่า"
              badge="Gender Ratio"
              icon={ShieldAlert}
              variant="neutral"
              customValueElement={
                <div className="w-full flex flex-col gap-1.5">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col items-start">
                      <div className="font-serif font-normal tabular-nums text-[1.75rem] leading-none text-[#5d2a1a]">
                        {genderRatio.malePct}%
                      </div>
                      <div className="text-[0.875rem] text-[#5f6370] font-sans flex items-center gap-1 mt-0.5">
                        <GenderMale size={16} weight="bold" className="text-[#5d2a1a] shrink-0" />
                        <span>ชาย</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end text-right">
                      <div className="font-serif font-normal tabular-nums text-[1.75rem] leading-none text-[#74371f]">
                        {genderRatio.femalePct}%
                      </div>
                      <div className="text-[0.875rem] text-[#5f6370] font-sans flex items-center gap-1 mt-0.5">
                        <span>หญิง</span>
                        <GenderFemale size={16} weight="bold" className="text-[#c48a72] shrink-0" />
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full h-[12px] rounded-full overflow-hidden flex bg-[#f2f2f3]">
                    <div
                      className="h-full bg-[#5d2a1a] transition-all duration-500 rounded-l-full"
                      style={{ width: `${genderRatio.malePct}%` }}
                    />
                    <div className="w-[2px] h-full bg-white shrink-0" />
                    <div
                      className="h-full bg-[#c48a72] transition-all duration-500 rounded-r-full"
                      style={{ width: `${genderRatio.femalePct}%` }}
                    />
                  </div>
                </div>
              }
            />
          </>
        )}
      </div>

      {/* Sub-view Switcher if not forced */}
      {!forceSection && (
        <div className="flex flex-wrap items-center gap-2.5 mb-8">
          <button
            onClick={() => setInternalSection('all')}
            className={`inline-flex items-center gap-2 px-5 h-[44px] rounded-full text-[0.9375rem] font-medium transition-all ${
              activeSection === 'all'
                ? 'bg-[#17191c] text-white shadow-sm'
                : 'bg-transparent border border-[#ececec] text-[#17191c] hover:bg-[#fafafb]'
            }`}
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span>ภาพรวมทั้งหมด</span>
          </button>
          <button
            onClick={() => setInternalSection('illness')}
            className={`inline-flex items-center gap-2 px-5 h-[44px] rounded-full text-[0.9375rem] font-medium transition-all ${
              activeSection === 'illness'
                ? 'bg-[#17191c] text-white shadow-sm'
                : 'bg-transparent border border-[#ececec] text-[#17191c] hover:bg-[#fafafb]'
            }`}
          >
            <Stethoscope className="w-4 h-4 shrink-0" />
            <span>สถิติการเจ็บป่วย (OPD / IPD 10 อันดับแรก)</span>
          </button>
          <button
            onClick={() => setInternalSection('mortality')}
            className={`inline-flex items-center gap-2 px-5 h-[44px] rounded-full text-[0.9375rem] font-medium transition-all ${
              activeSection === 'mortality'
                ? 'bg-[#17191c] text-white shadow-sm'
                : 'bg-transparent border border-[#ececec] text-[#17191c] hover:bg-[#fafafb]'
            }`}
          >
            <Skull className="w-4 h-4 shrink-0" />
            <span>สถิติสาเหตุการเสียชีวิต (Mortality Causes)</span>
          </button>
        </div>
      )}

      {/* Section 1: Top 10 Illnesses (OPD & IPD) */}
      {(activeSection === 'all' || activeSection === 'illness') && (
        <div className="space-y-8">
          {/* Top 10 Chronic Diseases Card Grid with 10-level Importance Scale */}
          <div className="bg-[#f2f2f3] p-5 sm:p-6 rounded-[24px] space-y-5">
            {/* Header: Title and Subtitle */}
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#17191c] flex items-center gap-2.5">
                <Activity className="w-5 h-5 text-[#5d2a1a]" />
                10 อันดับโรคและปัญหาสุขภาพสำคัญเฉพาะผู้สูงอายุ 60 ปีขึ้นไป
              </h3>
              <p className="text-[0.9375rem] text-[#5f6370]">
                สรุปอัตราความชุก (%) ลักษณะอาการและความสำคัญทางการแพทย์ (ข้อมูล มส.ผส. และ สธ.)
              </p>
            </div>

            {/* Legend explaining 10-level rank importance scale */}
            <div className="w-full bg-white/70 rounded-2xl p-4 border border-[#ececec] space-y-2.5">
              {/* Row: Left label, Right label, and ICD-10 badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[0.875rem] text-[#5f6370] font-normal">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[#17191c]">อันดับ 1 · สำคัญสูงสุด</span>
                  <span className="text-xs text-[#a3a6af]">→</span>
                  <span>อันดับ 10</span>
                </div>
                <span className="text-xs px-3.5 py-1.5 rounded-full bg-white text-[#5f6370] border border-[#ececec] font-medium shadow-none shrink-0">
                  ICD-10 Clinical Profile
                </span>
              </div>

              {/* 10px continuous gradient bar from --rank-1 to --rank-10 */}
              <div
                className="w-full h-2.5 rounded-full overflow-hidden"
                style={{
                  background: 'linear-gradient(to right, var(--rank-1) 0%, var(--rank-2) 11.11%, var(--rank-3) 22.22%, var(--rank-4) 33.33%, var(--rank-5) 44.44%, var(--rank-6) 55.55%, var(--rank-7) 66.66%, var(--rank-8) 77.77%, var(--rank-9) 88.88%, var(--rank-10) 100%)'
                }}
                aria-hidden="true"
              />

              {/* 10 equal steps indicator (dots/numbers 1 to 10 below the bar) */}
              <div className="grid grid-cols-10 text-center text-xs text-[#5f6370] font-normal tabular-nums px-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rank => (
                  <span key={rank} className="flex flex-col items-center">
                    <span className="w-1.5 h-1.5 rounded-full mb-0.5" style={{ backgroundColor: `var(--rank-${rank})` }} />
                    <span>{rank}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Grid of 10 Chronic Cards */}
            <div className="chronic-grid">
              {chronicTop10.map(c => {
                const Icon = getChronicIcon(c.rank);
                const isTopRank = c.rank <= 3;
                const badgeTextColor = c.rank <= 5 ? '#ffffff' : '#5d2a1a';
                const { leftPct, widthPct } = parsePrevalenceRange(c.prevalence);

                return (
                  <article
                    key={c.rank}
                    data-cursor="hover"
                    aria-label={`อันดับ ${c.rank} ${c.disease} ความชุก ${c.prevalence}`}
                    className={`chronic-card card-clickable ${isTopRank ? 'is-top-rank' : ''}`}
                    style={{
                      '--rank-color': `var(--rank-${c.rank})`
                    } as React.CSSProperties}
                  >
                    {/* Top colored strip: 6px full width */}
                    <div className="chronic-top-bar" aria-hidden="true" />

                    {/* Card Inner Content */}
                    <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                      <div>
                        {/* Header row: 36px Rank circle on left, ICD-10 badge on right */}
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className="w-9 h-9 rounded-full flex items-center justify-center font-serif font-normal text-[1.125rem] tabular-nums shrink-0"
                            style={{
                              backgroundColor: 'var(--rank-color)',
                              color: badgeTextColor
                            }}
                          >
                            {c.rank}
                          </span>
                          <span className="text-xs font-mono text-[#5f6370] bg-[#f2f2f3] px-2.5 py-1 rounded-full font-medium border border-[#ececec]">
                            {c.icd}
                          </span>
                        </div>

                        {/* Disease title with icon circle */}
                        <div className="flex items-start gap-2.5 mb-2.5">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[#5d2a1a] shrink-0 mt-0.5"
                            style={{
                              backgroundColor: 'color-mix(in srgb, var(--rank-color) 22%, #ffffff)'
                            }}
                            aria-hidden="true"
                          >
                            <Icon className="w-4 h-4 stroke-[1.75]" />
                          </div>
                          <h4 className="font-medium text-[#17191c] text-base leading-snug break-words">
                            {c.disease}
                          </h4>
                        </div>

                        {/* Prevalence text + range bar */}
                        <div className="mb-3 space-y-1">
                          <div className="text-sm flex items-baseline gap-1.5">
                            <span className="text-[#5f6370]">ความชุก:</span>
                            <span className="font-serif font-normal text-[#5d2a1a] text-lg tabular-nums leading-tight">
                              {c.prevalence}
                            </span>
                          </div>
                          {/* Mini prevalence range bar (height 6px, bg #ececec, filled range in var(--rank-color)) */}
                          <div
                            className="w-full h-1.5 rounded-full bg-[#ececec] overflow-hidden relative"
                            title={`ช่วงความชุก ${c.prevalence}`}
                            aria-hidden="true"
                          >
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                backgroundColor: 'var(--rank-color)',
                                marginLeft: `${leftPct}%`,
                                width: `${widthPct}%`
                              }}
                            />
                          </div>
                        </div>

                        {/* Clinical description */}
                        <p className="text-sm text-[#5f6370] leading-[1.6]">
                          {c.clinical_significance}
                        </p>
                      </div>

                      {/* Footer: Group label on left, Pill "อันดับ N" on right */}
                      <div className="mt-4 pt-3 border-t border-[#ececec] flex items-center justify-between text-xs text-[#6b6f7a]">
                        <span className="truncate pr-2">กลุ่มผู้สูงอายุไทย</span>
                        <span
                          className="px-3 py-0.5 rounded-full text-xs font-medium tabular-nums whitespace-nowrap shrink-0"
                          style={{
                            backgroundColor: 'var(--rank-color)',
                            color: badgeTextColor
                          }}
                        >
                          อันดับ {c.rank}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Prevalence Formula Footnote Note */}
            <div className="pt-1">
              <div className="p-3.5 sm:p-4 rounded-xl bg-white/90 border border-[#ececec] text-xs text-[#5f6370] space-y-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-start sm:items-center gap-2 min-w-0 flex-1">
                    <Info className="w-4 h-4 text-[#5d2a1a] shrink-0 mt-0.5 sm:mt-0" />
                    <div className="leading-relaxed">
                      <span className="font-medium text-[#17191c]">สูตรคำนวณอัตราความชุก (Prevalence Rate): </span>
                      <span className="font-mono text-[11.5px] bg-[#f2f2f3] px-2 py-0.5 rounded border border-[#ececec] text-[#17191c] inline-block my-0.5 sm:my-0">
                        ความชุก (%) = (จำนวนผู้สูงอายุที่พบโรค ÷ จำนวนประชากรสูงอายุทั้งหมด) × 100
                      </span>
                    </div>
                  </div>
                  <span className="text-[11.5px] text-[#5d2a1a] font-medium shrink-0 bg-[#fef2eb] px-2.5 py-0.5 rounded-full border border-[#f5d7c4]">
                    แสดงเป็นร้อยละ (%) เทียบต่อ 100 ประชากรสูงอายุ (ไม่ใช่ต่อแสน)
                  </span>
                </div>
                <div className="pt-1.5 border-t border-[#ececec]/80 text-[11px] text-[#6b6f7a] flex flex-col lg:flex-row lg:items-center justify-between gap-1.5 leading-relaxed">
                  <span>
                    <strong>ฐานตัวหาร (ประชากรสูงอายุ 60 ปีขึ้นไป):</strong> อ้างอิงการสำรวจสุขภาพประชาชนไทยโดยการตรวจร่างกาย (NHES/สวรส. กลุ่มตัวอย่างผู้สูงอายุ ~7,400 คน ถ่วงน้ำหนักระดับประเทศ) ร่วมกับฐานประชากรในระบบ HDC สธ. (~9.6–11.0 ล้านคน)
                  </span>
                  <span className="shrink-0 text-[#8a4730]">
                    * หากเทียบเป็นอัตราต่อแสนประชากร: นำ % × 1,000 (เช่น ความดันฯ 50% = 50,000 ต่อแสนคน)
                  </span>
                </div>
              </div>
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

              <div className="h-72 sm:h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparativeChartData.top5Opd} layout="vertical" margin={{ top: 5, right: 25, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ececec" />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 13, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 13, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} width={140} />
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

              <div className="h-72 sm:h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparativeChartData.top5Ipd} layout="vertical" margin={{ top: 5, right: 25, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ececec" />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 13, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 13, fill: '#5f6370', fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }} width={140} />
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
            {/* Left: OPD Top 10 Table */}
            <div className="ranking-table-card">
              <div className="p-5 sm:p-6 bg-[#fafafb] border-b border-[#ececec] flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                <div>
                  <h4 className="font-serif text-[#17191c] text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] font-normal leading-tight">
                    สาเหตุการป่วยผู้ป่วยนอก (OPD) 10 อันดับแรก ปี {selectedYear}
                  </h4>
                  <p className="text-[0.9375rem] text-[#5f6370] mt-1">จำแนกตามจำนวนครั้งที่มารับบริการ (HDC)</p>
                </div>
                <span className="text-[0.875rem] px-3.5 py-1 rounded-full bg-white text-[#5f6370] border border-[#ececec] whitespace-nowrap shrink-0 font-medium">
                  10 อันดับ
                </span>
              </div>

              {/* Table Header (Container >= 640px) */}
              <div className="ranking-table-header">
                <div className="text-center font-medium">อันดับ</div>
                <div className="font-medium">กลุ่มโรค (ICD-10)</div>
                <div className="text-right font-medium">จำนวนรวม (ครั้ง)</div>
                <div className="text-right font-medium">สัดส่วน (%)</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-[#ececec]">
                {currentOpd.length > 0 ? (
                  currentOpd.map(item => (
                  <div
                    key={`opd-${item.rank}`}
                    className="ranking-table-row group"
                    style={{ '--rank-color': `var(--rank-${item.rank})` } as React.CSSProperties}
                  >
                    {/* Desktop 4 columns */}
                    <div className="ranking-desktop-cols contents">
                      {/* 1. Rank */}
                      <div className="flex items-center justify-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold tabular-nums shrink-0 ${
                            item.rank <= 5 ? 'text-white' : 'text-[#5d2a1a]'
                          }`}
                          style={{ backgroundColor: `var(--rank-${item.rank})` }}
                        >
                          {item.rank}
                        </span>
                      </div>

                      {/* 2. Disease details */}
                      <div className="min-w-0 pr-2">
                        <div className="font-medium text-[#17191c] text-base leading-snug">
                          {item.disease_th}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[13px] font-medium font-mono tabular-nums bg-[#f2f2f3] text-[#17191c] border border-[#e5e5e7]">
                            {item.icd}
                          </span>
                          <span className="text-[14px] text-[#5f6370] truncate">
                            {item.disease_en}
                          </span>
                        </div>
                      </div>

                      {/* 3. Total visits */}
                      <div className="text-right whitespace-nowrap">
                        <div className="font-medium text-[#17191c] text-base tabular-nums">
                          {item.total.toLocaleString('th-TH')}
                        </div>
                        <div className="text-xs text-[#5f6370] mt-0.5">ครั้ง</div>
                      </div>

                      {/* 4. Proportion % */}
                      <div className="flex flex-col items-end whitespace-nowrap">
                        <div className="font-serif text-[1.125rem] text-[#5d2a1a] leading-none tabular-nums font-normal">
                          {item.pct.toFixed(2)}%
                        </div>
                        <div className="w-24 h-1.5 rounded-full bg-[#ececec] overflow-hidden mt-1.5 shrink-0">
                          <div
                            className="h-full rounded-full bg-[#5d2a1a] transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(3, (item.pct / maxOpdPct) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mobile 2-tier layout */}
                    <div className="ranking-mobile-row">
                      {/* Tier 1: Rank & Disease Name */}
                      <div className="flex items-start gap-3">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold tabular-nums shrink-0 mt-0.5 ${
                            item.rank <= 5 ? 'text-white' : 'text-[#5d2a1a]'
                          }`}
                          style={{ backgroundColor: `var(--rank-${item.rank})` }}
                        >
                          {item.rank}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-[#17191c] text-base leading-snug">
                            {item.disease_th}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium font-mono tabular-nums bg-[#f2f2f3] text-[#17191c] border border-[#e5e5e7]">
                              {item.icd}
                            </span>
                            <span className="text-[13px] text-[#5f6370]">
                              {item.disease_en}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tier 2: Stats Box */}
                      <div className="bg-[#fafafb] rounded-xl p-3 border border-[#ececec] space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#5f6370]">จำนวนครั้ง:</span>
                          <span className="font-medium text-[#17191c] tabular-nums whitespace-nowrap">
                            {item.total.toLocaleString('th-TH')} ครั้ง
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#5f6370]">สัดส่วน:</span>
                          <span className="font-serif text-[#5d2a1a] text-base font-normal tabular-nums whitespace-nowrap">
                            {item.pct.toFixed(2)}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#ececec] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#5d2a1a] transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(3, (item.pct / maxOpdPct) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="ไม่พบข้อมูลผู้ป่วยนอก (OPD)" />
              )}
              </div>
            </div>

            {/* Right: IPD Top 10 Table */}
            <div className="ranking-table-card">
              <div className="p-5 sm:p-6 bg-[#fafafb] border-b border-[#ececec] flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                <div>
                  <h4 className="font-serif text-[#17191c] text-[clamp(1.125rem,1rem+0.4vw,1.375rem)] font-normal leading-tight">
                    สาเหตุการป่วยผู้ป่วยใน (IPD) 10 อันดับแรก ปี {selectedYear}
                  </h4>
                  <p className="text-[0.9375rem] text-[#5f6370] mt-1">จำแนกตามจำนวนครั้งที่นอนโรงพยาบาล (HDC)</p>
                </div>
                <span className="text-[0.875rem] px-3.5 py-1 rounded-full bg-white text-[#5f6370] border border-[#ececec] whitespace-nowrap shrink-0 font-medium">
                  10 อันดับ
                </span>
              </div>

              {/* Table Header (Container >= 640px) */}
              <div className="ranking-table-header">
                <div className="text-center font-medium">อันดับ</div>
                <div className="font-medium">กลุ่มโรค (ICD-10)</div>
                <div className="text-right font-medium">จำนวนรวม (ครั้ง)</div>
                <div className="text-right font-medium">สัดส่วน (%)</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-[#ececec]">
                {currentIpd.length > 0 ? (
                  currentIpd.map(item => (
                  <div
                    key={`ipd-${item.rank}`}
                    className="ranking-table-row group"
                    style={{ '--rank-color': `var(--rank-${item.rank})` } as React.CSSProperties}
                  >
                    {/* Desktop 4 columns */}
                    <div className="ranking-desktop-cols contents">
                      {/* 1. Rank */}
                      <div className="flex items-center justify-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold tabular-nums shrink-0 ${
                            item.rank <= 5 ? 'text-white' : 'text-[#5d2a1a]'
                          }`}
                          style={{ backgroundColor: `var(--rank-${item.rank})` }}
                        >
                          {item.rank}
                        </span>
                      </div>

                      {/* 2. Disease details */}
                      <div className="min-w-0 pr-2">
                        <div className="font-medium text-[#17191c] text-base leading-snug">
                          {item.disease_th}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[13px] font-medium font-mono tabular-nums bg-[#f2f2f3] text-[#17191c] border border-[#e5e5e7]">
                            {item.icd}
                          </span>
                          <span className="text-[14px] text-[#5f6370] truncate">
                            {item.disease_en}
                          </span>
                        </div>
                      </div>

                      {/* 3. Total visits */}
                      <div className="text-right whitespace-nowrap">
                        <div className="font-medium text-[#17191c] text-base tabular-nums">
                          {item.total.toLocaleString('th-TH')}
                        </div>
                        <div className="text-xs text-[#5f6370] mt-0.5">ครั้ง</div>
                      </div>

                      {/* 4. Proportion % */}
                      <div className="flex flex-col items-end whitespace-nowrap">
                        <div className="font-serif text-[1.125rem] text-[#5d2a1a] leading-none tabular-nums font-normal">
                          {item.pct.toFixed(2)}%
                        </div>
                        <div className="w-24 h-1.5 rounded-full bg-[#ececec] overflow-hidden mt-1.5 shrink-0">
                          <div
                            className="h-full rounded-full bg-[#5d2a1a] transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(3, (item.pct / maxIpdPct) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mobile 2-tier layout */}
                    <div className="ranking-mobile-row">
                      {/* Tier 1: Rank & Disease Name */}
                      <div className="flex items-start gap-3">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold tabular-nums shrink-0 mt-0.5 ${
                            item.rank <= 5 ? 'text-white' : 'text-[#5d2a1a]'
                          }`}
                          style={{ backgroundColor: `var(--rank-${item.rank})` }}
                        >
                          {item.rank}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-[#17191c] text-base leading-snug">
                            {item.disease_th}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium font-mono tabular-nums bg-[#f2f2f3] text-[#17191c] border border-[#e5e5e7]">
                              {item.icd}
                            </span>
                            <span className="text-[13px] text-[#5f6370]">
                              {item.disease_en}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tier 2: Stats Box */}
                      <div className="bg-[#fafafb] rounded-xl p-3 border border-[#ececec] space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#5f6370]">จำนวนครั้ง:</span>
                          <span className="font-medium text-[#17191c] tabular-nums whitespace-nowrap">
                            {item.total.toLocaleString('th-TH')} ครั้ง
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#5f6370]">สัดส่วน:</span>
                          <span className="font-serif text-[#5d2a1a] text-base font-normal tabular-nums whitespace-nowrap">
                            {item.pct.toFixed(2)}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#ececec] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#5d2a1a] transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(3, (item.pct / maxIpdPct) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="ไม่พบข้อมูลผู้ป่วยใน (IPD)" />
              )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: 10 Mortality Causes */}
      {(activeSection === 'all' || activeSection === 'mortality') && (
        <div className="space-y-8 w-full">
          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-6 items-stretch w-full">
            {/* Left: 10 Top Death Causes HTML/CSS Ranking Bars */}
            <div className="mortality-card bg-[#f2f2f3] p-5 sm:p-7 rounded-[24px] border border-[#ececec]/80 flex flex-col w-full h-full min-w-0 shadow-xs">
              {/* Card Header (flex-none) */}
              <div className="flex-none flex items-center justify-between gap-3 flex-wrap pb-4 border-b border-[#e5e5e7]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#fbe1d1] flex items-center justify-center shrink-0">
                    <Skull className="w-5 h-5 text-[#5d2a1a]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif font-normal text-[#17191c] text-[clamp(1.25rem,1rem+0.6vw,1.625rem)] leading-tight">
                      10 อันดับสาเหตุการเสียชีวิตของประชากรสูงอายุไทย (ปี {selectedYear})
                    </h3>
                    <p className="text-[0.9375rem] text-[#5f6370] mt-0.5">
                      จำนวนผู้เสียชีวิต (คน/ปี) และสัดส่วนต่อการตายรวม อ้างอิงใบมรณบัตร
                    </p>
                  </div>
                </div>
                <span className="text-[0.875rem] px-3.5 py-1 rounded-full bg-white text-[#5f6370] border border-[#ececec] whitespace-nowrap font-medium shrink-0">
                  สถิติมรณกรรม
                </span>
              </div>

              {/* 10 Ranked Causes List (flex-none) */}
              <div className="flex-none space-y-2 mt-4">
                {mortalityChartData.map((item, idx) => {
                  const parsed = parseCauseName(item.name);
                  const isTop2 = item.rank <= 2;
                  const rowStyle: React.CSSProperties = {
                    '--bar-color': `var(--rank-${item.rank})`,
                    backgroundColor: isTop2
                      ? `color-mix(in srgb, var(--rank-${item.rank}) 10%, #ffffff)`
                      : '#ffffff',
                    border: isTop2
                      ? `1px solid color-mix(in srgb, var(--rank-${item.rank}) 24%, transparent)`
                      : '1px solid #ececec',
                  } as React.CSSProperties;

                  const tooltipText = `${item.name} (${item.icd}) • ${item.deaths.toLocaleString('th-TH')} ราย (${item.ratio}% ของการตายรวม)${item.note ? ` • ${item.note}` : ''}`;

                  return (
                    <div
                      key={`mortality-${item.rank}-${item.icd}`}
                      className="mortality-row group"
                      style={rowStyle}
                      title={tooltipText}
                    >
                      {/* Desktop Layout (Container >= 540px) */}
                      <div className="mortality-desktop-layout contents">
                        {/* Col 1: Rank Badge */}
                        <div className="flex items-center justify-center shrink-0">
                          <span
                            className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold font-serif tabular-nums shrink-0 ${
                              item.rank <= 5 ? 'text-white' : 'text-[#5d2a1a]'
                            }`}
                            style={{ backgroundColor: `var(--rank-${item.rank})` }}
                          >
                            {item.rank}
                          </span>
                        </div>

                        {/* Col 2: Name + 14px Bar */}
                        <div className="min-w-0 pr-2">
                          <div className="flex items-baseline gap-2 flex-wrap min-w-0">
                            <span className="font-medium text-[#17191c] text-[1rem] leading-snug">
                              {parsed.th}
                            </span>
                            {parsed.en && (
                              <span className="text-[0.875rem] text-[#5f6370] font-normal truncate">
                                ({parsed.en})
                              </span>
                            )}
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums text-[#5f6370] bg-[#f2f2f3] border border-[#e5e5e7]">
                              {item.icd}
                            </span>
                          </div>
                          <div className="mortality-bar-track mt-1.5">
                            <div
                              className="mortality-bar-fill"
                              style={{
                                width: `${Math.min(100, Math.max(3, (item.deaths / maxMortalityDeaths) * 100))}%`,
                                backgroundColor: `var(--rank-${item.rank})`,
                                transitionDelay: `${idx * 40}ms`
                              }}
                            />
                          </div>
                        </div>

                        {/* Col 3: Numbers (Deaths & Ratio) */}
                        <div className="text-right whitespace-nowrap shrink-0 pl-2">
                          <div className="font-medium text-[#17191c] text-[1rem] tabular-nums">
                            {item.deaths.toLocaleString('th-TH')} ราย
                          </div>
                          <div className="font-serif text-[0.9375rem] text-[#5d2a1a] tabular-nums font-normal mt-0.5">
                            {item.ratio}%
                          </div>
                        </div>
                      </div>

                      {/* Mobile Layout (Container < 540px) */}
                      <div className="mortality-mobile-layout">
                        <div className="flex items-start gap-3">
                          <span
                            className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold font-serif tabular-nums shrink-0 mt-0.5 ${
                              item.rank <= 5 ? 'text-white' : 'text-[#5d2a1a]'
                            }`}
                            style={{ backgroundColor: `var(--rank-${item.rank})` }}
                          >
                            {item.rank}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-[#17191c] text-[1rem] leading-snug">
                              {parsed.th}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap text-[0.875rem] text-[#5f6370]">
                              {parsed.en && <span>{parsed.en}</span>}
                              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[11px] font-mono tabular-nums bg-[#f2f2f3] border border-[#e5e5e7]">
                                {item.icd}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 space-y-1">
                          <div className="mortality-bar-track">
                            <div
                              className="mortality-bar-fill"
                              style={{
                                width: `${Math.min(100, Math.max(3, (item.deaths / maxMortalityDeaths) * 100))}%`,
                                backgroundColor: `var(--rank-${item.rank})`
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-sm pt-0.5">
                            <span className="font-medium text-[#17191c] tabular-nums whitespace-nowrap">
                              {item.deaths.toLocaleString('th-TH')} ราย
                            </span>
                            <span className="font-serif text-[#5d2a1a] tabular-nums font-normal whitespace-nowrap">
                              {item.ratio}% ของการตายรวม
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Infographic: ใน 100 การเสียชีวิตของผู้สูงอายุไทย (flex-1 image box) */}
              <div className="flex-1 flex flex-col justify-between mt-5 bg-white rounded-[20px] p-5 border border-[#ececec] shadow-xs overflow-hidden">
                {/* Panel Header */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#f2f2f3]">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#fbe1d1] flex items-center justify-center shrink-0">
                      <UsersThree size={22} weight="duotone" className="text-[#5d2a1a]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif font-normal text-[#17191c] text-[1.25rem] leading-tight">
                        ใน 100 การเสียชีวิตของผู้สูงอายุไทย
                      </h4>
                      <p className="text-[0.9375rem] text-[#5f6370] mt-0.5">
                        10 สาเหตุหลักตามสัดส่วนการเสียชีวิตทั้งหมด ปี 2569
                      </p>
                    </div>
                  </div>
                  {/* Mobile Scroll Hint */}
                  <span className="sm:hidden text-xs text-[#5f6370] bg-[#fafafb] px-2.5 py-1 rounded-full border border-[#ececec] shrink-0 font-medium self-center">
                    เลื่อนดูเพิ่มเติม →
                  </span>
                </div>

                {/* Infographic Image Box with horizontal scroll on narrow mobile screens */}
                <div className="flex-1 flex items-center justify-center w-full overflow-x-auto touch-scroll py-3">
                  <div className="w-full flex items-center justify-center min-w-[640px] sm:min-w-0">
                    <img
                      src="/images/mortality-infographic.webp"
                      alt="อินโฟกราฟิก 10 อันดับสาเหตุการเสียชีวิตของผู้สูงอายุไทย ปี 2569 มะเร็งและโรคหลอดเลือดสมองรวมกัน 25.9% หรือ 1 ใน 4"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto object-contain aspect-[900/420] rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Summary Info Box (flex-none) */}
              <div className="flex-none mt-5 p-4 bg-white rounded-[16px] border border-[#ececec] text-[0.9375rem] text-[#5f6370] flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-full bg-[#fbe1d1] flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-[#5d2a1a]" />
                </div>
                <p className="leading-relaxed">
                  โรคมะเร็งทุกชนิดและโรคหลอดเลือดสมองเป็น 2 สาเหตุหลัก คิดเป็นมากกว่า{' '}
                  <strong className="text-[#17191c] font-semibold">1 ใน 4 (25.9%)</strong>{' '}
                  ของการเสียชีวิตทั้งหมดในผู้สูงอายุไทย
                </p>
              </div>
            </div>

            {/* Right: Gender Differences in Mortality (No nested scrollbar, auto-stretched) */}
            <div className="bg-[#f2f2f3] p-5 sm:p-7 rounded-[24px] border border-[#ececec]/80 flex flex-col justify-between w-full h-full min-w-0 shadow-xs">
              <div>
                {/* Header with peach circle icon, serif title and color legend */}
                <div className="space-y-3 pb-4 border-b border-[#e5e5e7]">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#fbe1d1] flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-[#5d2a1a]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif font-normal text-[#17191c] text-[clamp(1.25rem,1rem+0.6vw,1.625rem)] leading-tight">
                          เปรียบเทียบสาเหตุการตาย: ชาย vs หญิง
                        </h3>
                        <p className="text-[0.9375rem] text-[#5f6370] mt-0.5">
                          วิเคราะห์ความแตกต่างทางระบาดวิทยาและพฤติกรรมเสี่ยง
                        </p>
                      </div>
                    </div>
                    <span className="text-[0.875rem] px-3.5 py-1 rounded-full bg-white text-[#5f6370] border border-[#ececec] whitespace-nowrap font-medium shrink-0">
                      สัดส่วนแยกเพศ
                    </span>
                  </div>

                  {/* Gender Color Legend */}
                  <div className="flex items-center gap-4 text-xs font-medium pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#5d2a1a]" />
                      <span className="text-[#17191c]">เพศชาย (#5d2a1a)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#c48a72]" />
                      <span className="text-[#17191c]">เพศหญิง (#c48a72)</span>
                    </div>
                  </div>
                </div>

                {/* Causes Sub-cards List (Evenly distributed) */}
                <div className="space-y-3.5 flex-1 flex flex-col justify-between mt-4">
                  {deathGender.map(g => {
                    const mNum = parseFloat(g.male_pct.replace('%', '')) || 0;
                    const fNum = parseFloat(g.female_pct.replace('%', '')) || 0;
                    const diffPill = getGenderDiffPill(g.male_pct, g.female_pct);

                    return (
                      <div
                        key={g.cause}
                        className="p-4 sm:p-[16px_18px] rounded-[16px] bg-white border border-[#ececec] text-sm space-y-3 shadow-xs hover:border-[#d5a58f]/40 transition-colors"
                      >
                        {/* Row 1: Disease Name & Difference Pill */}
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <span className="font-medium text-[#17191c] text-[1rem] leading-snug">
                            {g.cause}
                          </span>
                          <span className={`text-[0.875rem] px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap shrink-0 ${diffPill.className}`}>
                            {diffPill.text}
                          </span>
                        </div>

                        {/* Row 2: Two Stacked Comparison Bars */}
                        <div className="space-y-1.5">
                          {/* Male Bar */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2.5 rounded-full bg-[#ececec] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[#5d2a1a] transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.max(4, (mNum / maxGenderPct) * 100))}%` }}
                              />
                            </div>
                            <div className="flex items-center gap-1.5 min-w-[95px] justify-end shrink-0 text-sm">
                              <span className="w-2 h-2 rounded-full bg-[#5d2a1a] shrink-0" />
                              <span className="text-[#5f6370] text-xs">ชาย</span>
                              <span className="font-medium text-[#17191c] tabular-nums whitespace-nowrap">{g.male_pct}</span>
                            </div>
                          </div>

                          {/* Female Bar */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2.5 rounded-full bg-[#c48a72] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[#c48a72] transition-all duration-500"
                                style={{ width: `${Math.min(100, Math.max(4, (fNum / maxGenderPct) * 100))}%` }}
                              />
                            </div>
                            <div className="flex items-center gap-1.5 min-w-[95px] justify-end shrink-0 text-sm">
                              <span className="w-2 h-2 rounded-full bg-[#c48a72] shrink-0" />
                              <span className="text-[#5f6370] text-xs">หญิง</span>
                              <span className="font-medium text-[#17191c] tabular-nums whitespace-nowrap">{g.female_pct}</span>
                            </div>
                          </div>
                        </div>

                        {/* Row 3: Epidemiological difference & Behavior factors */}
                        <div className="pt-2 border-t border-[#f2f2f3] space-y-1">
                          <div className="text-[0.9375rem] font-medium text-[#17191c] flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4 text-[#5d2a1a] shrink-0" />
                            <span>{g.epi_diff}</span>
                          </div>
                          <div className="text-[0.875rem] text-[#5f6370] flex items-start gap-1.5 leading-relaxed">
                            <Info className="w-3.5 h-3.5 text-[#8a4730] shrink-0 mt-0.5" />
                            <span><strong className="font-medium text-[#17191c]">ปัจจัย:</strong> {g.behavior_factors}</span>
                          </div>
                        </div>
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
