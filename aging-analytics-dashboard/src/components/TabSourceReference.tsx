import React from 'react';
import { BookOpen } from 'lucide-react';

export interface TabSourceItem {
  title: string;
  dept: string;
  url?: string;
  displayUrl?: string;
  badge?: string;
  badgeColor?: string;
  description?: string;
  fileName?: string;
}

export interface TabNoteItem {
  id?: string;
  title: string;
  content: string;
  highlight?: string;
}

export interface TabSourceReferenceProps {
  tabTitle?: string;
  sources: TabSourceItem[];
  notes?: TabNoteItem[];
  lastUpdated?: string;
  accentColor?: string;
}

export const TabSourceReference: React.FC<TabSourceReferenceProps> = ({
  sources,
  lastUpdated = 'ปีงบประมาณ 2566–2569'
}) => {
  return (
    <div className="mt-12 pt-6 border-t border-[#ececec] text-sm text-[#5f6370] leading-[1.7] space-y-3">
      {/* แหล่งข้อมูลอ้างอิง (รายงานวิชาการแบบไม่มีลิงก์และไม่มีวงเล็บไฟล์) */}
      <div className="space-y-2">
        <div className="font-medium text-[#17191c] flex items-center gap-2 text-sm">
          <BookOpen className="w-4 h-4 text-[#17191c] shrink-0" />
          <span>แหล่งข้อมูลอ้างอิง (Data Sources & Citations):</span>
        </div>
        <ol className="space-y-1.5 pl-1 text-[#5f6370]">
          {sources.map((src, i) => (
            <li key={`src-${i}`} className="flex items-start gap-2">
              <span className="font-normal text-[#17191c] shrink-0 tabular-nums">[{i + 1}]</span>
              <div>
                <span className="font-medium text-[#17191c]">{src.title}</span>
                {src.dept && <span className="text-[#5f6370]">, {src.dept}</span>}
                {src.description && <span className="text-[#6b6f7a]"> — {src.description}</span>}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {lastUpdated && (
        <div className="text-xs text-[#6b6f7a] pt-1.5">
          * ข้อมูลสรุปประมวลผลรอบ {lastUpdated}
        </div>
      )}
    </div>
  );
};
