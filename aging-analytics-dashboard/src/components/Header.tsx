import React from 'react';
import { Hospital, Users, Activity, HeartPulse, Building2, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  selectedZone: string;
  setSelectedZone: (zone: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedZone,
  setSelectedZone,
  selectedYear,
  setSelectedYear
}) => {
  const tabs = [
    { id: 1, name: 'คลินิกผู้สูงอายุ', subtitle: 'มาตรฐานและศักยภาพ รพ.', icon: Hospital, count: '913 แห่ง' },
    { id: 2, name: 'ข้อมูลประชากร', subtitle: 'แนวโน้ม 2566–2569 & โครงสร้างอายุ', icon: Users, count: '10.9M คน' },
    { id: 3, name: 'การคัดกรองสุขภาพ', subtitle: '9 ด้าน (HDC) & DMS Care Tools', icon: Activity, count: '8.8M ราย' },
    { id: 4, name: 'โรคและสาเหตุการตาย', subtitle: 'NCDs, 10 อันดับป่วย & มรณกรรม', icon: HeartPulse, count: 'Top 10' },
  ];

  const zones = [
    { code: 'ALL', name: 'ทุกเขตสุขภาพ (ภาพรวมประเทศ)' },
    { code: '01', name: 'เขตสุขภาพที่ 1 (เชียงใหม่ ลำปาง ฯลฯ)' },
    { code: '02', name: 'เขตสุขภาพที่ 2 (พิษณุโลก สุโขทัย ฯลฯ)' },
    { code: '03', name: 'เขตสุขภาพที่ 3 (นครสวรรค์ พิจิตร ฯลฯ)' },
    { code: '04', name: 'เขตสุขภาพที่ 4 (นนทบุรี สระบุรี ฯลฯ)' },
    { code: '05', name: 'เขตสุขภาพที่ 5 (ราชบุรี เพชรบุรี ฯลฯ)' },
    { code: '06', name: 'เขตสุขภาพที่ 6 (ชลบุรี ระยอง ฯลฯ)' },
    { code: '07', name: 'เขตสุขภาพที่ 7 (ขอนแก่น ร้อยเอ็ด ฯลฯ)' },
    { code: '08', name: 'เขตสุขภาพที่ 8 (อุดรธานี สกลนคร ฯลฯ)' },
    { code: '09', name: 'เขตสุขภาพที่ 9 (นครราชสีมา บุรีรัมย์ ฯลฯ)' },
    { code: '10', name: 'เขตสุขภาพที่ 10 (อุบลราชธานี ศรีสะเกษ ฯลฯ)' },
    { code: '11', name: 'เขตสุขภาพที่ 11 (สุราษฎร์ธานี ภูเก็ต ฯลฯ)' },
    { code: '12', name: 'เขตสุขภาพที่ 12 (สงขลา ตรัง ฯลฯ)' },
    { code: '13', name: 'เขตสุขภาพที่ 13 (กรุงเทพมหานคร)' },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      {/* Top Bar: Institute Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 inline" /> สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ
                </span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-slate-400 text-xs">กรมการแพทย์ กระทรวงสาธารณสุข</span>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white flex flex-wrap items-center gap-2 mt-0.5">
                <span>Thailand Elderly Health Situation Dashboard</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-normal border border-blue-500/30">
                  HDC 2566–2569
                </span>
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-0.5">
                แดชบอร์ดสถานการณ์สุขภาพผู้สูงอายุไทย
              </p>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center space-x-2 self-start md:self-auto">
            <div className="flex items-center bg-slate-800/90 rounded-xl border border-slate-700/80 px-2.5 py-1 text-xs">
              <span className="text-slate-400 mr-2 font-medium">ปีงบประมาณ:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="2569" className="bg-slate-900 text-white">2569 (ล่าสุด)</option>
                <option value="2568" className="bg-slate-900 text-white">2568</option>
                <option value="2567" className="bg-slate-900 text-white">2567</option>
                <option value="2566" className="bg-slate-900 text-white">2566</option>
              </select>
            </div>

            <div className="flex items-center bg-slate-800/90 rounded-xl border border-slate-700/80 px-2.5 py-1 text-xs">
              <span className="text-slate-400 mr-2 font-medium">พื้นที่:</span>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer max-w-[170px] truncate"
              >
                {zones.map(z => (
                  <option key={z.code} value={z.code} className="bg-slate-900 text-white">
                    {z.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-t border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <div className="leading-tight">{tab.name}</div>
                    <div className={`text-[10px] hidden sm:block font-normal ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                      {tab.subtitle}
                    </div>
                  </div>
                  <span
                    className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
