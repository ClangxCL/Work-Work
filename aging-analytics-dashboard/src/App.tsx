import React, { useState } from 'react';
import rawData from './data/dashboardData.json';
import { DashboardRootData } from './types';
import { Header } from './components/Header';
import CursorSnap from './components/CursorSnap';
import { Tab2Population } from './components/tabs/Tab2Population';
import { Tab3Screening } from './components/tabs/Tab3Screening';
import { Tab4Morbidity } from './components/tabs/Tab4Morbidity';
import { Tab1Clinic } from './components/tabs/Tab1Clinic';
import { Database, Layers } from 'lucide-react';

const data = rawData as unknown as DashboardRootData;

export function App() {
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['1', '2', '3', '4', '5'].includes(tabParam)) {
        return parseInt(tabParam, 10);
      }
    }
    return 1;
  };

  const [activeTab, setActiveTabState] = useState<number>(getInitialTab);
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('2569');

  const setActiveTab = (tab: number) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab.toString());
      window.history.pushState({}, '', url.toString());
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#17191c]" style={{ overflowX: 'clip' }}>
      {/* Snap Highlight Custom Cursor */}
      <CursorSnap />

      {/* Global Navigation Header (Full-Bleed Banner + 1200px Pill Tabs) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedZone={selectedZone}
        setSelectedZone={setSelectedZone}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

      {/* Main Content Container: full-width page-shell (max-width: 2200px, padding-inline: clamp(16px, 3vw, 64px)) */}
      <main className="page-shell flex-1 py-10 my-4">
        {/* Tab 1: ความเสี่ยงต่อปัญหาสุขภาพ ผู้สูงอายุ 9 ด้าน */}
        {activeTab === 1 && (
          <Tab3Screening
            screeningByYear={data.screening_9domains}
            selectedZone={selectedZone}
            selectedYear={selectedYear}
          />
        )}

        {/* Tab 2: สถิติสาเหตุการป่วยและสาเหตุการตาย (OPD, IPD, 10 โรคเรื้อรัง, สาเหตุการเสียชีวิต ICD-10) */}
        {activeTab === 2 && (
          <Tab4Morbidity
            chronicTop10={data.illness.chronic_top10_elderly}
            opdByYear={data.illness.opd_by_year}
            ipdByYear={data.illness.ipd_by_year}
            deathCauses={data.death.top10_causes}
            deathGender={data.death.gender_comparison}
            selectedYear={selectedYear}
          />
        )}

        {/* Tab 3: ข้อมูลคลินิกผู้สูงอายุ พร้อมแสดงจำนวนเป้าหมาย รพ. 937 แห่ง */}
        {activeTab === 3 && (
          <Tab1Clinic
            zonesData={data.clinic.by_zone}
            provincesData={data.clinic.by_province}
            selectedZone={selectedZone}
          />
        )}

        {/* Fallback Tab 4: ข้อมูลประชากร/แนวโน้ม ผส. (Preserved) */}
        {activeTab === 4 && (
          <Tab2Population
            summaryZones={data.population.summary_zones}
            byYearZones={data.population.by_year_zones}
            byProvinceYears={data.population.by_province_years}
            projections={data.population.projections}
            selectedZone={selectedZone}
            selectedYear={selectedYear}
          />
        )}
      </main>

      {/* Footer: Steep editorial styling */}
      <footer className="bg-[#fafafb] border-t border-[#ececec] text-[#5f6370] text-sm py-8 mt-20">
        <div className="page-shell space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-[#17191c] shrink-0" />
              <span>
                <strong className="text-[#17191c] font-medium">แหล่งข้อมูล:</strong> ระบบคลังข้อมูลด้านการแพทย์และสุขภาพ (HDC) กระทรวงสาธารณสุข & กรมการแพทย์
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[#5f6370] shrink-0 tabular-nums">
              <Layers className="w-3.5 h-3.5 text-[#17191c]" />
              <span>ปีงบประมาณ 2566 – 2569</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#ececec] flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-[#6b6f7a]">
            <div>
              <span>รวบรวม วิเคราะห์ และประมวลผลโดย </span>
              <strong className="text-[#17191c] font-medium">กลุ่มงานสารสนเทศระบบสุขภาพด้านผู้สูงอายุ</strong>{' '}
              <span>สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์ กระทรวงสาธารณสุข</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
