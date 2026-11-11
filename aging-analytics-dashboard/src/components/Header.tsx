import React, { useRef, useEffect } from 'react';
import { formatThaiText } from '../utils/thaiTypography';

interface HeaderProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  selectedZone?: string;
  setSelectedZone?: (zone: string) => void;
  selectedYear?: string;
  setSelectedYear?: (year: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    {
      id: 1,
      name: 'ความเสี่ยงต่อปัญหาสุขภาพ ผู้สูงอายุ 9 ด้าน',
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

  const mobileTabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeBtn = mobileTabRefs.current[activeTab - 1];
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeTab]);

  return (
    <header className="w-full bg-white text-[#17191c]">
      {/* 1) Hero banner: Outside any max-width container, full-bleed 100% width, no crop */}
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

      {/* 2) Sticky Navigation Tabs Header (Neumorphism Style) */}
      <div className="sticky top-0 z-40 w-full main-tabs-bar">
        <div className="page-shell m-0 p-0 max-w-full">
          <nav
            className="main-tabs-nav"
            role="tablist"
            aria-label="Tabs"
          >
            {tabs.map((tab, idx) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={el => { mobileTabRefs.current[idx] = el; }}
                  role="tab"
                  id={`main-tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`main-tabpanel-${tab.id}`}
                  tabIndex={0}
                  onClick={() => setActiveTab(tab.id)}
                  className={`main-tab ${isActive ? 'is-active' : ''}`}
                >
                  <span className="main-tab-text">
                    {formatThaiText(tab.name)}
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
