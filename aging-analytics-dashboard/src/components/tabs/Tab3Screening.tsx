import React, { useState, useMemo } from 'react';
import { ScreeningZoneData, DmsRiskZone, DmsTotalZone } from '../../types';
import { KPICard } from '../KPICard';
import { TabSourceReference } from '../TabSourceReference';
import { Activity, Eye, ShieldAlert, HeartHandshake, CheckCheck, Sparkles, FileText, Stethoscope } from 'lucide-react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

interface Tab3ScreeningProps {
  screeningByYear: Record<string, ScreeningZoneData[]>;
  dmsRiskData: DmsRiskZone[];
  dmsTotalData: DmsTotalZone[];
  selectedZone: string;
  selectedYear: string;
}

export const Tab3Screening: React.FC<Tab3ScreeningProps> = ({
  screeningByYear,
  dmsRiskData,
  dmsTotalData,
  selectedZone,
  selectedYear
}) => {
  const [subView, setSubView] = useState<'hdc9' | 'dms'>('hdc9');

  // National 9 domains summary for 2569
  const national9Domains = useMemo(() => [
    { name: '1. การมองเห็น (สายตา)', screened: 9182964, risk: 1372196, riskPct: 14.9, icon: Eye, color: '#f43f5e' },
    { name: '2. สุขภาพช่องปาก', screened: 9201193, risk: 1099281, riskPct: 11.9, icon: Stethoscope, color: '#f97316' },
    { name: '3. การเคลื่อนไหวร่างกาย', screened: 9191600, risk: 815769, riskPct: 8.9, icon: Activity, color: '#eab308' },
    { name: '4. กิจวัตรประจำวัน (ADL)', screened: 9379648, risk: 585267, riskPct: 6.2, icon: HeartHandshake, color: '#3b82f6' },
    { name: '5. การได้ยิน (หูตึง/หนวก)', screened: 8962342, risk: 467799, riskPct: 5.2, icon: Sparkles, color: '#6366f1' },
    { name: '6. ความคิดความจำ', screened: 8768736, risk: 442860, riskPct: 5.1, icon: ShieldAlert, color: '#8b5cf6' },
    { name: '7. การกลั้นปัสสาวะ', screened: 9071493, risk: 407193, riskPct: 4.5, icon: Activity, color: '#06b6d4' },
    { name: '8. ภาวะโภชนาการ', screened: 8962399, risk: 371156, riskPct: 4.1, icon: HeartHandshake, color: '#10b981' },
    { name: '9. ภาวะซึมเศร้า (2Q)', screened: 9214935, risk: 131179, riskPct: 1.4, icon: ShieldAlert, color: '#64748b' },
  ], []);

  // Zones performance in 9 domains
  const zoneList = useMemo(() => {
    const list = screeningByYear[selectedYear] || screeningByYear['2569'] || [];
    return list.map(z => ({
      name: z.zone.replace('เขตสุขภาพที่ ', 'เขต '),
      เป้าหมาย: z.target,
      คัดกรองครบ9ด้าน: z.screened_all_9,
      ร้อยละผลงาน: z.screened_pct,
      code: z.zone_code
    }));
  }, [screeningByYear, selectedYear]);

  // DMS Care Tools data filtered
  const dmsYearRisk = useMemo(() => {
    return dmsRiskData.filter(d => d.year === selectedYear || d.year.includes(selectedYear));
  }, [dmsRiskData, selectedYear]);

  const dmsSummary = useMemo(() => {
    let fallsTreat = 0;
    let fallsRefer = 0;
    let fallsCarePlan = 0;
    let demTreat = 0;
    let demRefer = 0;
    let oralTreat = 0;

    dmsYearRisk.forEach(d => {
      fallsTreat += d.falls_treat_person;
      fallsRefer += d.falls_refer_person;
      fallsCarePlan += d.falls_careplan_person;
      demTreat += d.dementia_treat_person;
      demRefer += d.dementia_refer_person;
      oralTreat += d.oral_treat_person;
    });

    return { fallsTreat, fallsRefer, fallsCarePlan, demTreat, demRefer, oralTreat };
  }, [dmsYearRisk]);

  return (
    <div className="space-y-6">
      {/* Sub-navigation Switcher */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex space-x-2">
          <button
            onClick={() => setSubView('hdc9')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              subView === 'hdc9'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>1. คัดกรอง 9 ด้าน (HDC สธ.)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20">80.6%</span>
          </button>
          <button
            onClick={() => setSubView('dms')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              subView === 'dms'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>2. ระบบ DMS Care Tools (กรมการแพทย์)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">กลุ่มเสี่ยง & Care Plan</span>
          </button>
        </div>
        <div className="text-xs text-slate-500 hidden md:block">
          ข้อมูลเชื่อมโยงปีงบประมาณ: <strong>{selectedYear}</strong>
        </div>
      </div>

      {subView === 'hdc9' ? (
        <>
          {/* Top KPI Cards for 9 Domains */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <KPICard
              title={`เป้าหมายคัดกรอง ${selectedYear}`}
              value="10.98M คน"
              subtitle="ผู้สูงอายุขึ้นทะเบียนในระบบ HDC"
              badge="ประชากร 60+"
              badgeColor="blue"
              icon={Activity}
              variant="navy"
            />
            <KPICard
              title="คัดกรองครบ 9 ด้าน"
              value="8,848,154 คน"
              subtitle="คิดเป็น 80.59% ของเป้าหมายรวม"
              badge="ทะลุเป้าหมาย (≥80%)"
              badgeColor="emerald"
              icon={CheckCheck}
            />
            <KPICard
              title="ความเสี่ยงอันดับ 1: สายตา"
              value="14.9%"
              subtitle="พบความเสี่ยง 1,372,196 คน"
              badge="ต้อกระจก/สายตาเลือนราง"
              badgeColor="rose"
              icon={Eye}
            />
            <KPICard
              title="ความเสี่ยงอันดับ 2: ช่องปาก"
              value="11.9%"
              subtitle="พบปัญหาฟัน/บดเคี้ยว 1,099,281 คน"
              badge="กระทบโภชนาการ"
              badgeColor="amber"
              icon={Stethoscope}
            />
            <KPICard
              title="ความเสี่ยงอันดับ 3: การเคลื่อนไหว"
              value="8.9%"
              subtitle="เสี่ยงต่อการหกล้ม 815,769 คน"
              badge="นำสู่อัมพฤกษ์/ติดเตียง"
              badgeColor="amber"
              icon={Activity}
            />
          </div>

          {/* 9 Domains Risk Prevalence Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: 9 Domains Ranking Bar Chart (7 cols) */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    ความชุกของความผิดปกติ/ภาวะเสี่ยง รายมิติการคัดกรอง 9 ด้าน
                  </h3>
                  <p className="text-xs text-slate-500">
                    ข้อมูลผู้สูงอายุที่ตรวจพบความเสี่ยง (% Risk Prevalence) ปีงบประมาณ {selectedYear}
                  </p>
                </div>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={national9Domains} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" unit="%" tick={{ fontSize: 11 }} domain={[0, 18]} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={155} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                      formatter={(val: any, name: any, item: any) => [
                        `${val}% (${item.payload.risk.toLocaleString()} คน)`,
                        'อัตราความเสี่ยง'
                      ]}
                    />
                    <Bar dataKey="riskPct" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                      {national9Domains.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: Quick Cards for 9 Domains (5 cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-1">สรุปสาระสำคัญผลการคัดกรอง 9 ด้าน</h3>
                <p className="text-xs text-slate-500 mb-3">สถิติระดับชาติจากระบบ HDC กระทรวงสาธารณสุข</p>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {national9Domains.map((d) => (
                    <div key={d.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                        <span className="font-medium text-slate-800">{d.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900">{d.riskPct}%</span>
                        <span className="text-[10px] text-slate-400 block">{(d.risk / 1000).toFixed(0)}k คน</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                💡 <strong>ข้อสังเกต:</strong> ปัญหาสายตาและช่องปากเป็น 2 ประเด็นที่มีจำนวนผู้สูงอายุเสี่ยงเกิน 1 ล้านคน ซึ่งเป็นต้นเหตุสำคัญที่นำไปสู่ภาวะพลัดตกหกล้มและการขาดสารอาหารในระยะยาว
              </div>
            </div>
          </div>

          {/* Zones Performance in 9 Domains */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  ร้อยละผลงานการคัดกรองผู้สูงอายุครบ 9 ด้าน รายเขตสุขภาพ (ปี {selectedYear})
                </h3>
                <p className="text-xs text-slate-500">เปรียบเทียบความครอบคลุมเทียบกับเป้าหมาย (เกณฑ์ผ่าน ≥ 80%)</p>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={zoneList} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis unit="%" tick={{ fontSize: 11 }} domain={[50, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                    formatter={(val: any, name: any, item: any) => [
                      `${val}% (${item.payload.คัดกรองครบ9ด้าน.toLocaleString()} / ${item.payload.เป้าหมาย.toLocaleString()} คน)`,
                      'ร้อยละผลงาน'
                    ]}
                  />
                  <Bar dataKey="ร้อยละผลงาน" fill="#059669" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : (
        /* DMS Care Tools View */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard
              title="กลุ่มเสี่ยงหกล้ม (Falls)"
              value={`${dmsSummary.fallsTreat.toLocaleString()} คน`}
              subtitle="ได้รับการแนะนำและรักษาในคลินิก"
              badge="การดูแลเบื้องต้น"
              badgeColor="blue"
              icon={Activity}
              variant="navy"
            />
            <KPICard
              title="ส่งต่อรักษาภาวะหกล้ม"
              value={`${dmsSummary.fallsRefer.toLocaleString()} คน`}
              subtitle="ส่งต่อแพทย์เฉพาะทาง/กายภาพ"
              badge="ความเสี่ยงสูง"
              badgeColor="rose"
              icon={ShieldAlert}
            />
            <KPICard
              title="จัดทำ Care Plan หกล้ม"
              value={`${dmsSummary.fallsCarePlan.toLocaleString()} ราย`}
              subtitle="วางแผนการดูแลรายบุคคลต่อเนื่อง"
              badge="Individual Care"
              badgeColor="emerald"
              icon={FileText}
            />
            <KPICard
              title="กลุ่มเสี่ยงสมองเสื่อม (AMT)"
              value={`${dmsSummary.demTreat.toLocaleString()} คน`}
              subtitle="คัดกรองและให้การฟื้นฟูความจำ"
              badge="Dementia Care"
              badgeColor="amber"
              icon={Sparkles}
            />
          </div>

          {/* DMS Care Tools Zone Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-800">
                ผลการคัดกรองกลุ่มเสี่ยงและการจัดทำ Care Plan รายเขตสุขภาพ (DMS Care Tools ปี {selectedYear})
              </h3>
              <p className="text-xs text-slate-500">
                สะท้อนการส่งต่อและการดูแลเฉพาะทางด้านการหกล้ม ภาวะสมองเสื่อม และสุขภาพช่องปาก
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100/80 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">เขตสุขภาพ</th>
                    <th className="py-3 px-3 text-right text-blue-900 bg-blue-50/50">หกล้ม: แนะนำ/รักษา</th>
                    <th className="py-3 px-3 text-right text-rose-700">หกล้ม: ส่งรักษาต่อ</th>
                    <th className="py-3 px-3 text-right font-bold text-emerald-700 bg-emerald-50/50">หกล้ม: จัดทำ Care Plan</th>
                    <th className="py-3 px-3 text-right">สมองเสื่อม: รักษา</th>
                    <th className="py-3 px-3 text-right">สมองเสื่อม: ส่งต่อ</th>
                    <th className="py-3 px-3 text-right">ช่องปาก: แนะนำ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dmsYearRisk.map((d, idx) => (
                    <tr key={`${d.zone}-${idx}`} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-4 font-bold text-slate-900">{d.zone}</td>
                      <td className="py-2.5 px-3 text-right font-medium bg-blue-50/30">
                        {d.falls_treat_person.toLocaleString()} คน
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-rose-600">
                        {d.falls_refer_person.toLocaleString()} คน
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-700 bg-emerald-50/30">
                        {d.falls_careplan_person.toLocaleString()} ราย
                      </td>
                      <td className="py-2.5 px-3 text-right">{d.dementia_treat_person.toLocaleString()} คน</td>
                      <td className="py-2.5 px-3 text-right text-slate-500">{d.dementia_refer_person.toLocaleString()} คน</td>
                      <td className="py-2.5 px-3 text-right">{d.oral_treat_person.toLocaleString()} คน</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3 Dedicated Data Sources & Important Notes */}
      <TabSourceReference
        tabTitle="แท็บที่ 3: ข้อมูลสุขภาพและการคัดกรอง (Elderly Health Screening & ICOPE)"
        accentColor="purple"
        lastUpdated="ปีงบประมาณ 2567–2569"
        sources={[
          {
            title: 'ระบบคลังข้อมูลด้านการแพทย์และสุขภาพ (HDC) & Blue Book Application',
            dept: 'กรมอนามัย และ สำนักงานปลัดกระทรวงสาธารณสุข',
            url: 'https://bluebook.anamai.moph.go.th',
            displayUrl: 'bluebook.anamai.moph.go.th / hdcservice.moph.go.th',
            badge: 'ผลการคัดกรองสุขภาพ 9 ด้าน (ICOPE)',
            badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
            description: 'ฐานข้อมูลผลการคัดกรองสุขภาพผู้สูงอายุ 9 ด้านตามแนวทาง WHO ICOPE และการประเมินความสามารถในการดำเนินชีวิตประจำวัน (Barthel ADL Index)',
            fileName: '1. hdc_elderly_screening_9domains.xlsx'
          },
          {
            title: 'ระบบสารสนเทศการดูแลสุขภาพผู้สูงอายุ (DMS Care Tools)',
            dept: 'สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์',
            url: 'https://dmscaretools.dms.go.th',
            displayUrl: 'dmscaretools.dms.go.th',
            badge: 'การบำบัดรักษา & Care Plan ใน รพ.',
            badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            description: 'ระบบบันทึกการคัดกรองความเสี่ยงเชิงลึกในโรงพยาบาล (การหกล้ม, สมองเสื่อม, สุขภาพช่องปาก) และการวางแผนดูแลรายบุคคล (Care Plan)',
            fileName: '2. geriatric_data_report_2567-2569.xlsx'
          }
        ]}
        notes={[
          {
            id: 't3-scope9',
            title: '1. กรอบการคัดกรอง 9 ด้าน (WHO ICOPE Framework)',
            content: 'ประกอบด้วย 1. การมองเห็น, 2. สุขภาพช่องปาก, 3. การเคลื่อนไหวร่างกาย, 4. กิจวัตรประจำวัน (ADL), 5. การได้ยิน, 6. ความคิดความจำ, 7. การกลั้นปัสสาวะ, 8. ภาวะโภชนาการ, 9. ภาวะซึมเศร้า (2Q) คัดกรองโดยเจ้าหน้าที่สาธารณสุขและ อสม.'
          },
          {
            id: 't3-adl',
            title: '2. เกณฑ์การจำแนกกลุ่มตาม Barthel ADL Index',
            content: 'ติดสังคม (Socially Active: 12-20 คะแนน ดูแลตนเองได้ดี), ติดบ้าน (Homebound: 5-11 คะแนน ช่วยเหลือตนเองได้ปานกลาง ต้องมีผู้ดูแลช่วยเหลือ), ติดเตียง (Bedbound: 0-4 คะแนน พึ่งพิงผู้อื่นทั้งหมด)'
          },
          {
            id: 't3-dms-nature',
            title: '3. ลักษณะข้อมูลระบบ DMS Care Tools',
            content: 'เป็นข้อมูลระดับทุติยภูมิและตติยภูมิในโรงพยาบาลที่ดำเนินการคลินิกผู้สูงอายุ มีการตรวจประเมินเฉพาะทาง (Comprehensive Geriatric Assessment) และจัดทำแผนการดูแลเฉพาะบุคคล (Care Plan) จึงพบสัดส่วนความเสี่ยงสูงกว่าระดับชุมชน'
          },
          {
            id: 't3-round',
            title: '4. รอบการประมวลผลข้อมูล',
            content: 'รายงานผลสะสมตามปีงบประมาณ โดยปี 2569 แสดงข้อมูลสะสมถึงไตรมาสล่าสุดของปีงบประมาณ'
          }
        ]}
      />
    </div>
  );
};
