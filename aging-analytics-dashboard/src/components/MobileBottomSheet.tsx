import React, { useEffect } from 'react';
import { X, Filter } from 'lucide-react';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  activeCount?: number;
  onClear?: () => void;
  onApply?: () => void;
  children: React.ReactNode;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  activeCount = 0,
  onClear,
  onApply,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Content */}
      <div
        className="relative z-10 w-full bg-white rounded-t-[24px] shadow-2xl flex flex-col max-h-[85dvh] animate-in slide-in-from-bottom duration-200 border-t border-[#ececec]"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))' }}
      >
        {/* Handle bar */}
        <div className="w-12 h-1 bg-[#ececec] rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-[#ececec] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#17191c]" />
            <h3 className="text-base font-medium text-[#17191c]">{title}</h3>
            {activeCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-[#5d2a1a] text-white font-medium tabular-nums">
                {activeCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-full text-[#5f6370] hover:text-[#17191c] hover:bg-[#f2f2f3] transition-colors"
            aria-label="ปิดตัวกรอง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filters Body */}
        <div className="px-5 py-4 overflow-y-auto space-y-4 flex-1">
          {children}
        </div>

        {/* Sticky Actions Footer */}
        <div className="px-5 pt-3 border-t border-[#ececec] flex items-center gap-3 shrink-0 bg-white">
          {onClear && (
            <button
              onClick={() => {
                onClear();
              }}
              className="flex-1 min-h-[44px] px-4 py-2.5 rounded-full border border-[#ececec] text-sm font-medium text-[#5f6370] hover:text-[#17191c] hover:bg-[#fafafb] transition-all"
            >
              ล้างตัวกรอง
            </button>
          )}
          <button
            onClick={() => {
              if (onApply) onApply();
              onClose();
            }}
            className="flex-1 min-h-[44px] px-4 py-2.5 rounded-full bg-[#17191c] text-white text-sm font-medium hover:bg-black transition-all shadow-sm"
          >
            ใช้ตัวกรอง
          </button>
        </div>
      </div>
    </div>
  );
};
