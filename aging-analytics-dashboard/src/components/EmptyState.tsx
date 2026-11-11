import React from 'react';
import { RotateCcw } from 'lucide-react';

export interface EmptyStateProps {
  message?: string;
  description?: string;
  onReset?: () => void;
  resetLabel?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'ไม่พบข้อมูลตามตัวกรองที่เลือก',
  description,
  onReset,
  resetLabel = 'ล้างตัวกรอง',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 ${className}`}>
      <img
        src={`${import.meta.env.BASE_URL}images/illustrations/tab-screening.webp`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="w-[220px] max-w-full h-auto aspect-[3/2] object-contain mb-4 select-none pointer-events-none"
      />
      <p className="text-base font-medium text-[#17191c] mb-1">
        {message}
      </p>
      {description && (
        <p className="text-sm text-[#5f6370] max-w-[45ch] mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#5d2a1a] bg-[#fbe1d1] hover:bg-[#f6d2bd] rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#5d2a1a]/30 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{resetLabel}</span>
        </button>
      )}
    </div>
  );
};

export const TableEmptyRow: React.FC<EmptyStateProps & { colSpan: number }> = ({
  colSpan,
  ...props
}) => {
  return (
    <tr>
      <td colSpan={colSpan} className="py-10 px-4">
        <EmptyState {...props} />
      </td>
    </tr>
  );
};
