import React, { useState, useMemo } from 'react';
import { NcdItem, ChronicTop10, PatientCauseItem, DeathCauseItem, DeathGenderItem } from '../../types';
import { KPICard } from '../KPICard';
import { TabSourceReference } from '../TabSourceReference';
import { HeartPulse, Activity, AlertOctagon, Skull, FileSpreadsheet, TrendingUp, Users } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface Tab4MorbidityProps {
  ncdData: NcdItem[];
  chronicTop10: ChronicTop10[];
  opdByYear: Record<string, PatientCauseItem[]>;
  ipdByYear: Record<string, PatientCauseItem[]>;
  deathCauses: DeathCauseItem[];
  deathGender: DeathGenderItem[];
  selectedYear: string;
}

export const Tab4Morbidity: React.FC<Tab4MorbidityProps> = ({
  ncdData,
  chronicTop10,
  opdByYear,
  ipdByYear,
  deathCauses,
  deathGender,
  selectedYear
}) => {
  const [activeSection, setActiveSection] = useState<'ncd' | 'illness' | 'mortality'>('ncd');

  // NCD Chart Data (Trends 2566 to 2569)
  const ncdChartData = useMemo(() => {
    return [
      { year: '2566', ความดันโลหิตสูง: 4615969, เบาหวาน: 2144438, โรคไตเรื้อรัง: 754000, สโตรก: 247170, หัวใจขาดเลือด: 193527, ปอดอุดกั้น: 165000, มะเร็ง: 148000 },
      { year: '2567', ความดันโลหิตสูง: 4980000, เบาหวาน: 2360000, โรคไตเรื้อรัง: 820000, สโตรก: 272000, หัวใจขาดเลือด: 215000, ปอดอุดกั้น: 178000, มะเร็ง: 160000 },
      { year: '2568', ความดันโลหิตสูง: 5350000, เบาหวาน: 2580000, โรคไตเรื้อรัง: 890000, สโตรก: 298000, หัวใจขาดเลือด: 238000, ปอดอุดกั้น: 193000, มะเร็ง: 173000 },
      { year: '2569', ความดันโลหิตสูง: 5720000, เบาหวาน: 2810000, โรคไตเรื้อรัง: 970000, สโตรก: 325000, หัวใจขาดเลือด: 262000, ปอดอุดกั้น: 210000, มะเร็ง: 188000 },
    ];
  }, []);

  // OPD & IPD Data for selected year
  const currentOpd = useMemo(() => {
    return opdByYear[selectedYear] || opdByYear['2569'] || [];
  }, [opdByYear, selectedYear]);

  const currentIpd = useMemo(() => {
    return ipdByYear[selectedYear] || ipdByYear['2569'] || [];
  }, [ipdByYear, selectedYear]);

  // Mortality Chart Data
  const mortalityChartData = useMemo(() => {
    const yearKey = `y${selectedYear}` as keyof DeathCauseItem;
    return deathCauses.map(d => ({
      name: d.cause,
      icd: d.icd,
      deaths: (d[yearKey] as number) || d.y2569,
      ratio: d.ratio_pct
    }));
  }, [deathCauses, selectedYear]);

  return (
    <div className="space-y-6">
      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="ผู้สูงอายุป่วย NCDs รวม"
          value="8.90 ล้านคน"
          subtitle="ปี 2569 คิดเป็น ~75% ของผู้สูงอายุ"
          badge="+1.5M ใน 4 ปี"
          badgeColor="rose"
          icon={HeartPulse}
          variant="navy"
        />
        <KPICard
          title="อันดับ 1 NCDs: ความดัน"
          value="5,720,000 คน"
          subtitle="ผู้สูงอายุมากกว่า 52% ป่วยเป็นโรคนี้"
          badge="อันดับ 1 OPD"
          badgeColor="rose"
          icon={Activity}
        />
        <KPICard
          title="อันดับ 2 NCDs: เบาหวาน"
          value="2,810,000 คน"
          subtitle="กว่า 65% พบร่วมกับความดันโลหิตสูง"
          badge="เสี่ยงไตวาย/ตาเสื่อม"
          badgeColor="amber"
          icon={AlertOctagon}
        />
        <KPICard
          title="สาเหตุการตายอันดับ 1: มะเร็ง"
          value="68,500 ราย/ปี"
          subtitle="คิดเป็น 14.7% ของการเสียชีวิตรวม"
          badge="ตับ ปอด ลำไส้"
          badgeColor="rose"
          icon={Skull}
        />
        <KPICard
          title="สาเหตุครอง รพ. IPD: ปอดบวม"
          value="437,946 ครั้ง"
          subtitle="อันดับ 1 การนอนโรงพยาบาล"
          badge="ภัยเงียบติดเชื้อ"
          badgeColor="amber"
          icon={Activity}
        />
      </div>

      {/* View Switcher */}
      <div className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveSection('ncd')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSection === 'ncd'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>1. สถิติโรค NCDs (2566–2569)</span>
          </button>
          <button
            onClick={() => setActiveSection('illness')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSection === 'illness'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>2. 10 อันดับการป่วย (OPD / IPD)</span>
          </button>
          <button
            onClick={() => setActiveSection('mortality')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSection === 'mortality'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Skull className="w-4 h-4" />
            <span>3. 10 อันดับสาเหตุการเสียชีวิต</span>
          </button>
        </div>
        <div className="text-xs text-slate-500 hidden md:block">
          ข้อมูลแสดงสำหรับปี: <strong>{selectedYear}</strong>
        </div>
      </div>

      {/* Section 1: NCDs */}
      {activeSection === 'ncd' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: NCD Multi-Line Chart (8 cols) */}
            <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    แนวโน้มการเพิ่มขึ้นของผู้สูงอายุป่วยโรคไม่ติดต่อเรื้อรัง (NCDs)
                  </h3>
                  <p className="text-xs text-slate-500">ปี พ.ศ. 2566 – 2569 (จำนวนผู้ป่วยสะสมรายโรค)</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                  CAGR +7.0% ถึง +9.0%
                </span>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ncdChartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                      formatter={(val: any, name: any) => [`${Number(val).toLocaleString()} คน`, name]}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="ความดันโลหิตสูง" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} isAnimationActive={false} />
                    <Line type="monotone" dataKey="เบาหวาน" stroke="#f97316" strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
                    <Line type="monotone" dataKey="โรคไตเรื้อรัง" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
                    <Line type="monotone" dataKey="สโตรก" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
                    <Line type="monotone" dataKey="หัวใจขาดเลือด" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: NCD Summary Table (4 cols) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-1">สถิติผู้ป่วย NCDs รายโรค</h3>
                <p className="text-xs text-slate-500 mb-3">ปี 2566 เปรียบเทียบปี 2569</p>

                <div className="space-y-2.5">
                  {ncdData.slice(0, 6).map(n => {
                    const growth = (((n.y2569 - n.y2566) / n.y2566) * 100).toFixed(1);
                    return (
                      <div key={n.disease} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                          <span>{n.disease}</span>
                          <span className="text-rose-600">+{growth}%</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 text-[11px]">
                          <span>ปี 66: {(n.y2566 / 1000).toFixed(0)}k</span>
                          <span className="font-bold text-slate-900">ปี 69: {(n.y2569 / 1000000).toFixed(2)}M คน</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                📌 <strong>ที่มาการคาดการณ์:</strong> อ้างอิง สศช., การสำรวจสุขภาพ NHES ครั้งที่ 5 และ 6, ฐาน HDC สธ. และแผนปฏิบัติการ NCDs 2566–2570
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Top 10 Illnesses (OPD & IPD) */}
      {activeSection === 'illness' && (
        <div className="space-y-6">
          {/* Top 10 Chronic Diseases Card Grid */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-1">
              10 อันดับโรคเรื้อรังและปัญหาสุขภาพสำคัญเฉพาะผู้สูงอายุ 60 ปีขึ้นไป
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              สรุปอัตราความชุก (%) ลักษณะอาการและความสำคัญทางการแพทย์ (มส.ผส. และ สธ.)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {chronicTop10.map(c => (
                <div key={c.rank} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                        {c.rank}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border">
                        {c.icd}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs mb-1 line-clamp-1">{c.disease}</div>
                    <div className="text-[11px] font-bold text-rose-600 mb-1.5">ความชุก {c.prevalence}</div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{c.clinical_significance}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OPD vs IPD Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: OPD Top 10 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-blue-50/50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    สาเหตุการป่วยผู้ป่วยนอก (OPD) 10 อันดับแรก ปี {selectedYear}
                  </h4>
                  <p className="text-[11px] text-slate-500">จำแนกตามจำนวนครั้งที่มารับบริการ (HDC)</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold">OPD Visits</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">อันดับ</th>
                      <th className="py-2.5 px-3">กลุ่มโรค (ICD-10)</th>
                      <th className="py-2.5 px-3 text-right">จำนวนรวม (ครั้ง)</th>
                      <th className="py-2.5 px-3 text-right">สัดส่วน (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentOpd.map(item => (
                      <tr key={`opd-${item.rank}`} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-700">{item.rank}</td>
                        <td className="py-2 px-3">
                          <div className="font-semibold text-slate-900">{item.disease_th}</div>
                          <div className="text-[10px] font-mono text-slate-400">{item.icd}</div>
                        </td>
                        <td className="py-2 px-3 text-right font-medium text-slate-800">
                          {item.total.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-blue-600">{item.pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: IPD Top 10 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-rose-50/50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    สาเหตุการป่วยผู้ป่วยใน (IPD) 10 อันดับแรก ปี {selectedYear}
                  </h4>
                  <p className="text-[11px] text-slate-500">จำแนกตามจำนวนครั้งที่นอนโรงพยาบาล (HDC)</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-bold">IPD Admissions</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">อันดับ</th>
                      <th className="py-2.5 px-3">กลุ่มโรค (ICD-10)</th>
                      <th className="py-2.5 px-3 text-right">จำนวนรวม (ครั้ง)</th>
                      <th className="py-2.5 px-3 text-right">สัดส่วน (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentIpd.map(item => (
                      <tr key={`ipd-${item.rank}`} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-700">{item.rank}</td>
                        <td className="py-2 px-3">
                          <div className="font-semibold text-slate-900">{item.disease_th}</div>
                          <div className="text-[10px] font-mono text-slate-400">{item.icd}</div>
                        </td>
                        <td className="py-2 px-3 text-right font-medium text-slate-800">
                          {item.total.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-rose-600">{item.pct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: 10 Mortality Causes */}
      {activeSection === 'mortality' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Mortality Bar Chart (7 cols) */}
            <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    10 อันดับสาเหตุการเสียชีวิตของประชากรสูงอายุไทย (ปี {selectedYear})
                  </h3>
                  <p className="text-xs text-slate-500">จำนวนผู้เสียชีวิต (คน/ปี) และสัดส่วนต่อการตายรวม</p>
                </div>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mortalityChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={160} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                      formatter={(val: any, name: any, item: any) => [
                        `${Number(val).toLocaleString()} ราย (${item.payload.ratio}% ของการตายรวม)`,
                        'จำนวนผู้เสียชีวิต'
                      ]}
                    />
                    <Bar dataKey="deaths" fill="#e11d48" radius={[0, 6, 6, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: Gender Differences in Mortality (5 cols) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  เปรียบเทียบสาเหตุการตาย: เพศชาย vs เพศหญิง
                </h3>
                <p className="text-xs text-slate-500 mb-3">วิเคราะห์ความแตกต่างทางระบาดวิทยาและพฤติกรรมสุขภาพ</p>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {deathGender.map(g => (
                    <div key={g.cause} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                        <span>{g.cause}</span>
                        <span className="text-[11px] text-slate-500">
                          ชาย <strong className="text-blue-600">{g.male_pct}</strong> | หญิง <strong className="text-pink-600">{g.female_pct}</strong>
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed mb-0.5">{g.epi_diff}</p>
                      <span className="text-[10px] text-slate-400 italic">ปัจจัย: {g.behavior_factors}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                📌 <strong>จุดเน้น:</strong> เพศชายมีอัตราตายจากโรคมะเร็งและอุบัติเหตุสูงกว่าเพศหญิงอย่างชัดเจน ขณะที่เพศหญิงมีอายุขัยยืนยาวกว่า จึงพบอัตราการตายจากสโตรกและไตวายในวัยปลายสูงกว่า
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4 Dedicated Data Sources & Important Notes */}
      <TabSourceReference
        tabTitle="แท็บที่ 4: โรคและสาเหตุการป่วยและตาย (Morbidity & Mortality Statistics)"
        accentColor="rose"
        lastUpdated="ปีงบประมาณ 2566–2569"
        sources={[
          {
            title: 'ระบบคลังข้อมูลด้านการแพทย์และสุขภาพ (HDC) แฟ้ม Chronic, OPD, IPD',
            dept: 'สำนักงานปลัดกระทรวงสาธารณสุข (สป.สธ.)',
            url: 'https://hdcservice.moph.go.th',
            displayUrl: 'hdcservice.moph.go.th',
            badge: 'สถิติ NCDs, ผู้ป่วยนอก (OPD) & ผู้ป่วยใน (IPD)',
            badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
            description: 'สถิติการวินิจฉัยโรคไม่ติดต่อเรื้อรัง (ความดันโลหิตสูง, เบาหวาน, ไตวายเรื้อรัง, หลอดเลือดสมอง, หลอดเลือดหัวใจ) และ 10 อันดับโรคที่มารับบริการในสถานพยาบาล',
            fileName: '3. สถิติผู้สูงอายุ_NCDs_2566-2569.xlsx & 4. สถิติสาเหตุการป่วย_10อันดับแรก_2566-2569.xlsx'
          },
          {
            title: 'กองโรคไม่ติดต่อ กรมควบคุมโรค',
            dept: 'กระทรวงสาธารณสุข',
            url: 'https://ddc.moph.go.th',
            displayUrl: 'ddc.moph.go.th',
            badge: 'รายงานสถานการณ์ NCDs',
            badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
            description: 'องค์ความรู้ สถิติการเฝ้าระวังพฤติกรรมเสี่ยง และแนวทางการควบคุมป้องกันโรคไม่ติดต่อเรื้อรังในประชากรสูงอายุไทย'
          },
          {
            title: 'กองยุทธศาสตร์และแผนงาน สป.สธ. & สำนักบริหารการทะเบียน กรมการปกครอง',
            dept: 'กระทรวงสาธารณสุข & กระทรวงมหาดไทย',
            url: 'https://spd.moph.go.th',
            displayUrl: 'spd.moph.go.th',
            badge: 'สถิติสาเหตุการตาย (Vital Statistics)',
            badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
            description: 'สถิติสาเหตุการตายของประชากรไทย อ้างอิงจากใบมรณบัตร (Death Certificate) ผ่านการตรวจประมวลรหัสสาเหตุการตายสากล ICD-10',
            fileName: '5. สถิติสาเหตุการตายในผู้สูงอายุ.xlsx'
          }
        ]}
        notes={[
          {
            id: 't4-icd10',
            title: '1. การจำแนกโรคตามมาตรฐานสากล ICD-10',
            content: 'ใช้รหัส ICD-10 สากล ได้แก่ โรคความดันโลหิตสูง (I10-I15), โรคเบาหวาน (E10-E14), โรคไตเรื้อรัง (N18), โรคหลอดเลือดสมอง (I60-I69), โรคหัวใจขาดเลือด (I20-I25), โรคปอดอุดกั้นเรื้อรัง (J44)'
          },
          {
            id: 't4-opd-ipd',
            title: '2. ความแตกต่างระหว่างหน่วยนับผู้ป่วยนอก (OPD) และผู้ป่วยใน (IPD)',
            content: 'ผู้ป่วยนอก (OPD) นับเป็น "จำนวนครั้งการรับบริการ (Visits)" ซึ่งผู้ป่วย 1 คนอาจรับบริการหลายครั้งในรอบปี ส่วนผู้ป่วยใน (IPD) นับเป็น "จำนวนครั้งการนอนโรงพยาบาล (Admissions)"'
          },
          {
            id: 't4-mortality-gender',
            title: '3. ข้อสังเกตความแตกต่างตามเพศในสาเหตุการตาย',
            content: 'เพศชายมีอัตราการเสียชีวิตจากโรคมะเร็งปอด โรคมะเร็งตับ และโรคปอดอุดกั้นเรื้อรังสูงกว่าเพศหญิงอย่างชัดเจน มีความสัมพันธ์กับประวัติการสูบบุหรี่และดื่มแอลกอฮอล์ ขณะที่เพศหญิงมีสัดส่วนการตายจากโรคหลอดเลือดสมองและไตวายในวัยปลายสูงกว่า สัมพันธ์กับอายุขัยเฉลี่ยที่ยืนยาวกว่า'
          },
          {
            id: 't4-multimorbidity',
            title: '4. ภาวะพหุพยาธิสภาพ (Multimorbidity)',
            content: 'ผู้สูงอายุไทยส่วนใหญ่ (กว่า 68%) มีโรคประจำตัวเรื้อรังมากกว่า 1 โรคขึ้นไป โดยคู่โรคที่พบบ่อยที่สุดคือ โรคความดันโลหิตสูงร่วมกับโรคเบาหวาน'
          }
        ]}
      />
    </div>
  );
};
