import React from 'react';
import {
  Eye,
  Smile,
  Footprints,
  HandHeart,
  Ear,
  Brain,
  Droplets,
  Apple,
  CloudRain,
  type LucideIcon,
} from 'lucide-react';
import type { ScreeningMetricKey } from '../components/ThailandScreeningMap';

export interface DomainMeta {
  key: ScreeningMetricKey;
  order: string;
  name: string;
  shortName: string;
  shortLabel: string;
  slug: string;
  icon: LucideIcon;
  desc: string;
}

export const DOMAIN_META: Record<ScreeningMetricKey, DomainMeta> = {
  vision: {
    key: 'vision',
    order: '01',
    name: '1. สายตา/การมองเห็น',
    shortName: 'สายตา/การมองเห็น',
    shortLabel: 'สายตา',
    slug: 'vision',
    icon: Eye,
    desc: 'ต้อกระจก สายตาเลือนราง เสี่ยงต่ออุบัติเหตุ',
  },
  oral: {
    key: 'oral',
    order: '02',
    name: '2. สุขภาพช่องปาก',
    shortName: 'สุขภาพช่องปาก',
    shortLabel: 'ช่องปาก',
    slug: 'oral',
    icon: Smile,
    desc: 'มีฟันเคี้ยวอาหารน้อยกว่า 20 ซี่ กระทบภาวะโภชนาการ',
  },
  movement: {
    key: 'movement',
    order: '03',
    name: '3. การเคลื่อนไหว/หกล้ม',
    shortName: 'การเคลื่อนไหว/หกล้ม',
    shortLabel: 'หกล้ม',
    slug: 'mobility',
    icon: Footprints,
    desc: 'ทดสอบ TUG ลุกยืนเดิน ทรงตัวบกพร่อง เสี่ยงต่อการหกล้ม',
  },
  adl: {
    key: 'adl',
    order: '04',
    name: '4. กิจวัตรประจำวัน (ADL)',
    shortName: 'กิจวัตรประจำวัน (ADL)',
    shortLabel: 'ADL',
    slug: 'adl',
    icon: HandHeart,
    desc: 'กลุ่มติดบ้านและติดเตียง ต้องการผู้ดูแล (Caregiver)',
  },
  hearing: {
    key: 'hearing',
    order: '05',
    name: '5. การได้ยิน (หูตึง/หนวก)',
    shortName: 'การได้ยิน (หูตึง/หนวก)',
    shortLabel: 'การได้ยิน',
    slug: 'hearing',
    icon: Ear,
    desc: 'ได้ยินไม่ชัดเจน นำไปสู่ภาวะแยกตัวจากสังคม',
  },
  cognition: {
    key: 'cognition',
    order: '06',
    name: '6. ความคิดความจำ',
    shortName: 'ความคิดความจำ',
    shortLabel: 'ความจำ',
    slug: 'cognition',
    icon: Brain,
    desc: 'สงสัยสมองเสื่อม (Dementia) จากแบบประเมิน Mini-Cog',
  },
  urine: {
    key: 'urine',
    order: '07',
    name: '7. การกลั้นปัสสาวะ',
    shortName: 'การกลั้นปัสสาวะ',
    shortLabel: 'ปัสสาวะ',
    slug: 'continence',
    icon: Droplets,
    desc: 'ปัสสาวะเล็ดราด กระทบสุขอนามัยและคุณภาพชีวิต',
  },
  nutrition: {
    key: 'nutrition',
    order: '08',
    name: '8. ภาวะโภชนาการ',
    shortName: 'ภาวะโภชนาการ',
    shortLabel: 'โภชนาการ',
    slug: 'nutrition',
    icon: Apple,
    desc: 'ภาวะขาดสารอาหาร/น้ำหนักลดผิดปกติในผู้สูงอายุ',
  },
  depression: {
    key: 'depression',
    order: '09',
    name: '9. ภาวะซึมเศร้า (2Q)',
    shortName: 'ภาวะซึมเศร้า (2Q)',
    shortLabel: 'ซึมเศร้า',
    slug: 'depression',
    icon: CloudRain,
    desc: 'คัดกรองเบื้องต้นด้วยแบบคัดกรอง 2 คำถาม (2Q)',
  },
};

export interface DomainIconProps {
  icon?: LucideIcon;
  domainKey?: ScreeningMetricKey;
  size?: number;
  variant?: 'plain' | 'circle';
  className?: string;
}

/**
 * DomainIcon:
 * Renders domain icon inside a 24px peach circle (#fbe1d1) with brown stroke (#5d2a1a).
 */
export const DomainIcon: React.FC<DomainIconProps> = ({
  icon,
  domainKey,
  size = 16,
  variant = 'plain',
  className = '',
}) => {
  const IconComponent = icon || (domainKey ? DOMAIN_META[domainKey]?.icon : null);
  if (!IconComponent) return null;

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-[#fbe1d1] text-[#5d2a1a] ${className}`}
      aria-hidden="true"
    >
      <IconComponent size={size} strokeWidth={1.75} className="w-4 h-4 text-[#5d2a1a]" />
    </span>
  );
};
