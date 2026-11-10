import React from 'react';

interface HeaderProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  selectedZone?: string;
  setSelectedZone?: (zone: string) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedYear,
  setSelectedYear
}) => {
  // 3 Tabs as requested:
  // 1: การคัดกรองผู้สูงอายุ 9 ด้าน / (Basic/Community Screen)
  // 2: สถิติสาเหตุการป่วยและสาเหตุการตาย
  // 3: ข้อมูลคลินิกผู้สูงอายุ
  const tabs = [
    {
      id: 1,
      name: 'การคัดกรองผู้สูงอายุ 9 ด้าน',
      subname: '(Basic/Community Screen)',
    },
    {
      id: 2,
      name: 'สถิติสาเหตุการป่วยและสาเหตุการตาย',
    },
    {
      id: 3,
      name: 'ข้อมูลคลินิกผู้สูงอายุ',
    },
  ];

  return (
    <header className="w-full bg-white text-[#17191c]">
      {/* 1) Hero banner: Outside any max-width container, full-bleed 100% width */}
      <div className="w-full m-0 p-0 overflow-hidden leading-none block border-0 bg-white">
        <img
          src={`${import.meta.env.BASE_URL}images/banner-1440x480.webp`}
          alt="Thailand Elderly Health Situation Dashboard"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="w-full h-auto block select-none border-0 m-0 p-0"
          style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '3 / 1', objectFit: 'contain' }}
        />
      </div>

      {/* 2) Navigation Tabs & Year Selector: No colored bar, full width page-shell */}
      <div className="w-full bg-white border-b border-[#ececec]">
        <div className="page-shell py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 w-full">
            {/* 3 Tabs using flex: 1, dividing equally with pill shape */}
            <nav
              className="flex items-center gap-2 overflow-x-auto sm:overflow-visible scroll-smooth snap-x snap-mandatory scrollbar-none flex-1 min-w-0"
              aria-label="Tabs"
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[210px] sm:min-w-0 snap-start px-5 py-2.5 sm:py-3 rounded-full transition-all text-center flex flex-col items-center justify-center min-h-[48px] ${
                      isActive
                        ? 'bg-[#17191c] text-white shadow-none font-medium'
                        : 'bg-transparent border border-[#ececec] text-[#17191c] hover:bg-[#fafafb] font-medium'
                    }`}
                  >
                    <span
                      className="text-sm sm:text-base font-medium leading-[1.4] break-words"
                      style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}
                    >
                      {tab.name}
                    </span>
                    {tab.subname && (
                      <span
                        className={`text-xs sm:text-sm font-normal leading-[1.3] mt-0.5 block ${
                          isActive ? 'text-white/80' : 'text-[#5f6370]'
                        }`}
                      >
                        {tab.subname}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Year Selector: Far right on desktop, drops to new row if < 1024px */}
            <div className="flex items-center justify-end shrink-0 pt-1 lg:pt-0">
              <div className="flex items-center bg-white border border-[#ececec] rounded-[16px] px-4 py-2 text-sm text-[#17191c] min-h-[44px]">
                <span className="text-[#5f6370] mr-2 whitespace-nowrap font-medium">ปีงบประมาณ:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-transparent text-[#17191c] font-medium focus:outline-none cursor-pointer tabular-nums text-sm"
                >
                  <option value="2569">2569 (ล่าสุด)</option>
                  <option value="2568">2568</option>
                  <option value="2567">2567</option>
                  <option value="2566">2566</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
