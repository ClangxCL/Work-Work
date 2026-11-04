import React, { useState } from 'react';
import {
  Database, ExternalLink, FileSpreadsheet, CheckCircle2,
  Info, ChevronDown, ChevronUp, Link as LinkIcon, ShieldCheck
} from 'lucide-react';

export interface TabSourceItem {
  title: string;
  dept: string;
  url: string;
  displayUrl: string;
  badge: string;
  badgeColor?: string;
  description: string;
  fileName?: string;
}

export interface TabNoteItem {
  id?: string;
  title: string;
  content: string;
  highlight?: string;
}

export interface TabSourceReferenceProps {
  tabTitle: string;
  sources: TabSourceItem[];
  notes: TabNoteItem[];
  lastUpdated?: string;
  accentColor?: 'blue' | 'emerald' | 'purple' | 'rose' | 'amber';
}

export const TabSourceReference: React.FC<TabSourceReferenceProps> = ({
  tabTitle,
  sources,
  notes,
  lastUpdated = 'พฤศจิกายน 2569',
  accentColor = 'blue'
}) => {
  const [isNotesExpanded, setIsNotesExpanded] = useState<boolean>(true);

  // Accent styling mappings
  const colorMap = {
    blue: {
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      iconColor: 'text-blue-600',
      borderHover: 'hover:border-blue-300',
      tagBg: 'bg-blue-50/80 text-blue-800 border-blue-200',
      linkText: 'text-blue-600 hover:text-blue-800'
    },
    emerald: {
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconColor: 'text-emerald-600',
      borderHover: 'hover:border-emerald-300',
      tagBg: 'bg-emerald-50/80 text-emerald-800 border-emerald-200',
      linkText: 'text-emerald-600 hover:text-emerald-800'
    },
    purple: {
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      iconColor: 'text-purple-600',
      borderHover: 'hover:border-purple-300',
      tagBg: 'bg-purple-50/80 text-purple-800 border-purple-200',
      linkText: 'text-purple-600 hover:text-purple-800'
    },
    rose: {
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      iconColor: 'text-rose-600',
      borderHover: 'hover:border-rose-300',
      tagBg: 'bg-rose-50/80 text-rose-800 border-rose-200',
      linkText: 'text-rose-600 hover:text-rose-800'
    },
    amber: {
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      iconColor: 'text-amber-600',
      borderHover: 'hover:border-amber-300',
      tagBg: 'bg-amber-50/80 text-amber-800 border-amber-200',
      linkText: 'text-amber-600 hover:text-amber-800'
    }
  };

  const currentTheme = colorMap[accentColor] || colorMap.blue;

  return (
    <div className="mt-10 pt-8 border-t border-slate-200">
      {/* 1. Header with Tab Identification */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${currentTheme.badgeBg}`}>
              {tabTitle}
            </span>
            <span className="text-xs text-slate-400">• แหล่งอ้างอิงและหมายเหตุเฉพาะแท็บ</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mt-1">
            <Database className={`w-5 h-5 ${currentTheme.iconColor}`} />
            แหล่งข้อมูลอ้างอิงและลิงก์ทางการ (Official Sources & Reference Links)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            ข้อมูลที่แสดงในหน้านี้ดึงและประมวลผลจากฐานข้อมูลทางการของหน่วยงานที่ระบุด้านล่าง
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200 flex items-center gap-1.5 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            ข้อมูลรอบ {lastUpdated}
          </span>
        </div>
      </div>

      {/* 2. Grid of Source Reference Cards */}
      <div className={`grid grid-cols-1 ${sources.length > 1 ? 'md:grid-cols-2' : ''} gap-4 mb-6`}>
        {sources.map((src, i) => (
          <div
            key={`src-${i}`}
            className={`p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs ${currentTheme.borderHover} hover:shadow-md transition-all flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${src.badgeColor || currentTheme.tagBg}`}>
                  {src.badge}
                </span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-xs font-semibold ${currentTheme.linkText} flex items-center gap-1 transition-colors group shrink-0`}
                >
                  <span>เปิดลิงก์ข้อมูล</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              <h4 className="font-bold text-slate-900 text-sm leading-snug">
                {src.title}
              </h4>
              <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                {src.dept}
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {src.description}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span className="flex items-center gap-1 text-slate-500 font-mono">
                <LinkIcon className="w-3 h-3 text-slate-400" />
                {src.displayUrl}
              </span>
              {src.fileName && (
                <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md text-[10px] font-medium border border-slate-200">
                  <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                  {src.fileName}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Important Notes for this specific tab */}
      {notes && notes.length > 0 && (
        <div className="bg-slate-50/90 rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div
            onClick={() => setIsNotesExpanded(!isNotesExpanded)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-600 shrink-0" />
              <h4 className="font-bold text-slate-900 text-sm">
                หมายเหตุสำคัญและข้อกำหนดทางเทคนิคเฉพาะแท็บ ({notes.length} ข้อ)
              </h4>
            </div>
            <button
              type="button"
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-200/60 transition-colors"
            >
              <span>{isNotesExpanded ? 'ย่อเนื้อหา' : 'ขยายอ่านรายละเอียด'}</span>
              {isNotesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {isNotesExpanded && (
            <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-3">
              {notes.map((note, idx) => (
                <div key={note.id || `note-${idx}`} className="flex items-start gap-3 text-xs leading-relaxed text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 font-semibold">{note.title}: </strong>
                    <span>{note.content}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
