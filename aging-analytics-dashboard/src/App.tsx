import React, { useState } from 'react';
import rawData from './data/dashboardData.json';
import { DashboardRootData } from './types';
import { Header } from './components/Header';
import { Tab1Clinic } from './components/tabs/Tab1Clinic';
import { Tab2Population } from './components/tabs/Tab2Population';
import { Tab3Screening } from './components/tabs/Tab3Screening';
import { Tab4Morbidity } from './components/tabs/Tab4Morbidity';
import { ExternalLink, Database, Info, Layers } from 'lucide-react';

const data = rawData as unknown as DashboardRootData;

export function App() {
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['1', '2', '3', '4'].includes(tabParam)) {
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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Global Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedZone={selectedZone}
        setSelectedZone={setSelectedZone}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 1 && (
          <Tab1Clinic
            zonesData={data.clinic.by_zone}
            provincesData={data.clinic.by_province}
            selectedZone={selectedZone}
          />
        )}

        {activeTab === 2 && (
          <Tab2Population
            summaryZones={data.population.summary_zones}
            byYearZones={data.population.by_year_zones}
            byProvinceYears={data.population.by_province_years}
            projections={data.population.projections}
            selectedZone={selectedZone}
            selectedYear={selectedYear}
          />
        )}

        {activeTab === 3 && (
          <Tab3Screening
            screeningByYear={data.screening_9domains}
            dmsRiskData={data.dms_care_tools.risk_by_zone}
            dmsTotalData={data.dms_care_tools.totals_by_zone}
            selectedZone={selectedZone}
            selectedYear={selectedYear}
          />
        )}

        {activeTab === 4 && (
          <Tab4Morbidity
            ncdData={data.ncd}
            chronicTop10={data.illness.chronic_top10_elderly}
            opdByYear={data.illness.opd_by_year}
            ipdByYear={data.illness.ipd_by_year}
            deathCauses={data.death.top10_causes}
            deathGender={data.death.gender_comparison}
            selectedYear={selectedYear}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-center md:text-left">
            <Database className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>แหล่งข้อมูล:</strong> ระบบคลังข้อมูลด้านการแพทย์และสุขภาพ (HDC) กระทรวงสาธารณสุข & ระบบ DMS Care Tools กรมการแพทย์
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Layers className="w-3.5 h-3.5 text-blue-400" /> ปีงบประมาณ 2566 – 2569
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
