// Data definition and baseline figures for KPI Proxy 2 (FY2570)
// Generated from Department of Medical Services (DMS) Official KPI Template: 30.10.2569

export interface DomainBaseline {
  id: string;
  name: string;
  shortName: string;
  category: string;
  service_desc: string;
  screening_base_desc: string;
  baseline_national_pct: number;
  flow_steps: string[];
}

export interface Proxy2ProvinceRecord {
  province: string;
  zone: string;
  zone_code: string;
  elderly_total_69: number;
  screened_total_69: number;
  screened_pct: number;
  target_population_b: number;
  risk_rate_pct: number;
  cared_population_a: number;
  coverage_pct: number;
  q1_data_ready: boolean;
  q2_current_pct: number;
  q3_projected_pct: number;
  q4_projected_pct: number;
  q2_target_met: boolean;
  q3_target_met: boolean;
  q4_target_met: boolean;
  gap_to_20pct: number;
  gap_to_40pct: number;
  gap_to_70pct: number;
  domain_risks: Record<string, { risk: number; cared: number; pct: number }>;
}

export interface ContactPerson {
  name: string;
  role: string;
  division: string;
  phone: string;
  mobile: string;
  email: string;
  lineId?: string;
}

export interface SupportingDocument {
  title: string;
  category: string;
  description: string;
  url: string;
  badge: string;
}

export const DOMAIN_BASELINES: DomainBaseline[] = [
  {
    "id": "dementia",
    "name": "1. ภาวะสมองเสื่อม",
    "shortName": "สมองเสื่อม",
    "category": "ระบบประสาทและการรับรู้",
    "service_desc": "วินิจฉัย MCI หรือภาวะสมองเสื่อม",
    "screening_base_desc": "ผู้รับการประเมิน MMSE ที่ปกติและเสี่ยง",
    "baseline_national_pct": 18.63,
    "flow_steps": [
      "คัดกรองเบื้องต้นในชุมชน (Mini-Cog / AMT)",
      "ส่งต่อประเมิน MMSE / MoCA โดยบุคลากรการแพทย์",
      "ตรวจวินิจฉัยแยกโรค MCI / Dementia ทางคลินิก",
      "จัดทำ Care Plan และประสานงานผู้ดูแล (Caregiver)"
    ]
  },
  {
    "id": "fall",
    "name": "2. ภาวะหกล้มและการทรงตัว",
    "shortName": "หกล้ม",
    "category": "ระบบกล้ามเนื้อและกระดูก",
    "service_desc": "วินิจฉัยภาวะมวลกล้ามเนื้อน้อย (Sarcopenia)",
    "screening_base_desc": "ผู้มีความเสี่ยงจากการคัดกรองในชุมชน (TUG / ล้มใน 1 ปี)",
    "baseline_national_pct": 0.91,
    "flow_steps": [
      "คัดกรองการทรงตัวและการล้มในชุมชน (TUG > 12 วินาที)",
      "ส่งตรวจประเมิน Sarcopenia (แรงบีบมือ Handgrip / Bioimpedance)",
      "กายภาพบำบัดฝึกการทรงตัว และเพิ่มมวลกล้ามเนื้อ (Resistance Training)",
      "ประเมินและปรับปรุงสิ่งแวดล้อมที่อยู่อาศัยเพื่อความปลอดภัย"
    ]
  },
  {
    "id": "oral",
    "name": "3. สุขภาพช่องปาก",
    "shortName": "สุขภาพช่องปาก",
    "category": "ระบบทันตสุขภาพ",
    "service_desc": "ตรวจรักษา สูญเสียฟัน / โรคปริทันต์ / ปากแห้ง",
    "screening_base_desc": "ผู้คัดกรองช่องปากทั้งหมด (D21)",
    "baseline_national_pct": 64.48,
    "flow_steps": [
      "คัดกรองฟันแท้ใช้งาน < 20 ซี่ หรือเคี้ยวลำบาก",
      "ตรวจสุขภาพช่องปากโดยทันตบุคลากร",
      "รักษาโรคปริทันต์ / อุดฟัน / ถอนฟัน",
      "ใส่ฟันเทียมพระราชทาน / ฟื้นฟูสมรรถภาพการบดเคี้ยว"
    ]
  },
  {
    "id": "vision",
    "name": "4. การมองเห็น (สายตา)",
    "shortName": "การมองเห็น",
    "category": "ระบบประสาทสัมผัส",
    "service_desc": "ประเมินต่อในโรงพยาบาล (GA) / ตรวจจักษุแพทย์",
    "screening_base_desc": "ผู้มีความเสี่ยงจากการคัดกรองในชุมชน (Snellen / นับนิ้ว)",
    "baseline_national_pct": 6.26,
    "flow_steps": [
      "คัดกรองสายตาเบื้องต้น (Snellen chart / นับนิ้วระยะ 3 เมตร)",
      "ตรวจวัดสายตาโดยละเอียดและการประเมิน GA ในโรงพยาบาล",
      "ตรวจแยกต้อกระจก ต้อหิน จอประสาทตาเสื่อมโดยจักษุแพทย์",
      "ส่งผ่าตัดเปลี่ยนเลนส์ตาเทียม หรือจัดหาแว่นสายตา"
    ]
  },
  {
    "id": "hearing",
    "name": "5. การได้ยิน",
    "shortName": "การได้ยิน",
    "category": "ระบบประสาทสัมผัส",
    "service_desc": "ได้รับการวินิจฉัยการสูญเสียการได้ยิน (Hearing Loss)",
    "screening_base_desc": "ผู้คัดกรองการได้ยินทั้งหมด (D39 / กระซิบ)",
    "baseline_national_pct": 13.78,
    "flow_steps": [
      "คัดกรองการได้ยินด้วยแบบทดสอบกระซิบหรือแบบสอบถาม",
      "ตรวจช่องหู (Otoscope) คัดกรองขี้หูอุดตัน",
      "ส่งตรวจการได้ยินด้วยเครื่อง Audiometry",
      "ประเมินและส่งต่อเพื่อรับเครื่องช่วยฟัง (Hearing Aid)"
    ]
  },
  {
    "id": "depression",
    "name": "6. ภาวะซึมเศร้าและความเสี่ยงฆ่าตัวตาย",
    "shortName": "ซึมเศร้า/ฆ่าตัวตาย",
    "category": "สุขภาพจิตและจิตเวช",
    "service_desc": "เข้าสู่กระบวนการวินิจฉัยซึมเศร้า (9Q + 8Q)",
    "screening_base_desc": "ผู้รับการประเมิน GA ที่พบผลบวกจาก 2Q",
    "baseline_national_pct": 72.83,
    "flow_steps": [
      "คัดกรอง 2Q ในชุมชน",
      "ประเมินความรุนแรงด้วย 9Q (โรคซึมเศร้า) และ 8Q (เสี่ยงฆ่าตัวตาย)",
      "พบแพทย์เพื่อเริ่มการรักษาด้วยยาและจิตบำบัด",
      "ติดตามเฝ้าระวังต่อเนื่องโดยทีมสุขภาพจิตชุมชน"
    ]
  },
  {
    "id": "adl",
    "name": "7. การปฏิบัติกิจวัตรประจำวัน (ADL & Frailty)",
    "shortName": "ADL / เปราะบาง",
    "category": "สมรรถนะร่างกายและการพึ่งพา",
    "service_desc": "ประเมิน ADL รายข้อ / ภาวะเปราะบาง (Frailty)",
    "screening_base_desc": "ผู้คัดกรองพบความสามารถลดลง (Barthel ADL < 12)",
    "baseline_national_pct": 8.72,
    "flow_steps": [
      "ประเมิน Barthel ADL จำแนกกลุ่มติดสังคม / ติดบ้าน / ติดเตียง",
      "ประเมินระดับความเปราะบาง (Clinical Frailty Scale)",
      "จัดทำ Care Plan ร่วมกับทีมสหวิชาชีพและ Care Manager",
      "จัดบริการ Long Term Care (LTC) และกายภาพบำบัดที่บ้าน"
    ]
  },
  {
    "id": "urine",
    "name": "8. การกลั้นปัสสาวะ",
    "shortName": "กลั้นปัสสาวะ",
    "category": "ระบบทางเดินปัสสาวะ",
    "service_desc": "ตรวจหาสาเหตุ ปัสสาวะเล็ดราด และฝึกกล้ามเนื้ออุ้งเชิงกราน",
    "screening_base_desc": "ผู้สูงอายุที่มีอาการปัสสาวะเล็ด/ราด",
    "baseline_national_pct": 5.4,
    "flow_steps": [
      "คัดกรองอาการปัสสาวะเล็ดราด และตรวจปัสสาวะเบื้องต้น",
      "ตรวจแยกโรคติดเชื้อทางเดินปัสสาวะ หรือต่อมลูกหมากโต",
      "ฝึกบริหารกล้ามเนื้ออุ้งเชิงกราน (Kegel exercise) และปรับพฤติกรรม",
      "ส่งต่อแพทย์ทางเดินปัสสาวะกรณีอาการซับซ้อน"
    ]
  },
  {
    "id": "nutrition",
    "name": "9. ภาวะโภชนาการ",
    "shortName": "โภชนาการ",
    "category": "ระบบโภชนาการและการเผาผลาญ",
    "service_desc": "ประเมิน MNA และให้คำปรึกษาภาวะทุพโภชนาการ",
    "screening_base_desc": "ผู้คัดกรองพบน้ำหนักลดผิดปกติ หรือ BMI < 18.5",
    "baseline_national_pct": 11.8,
    "flow_steps": [
      "คัดกรองน้ำหนักลดผิดปกติ และคำนวณดัชนีมวลกาย BMI",
      "ประเมิน Mini Nutritional Assessment (MNA)",
      "ให้คำปรึกษาด้านโภชนาการโดยนักกำหนดอาหาร/ทีมโภชนาการ",
      "สนับสนุนอาหารเสริมทางการแพทย์ และติดตามน้ำหนักตัวทุกเดือน"
    ]
  }
];

export const PROXY2_PROVINCES: Proxy2ProvinceRecord[] = [
  {
    "province": "กรุงเทพมหานคร",
    "zone": "เขตสุขภาพที่ 13",
    "zone_code": "13",
    "elderly_total_69": 1375000,
    "screened_total_69": 1121120,
    "screened_pct": 81.5,
    "target_population_b": 293434,
    "risk_rate_pct": 26.2,
    "cared_population_a": 56046,
    "coverage_pct": 19.1,
    "q1_data_ready": true,
    "q2_current_pct": 19.1,
    "q3_projected_pct": 25.8,
    "q4_projected_pct": 35.3,
    "q2_target_met": false,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 2641,
    "gap_to_40pct": 61328,
    "gap_to_70pct": 149358,
    "domain_risks": {
      "dementia": {
        "risk": 25478,
        "cared": 5287,
        "pct": 20.8
      },
      "fall": {
        "risk": 37655,
        "cared": 339,
        "pct": 0.9
      },
      "oral": {
        "risk": 49267,
        "cared": 31640,
        "pct": 64.2
      },
      "vision": {
        "risk": 67413,
        "cared": 4316,
        "pct": 6.4
      },
      "hearing": {
        "risk": 18649,
        "cared": 2988,
        "pct": 16
      },
      "depression": {
        "risk": 9596,
        "cared": 6155,
        "pct": 64.1
      },
      "adl": {
        "risk": 24299,
        "cared": 2461,
        "pct": 10.1
      },
      "urine": {
        "risk": 16030,
        "cared": 996,
        "pct": 6.2
      },
      "nutrition": {
        "risk": 13738,
        "cared": 1414,
        "pct": 10.3
      }
    }
  },
  {
    "province": "สมุทรปราการ",
    "zone": "เขตสุขภาพที่ 6",
    "zone_code": "06",
    "elderly_total_69": 201324,
    "screened_total_69": 182224,
    "screened_pct": 90.5,
    "target_population_b": 60864,
    "risk_rate_pct": 33.4,
    "cared_population_a": 14729,
    "coverage_pct": 24.2,
    "q1_data_ready": true,
    "q2_current_pct": 24.2,
    "q3_projected_pct": 32.7,
    "q4_projected_pct": 44.8,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 9617,
    "gap_to_70pct": 27876,
    "domain_risks": {
      "dementia": {
        "risk": 4694,
        "cared": 833,
        "pct": 17.7
      },
      "fall": {
        "risk": 6779,
        "cared": 61,
        "pct": 0.9
      },
      "oral": {
        "risk": 9811,
        "cared": 5771,
        "pct": 58.8
      },
      "vision": {
        "risk": 13540,
        "cared": 717,
        "pct": 5.3
      },
      "hearing": {
        "risk": 4738,
        "cared": 737,
        "pct": 15.6
      },
      "depression": {
        "risk": 2047,
        "cared": 1479,
        "pct": 72.3
      },
      "adl": {
        "risk": 5797,
        "cared": 457,
        "pct": 7.9
      },
      "urine": {
        "risk": 3630,
        "cared": 171,
        "pct": 4.7
      },
      "nutrition": {
        "risk": 3437,
        "cared": 382,
        "pct": 11.1
      }
    }
  },
  {
    "province": "นนทบุรี",
    "zone": "เขตสุขภาพที่ 4",
    "zone_code": "04",
    "elderly_total_69": 276284,
    "screened_total_69": 223299,
    "screened_pct": 80.8,
    "target_population_b": 73825,
    "risk_rate_pct": 33.1,
    "cared_population_a": 33886,
    "coverage_pct": 45.9,
    "q1_data_ready": true,
    "q2_current_pct": 45.9,
    "q3_projected_pct": 62,
    "q4_projected_pct": 84.9,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 17792,
    "domain_risks": {
      "dementia": {
        "risk": 5155,
        "cared": 798,
        "pct": 15.5
      },
      "fall": {
        "risk": 7849,
        "cared": 76,
        "pct": 1
      },
      "oral": {
        "risk": 12952,
        "cared": 9910,
        "pct": 76.5
      },
      "vision": {
        "risk": 18069,
        "cared": 940,
        "pct": 5.2
      },
      "hearing": {
        "risk": 5753,
        "cared": 880,
        "pct": 15.3
      },
      "depression": {
        "risk": 2054,
        "cared": 1487,
        "pct": 72.4
      },
      "adl": {
        "risk": 6794,
        "cared": 587,
        "pct": 8.6
      },
      "urine": {
        "risk": 4410,
        "cared": 247,
        "pct": 5.6
      },
      "nutrition": {
        "risk": 3817,
        "cared": 511,
        "pct": 13.4
      }
    }
  },
  {
    "province": "ปทุมธานี",
    "zone": "เขตสุขภาพที่ 4",
    "zone_code": "04",
    "elderly_total_69": 174242,
    "screened_total_69": 147621,
    "screened_pct": 84.7,
    "target_population_b": 46581,
    "risk_rate_pct": 31.6,
    "cared_population_a": 21474,
    "coverage_pct": 46.1,
    "q1_data_ready": true,
    "q2_current_pct": 46.1,
    "q3_projected_pct": 62.2,
    "q4_projected_pct": 85.3,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 11133,
    "domain_risks": {
      "dementia": {
        "risk": 3367,
        "cared": 547,
        "pct": 16.2
      },
      "fall": {
        "risk": 5055,
        "cared": 43,
        "pct": 0.9
      },
      "oral": {
        "risk": 9356,
        "cared": 6799,
        "pct": 72.7
      },
      "vision": {
        "risk": 9280,
        "cared": 652,
        "pct": 7
      },
      "hearing": {
        "risk": 2949,
        "cared": 350,
        "pct": 11.9
      },
      "depression": {
        "risk": 1388,
        "cared": 961,
        "pct": 69.2
      },
      "adl": {
        "risk": 4777,
        "cared": 448,
        "pct": 9.4
      },
      "urine": {
        "risk": 2692,
        "cared": 119,
        "pct": 4.4
      },
      "nutrition": {
        "risk": 2439,
        "cared": 289,
        "pct": 11.8
      }
    }
  },
  {
    "province": "พระนครศรีอยุธยา",
    "zone": "เขตสุขภาพที่ 4",
    "zone_code": "04",
    "elderly_total_69": 162042,
    "screened_total_69": 137407,
    "screened_pct": 84.8,
    "target_population_b": 36269,
    "risk_rate_pct": 26.4,
    "cared_population_a": 8632,
    "coverage_pct": 23.8,
    "q1_data_ready": true,
    "q2_current_pct": 23.8,
    "q3_projected_pct": 32.1,
    "q4_projected_pct": 44,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 5876,
    "gap_to_70pct": 16756,
    "domain_risks": {
      "dementia": {
        "risk": 2965,
        "cared": 569,
        "pct": 19.2
      },
      "fall": {
        "risk": 4161,
        "cared": 31,
        "pct": 0.7
      },
      "oral": {
        "risk": 5768,
        "cared": 3169,
        "pct": 54.9
      },
      "vision": {
        "risk": 8208,
        "cared": 610,
        "pct": 7.4
      },
      "hearing": {
        "risk": 2874,
        "cared": 392,
        "pct": 13.6
      },
      "depression": {
        "risk": 1149,
        "cared": 821,
        "pct": 71.5
      },
      "adl": {
        "risk": 3163,
        "cared": 243,
        "pct": 7.7
      },
      "urine": {
        "risk": 2145,
        "cared": 102,
        "pct": 4.8
      },
      "nutrition": {
        "risk": 1670,
        "cared": 230,
        "pct": 13.8
      }
    }
  },
  {
    "province": "อ่างทอง",
    "zone": "เขตสุขภาพที่ 4",
    "zone_code": "04",
    "elderly_total_69": 61821,
    "screened_total_69": 51484,
    "screened_pct": 83.3,
    "target_population_b": 14619,
    "risk_rate_pct": 28.4,
    "cared_population_a": 7032,
    "coverage_pct": 48.1,
    "q1_data_ready": true,
    "q2_current_pct": 48.1,
    "q3_projected_pct": 64.9,
    "q4_projected_pct": 89,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 3201,
    "domain_risks": {
      "dementia": {
        "risk": 1100,
        "cared": 189,
        "pct": 17.2
      },
      "fall": {
        "risk": 1931,
        "cared": 16,
        "pct": 0.8
      },
      "oral": {
        "risk": 2912,
        "cared": 2038,
        "pct": 70
      },
      "vision": {
        "risk": 2782,
        "cared": 186,
        "pct": 6.7
      },
      "hearing": {
        "risk": 1005,
        "cared": 160,
        "pct": 15.9
      },
      "depression": {
        "risk": 400,
        "cared": 291,
        "pct": 72.8
      },
      "adl": {
        "risk": 1321,
        "cared": 92,
        "pct": 7
      },
      "urine": {
        "risk": 876,
        "cared": 48,
        "pct": 5.5
      },
      "nutrition": {
        "risk": 731,
        "cared": 97,
        "pct": 13.3
      }
    }
  },
  {
    "province": "ลพบุรี",
    "zone": "เขตสุขภาพที่ 4",
    "zone_code": "04",
    "elderly_total_69": 138010,
    "screened_total_69": 116374,
    "screened_pct": 84.3,
    "target_population_b": 37502,
    "risk_rate_pct": 32.2,
    "cared_population_a": 12038,
    "coverage_pct": 32.1,
    "q1_data_ready": true,
    "q2_current_pct": 32.1,
    "q3_projected_pct": 43.3,
    "q4_projected_pct": 59.4,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 2963,
    "gap_to_70pct": 14213,
    "domain_risks": {
      "dementia": {
        "risk": 3256,
        "cared": 676,
        "pct": 20.8
      },
      "fall": {
        "risk": 4518,
        "cared": 41,
        "pct": 0.9
      },
      "oral": {
        "risk": 7351,
        "cared": 4249,
        "pct": 57.8
      },
      "vision": {
        "risk": 7501,
        "cared": 558,
        "pct": 7.4
      },
      "hearing": {
        "risk": 2490,
        "cared": 356,
        "pct": 14.3
      },
      "depression": {
        "risk": 957,
        "cared": 619,
        "pct": 64.7
      },
      "adl": {
        "risk": 3254,
        "cared": 313,
        "pct": 9.6
      },
      "urine": {
        "risk": 2062,
        "cared": 108,
        "pct": 5.2
      },
      "nutrition": {
        "risk": 2069,
        "cared": 198,
        "pct": 9.6
      }
    }
  },
  {
    "province": "สิงห์บุรี",
    "zone": "เขตสุขภาพที่ 4",
    "zone_code": "04",
    "elderly_total_69": 51430,
    "screened_total_69": 43690,
    "screened_pct": 85,
    "target_population_b": 14891,
    "risk_rate_pct": 34.1,
    "cared_population_a": 4244,
    "coverage_pct": 28.5,
    "q1_data_ready": true,
    "q2_current_pct": 28.5,
    "q3_projected_pct": 38.5,
    "q4_projected_pct": 52.7,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 1712,
    "gap_to_70pct": 6180,
    "domain_risks": {
      "dementia": {
        "risk": 1342,
        "cared": 292,
        "pct": 21.8
      },
      "fall": {
        "risk": 2010,
        "cared": 17,
        "pct": 0.8
      },
      "oral": {
        "risk": 3009,
        "cared": 2060,
        "pct": 68.5
      },
      "vision": {
        "risk": 3298,
        "cared": 181,
        "pct": 5.5
      },
      "hearing": {
        "risk": 1038,
        "cared": 125,
        "pct": 12
      },
      "depression": {
        "risk": 482,
        "cared": 323,
        "pct": 67
      },
      "adl": {
        "risk": 1174,
        "cared": 86,
        "pct": 7.3
      },
      "urine": {
        "risk": 840,
        "cared": 40,
        "pct": 4.8
      },
      "nutrition": {
        "risk": 655,
        "cared": 68,
        "pct": 10.4
      }
    }
  },
  {
    "province": "ชัยนาท",
    "zone": "เขตสุขภาพที่ 3",
    "zone_code": "03",
    "elderly_total_69": 73841,
    "screened_total_69": 59888,
    "screened_pct": 81.1,
    "target_population_b": 18124,
    "risk_rate_pct": 30.3,
    "cared_population_a": 6090,
    "coverage_pct": 33.6,
    "q1_data_ready": true,
    "q2_current_pct": 33.6,
    "q3_projected_pct": 45.4,
    "q4_projected_pct": 62.2,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 1160,
    "gap_to_70pct": 6597,
    "domain_risks": {
      "dementia": {
        "risk": 1560,
        "cared": 320,
        "pct": 20.5
      },
      "fall": {
        "risk": 2373,
        "cared": 19,
        "pct": 0.8
      },
      "oral": {
        "risk": 3520,
        "cared": 2375,
        "pct": 67.5
      },
      "vision": {
        "risk": 3909,
        "cared": 197,
        "pct": 5
      },
      "hearing": {
        "risk": 1160,
        "cared": 165,
        "pct": 14.2
      },
      "depression": {
        "risk": 478,
        "cared": 319,
        "pct": 66.7
      },
      "adl": {
        "risk": 1719,
        "cared": 179,
        "pct": 10.4
      },
      "urine": {
        "risk": 1020,
        "cared": 57,
        "pct": 5.6
      },
      "nutrition": {
        "risk": 975,
        "cared": 100,
        "pct": 10.3
      }
    }
  },
  {
    "province": "สระบุรี",
    "zone": "เขตสุขภาพที่ 4",
    "zone_code": "04",
    "elderly_total_69": 124694,
    "screened_total_69": 102508,
    "screened_pct": 82.2,
    "target_population_b": 27191,
    "risk_rate_pct": 26.5,
    "cared_population_a": 6771,
    "coverage_pct": 24.9,
    "q1_data_ready": true,
    "q2_current_pct": 24.9,
    "q3_projected_pct": 33.6,
    "q4_projected_pct": 46.1,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 4105,
    "gap_to_70pct": 12263,
    "domain_risks": {
      "dementia": {
        "risk": 2206,
        "cared": 419,
        "pct": 19
      },
      "fall": {
        "risk": 2800,
        "cared": 22,
        "pct": 0.8
      },
      "oral": {
        "risk": 4197,
        "cared": 2886,
        "pct": 68.8
      },
      "vision": {
        "risk": 5417,
        "cared": 351,
        "pct": 6.5
      },
      "hearing": {
        "risk": 1878,
        "cared": 262,
        "pct": 14
      },
      "depression": {
        "risk": 935,
        "cared": 642,
        "pct": 68.7
      },
      "adl": {
        "risk": 2118,
        "cared": 179,
        "pct": 8.5
      },
      "urine": {
        "risk": 1562,
        "cared": 89,
        "pct": 5.7
      },
      "nutrition": {
        "risk": 1509,
        "cared": 147,
        "pct": 9.7
      }
    }
  },
  {
    "province": "ชลบุรี",
    "zone": "เขตสุขภาพที่ 6",
    "zone_code": "06",
    "elderly_total_69": 230403,
    "screened_total_69": 189191,
    "screened_pct": 82.1,
    "target_population_b": 66123,
    "risk_rate_pct": 35,
    "cared_population_a": 21556,
    "coverage_pct": 32.6,
    "q1_data_ready": true,
    "q2_current_pct": 32.6,
    "q3_projected_pct": 44,
    "q4_projected_pct": 60.3,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 4893,
    "gap_to_70pct": 24730,
    "domain_risks": {
      "dementia": {
        "risk": 5336,
        "cared": 1006,
        "pct": 18.9
      },
      "fall": {
        "risk": 7182,
        "cared": 75,
        "pct": 1
      },
      "oral": {
        "risk": 11932,
        "cared": 7884,
        "pct": 66.1
      },
      "vision": {
        "risk": 14922,
        "cared": 894,
        "pct": 6
      },
      "hearing": {
        "risk": 4258,
        "cared": 575,
        "pct": 13.5
      },
      "depression": {
        "risk": 1937,
        "cared": 1169,
        "pct": 60.4
      },
      "adl": {
        "risk": 6631,
        "cared": 691,
        "pct": 10.4
      },
      "urine": {
        "risk": 3458,
        "cared": 163,
        "pct": 4.7
      },
      "nutrition": {
        "risk": 2931,
        "cared": 367,
        "pct": 12.5
      }
    }
  },
  {
    "province": "ระยอง",
    "zone": "เขตสุขภาพที่ 6",
    "zone_code": "06",
    "elderly_total_69": 110656,
    "screened_total_69": 91857,
    "screened_pct": 83,
    "target_population_b": 25190,
    "risk_rate_pct": 27.4,
    "cared_population_a": 6398,
    "coverage_pct": 25.4,
    "q1_data_ready": true,
    "q2_current_pct": 25.4,
    "q3_projected_pct": 34.3,
    "q4_projected_pct": 47,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 3678,
    "gap_to_70pct": 11235,
    "domain_risks": {
      "dementia": {
        "risk": 2090,
        "cared": 409,
        "pct": 19.6
      },
      "fall": {
        "risk": 2721,
        "cared": 27,
        "pct": 1
      },
      "oral": {
        "risk": 5088,
        "cared": 3814,
        "pct": 75
      },
      "vision": {
        "risk": 5770,
        "cared": 393,
        "pct": 6.8
      },
      "hearing": {
        "risk": 1694,
        "cared": 227,
        "pct": 13.4
      },
      "depression": {
        "risk": 867,
        "cared": 549,
        "pct": 63.3
      },
      "adl": {
        "risk": 2561,
        "cared": 188,
        "pct": 7.3
      },
      "urine": {
        "risk": 1364,
        "cared": 65,
        "pct": 4.8
      },
      "nutrition": {
        "risk": 1271,
        "cared": 163,
        "pct": 12.8
      }
    }
  },
  {
    "province": "จันทบุรี",
    "zone": "เขตสุขภาพที่ 6",
    "zone_code": "06",
    "elderly_total_69": 107695,
    "screened_total_69": 85085,
    "screened_pct": 79,
    "target_population_b": 26113,
    "risk_rate_pct": 30.7,
    "cared_population_a": 7782,
    "coverage_pct": 29.8,
    "q1_data_ready": true,
    "q2_current_pct": 29.8,
    "q3_projected_pct": 40.2,
    "q4_projected_pct": 55.1,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 2663,
    "gap_to_70pct": 10497,
    "domain_risks": {
      "dementia": {
        "risk": 2152,
        "cared": 417,
        "pct": 19.4
      },
      "fall": {
        "risk": 2721,
        "cared": 22,
        "pct": 0.8
      },
      "oral": {
        "risk": 5292,
        "cared": 3272,
        "pct": 61.8
      },
      "vision": {
        "risk": 5207,
        "cared": 350,
        "pct": 6.7
      },
      "hearing": {
        "risk": 1850,
        "cared": 294,
        "pct": 15.9
      },
      "depression": {
        "risk": 691,
        "cared": 500,
        "pct": 72.4
      },
      "adl": {
        "risk": 2099,
        "cared": 216,
        "pct": 10.3
      },
      "urine": {
        "risk": 1560,
        "cared": 73,
        "pct": 4.7
      },
      "nutrition": {
        "risk": 1444,
        "cared": 172,
        "pct": 11.9
      }
    }
  },
  {
    "province": "ตราด",
    "zone": "เขตสุขภาพที่ 6",
    "zone_code": "06",
    "elderly_total_69": 41533,
    "screened_total_69": 33412,
    "screened_pct": 80.4,
    "target_population_b": 8993,
    "risk_rate_pct": 26.9,
    "cared_population_a": 3175,
    "coverage_pct": 35.3,
    "q1_data_ready": true,
    "q2_current_pct": 35.3,
    "q3_projected_pct": 47.7,
    "q4_projected_pct": 65.3,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 422,
    "gap_to_70pct": 3120,
    "domain_risks": {
      "dementia": {
        "risk": 726,
        "cared": 137,
        "pct": 18.9
      },
      "fall": {
        "risk": 1128,
        "cared": 10,
        "pct": 0.9
      },
      "oral": {
        "risk": 1377,
        "cared": 726,
        "pct": 52.7
      },
      "vision": {
        "risk": 1807,
        "cared": 119,
        "pct": 6.6
      },
      "hearing": {
        "risk": 634,
        "cared": 75,
        "pct": 11.8
      },
      "depression": {
        "risk": 307,
        "cared": 213,
        "pct": 69.4
      },
      "adl": {
        "risk": 928,
        "cared": 96,
        "pct": 10.3
      },
      "urine": {
        "risk": 520,
        "cared": 23,
        "pct": 4.4
      },
      "nutrition": {
        "risk": 426,
        "cared": 45,
        "pct": 10.6
      }
    }
  },
  {
    "province": "ฉะเชิงเทรา",
    "zone": "เขตสุขภาพที่ 6",
    "zone_code": "06",
    "elderly_total_69": 136090,
    "screened_total_69": 115403,
    "screened_pct": 84.8,
    "target_population_b": 35222,
    "risk_rate_pct": 30.5,
    "cared_population_a": 12257,
    "coverage_pct": 34.8,
    "q1_data_ready": true,
    "q2_current_pct": 34.8,
    "q3_projected_pct": 47,
    "q4_projected_pct": 64.4,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 1832,
    "gap_to_70pct": 12398,
    "domain_risks": {
      "dementia": {
        "risk": 3161,
        "cared": 684,
        "pct": 21.6
      },
      "fall": {
        "risk": 4500,
        "cared": 42,
        "pct": 0.9
      },
      "oral": {
        "risk": 6257,
        "cared": 4680,
        "pct": 74.8
      },
      "vision": {
        "risk": 7007,
        "cared": 414,
        "pct": 5.9
      },
      "hearing": {
        "risk": 2422,
        "cared": 271,
        "pct": 11.2
      },
      "depression": {
        "risk": 1203,
        "cared": 817,
        "pct": 67.9
      },
      "adl": {
        "risk": 3528,
        "cared": 261,
        "pct": 7.4
      },
      "urine": {
        "risk": 2007,
        "cared": 104,
        "pct": 5.2
      },
      "nutrition": {
        "risk": 1732,
        "cared": 202,
        "pct": 11.7
      }
    }
  },
  {
    "province": "ปราจีนบุรี",
    "zone": "เขตสุขภาพที่ 6",
    "zone_code": "06",
    "elderly_total_69": 91139,
    "screened_total_69": 75890,
    "screened_pct": 83.3,
    "target_population_b": 21321,
    "risk_rate_pct": 28.1,
    "cared_population_a": 6844,
    "coverage_pct": 32.1,
    "q1_data_ready": true,
    "q2_current_pct": 32.1,
    "q3_projected_pct": 43.3,
    "q4_projected_pct": 59.4,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 1684,
    "gap_to_70pct": 8081,
    "domain_risks": {
      "dementia": {
        "risk": 1803,
        "cared": 362,
        "pct": 20.1
      },
      "fall": {
        "risk": 2580,
        "cared": 19,
        "pct": 0.7
      },
      "oral": {
        "risk": 4006,
        "cared": 2808,
        "pct": 70.1
      },
      "vision": {
        "risk": 4107,
        "cared": 246,
        "pct": 6
      },
      "hearing": {
        "risk": 1447,
        "cared": 210,
        "pct": 14.5
      },
      "depression": {
        "risk": 567,
        "cared": 488,
        "pct": 86.1
      },
      "adl": {
        "risk": 1831,
        "cared": 144,
        "pct": 7.9
      },
      "urine": {
        "risk": 1454,
        "cared": 77,
        "pct": 5.3
      },
      "nutrition": {
        "risk": 1203,
        "cared": 119,
        "pct": 9.9
      }
    }
  },
  {
    "province": "นครนายก",
    "zone": "เขตสุขภาพที่ 4",
    "zone_code": "04",
    "elderly_total_69": 51665,
    "screened_total_69": 42705,
    "screened_pct": 82.7,
    "target_population_b": 14460,
    "risk_rate_pct": 33.9,
    "cared_population_a": 4439,
    "coverage_pct": 30.7,
    "q1_data_ready": true,
    "q2_current_pct": 30.7,
    "q3_projected_pct": 41.4,
    "q4_projected_pct": 56.8,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 1345,
    "gap_to_70pct": 5683,
    "domain_risks": {
      "dementia": {
        "risk": 1008,
        "cared": 156,
        "pct": 15.5
      },
      "fall": {
        "risk": 1605,
        "cared": 12,
        "pct": 0.7
      },
      "oral": {
        "risk": 2484,
        "cared": 1824,
        "pct": 73.4
      },
      "vision": {
        "risk": 3076,
        "cared": 179,
        "pct": 5.8
      },
      "hearing": {
        "risk": 1079,
        "cared": 143,
        "pct": 13.3
      },
      "depression": {
        "risk": 402,
        "cared": 299,
        "pct": 74.4
      },
      "adl": {
        "risk": 1144,
        "cared": 85,
        "pct": 7.4
      },
      "urine": {
        "risk": 882,
        "cared": 47,
        "pct": 5.3
      },
      "nutrition": {
        "risk": 733,
        "cared": 81,
        "pct": 11.1
      }
    }
  },
  {
    "province": "สระแก้ว",
    "zone": "เขตสุขภาพที่ 6",
    "zone_code": "06",
    "elderly_total_69": 88821,
    "screened_total_69": 81175,
    "screened_pct": 91.4,
    "target_population_b": 26865,
    "risk_rate_pct": 33.1,
    "cared_population_a": 11042,
    "coverage_pct": 41.1,
    "q1_data_ready": true,
    "q2_current_pct": 41.1,
    "q3_projected_pct": 55.5,
    "q4_projected_pct": 76,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 7764,
    "domain_risks": {
      "dementia": {
        "risk": 1884,
        "cared": 293,
        "pct": 15.6
      },
      "fall": {
        "risk": 3199,
        "cared": 25,
        "pct": 0.8
      },
      "oral": {
        "risk": 4157,
        "cared": 2189,
        "pct": 52.7
      },
      "vision": {
        "risk": 5838,
        "cared": 365,
        "pct": 6.3
      },
      "hearing": {
        "risk": 1696,
        "cared": 208,
        "pct": 12.3
      },
      "depression": {
        "risk": 716,
        "cared": 605,
        "pct": 84.5
      },
      "adl": {
        "risk": 2683,
        "cared": 250,
        "pct": 9.3
      },
      "urine": {
        "risk": 1806,
        "cared": 87,
        "pct": 4.8
      },
      "nutrition": {
        "risk": 1271,
        "cared": 149,
        "pct": 11.7
      }
    }
  },
  {
    "province": "นครราชสีมา",
    "zone": "เขตสุขภาพที่ 9",
    "zone_code": "09",
    "elderly_total_69": 486575,
    "screened_total_69": 417375,
    "screened_pct": 85.8,
    "target_population_b": 133751,
    "risk_rate_pct": 32,
    "cared_population_a": 31431,
    "coverage_pct": 23.5,
    "q1_data_ready": true,
    "q2_current_pct": 23.5,
    "q3_projected_pct": 31.7,
    "q4_projected_pct": 43.5,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 22069,
    "gap_to_70pct": 62195,
    "domain_risks": {
      "dementia": {
        "risk": 11145,
        "cared": 2192,
        "pct": 19.7
      },
      "fall": {
        "risk": 14123,
        "cared": 139,
        "pct": 1
      },
      "oral": {
        "risk": 21174,
        "cared": 15874,
        "pct": 75
      },
      "vision": {
        "risk": 29084,
        "cared": 2101,
        "pct": 7.2
      },
      "hearing": {
        "risk": 8116,
        "cared": 1167,
        "pct": 14.4
      },
      "depression": {
        "risk": 4221,
        "cared": 2745,
        "pct": 65
      },
      "adl": {
        "risk": 11549,
        "cared": 846,
        "pct": 7.3
      },
      "urine": {
        "risk": 7381,
        "cared": 372,
        "pct": 5
      },
      "nutrition": {
        "risk": 7461,
        "cared": 858,
        "pct": 11.5
      }
    }
  },
  {
    "province": "บุรีรัมย์",
    "zone": "เขตสุขภาพที่ 9",
    "zone_code": "09",
    "elderly_total_69": 255011,
    "screened_total_69": 231066,
    "screened_pct": 90.6,
    "target_population_b": 69951,
    "risk_rate_pct": 30.3,
    "cared_population_a": 13850,
    "coverage_pct": 19.8,
    "q1_data_ready": true,
    "q2_current_pct": 19.8,
    "q3_projected_pct": 26.7,
    "q4_projected_pct": 36.6,
    "q2_target_met": false,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 140,
    "gap_to_40pct": 14130,
    "gap_to_70pct": 35116,
    "domain_risks": {
      "dementia": {
        "risk": 5536,
        "cared": 1017,
        "pct": 18.4
      },
      "fall": {
        "risk": 8018,
        "cared": 60,
        "pct": 0.7
      },
      "oral": {
        "risk": 12306,
        "cared": 8429,
        "pct": 68.5
      },
      "vision": {
        "risk": 14091,
        "cared": 741,
        "pct": 5.3
      },
      "hearing": {
        "risk": 4558,
        "cared": 509,
        "pct": 11.2
      },
      "depression": {
        "risk": 1846,
        "cared": 1509,
        "pct": 81.7
      },
      "adl": {
        "risk": 5482,
        "cared": 530,
        "pct": 9.7
      },
      "urine": {
        "risk": 4583,
        "cared": 282,
        "pct": 6.2
      },
      "nutrition": {
        "risk": 3453,
        "cared": 458,
        "pct": 13.3
      }
    }
  },
  {
    "province": "สุรินทร์",
    "zone": "เขตสุขภาพที่ 9",
    "zone_code": "09",
    "elderly_total_69": 239024,
    "screened_total_69": 194212,
    "screened_pct": 81.3,
    "target_population_b": 60359,
    "risk_rate_pct": 31.1,
    "cared_population_a": 16055,
    "coverage_pct": 26.6,
    "q1_data_ready": true,
    "q2_current_pct": 26.6,
    "q3_projected_pct": 35.9,
    "q4_projected_pct": 49.2,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 8089,
    "gap_to_70pct": 26196,
    "domain_risks": {
      "dementia": {
        "risk": 4581,
        "cared": 795,
        "pct": 17.4
      },
      "fall": {
        "risk": 7203,
        "cared": 64,
        "pct": 0.9
      },
      "oral": {
        "risk": 9726,
        "cared": 6332,
        "pct": 65.1
      },
      "vision": {
        "risk": 12626,
        "cared": 866,
        "pct": 6.9
      },
      "hearing": {
        "risk": 4311,
        "cared": 605,
        "pct": 14
      },
      "depression": {
        "risk": 1959,
        "cared": 1486,
        "pct": 75.9
      },
      "adl": {
        "risk": 4750,
        "cared": 422,
        "pct": 8.9
      },
      "urine": {
        "risk": 3734,
        "cared": 216,
        "pct": 5.8
      },
      "nutrition": {
        "risk": 2887,
        "cared": 311,
        "pct": 10.8
      }
    }
  },
  {
    "province": "ศรีสะเกษ",
    "zone": "เขตสุขภาพที่ 10",
    "zone_code": "10",
    "elderly_total_69": 248961,
    "screened_total_69": 222296,
    "screened_pct": 89.3,
    "target_population_b": 62735,
    "risk_rate_pct": 28.2,
    "cared_population_a": 22710,
    "coverage_pct": 36.2,
    "q1_data_ready": true,
    "q2_current_pct": 36.2,
    "q3_projected_pct": 48.9,
    "q4_projected_pct": 67,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 2384,
    "gap_to_70pct": 21205,
    "domain_risks": {
      "dementia": {
        "risk": 5289,
        "cared": 1056,
        "pct": 20
      },
      "fall": {
        "risk": 7383,
        "cared": 67,
        "pct": 0.9
      },
      "oral": {
        "risk": 10074,
        "cared": 5814,
        "pct": 57.7
      },
      "vision": {
        "risk": 15261,
        "cared": 1102,
        "pct": 7.2
      },
      "hearing": {
        "risk": 4552,
        "cared": 516,
        "pct": 11.3
      },
      "depression": {
        "risk": 1910,
        "cared": 1334,
        "pct": 69.8
      },
      "adl": {
        "risk": 5495,
        "cared": 518,
        "pct": 9.4
      },
      "urine": {
        "risk": 3648,
        "cared": 215,
        "pct": 5.9
      },
      "nutrition": {
        "risk": 2950,
        "cared": 334,
        "pct": 11.3
      }
    }
  },
  {
    "province": "อุบลราชธานี",
    "zone": "เขตสุขภาพที่ 10",
    "zone_code": "10",
    "elderly_total_69": 296984,
    "screened_total_69": 256758,
    "screened_pct": 86.5,
    "target_population_b": 70126,
    "risk_rate_pct": 27.3,
    "cared_population_a": 26578,
    "coverage_pct": 37.9,
    "q1_data_ready": true,
    "q2_current_pct": 37.9,
    "q3_projected_pct": 51.2,
    "q4_projected_pct": 70.1,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 1472,
    "gap_to_70pct": 22510,
    "domain_risks": {
      "dementia": {
        "risk": 5199,
        "cared": 874,
        "pct": 16.8
      },
      "fall": {
        "risk": 9205,
        "cared": 72,
        "pct": 0.8
      },
      "oral": {
        "risk": 12799,
        "cared": 8380,
        "pct": 65.5
      },
      "vision": {
        "risk": 16238,
        "cared": 986,
        "pct": 6.1
      },
      "hearing": {
        "risk": 5124,
        "cared": 608,
        "pct": 11.9
      },
      "depression": {
        "risk": 2230,
        "cared": 1414,
        "pct": 63.4
      },
      "adl": {
        "risk": 6169,
        "cared": 506,
        "pct": 8.2
      },
      "urine": {
        "risk": 3800,
        "cared": 224,
        "pct": 5.9
      },
      "nutrition": {
        "risk": 3478,
        "cared": 361,
        "pct": 10.4
      }
    }
  },
  {
    "province": "ยโสธร",
    "zone": "เขตสุขภาพที่ 10",
    "zone_code": "10",
    "elderly_total_69": 89946,
    "screened_total_69": 75154,
    "screened_pct": 83.6,
    "target_population_b": 25762,
    "risk_rate_pct": 34.3,
    "cared_population_a": 9970,
    "coverage_pct": 38.7,
    "q1_data_ready": true,
    "q2_current_pct": 38.7,
    "q3_projected_pct": 52.2,
    "q4_projected_pct": 71.6,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 335,
    "gap_to_70pct": 8063,
    "domain_risks": {
      "dementia": {
        "risk": 2045,
        "cared": 377,
        "pct": 18.4
      },
      "fall": {
        "risk": 2888,
        "cared": 22,
        "pct": 0.8
      },
      "oral": {
        "risk": 4937,
        "cared": 3628,
        "pct": 73.5
      },
      "vision": {
        "risk": 6051,
        "cared": 312,
        "pct": 5.2
      },
      "hearing": {
        "risk": 1568,
        "cared": 192,
        "pct": 12.2
      },
      "depression": {
        "risk": 738,
        "cared": 542,
        "pct": 73.4
      },
      "adl": {
        "risk": 2459,
        "cared": 227,
        "pct": 9.2
      },
      "urine": {
        "risk": 1555,
        "cared": 88,
        "pct": 5.7
      },
      "nutrition": {
        "risk": 1274,
        "cared": 174,
        "pct": 13.7
      }
    }
  },
  {
    "province": "ชัยภูมิ",
    "zone": "เขตสุขภาพที่ 9",
    "zone_code": "09",
    "elderly_total_69": 215903,
    "screened_total_69": 173753,
    "screened_pct": 80.5,
    "target_population_b": 48327,
    "risk_rate_pct": 27.8,
    "cared_population_a": 9714,
    "coverage_pct": 20.1,
    "q1_data_ready": true,
    "q2_current_pct": 20.1,
    "q3_projected_pct": 27.1,
    "q4_projected_pct": 37.2,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 9617,
    "gap_to_70pct": 24115,
    "domain_risks": {
      "dementia": {
        "risk": 3475,
        "cared": 560,
        "pct": 16.1
      },
      "fall": {
        "risk": 5619,
        "cared": 55,
        "pct": 1
      },
      "oral": {
        "risk": 8504,
        "cared": 6027,
        "pct": 70.9
      },
      "vision": {
        "risk": 11359,
        "cared": 762,
        "pct": 6.7
      },
      "hearing": {
        "risk": 3631,
        "cared": 461,
        "pct": 12.7
      },
      "depression": {
        "risk": 1512,
        "cared": 956,
        "pct": 63.2
      },
      "adl": {
        "risk": 3915,
        "cared": 279,
        "pct": 7.1
      },
      "urine": {
        "risk": 2613,
        "cared": 167,
        "pct": 6.4
      },
      "nutrition": {
        "risk": 2499,
        "cared": 260,
        "pct": 10.4
      }
    }
  },
  {
    "province": "อำนาจเจริญ",
    "zone": "เขตสุขภาพที่ 10",
    "zone_code": "10",
    "elderly_total_69": 66865,
    "screened_total_69": 57014,
    "screened_pct": 85.3,
    "target_population_b": 14872,
    "risk_rate_pct": 26.1,
    "cared_population_a": 6216,
    "coverage_pct": 41.8,
    "q1_data_ready": true,
    "q2_current_pct": 41.8,
    "q3_projected_pct": 56.4,
    "q4_projected_pct": 77.3,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 4194,
    "domain_risks": {
      "dementia": {
        "risk": 1303,
        "cared": 274,
        "pct": 21
      },
      "fall": {
        "risk": 1623,
        "cared": 16,
        "pct": 1
      },
      "oral": {
        "risk": 2380,
        "cared": 1723,
        "pct": 72.4
      },
      "vision": {
        "risk": 3399,
        "cared": 187,
        "pct": 5.5
      },
      "hearing": {
        "risk": 1154,
        "cared": 169,
        "pct": 14.6
      },
      "depression": {
        "risk": 385,
        "cared": 314,
        "pct": 81.6
      },
      "adl": {
        "risk": 1216,
        "cared": 106,
        "pct": 8.7
      },
      "urine": {
        "risk": 972,
        "cared": 48,
        "pct": 4.9
      },
      "nutrition": {
        "risk": 785,
        "cared": 102,
        "pct": 13
      }
    }
  },
  {
    "province": "บึงกาฬ",
    "zone": "เขตสุขภาพที่ 8",
    "zone_code": "08",
    "elderly_total_69": 65099,
    "screened_total_69": 52329,
    "screened_pct": 80.4,
    "target_population_b": 17645,
    "risk_rate_pct": 33.7,
    "cared_population_a": 8046,
    "coverage_pct": 45.6,
    "q1_data_ready": true,
    "q2_current_pct": 45.6,
    "q3_projected_pct": 61.6,
    "q4_projected_pct": 84.4,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 4306,
    "domain_risks": {
      "dementia": {
        "risk": 1212,
        "cared": 183,
        "pct": 15.1
      },
      "fall": {
        "risk": 2366,
        "cared": 22,
        "pct": 0.9
      },
      "oral": {
        "risk": 3636,
        "cared": 2285,
        "pct": 62.8
      },
      "vision": {
        "risk": 4410,
        "cared": 282,
        "pct": 6.4
      },
      "hearing": {
        "risk": 1255,
        "cared": 151,
        "pct": 12
      },
      "depression": {
        "risk": 530,
        "cared": 375,
        "pct": 70.8
      },
      "adl": {
        "risk": 1781,
        "cared": 126,
        "pct": 7.1
      },
      "urine": {
        "risk": 1036,
        "cared": 54,
        "pct": 5.2
      },
      "nutrition": {
        "risk": 951,
        "cared": 93,
        "pct": 9.8
      }
    }
  },
  {
    "province": "หนองบัวลำภู",
    "zone": "เขตสุขภาพที่ 8",
    "zone_code": "08",
    "elderly_total_69": 94352,
    "screened_total_69": 84147,
    "screened_pct": 89.2,
    "target_population_b": 26556,
    "risk_rate_pct": 31.6,
    "cared_population_a": 9480,
    "coverage_pct": 35.7,
    "q1_data_ready": true,
    "q2_current_pct": 35.7,
    "q3_projected_pct": 48.2,
    "q4_projected_pct": 66,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 1142,
    "gap_to_70pct": 9109,
    "domain_risks": {
      "dementia": {
        "risk": 1986,
        "cared": 338,
        "pct": 17
      },
      "fall": {
        "risk": 2906,
        "cared": 23,
        "pct": 0.8
      },
      "oral": {
        "risk": 5073,
        "cared": 2671,
        "pct": 52.7
      },
      "vision": {
        "risk": 5478,
        "cared": 380,
        "pct": 6.9
      },
      "hearing": {
        "risk": 1774,
        "cared": 267,
        "pct": 15.1
      },
      "depression": {
        "risk": 684,
        "cared": 480,
        "pct": 70.2
      },
      "adl": {
        "risk": 2158,
        "cared": 224,
        "pct": 10.4
      },
      "urine": {
        "risk": 1550,
        "cared": 72,
        "pct": 4.6
      },
      "nutrition": {
        "risk": 1320,
        "cared": 164,
        "pct": 12.4
      }
    }
  },
  {
    "province": "ขอนแก่น",
    "zone": "เขตสุขภาพที่ 7",
    "zone_code": "07",
    "elderly_total_69": 329780,
    "screened_total_69": 277078,
    "screened_pct": 84,
    "target_population_b": 73217,
    "risk_rate_pct": 26.4,
    "cared_population_a": 21306,
    "coverage_pct": 29.1,
    "q1_data_ready": true,
    "q2_current_pct": 29.1,
    "q3_projected_pct": 39.3,
    "q4_projected_pct": 53.8,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 7981,
    "gap_to_70pct": 29946,
    "domain_risks": {
      "dementia": {
        "risk": 6420,
        "cared": 1349,
        "pct": 21
      },
      "fall": {
        "risk": 9460,
        "cared": 77,
        "pct": 0.8
      },
      "oral": {
        "risk": 12784,
        "cared": 9752,
        "pct": 76.3
      },
      "vision": {
        "risk": 15582,
        "cared": 867,
        "pct": 5.6
      },
      "hearing": {
        "risk": 5868,
        "cared": 698,
        "pct": 11.9
      },
      "depression": {
        "risk": 2507,
        "cared": 1524,
        "pct": 60.8
      },
      "adl": {
        "risk": 6843,
        "cared": 522,
        "pct": 7.6
      },
      "urine": {
        "risk": 3848,
        "cared": 207,
        "pct": 5.4
      },
      "nutrition": {
        "risk": 3124,
        "cared": 437,
        "pct": 14
      }
    }
  },
  {
    "province": "อุดรธานี",
    "zone": "เขตสุขภาพที่ 8",
    "zone_code": "08",
    "elderly_total_69": 273635,
    "screened_total_69": 229075,
    "screened_pct": 83.7,
    "target_population_b": 70197,
    "risk_rate_pct": 30.6,
    "cared_population_a": 34748,
    "coverage_pct": 49.5,
    "q1_data_ready": true,
    "q2_current_pct": 49.5,
    "q3_projected_pct": 66.8,
    "q4_projected_pct": 91.6,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 14390,
    "domain_risks": {
      "dementia": {
        "risk": 5964,
        "cared": 1203,
        "pct": 20.2
      },
      "fall": {
        "risk": 7339,
        "cared": 72,
        "pct": 1
      },
      "oral": {
        "risk": 14482,
        "cared": 9894,
        "pct": 68.3
      },
      "vision": {
        "risk": 13865,
        "cared": 903,
        "pct": 6.5
      },
      "hearing": {
        "risk": 5395,
        "cared": 619,
        "pct": 11.5
      },
      "depression": {
        "risk": 1907,
        "cared": 1380,
        "pct": 72.4
      },
      "adl": {
        "risk": 5524,
        "cared": 509,
        "pct": 9.2
      },
      "urine": {
        "risk": 4192,
        "cared": 241,
        "pct": 5.7
      },
      "nutrition": {
        "risk": 3734,
        "cared": 458,
        "pct": 12.3
      }
    }
  },
  {
    "province": "เลย",
    "zone": "เขตสุขภาพที่ 8",
    "zone_code": "08",
    "elderly_total_69": 129417,
    "screened_total_69": 102511,
    "screened_pct": 79.2,
    "target_population_b": 27857,
    "risk_rate_pct": 27.2,
    "cared_population_a": 12369,
    "coverage_pct": 44.4,
    "q1_data_ready": true,
    "q2_current_pct": 44.4,
    "q3_projected_pct": 59.9,
    "q4_projected_pct": 82.1,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 7131,
    "domain_risks": {
      "dementia": {
        "risk": 1977,
        "cared": 313,
        "pct": 15.8
      },
      "fall": {
        "risk": 3481,
        "cared": 27,
        "pct": 0.8
      },
      "oral": {
        "risk": 5415,
        "cared": 3828,
        "pct": 70.7
      },
      "vision": {
        "risk": 6107,
        "cared": 359,
        "pct": 5.9
      },
      "hearing": {
        "risk": 1722,
        "cared": 269,
        "pct": 15.6
      },
      "depression": {
        "risk": 871,
        "cared": 634,
        "pct": 72.8
      },
      "adl": {
        "risk": 2285,
        "cared": 223,
        "pct": 9.8
      },
      "urine": {
        "risk": 1671,
        "cared": 80,
        "pct": 4.8
      },
      "nutrition": {
        "risk": 1450,
        "cared": 191,
        "pct": 13.2
      }
    }
  },
  {
    "province": "หนองคาย",
    "zone": "เขตสุขภาพที่ 8",
    "zone_code": "08",
    "elderly_total_69": 86233,
    "screened_total_69": 73107,
    "screened_pct": 84.8,
    "target_population_b": 23163,
    "risk_rate_pct": 31.7,
    "cared_population_a": 4980,
    "coverage_pct": 21.5,
    "q1_data_ready": true,
    "q2_current_pct": 21.5,
    "q3_projected_pct": 29,
    "q4_projected_pct": 39.8,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 4285,
    "gap_to_70pct": 11234,
    "domain_risks": {
      "dementia": {
        "risk": 1978,
        "cared": 402,
        "pct": 20.3
      },
      "fall": {
        "risk": 3165,
        "cared": 28,
        "pct": 0.9
      },
      "oral": {
        "risk": 4027,
        "cared": 2949,
        "pct": 73.2
      },
      "vision": {
        "risk": 5342,
        "cared": 318,
        "pct": 6
      },
      "hearing": {
        "risk": 1776,
        "cared": 237,
        "pct": 13.3
      },
      "depression": {
        "risk": 757,
        "cared": 626,
        "pct": 82.7
      },
      "adl": {
        "risk": 1904,
        "cared": 139,
        "pct": 7.3
      },
      "urine": {
        "risk": 1531,
        "cared": 75,
        "pct": 4.9
      },
      "nutrition": {
        "risk": 1082,
        "cared": 110,
        "pct": 10.2
      }
    }
  },
  {
    "province": "มหาสารคาม",
    "zone": "เขตสุขภาพที่ 7",
    "zone_code": "07",
    "elderly_total_69": 178849,
    "screened_total_69": 152010,
    "screened_pct": 85,
    "target_population_b": 44255,
    "risk_rate_pct": 29.1,
    "cared_population_a": 19561,
    "coverage_pct": 44.2,
    "q1_data_ready": true,
    "q2_current_pct": 44.2,
    "q3_projected_pct": 59.7,
    "q4_projected_pct": 81.8,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 11417,
    "domain_risks": {
      "dementia": {
        "risk": 3874,
        "cared": 812,
        "pct": 21
      },
      "fall": {
        "risk": 5471,
        "cared": 51,
        "pct": 0.9
      },
      "oral": {
        "risk": 8132,
        "cared": 5924,
        "pct": 72.8
      },
      "vision": {
        "risk": 8936,
        "cared": 591,
        "pct": 6.6
      },
      "hearing": {
        "risk": 3240,
        "cared": 360,
        "pct": 11.1
      },
      "depression": {
        "risk": 1165,
        "cared": 887,
        "pct": 76.1
      },
      "adl": {
        "risk": 3510,
        "cared": 280,
        "pct": 8
      },
      "urine": {
        "risk": 2746,
        "cared": 141,
        "pct": 5.1
      },
      "nutrition": {
        "risk": 2337,
        "cared": 280,
        "pct": 12
      }
    }
  },
  {
    "province": "ร้อยเอ็ด",
    "zone": "เขตสุขภาพที่ 7",
    "zone_code": "07",
    "elderly_total_69": 238923,
    "screened_total_69": 214419,
    "screened_pct": 89.7,
    "target_population_b": 59754,
    "risk_rate_pct": 27.9,
    "cared_population_a": 23244,
    "coverage_pct": 38.9,
    "q1_data_ready": true,
    "q2_current_pct": 38.9,
    "q3_projected_pct": 52.5,
    "q4_projected_pct": 72,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 658,
    "gap_to_70pct": 18584,
    "domain_risks": {
      "dementia": {
        "risk": 5175,
        "cared": 1070,
        "pct": 20.7
      },
      "fall": {
        "risk": 7802,
        "cared": 62,
        "pct": 0.8
      },
      "oral": {
        "risk": 10320,
        "cared": 5357,
        "pct": 51.9
      },
      "vision": {
        "risk": 12290,
        "cared": 724,
        "pct": 5.9
      },
      "hearing": {
        "risk": 4210,
        "cared": 600,
        "pct": 14.3
      },
      "depression": {
        "risk": 1677,
        "cared": 1067,
        "pct": 63.6
      },
      "adl": {
        "risk": 5829,
        "cared": 483,
        "pct": 8.3
      },
      "urine": {
        "risk": 3245,
        "cared": 164,
        "pct": 5.1
      },
      "nutrition": {
        "risk": 3335,
        "cared": 339,
        "pct": 10.2
      }
    }
  },
  {
    "province": "กาฬสินธุ์",
    "zone": "เขตสุขภาพที่ 7",
    "zone_code": "07",
    "elderly_total_69": 179549,
    "screened_total_69": 155471,
    "screened_pct": 86.6,
    "target_population_b": 49091,
    "risk_rate_pct": 31.6,
    "cared_population_a": 17035,
    "coverage_pct": 34.7,
    "q1_data_ready": true,
    "q2_current_pct": 34.7,
    "q3_projected_pct": 46.8,
    "q4_projected_pct": 64.2,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 2601,
    "gap_to_70pct": 17329,
    "domain_risks": {
      "dementia": {
        "risk": 4237,
        "cared": 872,
        "pct": 20.6
      },
      "fall": {
        "risk": 5295,
        "cared": 48,
        "pct": 0.9
      },
      "oral": {
        "risk": 9685,
        "cared": 6047,
        "pct": 62.4
      },
      "vision": {
        "risk": 10385,
        "cared": 636,
        "pct": 6.1
      },
      "hearing": {
        "risk": 3411,
        "cared": 416,
        "pct": 12.2
      },
      "depression": {
        "risk": 1417,
        "cared": 1059,
        "pct": 74.7
      },
      "adl": {
        "risk": 4461,
        "cared": 336,
        "pct": 7.5
      },
      "urine": {
        "risk": 3003,
        "cared": 171,
        "pct": 5.7
      },
      "nutrition": {
        "risk": 2330,
        "cared": 293,
        "pct": 12.6
      }
    }
  },
  {
    "province": "สกลนคร",
    "zone": "เขตสุขภาพที่ 8",
    "zone_code": "08",
    "elderly_total_69": 193469,
    "screened_total_69": 155869,
    "screened_pct": 80.6,
    "target_population_b": 44274,
    "risk_rate_pct": 28.4,
    "cared_population_a": 14699,
    "coverage_pct": 33.2,
    "q1_data_ready": true,
    "q2_current_pct": 33.2,
    "q3_projected_pct": 44.8,
    "q4_projected_pct": 61.4,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 3011,
    "gap_to_70pct": 16293,
    "domain_risks": {
      "dementia": {
        "risk": 3304,
        "cared": 560,
        "pct": 16.9
      },
      "fall": {
        "risk": 5380,
        "cared": 57,
        "pct": 1.1
      },
      "oral": {
        "risk": 6863,
        "cared": 3815,
        "pct": 55.6
      },
      "vision": {
        "risk": 9288,
        "cared": 611,
        "pct": 6.6
      },
      "hearing": {
        "risk": 2815,
        "cared": 354,
        "pct": 12.6
      },
      "depression": {
        "risk": 1193,
        "cared": 1004,
        "pct": 84.2
      },
      "adl": {
        "risk": 3485,
        "cared": 356,
        "pct": 10.2
      },
      "urine": {
        "risk": 2967,
        "cared": 131,
        "pct": 4.4
      },
      "nutrition": {
        "risk": 2462,
        "cared": 326,
        "pct": 13.2
      }
    }
  },
  {
    "province": "นครพนม",
    "zone": "เขตสุขภาพที่ 8",
    "zone_code": "08",
    "elderly_total_69": 111666,
    "screened_total_69": 95933,
    "screened_pct": 85.9,
    "target_population_b": 28314,
    "risk_rate_pct": 29.5,
    "cared_population_a": 6852,
    "coverage_pct": 24.2,
    "q1_data_ready": true,
    "q2_current_pct": 24.2,
    "q3_projected_pct": 32.7,
    "q4_projected_pct": 44.8,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 4474,
    "gap_to_70pct": 12968,
    "domain_risks": {
      "dementia": {
        "risk": 1942,
        "cared": 293,
        "pct": 15.1
      },
      "fall": {
        "risk": 3047,
        "cared": 30,
        "pct": 1
      },
      "oral": {
        "risk": 5641,
        "cared": 4327,
        "pct": 76.7
      },
      "vision": {
        "risk": 6475,
        "cared": 370,
        "pct": 5.7
      },
      "hearing": {
        "risk": 2108,
        "cared": 274,
        "pct": 13
      },
      "depression": {
        "risk": 958,
        "cared": 590,
        "pct": 61.6
      },
      "adl": {
        "risk": 2782,
        "cared": 195,
        "pct": 7
      },
      "urine": {
        "risk": 1502,
        "cared": 84,
        "pct": 5.6
      },
      "nutrition": {
        "risk": 1397,
        "cared": 172,
        "pct": 12.3
      }
    }
  },
  {
    "province": "มุกดาหาร",
    "zone": "เขตสุขภาพที่ 10",
    "zone_code": "10",
    "elderly_total_69": 57105,
    "screened_total_69": 51657,
    "screened_pct": 90.5,
    "target_population_b": 17349,
    "risk_rate_pct": 33.6,
    "cared_population_a": 7078,
    "coverage_pct": 40.8,
    "q1_data_ready": true,
    "q2_current_pct": 40.8,
    "q3_projected_pct": 55.1,
    "q4_projected_pct": 75.5,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 5066,
    "domain_risks": {
      "dementia": {
        "risk": 1266,
        "cared": 208,
        "pct": 16.4
      },
      "fall": {
        "risk": 2183,
        "cared": 18,
        "pct": 0.8
      },
      "oral": {
        "risk": 3486,
        "cared": 1902,
        "pct": 54.6
      },
      "vision": {
        "risk": 3289,
        "cared": 187,
        "pct": 5.7
      },
      "hearing": {
        "risk": 1332,
        "cared": 213,
        "pct": 16
      },
      "depression": {
        "risk": 444,
        "cared": 340,
        "pct": 76.6
      },
      "adl": {
        "risk": 1452,
        "cared": 132,
        "pct": 9.1
      },
      "urine": {
        "risk": 1082,
        "cared": 53,
        "pct": 4.9
      },
      "nutrition": {
        "risk": 747,
        "cared": 101,
        "pct": 13.5
      }
    }
  },
  {
    "province": "เชียงใหม่",
    "zone": "เขตสุขภาพที่ 1",
    "zone_code": "01",
    "elderly_total_69": 353892,
    "screened_total_69": 281655,
    "screened_pct": 79.6,
    "target_population_b": 93346,
    "risk_rate_pct": 33.1,
    "cared_population_a": 41446,
    "coverage_pct": 44.4,
    "q1_data_ready": true,
    "q2_current_pct": 44.4,
    "q3_projected_pct": 59.9,
    "q4_projected_pct": 82.1,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 23896,
    "domain_risks": {
      "dementia": {
        "risk": 8387,
        "cared": 1819,
        "pct": 21.7
      },
      "fall": {
        "risk": 12240,
        "cared": 119,
        "pct": 1
      },
      "oral": {
        "risk": 15481,
        "cared": 9303,
        "pct": 60.1
      },
      "vision": {
        "risk": 21082,
        "cared": 1381,
        "pct": 6.6
      },
      "hearing": {
        "risk": 7073,
        "cared": 945,
        "pct": 13.4
      },
      "depression": {
        "risk": 2887,
        "cared": 1865,
        "pct": 64.6
      },
      "adl": {
        "risk": 8388,
        "cared": 790,
        "pct": 9.4
      },
      "urine": {
        "risk": 5126,
        "cared": 286,
        "pct": 5.6
      },
      "nutrition": {
        "risk": 4703,
        "cared": 514,
        "pct": 10.9
      }
    }
  },
  {
    "province": "ลำพูน",
    "zone": "เขตสุขภาพที่ 1",
    "zone_code": "01",
    "elderly_total_69": 110715,
    "screened_total_69": 96136,
    "screened_pct": 86.8,
    "target_population_b": 26752,
    "risk_rate_pct": 27.8,
    "cared_population_a": 11450,
    "coverage_pct": 42.8,
    "q1_data_ready": true,
    "q2_current_pct": 42.8,
    "q3_projected_pct": 57.8,
    "q4_projected_pct": 79.2,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 7276,
    "domain_risks": {
      "dementia": {
        "risk": 2085,
        "cared": 375,
        "pct": 18
      },
      "fall": {
        "risk": 3309,
        "cared": 33,
        "pct": 1
      },
      "oral": {
        "risk": 5434,
        "cared": 3694,
        "pct": 68
      },
      "vision": {
        "risk": 5502,
        "cared": 329,
        "pct": 6
      },
      "hearing": {
        "risk": 1828,
        "cared": 249,
        "pct": 13.6
      },
      "depression": {
        "risk": 850,
        "cared": 688,
        "pct": 80.9
      },
      "adl": {
        "risk": 2104,
        "cared": 153,
        "pct": 7.3
      },
      "urine": {
        "risk": 1738,
        "cared": 98,
        "pct": 5.6
      },
      "nutrition": {
        "risk": 1389,
        "cared": 180,
        "pct": 13
      }
    }
  },
  {
    "province": "ลำปาง",
    "zone": "เขตสุขภาพที่ 1",
    "zone_code": "01",
    "elderly_total_69": 186905,
    "screened_total_69": 151476,
    "screened_pct": 81,
    "target_population_b": 41510,
    "risk_rate_pct": 27.4,
    "cared_population_a": 13076,
    "coverage_pct": 31.5,
    "q1_data_ready": true,
    "q2_current_pct": 31.5,
    "q3_projected_pct": 42.5,
    "q4_projected_pct": 58.3,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 3528,
    "gap_to_70pct": 15981,
    "domain_risks": {
      "dementia": {
        "risk": 3599,
        "cared": 745,
        "pct": 20.7
      },
      "fall": {
        "risk": 5518,
        "cared": 48,
        "pct": 0.9
      },
      "oral": {
        "risk": 8333,
        "cared": 6393,
        "pct": 76.7
      },
      "vision": {
        "risk": 9360,
        "cared": 495,
        "pct": 5.3
      },
      "hearing": {
        "risk": 3141,
        "cared": 473,
        "pct": 15.1
      },
      "depression": {
        "risk": 1088,
        "cared": 676,
        "pct": 62.1
      },
      "adl": {
        "risk": 3785,
        "cared": 345,
        "pct": 9.1
      },
      "urine": {
        "risk": 2216,
        "cared": 128,
        "pct": 5.8
      },
      "nutrition": {
        "risk": 1875,
        "cared": 264,
        "pct": 14.1
      }
    }
  },
  {
    "province": "อุตรดิตถ์",
    "zone": "เขตสุขภาพที่ 2",
    "zone_code": "02",
    "elderly_total_69": 103545,
    "screened_total_69": 92025,
    "screened_pct": 88.9,
    "target_population_b": 25376,
    "risk_rate_pct": 27.6,
    "cared_population_a": 10810,
    "coverage_pct": 42.6,
    "q1_data_ready": true,
    "q2_current_pct": 42.6,
    "q3_projected_pct": 57.5,
    "q4_projected_pct": 78.8,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 6953,
    "domain_risks": {
      "dementia": {
        "risk": 1854,
        "cared": 305,
        "pct": 16.5
      },
      "fall": {
        "risk": 2876,
        "cared": 22,
        "pct": 0.8
      },
      "oral": {
        "risk": 4040,
        "cared": 2696,
        "pct": 66.7
      },
      "vision": {
        "risk": 5787,
        "cared": 411,
        "pct": 7.1
      },
      "hearing": {
        "risk": 1859,
        "cared": 224,
        "pct": 12
      },
      "depression": {
        "risk": 786,
        "cared": 572,
        "pct": 72.8
      },
      "adl": {
        "risk": 2568,
        "cared": 211,
        "pct": 8.2
      },
      "urine": {
        "risk": 1521,
        "cared": 74,
        "pct": 4.9
      },
      "nutrition": {
        "risk": 1364,
        "cared": 171,
        "pct": 12.5
      }
    }
  },
  {
    "province": "แพร่",
    "zone": "เขตสุขภาพที่ 1",
    "zone_code": "01",
    "elderly_total_69": 113611,
    "screened_total_69": 90731,
    "screened_pct": 79.9,
    "target_population_b": 24141,
    "risk_rate_pct": 26.6,
    "cared_population_a": 9415,
    "coverage_pct": 39,
    "q1_data_ready": true,
    "q2_current_pct": 39,
    "q3_projected_pct": 52.7,
    "q4_projected_pct": 72.2,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 241,
    "gap_to_70pct": 7484,
    "domain_risks": {
      "dementia": {
        "risk": 2002,
        "cared": 391,
        "pct": 19.5
      },
      "fall": {
        "risk": 3105,
        "cared": 30,
        "pct": 1
      },
      "oral": {
        "risk": 3699,
        "cared": 2213,
        "pct": 59.8
      },
      "vision": {
        "risk": 5577,
        "cared": 347,
        "pct": 6.2
      },
      "hearing": {
        "risk": 1885,
        "cared": 274,
        "pct": 14.5
      },
      "depression": {
        "risk": 694,
        "cared": 523,
        "pct": 75.4
      },
      "adl": {
        "risk": 2220,
        "cared": 200,
        "pct": 9
      },
      "urine": {
        "risk": 1487,
        "cared": 66,
        "pct": 4.4
      },
      "nutrition": {
        "risk": 1093,
        "cared": 120,
        "pct": 11
      }
    }
  },
  {
    "province": "น่าน",
    "zone": "เขตสุขภาพที่ 1",
    "zone_code": "01",
    "elderly_total_69": 114576,
    "screened_total_69": 97335,
    "screened_pct": 85,
    "target_population_b": 33609,
    "risk_rate_pct": 34.5,
    "cared_population_a": 15561,
    "coverage_pct": 46.3,
    "q1_data_ready": true,
    "q2_current_pct": 46.3,
    "q3_projected_pct": 62.5,
    "q4_projected_pct": 85.7,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 7965,
    "domain_risks": {
      "dementia": {
        "risk": 2408,
        "cared": 386,
        "pct": 16
      },
      "fall": {
        "risk": 4624,
        "cared": 39,
        "pct": 0.8
      },
      "oral": {
        "risk": 6661,
        "cared": 3750,
        "pct": 56.3
      },
      "vision": {
        "risk": 6878,
        "cared": 429,
        "pct": 6.2
      },
      "hearing": {
        "risk": 2561,
        "cared": 321,
        "pct": 12.5
      },
      "depression": {
        "risk": 1034,
        "cared": 809,
        "pct": 78.2
      },
      "adl": {
        "risk": 2907,
        "cared": 254,
        "pct": 8.7
      },
      "urine": {
        "risk": 2130,
        "cared": 107,
        "pct": 5
      },
      "nutrition": {
        "risk": 1637,
        "cared": 195,
        "pct": 11.9
      }
    }
  },
  {
    "province": "พะเยา",
    "zone": "เขตสุขภาพที่ 1",
    "zone_code": "01",
    "elderly_total_69": 117195,
    "screened_total_69": 101065,
    "screened_pct": 86.2,
    "target_population_b": 34103,
    "risk_rate_pct": 33.7,
    "cared_population_a": 14801,
    "coverage_pct": 43.4,
    "q1_data_ready": true,
    "q2_current_pct": 43.4,
    "q3_projected_pct": 58.6,
    "q4_projected_pct": 80.3,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 9071,
    "domain_risks": {
      "dementia": {
        "risk": 2357,
        "cared": 360,
        "pct": 15.3
      },
      "fall": {
        "risk": 4277,
        "cared": 34,
        "pct": 0.8
      },
      "oral": {
        "risk": 6500,
        "cared": 3461,
        "pct": 53.2
      },
      "vision": {
        "risk": 6506,
        "cared": 455,
        "pct": 7
      },
      "hearing": {
        "risk": 2648,
        "cared": 352,
        "pct": 13.3
      },
      "depression": {
        "risk": 1024,
        "cared": 643,
        "pct": 62.8
      },
      "adl": {
        "risk": 3503,
        "cared": 319,
        "pct": 9.1
      },
      "urine": {
        "risk": 1836,
        "cared": 106,
        "pct": 5.8
      },
      "nutrition": {
        "risk": 1758,
        "cared": 191,
        "pct": 10.9
      }
    }
  },
  {
    "province": "เชียงราย",
    "zone": "เขตสุขภาพที่ 1",
    "zone_code": "01",
    "elderly_total_69": 259829,
    "screened_total_69": 227670,
    "screened_pct": 87.6,
    "target_population_b": 78776,
    "risk_rate_pct": 34.6,
    "cared_population_a": 35922,
    "coverage_pct": 45.6,
    "q1_data_ready": true,
    "q2_current_pct": 45.6,
    "q3_projected_pct": 61.6,
    "q4_projected_pct": 84.4,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 19221,
    "domain_risks": {
      "dementia": {
        "risk": 6339,
        "cared": 1190,
        "pct": 18.8
      },
      "fall": {
        "risk": 8969,
        "cared": 72,
        "pct": 0.8
      },
      "oral": {
        "risk": 13797,
        "cared": 7767,
        "pct": 56.3
      },
      "vision": {
        "risk": 16389,
        "cared": 1064,
        "pct": 6.5
      },
      "hearing": {
        "risk": 5653,
        "cared": 645,
        "pct": 11.4
      },
      "depression": {
        "risk": 2441,
        "cared": 1734,
        "pct": 71
      },
      "adl": {
        "risk": 6964,
        "cared": 543,
        "pct": 7.8
      },
      "urine": {
        "risk": 4639,
        "cared": 275,
        "pct": 5.9
      },
      "nutrition": {
        "risk": 3415,
        "cared": 427,
        "pct": 12.5
      }
    }
  },
  {
    "province": "แม่ฮ่องสอน",
    "zone": "เขตสุขภาพที่ 1",
    "zone_code": "01",
    "elderly_total_69": 35853,
    "screened_total_69": 28753,
    "screened_pct": 80.2,
    "target_population_b": 7549,
    "risk_rate_pct": 26.3,
    "cared_population_a": 2770,
    "coverage_pct": 36.7,
    "q1_data_ready": true,
    "q2_current_pct": 36.7,
    "q3_projected_pct": 49.5,
    "q4_projected_pct": 67.9,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 250,
    "gap_to_70pct": 2514,
    "domain_risks": {
      "dementia": {
        "risk": 545,
        "cared": 88,
        "pct": 16.1
      },
      "fall": {
        "risk": 911,
        "cared": 7,
        "pct": 0.8
      },
      "oral": {
        "risk": 1185,
        "cared": 904,
        "pct": 76.3
      },
      "vision": {
        "risk": 1748,
        "cared": 91,
        "pct": 5.2
      },
      "hearing": {
        "risk": 603,
        "cared": 85,
        "pct": 14.1
      },
      "depression": {
        "risk": 208,
        "cared": 144,
        "pct": 69.2
      },
      "adl": {
        "risk": 641,
        "cared": 55,
        "pct": 8.6
      },
      "urine": {
        "risk": 436,
        "cared": 23,
        "pct": 5.3
      },
      "nutrition": {
        "risk": 343,
        "cared": 33,
        "pct": 9.6
      }
    }
  },
  {
    "province": "นครสวรรค์",
    "zone": "เขตสุขภาพที่ 3",
    "zone_code": "03",
    "elderly_total_69": 212385,
    "screened_total_69": 178681,
    "screened_pct": 84.1,
    "target_population_b": 61829,
    "risk_rate_pct": 34.6,
    "cared_population_a": 30296,
    "coverage_pct": 49,
    "q1_data_ready": true,
    "q2_current_pct": 49,
    "q3_projected_pct": 66.2,
    "q4_projected_pct": 90.7,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 12984,
    "domain_risks": {
      "dementia": {
        "risk": 4677,
        "cared": 808,
        "pct": 17.3
      },
      "fall": {
        "risk": 6971,
        "cared": 52,
        "pct": 0.7
      },
      "oral": {
        "risk": 9967,
        "cared": 7672,
        "pct": 77
      },
      "vision": {
        "risk": 14591,
        "cared": 885,
        "pct": 6.1
      },
      "hearing": {
        "risk": 3795,
        "cared": 626,
        "pct": 16.5
      },
      "depression": {
        "risk": 1820,
        "cared": 1266,
        "pct": 69.6
      },
      "adl": {
        "risk": 5553,
        "cared": 447,
        "pct": 8
      },
      "urine": {
        "risk": 3585,
        "cared": 164,
        "pct": 4.6
      },
      "nutrition": {
        "risk": 2663,
        "cared": 294,
        "pct": 11
      }
    }
  },
  {
    "province": "อุทัยธานี",
    "zone": "เขตสุขภาพที่ 3",
    "zone_code": "03",
    "elderly_total_69": 68532,
    "screened_total_69": 57088,
    "screened_pct": 83.3,
    "target_population_b": 18220,
    "risk_rate_pct": 31.9,
    "cared_population_a": 3808,
    "coverage_pct": 20.9,
    "q1_data_ready": true,
    "q2_current_pct": 20.9,
    "q3_projected_pct": 28.2,
    "q4_projected_pct": 38.7,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 3480,
    "gap_to_70pct": 8946,
    "domain_risks": {
      "dementia": {
        "risk": 1282,
        "cared": 201,
        "pct": 15.7
      },
      "fall": {
        "risk": 2284,
        "cared": 22,
        "pct": 1
      },
      "oral": {
        "risk": 3384,
        "cared": 2288,
        "pct": 67.6
      },
      "vision": {
        "risk": 3963,
        "cared": 246,
        "pct": 6.2
      },
      "hearing": {
        "risk": 1169,
        "cared": 137,
        "pct": 11.7
      },
      "depression": {
        "risk": 515,
        "cared": 334,
        "pct": 64.9
      },
      "adl": {
        "risk": 1622,
        "cared": 115,
        "pct": 7.1
      },
      "urine": {
        "risk": 1004,
        "cared": 58,
        "pct": 5.8
      },
      "nutrition": {
        "risk": 855,
        "cared": 105,
        "pct": 12.3
      }
    }
  },
  {
    "province": "กำแพงเพชร",
    "zone": "เขตสุขภาพที่ 3",
    "zone_code": "03",
    "elderly_total_69": 135909,
    "screened_total_69": 113388,
    "screened_pct": 83.4,
    "target_population_b": 39357,
    "risk_rate_pct": 34.7,
    "cared_population_a": 9879,
    "coverage_pct": 25.1,
    "q1_data_ready": true,
    "q2_current_pct": 25.1,
    "q3_projected_pct": 33.9,
    "q4_projected_pct": 46.4,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 5864,
    "gap_to_70pct": 17671,
    "domain_risks": {
      "dementia": {
        "risk": 3557,
        "cared": 777,
        "pct": 21.8
      },
      "fall": {
        "risk": 4100,
        "cared": 32,
        "pct": 0.8
      },
      "oral": {
        "risk": 6053,
        "cared": 4091,
        "pct": 67.6
      },
      "vision": {
        "risk": 7653,
        "cared": 437,
        "pct": 5.7
      },
      "hearing": {
        "risk": 2876,
        "cared": 366,
        "pct": 12.7
      },
      "depression": {
        "risk": 1015,
        "cared": 686,
        "pct": 67.6
      },
      "adl": {
        "risk": 3154,
        "cared": 277,
        "pct": 8.8
      },
      "urine": {
        "risk": 2234,
        "cared": 123,
        "pct": 5.5
      },
      "nutrition": {
        "risk": 2029,
        "cared": 255,
        "pct": 12.6
      }
    }
  },
  {
    "province": "ตาก",
    "zone": "เขตสุขภาพที่ 2",
    "zone_code": "02",
    "elderly_total_69": 82593,
    "screened_total_69": 67075,
    "screened_pct": 81.2,
    "target_population_b": 21750,
    "risk_rate_pct": 32.4,
    "cared_population_a": 8417,
    "coverage_pct": 38.7,
    "q1_data_ready": true,
    "q2_current_pct": 38.7,
    "q3_projected_pct": 52.2,
    "q4_projected_pct": 71.6,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 283,
    "gap_to_70pct": 6808,
    "domain_risks": {
      "dementia": {
        "risk": 1885,
        "cared": 390,
        "pct": 20.7
      },
      "fall": {
        "risk": 2481,
        "cared": 24,
        "pct": 1
      },
      "oral": {
        "risk": 3390,
        "cared": 2192,
        "pct": 64.7
      },
      "vision": {
        "risk": 5063,
        "cared": 365,
        "pct": 7.2
      },
      "hearing": {
        "risk": 1541,
        "cared": 225,
        "pct": 14.6
      },
      "depression": {
        "risk": 656,
        "cared": 496,
        "pct": 75.6
      },
      "adl": {
        "risk": 1954,
        "cared": 166,
        "pct": 8.5
      },
      "urine": {
        "risk": 1343,
        "cared": 64,
        "pct": 4.8
      },
      "nutrition": {
        "risk": 993,
        "cared": 125,
        "pct": 12.6
      }
    }
  },
  {
    "province": "สุโขทัย",
    "zone": "เขตสุขภาพที่ 2",
    "zone_code": "02",
    "elderly_total_69": 123981,
    "screened_total_69": 102273,
    "screened_pct": 82.5,
    "target_population_b": 33027,
    "risk_rate_pct": 32.3,
    "cared_population_a": 11659,
    "coverage_pct": 35.3,
    "q1_data_ready": true,
    "q2_current_pct": 35.3,
    "q3_projected_pct": 47.7,
    "q4_projected_pct": 65.3,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 1552,
    "gap_to_70pct": 11460,
    "domain_risks": {
      "dementia": {
        "risk": 2822,
        "cared": 574,
        "pct": 20.3
      },
      "fall": {
        "risk": 4098,
        "cared": 41,
        "pct": 1
      },
      "oral": {
        "risk": 6151,
        "cared": 4413,
        "pct": 71.7
      },
      "vision": {
        "risk": 7388,
        "cared": 479,
        "pct": 6.5
      },
      "hearing": {
        "risk": 2119,
        "cared": 234,
        "pct": 11
      },
      "depression": {
        "risk": 972,
        "cared": 622,
        "pct": 64
      },
      "adl": {
        "risk": 2575,
        "cared": 202,
        "pct": 7.8
      },
      "urine": {
        "risk": 1801,
        "cared": 114,
        "pct": 6.3
      },
      "nutrition": {
        "risk": 1648,
        "cared": 199,
        "pct": 12.1
      }
    }
  },
  {
    "province": "พิษณุโลก",
    "zone": "เขตสุขภาพที่ 2",
    "zone_code": "02",
    "elderly_total_69": 177301,
    "screened_total_69": 153111,
    "screened_pct": 86.4,
    "target_population_b": 47433,
    "risk_rate_pct": 31,
    "cared_population_a": 11906,
    "coverage_pct": 25.1,
    "q1_data_ready": true,
    "q2_current_pct": 25.1,
    "q3_projected_pct": 33.9,
    "q4_projected_pct": 46.4,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 7067,
    "gap_to_70pct": 21297,
    "domain_risks": {
      "dementia": {
        "risk": 3398,
        "cared": 545,
        "pct": 16
      },
      "fall": {
        "risk": 5978,
        "cared": 64,
        "pct": 1.1
      },
      "oral": {
        "risk": 7650,
        "cared": 5689,
        "pct": 74.4
      },
      "vision": {
        "risk": 9540,
        "cared": 551,
        "pct": 5.8
      },
      "hearing": {
        "risk": 2941,
        "cared": 477,
        "pct": 16.2
      },
      "depression": {
        "risk": 1314,
        "cared": 1008,
        "pct": 76.7
      },
      "adl": {
        "risk": 4843,
        "cared": 492,
        "pct": 10.2
      },
      "urine": {
        "risk": 2959,
        "cared": 152,
        "pct": 5.1
      },
      "nutrition": {
        "risk": 2653,
        "cared": 303,
        "pct": 11.4
      }
    }
  },
  {
    "province": "พิจิตร",
    "zone": "เขตสุขภาพที่ 3",
    "zone_code": "03",
    "elderly_total_69": 111623,
    "screened_total_69": 90132,
    "screened_pct": 80.7,
    "target_population_b": 26481,
    "risk_rate_pct": 29.4,
    "cared_population_a": 5773,
    "coverage_pct": 21.8,
    "q1_data_ready": true,
    "q2_current_pct": 21.8,
    "q3_projected_pct": 29.4,
    "q4_projected_pct": 40.3,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 4819,
    "gap_to_70pct": 12764,
    "domain_risks": {
      "dementia": {
        "risk": 2382,
        "cared": 517,
        "pct": 21.7
      },
      "fall": {
        "risk": 3345,
        "cared": 32,
        "pct": 1
      },
      "oral": {
        "risk": 4955,
        "cared": 3636,
        "pct": 73.4
      },
      "vision": {
        "risk": 6575,
        "cared": 404,
        "pct": 6.1
      },
      "hearing": {
        "risk": 1673,
        "cared": 240,
        "pct": 14.3
      },
      "depression": {
        "risk": 893,
        "cared": 600,
        "pct": 67.2
      },
      "adl": {
        "risk": 2673,
        "cared": 206,
        "pct": 7.7
      },
      "urine": {
        "risk": 1497,
        "cared": 95,
        "pct": 6.3
      },
      "nutrition": {
        "risk": 1296,
        "cared": 146,
        "pct": 11.3
      }
    }
  },
  {
    "province": "เพชรบูรณ์",
    "zone": "เขตสุขภาพที่ 2",
    "zone_code": "02",
    "elderly_total_69": 177709,
    "screened_total_69": 154343,
    "screened_pct": 86.9,
    "target_population_b": 48376,
    "risk_rate_pct": 31.3,
    "cared_population_a": 11417,
    "coverage_pct": 23.6,
    "q1_data_ready": true,
    "q2_current_pct": 23.6,
    "q3_projected_pct": 31.9,
    "q4_projected_pct": 43.7,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 7933,
    "gap_to_70pct": 22446,
    "domain_risks": {
      "dementia": {
        "risk": 4294,
        "cared": 917,
        "pct": 21.4
      },
      "fall": {
        "risk": 5916,
        "cared": 63,
        "pct": 1.1
      },
      "oral": {
        "risk": 9901,
        "cared": 7085,
        "pct": 71.6
      },
      "vision": {
        "risk": 10233,
        "cared": 645,
        "pct": 6.3
      },
      "hearing": {
        "risk": 3015,
        "cared": 371,
        "pct": 12.3
      },
      "depression": {
        "risk": 1326,
        "cared": 902,
        "pct": 68
      },
      "adl": {
        "risk": 4158,
        "cared": 387,
        "pct": 9.3
      },
      "urine": {
        "risk": 2758,
        "cared": 162,
        "pct": 5.9
      },
      "nutrition": {
        "risk": 2633,
        "cared": 274,
        "pct": 10.4
      }
    }
  },
  {
    "province": "ราชบุรี",
    "zone": "เขตสุขภาพที่ 5",
    "zone_code": "05",
    "elderly_total_69": 179914,
    "screened_total_69": 148051,
    "screened_pct": 82.3,
    "target_population_b": 48654,
    "risk_rate_pct": 32.9,
    "cared_population_a": 10850,
    "coverage_pct": 22.3,
    "q1_data_ready": true,
    "q2_current_pct": 22.3,
    "q3_projected_pct": 30.1,
    "q4_projected_pct": 41.3,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 8612,
    "gap_to_70pct": 23208,
    "domain_risks": {
      "dementia": {
        "risk": 3401,
        "cared": 527,
        "pct": 15.5
      },
      "fall": {
        "risk": 5696,
        "cared": 50,
        "pct": 0.9
      },
      "oral": {
        "risk": 8916,
        "cared": 5478,
        "pct": 61.4
      },
      "vision": {
        "risk": 12137,
        "cared": 689,
        "pct": 5.7
      },
      "hearing": {
        "risk": 3227,
        "cared": 490,
        "pct": 15.2
      },
      "depression": {
        "risk": 1532,
        "cared": 929,
        "pct": 60.6
      },
      "adl": {
        "risk": 4535,
        "cared": 360,
        "pct": 7.9
      },
      "urine": {
        "risk": 2553,
        "cared": 150,
        "pct": 5.9
      },
      "nutrition": {
        "risk": 2091,
        "cared": 248,
        "pct": 11.9
      }
    }
  },
  {
    "province": "กาญจนบุรี",
    "zone": "เขตสุขภาพที่ 5",
    "zone_code": "05",
    "elderly_total_69": 146437,
    "screened_total_69": 121069,
    "screened_pct": 82.7,
    "target_population_b": 34240,
    "risk_rate_pct": 28.3,
    "cared_population_a": 9724,
    "coverage_pct": 28.4,
    "q1_data_ready": true,
    "q2_current_pct": 28.4,
    "q3_projected_pct": 38.3,
    "q4_projected_pct": 52.5,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 3972,
    "gap_to_70pct": 14244,
    "domain_risks": {
      "dementia": {
        "risk": 3007,
        "cared": 633,
        "pct": 21.1
      },
      "fall": {
        "risk": 3976,
        "cared": 42,
        "pct": 1.1
      },
      "oral": {
        "risk": 5342,
        "cared": 3904,
        "pct": 73.1
      },
      "vision": {
        "risk": 8026,
        "cared": 478,
        "pct": 6
      },
      "hearing": {
        "risk": 2484,
        "cared": 377,
        "pct": 15.2
      },
      "depression": {
        "risk": 958,
        "cared": 649,
        "pct": 67.7
      },
      "adl": {
        "risk": 3235,
        "cared": 264,
        "pct": 8.2
      },
      "urine": {
        "risk": 1948,
        "cared": 101,
        "pct": 5.2
      },
      "nutrition": {
        "risk": 1864,
        "cared": 226,
        "pct": 12.1
      }
    }
  },
  {
    "province": "สุพรรณบุรี",
    "zone": "เขตสุขภาพที่ 5",
    "zone_code": "05",
    "elderly_total_69": 180029,
    "screened_total_69": 142487,
    "screened_pct": 79.1,
    "target_population_b": 42475,
    "risk_rate_pct": 29.8,
    "cared_population_a": 16098,
    "coverage_pct": 37.9,
    "q1_data_ready": true,
    "q2_current_pct": 37.9,
    "q3_projected_pct": 51.2,
    "q4_projected_pct": 70.1,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 892,
    "gap_to_70pct": 13634,
    "domain_risks": {
      "dementia": {
        "risk": 3764,
        "cared": 802,
        "pct": 21.3
      },
      "fall": {
        "risk": 4641,
        "cared": 44,
        "pct": 0.9
      },
      "oral": {
        "risk": 6763,
        "cared": 4770,
        "pct": 70.5
      },
      "vision": {
        "risk": 9941,
        "cared": 530,
        "pct": 5.3
      },
      "hearing": {
        "risk": 3057,
        "cared": 505,
        "pct": 16.5
      },
      "depression": {
        "risk": 1212,
        "cared": 1016,
        "pct": 83.8
      },
      "adl": {
        "risk": 4204,
        "cared": 368,
        "pct": 8.8
      },
      "urine": {
        "risk": 2837,
        "cared": 153,
        "pct": 5.4
      },
      "nutrition": {
        "risk": 2410,
        "cared": 273,
        "pct": 11.3
      }
    }
  },
  {
    "province": "นครปฐม",
    "zone": "เขตสุขภาพที่ 5",
    "zone_code": "05",
    "elderly_total_69": 196686,
    "screened_total_69": 162426,
    "screened_pct": 82.6,
    "target_population_b": 56711,
    "risk_rate_pct": 34.9,
    "cared_population_a": 20983,
    "coverage_pct": 37,
    "q1_data_ready": true,
    "q2_current_pct": 37,
    "q3_projected_pct": 50,
    "q4_projected_pct": 68.5,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 1701,
    "gap_to_70pct": 18715,
    "domain_risks": {
      "dementia": {
        "risk": 5117,
        "cared": 1116,
        "pct": 21.8
      },
      "fall": {
        "risk": 6831,
        "cared": 63,
        "pct": 0.9
      },
      "oral": {
        "risk": 8749,
        "cared": 5140,
        "pct": 58.7
      },
      "vision": {
        "risk": 12069,
        "cared": 856,
        "pct": 7.1
      },
      "hearing": {
        "risk": 3701,
        "cared": 410,
        "pct": 11.1
      },
      "depression": {
        "risk": 1705,
        "cared": 1168,
        "pct": 68.5
      },
      "adl": {
        "risk": 4620,
        "cared": 481,
        "pct": 10.4
      },
      "urine": {
        "risk": 3250,
        "cared": 208,
        "pct": 6.4
      },
      "nutrition": {
        "risk": 3002,
        "cared": 331,
        "pct": 11
      }
    }
  },
  {
    "province": "สมุทรสาคร",
    "zone": "เขตสุขภาพที่ 5",
    "zone_code": "05",
    "elderly_total_69": 102729,
    "screened_total_69": 92756,
    "screened_pct": 90.3,
    "target_population_b": 28545,
    "risk_rate_pct": 30.8,
    "cared_population_a": 7650,
    "coverage_pct": 26.8,
    "q1_data_ready": true,
    "q2_current_pct": 26.8,
    "q3_projected_pct": 36.2,
    "q4_projected_pct": 49.6,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 3768,
    "gap_to_70pct": 12332,
    "domain_risks": {
      "dementia": {
        "risk": 1998,
        "cared": 310,
        "pct": 15.5
      },
      "fall": {
        "risk": 3493,
        "cared": 36,
        "pct": 1
      },
      "oral": {
        "risk": 5212,
        "cared": 4002,
        "pct": 76.8
      },
      "vision": {
        "risk": 6281,
        "cared": 441,
        "pct": 7
      },
      "hearing": {
        "risk": 1756,
        "cared": 247,
        "pct": 14.1
      },
      "depression": {
        "risk": 981,
        "cared": 803,
        "pct": 81.9
      },
      "adl": {
        "risk": 2931,
        "cared": 247,
        "pct": 8.4
      },
      "urine": {
        "risk": 1871,
        "cared": 81,
        "pct": 4.3
      },
      "nutrition": {
        "risk": 1290,
        "cared": 177,
        "pct": 13.7
      }
    }
  },
  {
    "province": "สมุทรสงคราม",
    "zone": "เขตสุขภาพที่ 5",
    "zone_code": "05",
    "elderly_total_69": 43247,
    "screened_total_69": 35855,
    "screened_pct": 82.9,
    "target_population_b": 10036,
    "risk_rate_pct": 28,
    "cared_population_a": 2118,
    "coverage_pct": 21.1,
    "q1_data_ready": true,
    "q2_current_pct": 21.1,
    "q3_projected_pct": 28.5,
    "q4_projected_pct": 39,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 1896,
    "gap_to_70pct": 4907,
    "domain_risks": {
      "dementia": {
        "risk": 705,
        "cared": 110,
        "pct": 15.6
      },
      "fall": {
        "risk": 1169,
        "cared": 11,
        "pct": 0.9
      },
      "oral": {
        "risk": 1781,
        "cared": 1331,
        "pct": 74.7
      },
      "vision": {
        "risk": 2517,
        "cared": 143,
        "pct": 5.7
      },
      "hearing": {
        "risk": 644,
        "cared": 93,
        "pct": 14.4
      },
      "depression": {
        "risk": 294,
        "cared": 255,
        "pct": 86.7
      },
      "adl": {
        "risk": 905,
        "cared": 89,
        "pct": 9.8
      },
      "urine": {
        "risk": 689,
        "cared": 37,
        "pct": 5.4
      },
      "nutrition": {
        "risk": 530,
        "cared": 65,
        "pct": 12.3
      }
    }
  },
  {
    "province": "เพชรบุรี",
    "zone": "เขตสุขภาพที่ 5",
    "zone_code": "05",
    "elderly_total_69": 105929,
    "screened_total_69": 94617,
    "screened_pct": 89.3,
    "target_population_b": 32258,
    "risk_rate_pct": 34.1,
    "cared_population_a": 8129,
    "coverage_pct": 25.2,
    "q1_data_ready": true,
    "q2_current_pct": 25.2,
    "q3_projected_pct": 34,
    "q4_projected_pct": 46.6,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 4774,
    "gap_to_70pct": 14452,
    "domain_risks": {
      "dementia": {
        "risk": 2815,
        "cared": 588,
        "pct": 20.9
      },
      "fall": {
        "risk": 3678,
        "cared": 39,
        "pct": 1.1
      },
      "oral": {
        "risk": 5632,
        "cared": 4086,
        "pct": 72.5
      },
      "vision": {
        "risk": 6065,
        "cared": 402,
        "pct": 6.6
      },
      "hearing": {
        "risk": 2556,
        "cared": 363,
        "pct": 14.2
      },
      "depression": {
        "risk": 1056,
        "cared": 694,
        "pct": 65.7
      },
      "adl": {
        "risk": 2534,
        "cared": 242,
        "pct": 9.6
      },
      "urine": {
        "risk": 1793,
        "cared": 99,
        "pct": 5.5
      },
      "nutrition": {
        "risk": 1681,
        "cared": 200,
        "pct": 11.9
      }
    }
  },
  {
    "province": "ประจวบคีรีขันธ์",
    "zone": "เขตสุขภาพที่ 5",
    "zone_code": "05",
    "elderly_total_69": 93825,
    "screened_total_69": 86040,
    "screened_pct": 91.7,
    "target_population_b": 29289,
    "risk_rate_pct": 34,
    "cared_population_a": 14088,
    "coverage_pct": 48.1,
    "q1_data_ready": true,
    "q2_current_pct": 48.1,
    "q3_projected_pct": 64.9,
    "q4_projected_pct": 89,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 6414,
    "domain_risks": {
      "dementia": {
        "risk": 2378,
        "cared": 452,
        "pct": 19
      },
      "fall": {
        "risk": 3941,
        "cared": 35,
        "pct": 0.9
      },
      "oral": {
        "risk": 4670,
        "cared": 2999,
        "pct": 64.2
      },
      "vision": {
        "risk": 6458,
        "cared": 464,
        "pct": 7.2
      },
      "hearing": {
        "risk": 1766,
        "cared": 226,
        "pct": 12.8
      },
      "depression": {
        "risk": 942,
        "cared": 663,
        "pct": 70.4
      },
      "adl": {
        "risk": 2566,
        "cared": 213,
        "pct": 8.3
      },
      "urine": {
        "risk": 1713,
        "cared": 110,
        "pct": 6.4
      },
      "nutrition": {
        "risk": 1567,
        "cared": 197,
        "pct": 12.6
      }
    }
  },
  {
    "province": "นครศรีธรรมราช",
    "zone": "เขตสุขภาพที่ 11",
    "zone_code": "11",
    "elderly_total_69": 280967,
    "screened_total_69": 229171,
    "screened_pct": 81.6,
    "target_population_b": 77650,
    "risk_rate_pct": 33.9,
    "cared_population_a": 14909,
    "coverage_pct": 19.2,
    "q1_data_ready": true,
    "q2_current_pct": 19.2,
    "q3_projected_pct": 25.9,
    "q4_projected_pct": 35.5,
    "q2_target_met": false,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 621,
    "gap_to_40pct": 16151,
    "gap_to_70pct": 39446,
    "domain_risks": {
      "dementia": {
        "risk": 5514,
        "cared": 873,
        "pct": 15.8
      },
      "fall": {
        "risk": 9539,
        "cared": 88,
        "pct": 0.9
      },
      "oral": {
        "risk": 12576,
        "cared": 7129,
        "pct": 56.7
      },
      "vision": {
        "risk": 17347,
        "cared": 1281,
        "pct": 7.4
      },
      "hearing": {
        "risk": 6053,
        "cared": 727,
        "pct": 12
      },
      "depression": {
        "risk": 2249,
        "cared": 1395,
        "pct": 62
      },
      "adl": {
        "risk": 8018,
        "cared": 682,
        "pct": 8.5
      },
      "urine": {
        "risk": 4142,
        "cared": 247,
        "pct": 6
      },
      "nutrition": {
        "risk": 3432,
        "cared": 337,
        "pct": 9.8
      }
    }
  },
  {
    "province": "กระบี่",
    "zone": "เขตสุขภาพที่ 11",
    "zone_code": "11",
    "elderly_total_69": 66946,
    "screened_total_69": 56113,
    "screened_pct": 83.8,
    "target_population_b": 17963,
    "risk_rate_pct": 32,
    "cared_population_a": 8281,
    "coverage_pct": 46.1,
    "q1_data_ready": true,
    "q2_current_pct": 46.1,
    "q3_projected_pct": 62.2,
    "q4_projected_pct": 85.3,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 4293,
    "domain_risks": {
      "dementia": {
        "risk": 1317,
        "cared": 218,
        "pct": 16.6
      },
      "fall": {
        "risk": 2169,
        "cared": 21,
        "pct": 1
      },
      "oral": {
        "risk": 3702,
        "cared": 2804,
        "pct": 75.7
      },
      "vision": {
        "risk": 4528,
        "cared": 332,
        "pct": 7.3
      },
      "hearing": {
        "risk": 1313,
        "cared": 183,
        "pct": 13.9
      },
      "depression": {
        "risk": 529,
        "cared": 443,
        "pct": 83.7
      },
      "adl": {
        "risk": 1725,
        "cared": 138,
        "pct": 8
      },
      "urine": {
        "risk": 1200,
        "cared": 68,
        "pct": 5.7
      },
      "nutrition": {
        "risk": 917,
        "cared": 125,
        "pct": 13.6
      }
    }
  },
  {
    "province": "พังงา",
    "zone": "เขตสุขภาพที่ 11",
    "zone_code": "11",
    "elderly_total_69": 48874,
    "screened_total_69": 39010,
    "screened_pct": 79.8,
    "target_population_b": 12642,
    "risk_rate_pct": 32.4,
    "cared_population_a": 4892,
    "coverage_pct": 38.7,
    "q1_data_ready": true,
    "q2_current_pct": 38.7,
    "q3_projected_pct": 52.2,
    "q4_projected_pct": 71.6,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 165,
    "gap_to_70pct": 3957,
    "domain_risks": {
      "dementia": {
        "risk": 1119,
        "cared": 238,
        "pct": 21.3
      },
      "fall": {
        "risk": 1591,
        "cared": 16,
        "pct": 1
      },
      "oral": {
        "risk": 2089,
        "cared": 1232,
        "pct": 59
      },
      "vision": {
        "risk": 2998,
        "cared": 212,
        "pct": 7.1
      },
      "hearing": {
        "risk": 922,
        "cared": 118,
        "pct": 12.8
      },
      "depression": {
        "risk": 356,
        "cared": 273,
        "pct": 76.7
      },
      "adl": {
        "risk": 1153,
        "cared": 119,
        "pct": 10.3
      },
      "urine": {
        "risk": 789,
        "cared": 43,
        "pct": 5.4
      },
      "nutrition": {
        "risk": 661,
        "cared": 82,
        "pct": 12.4
      }
    }
  },
  {
    "province": "ภูเก็ต",
    "zone": "เขตสุขภาพที่ 11",
    "zone_code": "11",
    "elderly_total_69": 43183,
    "screened_total_69": 38982,
    "screened_pct": 90.3,
    "target_population_b": 13417,
    "risk_rate_pct": 34.4,
    "cared_population_a": 5166,
    "coverage_pct": 38.5,
    "q1_data_ready": true,
    "q2_current_pct": 38.5,
    "q3_projected_pct": 52,
    "q4_projected_pct": 71.2,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 201,
    "gap_to_70pct": 4226,
    "domain_risks": {
      "dementia": {
        "risk": 923,
        "cared": 140,
        "pct": 15.2
      },
      "fall": {
        "risk": 1407,
        "cared": 14,
        "pct": 1
      },
      "oral": {
        "risk": 2122,
        "cared": 1598,
        "pct": 75.3
      },
      "vision": {
        "risk": 3072,
        "cared": 166,
        "pct": 5.4
      },
      "hearing": {
        "risk": 855,
        "cared": 117,
        "pct": 13.7
      },
      "depression": {
        "risk": 457,
        "cared": 289,
        "pct": 63.2
      },
      "adl": {
        "risk": 1251,
        "cared": 93,
        "pct": 7.4
      },
      "urine": {
        "risk": 726,
        "cared": 34,
        "pct": 4.7
      },
      "nutrition": {
        "risk": 681,
        "cared": 82,
        "pct": 12
      }
    }
  },
  {
    "province": "สุราษฎร์ธานี",
    "zone": "เขตสุขภาพที่ 11",
    "zone_code": "11",
    "elderly_total_69": 173261,
    "screened_total_69": 150527,
    "screened_pct": 86.9,
    "target_population_b": 43887,
    "risk_rate_pct": 29.2,
    "cared_population_a": 10708,
    "coverage_pct": 24.4,
    "q1_data_ready": true,
    "q2_current_pct": 24.4,
    "q3_projected_pct": 32.9,
    "q4_projected_pct": 45.1,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 6847,
    "gap_to_70pct": 20013,
    "domain_risks": {
      "dementia": {
        "risk": 3263,
        "cared": 551,
        "pct": 16.9
      },
      "fall": {
        "risk": 5885,
        "cared": 61,
        "pct": 1
      },
      "oral": {
        "risk": 7279,
        "cared": 4490,
        "pct": 61.7
      },
      "vision": {
        "risk": 9671,
        "cared": 688,
        "pct": 7.1
      },
      "hearing": {
        "risk": 3428,
        "cared": 459,
        "pct": 13.4
      },
      "depression": {
        "risk": 1170,
        "cared": 891,
        "pct": 76.2
      },
      "adl": {
        "risk": 3633,
        "cared": 280,
        "pct": 7.7
      },
      "urine": {
        "risk": 2724,
        "cared": 123,
        "pct": 4.5
      },
      "nutrition": {
        "risk": 2141,
        "cared": 207,
        "pct": 9.7
      }
    }
  },
  {
    "province": "ระนอง",
    "zone": "เขตสุขภาพที่ 11",
    "zone_code": "11",
    "elderly_total_69": 27130,
    "screened_total_69": 21812,
    "screened_pct": 80.4,
    "target_population_b": 6091,
    "risk_rate_pct": 27.9,
    "cared_population_a": 2826,
    "coverage_pct": 46.4,
    "q1_data_ready": true,
    "q2_current_pct": 46.4,
    "q3_projected_pct": 62.6,
    "q4_projected_pct": 85.8,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 1438,
    "domain_risks": {
      "dementia": {
        "risk": 545,
        "cared": 118,
        "pct": 21.7
      },
      "fall": {
        "risk": 762,
        "cared": 8,
        "pct": 1
      },
      "oral": {
        "risk": 1064,
        "cared": 625,
        "pct": 58.7
      },
      "vision": {
        "risk": 1213,
        "cared": 64,
        "pct": 5.3
      },
      "hearing": {
        "risk": 430,
        "cared": 65,
        "pct": 15.1
      },
      "depression": {
        "risk": 167,
        "cared": 136,
        "pct": 81.4
      },
      "adl": {
        "risk": 508,
        "cared": 50,
        "pct": 9.8
      },
      "urine": {
        "risk": 398,
        "cared": 25,
        "pct": 6.3
      },
      "nutrition": {
        "risk": 349,
        "cared": 33,
        "pct": 9.5
      }
    }
  },
  {
    "province": "ชุมพร",
    "zone": "เขตสุขภาพที่ 11",
    "zone_code": "11",
    "elderly_total_69": 96646,
    "screened_total_69": 83712,
    "screened_pct": 86.6,
    "target_population_b": 25307,
    "risk_rate_pct": 30.2,
    "cared_population_a": 8832,
    "coverage_pct": 34.9,
    "q1_data_ready": true,
    "q2_current_pct": 34.9,
    "q3_projected_pct": 47.1,
    "q4_projected_pct": 64.6,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 1291,
    "gap_to_70pct": 8883,
    "domain_risks": {
      "dementia": {
        "risk": 1801,
        "cared": 286,
        "pct": 15.9
      },
      "fall": {
        "risk": 3092,
        "cared": 29,
        "pct": 0.9
      },
      "oral": {
        "risk": 4733,
        "cared": 3596,
        "pct": 76
      },
      "vision": {
        "risk": 4878,
        "cared": 354,
        "pct": 7.3
      },
      "hearing": {
        "risk": 1855,
        "cared": 274,
        "pct": 14.8
      },
      "depression": {
        "risk": 829,
        "cared": 637,
        "pct": 76.8
      },
      "adl": {
        "risk": 1982,
        "cared": 154,
        "pct": 7.8
      },
      "urine": {
        "risk": 1581,
        "cared": 82,
        "pct": 5.2
      },
      "nutrition": {
        "risk": 1435,
        "cared": 150,
        "pct": 10.5
      }
    }
  },
  {
    "province": "สงขลา",
    "zone": "เขตสุขภาพที่ 12",
    "zone_code": "12",
    "elderly_total_69": 239155,
    "screened_total_69": 213353,
    "screened_pct": 89.2,
    "target_population_b": 60782,
    "risk_rate_pct": 28.5,
    "cared_population_a": 23705,
    "coverage_pct": 39,
    "q1_data_ready": true,
    "q2_current_pct": 39,
    "q3_projected_pct": 52.7,
    "q4_projected_pct": 72.2,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 608,
    "gap_to_70pct": 18842,
    "domain_risks": {
      "dementia": {
        "risk": 4567,
        "cared": 782,
        "pct": 17.1
      },
      "fall": {
        "risk": 6302,
        "cared": 67,
        "pct": 1.1
      },
      "oral": {
        "risk": 11494,
        "cared": 6512,
        "pct": 56.7
      },
      "vision": {
        "risk": 15084,
        "cared": 922,
        "pct": 6.1
      },
      "hearing": {
        "risk": 4436,
        "cared": 629,
        "pct": 14.2
      },
      "depression": {
        "risk": 1675,
        "cared": 1113,
        "pct": 66.4
      },
      "adl": {
        "risk": 5453,
        "cared": 458,
        "pct": 8.4
      },
      "urine": {
        "risk": 3408,
        "cared": 152,
        "pct": 4.5
      },
      "nutrition": {
        "risk": 2765,
        "cared": 309,
        "pct": 11.2
      }
    }
  },
  {
    "province": "สตูล",
    "zone": "เขตสุขภาพที่ 12",
    "zone_code": "12",
    "elderly_total_69": 45032,
    "screened_total_69": 39138,
    "screened_pct": 86.9,
    "target_population_b": 13562,
    "risk_rate_pct": 34.7,
    "cared_population_a": 5235,
    "coverage_pct": 38.6,
    "q1_data_ready": true,
    "q2_current_pct": 38.6,
    "q3_projected_pct": 52.1,
    "q4_projected_pct": 71.4,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 190,
    "gap_to_70pct": 4258,
    "domain_risks": {
      "dementia": {
        "risk": 1036,
        "cared": 181,
        "pct": 17.5
      },
      "fall": {
        "risk": 1397,
        "cared": 13,
        "pct": 0.9
      },
      "oral": {
        "risk": 2236,
        "cared": 1550,
        "pct": 69.3
      },
      "vision": {
        "risk": 2907,
        "cared": 190,
        "pct": 6.5
      },
      "hearing": {
        "risk": 1001,
        "cared": 139,
        "pct": 13.9
      },
      "depression": {
        "risk": 396,
        "cared": 299,
        "pct": 75.5
      },
      "adl": {
        "risk": 1097,
        "cared": 98,
        "pct": 8.9
      },
      "urine": {
        "risk": 837,
        "cared": 51,
        "pct": 6.1
      },
      "nutrition": {
        "risk": 727,
        "cared": 77,
        "pct": 10.6
      }
    }
  },
  {
    "province": "ตรัง",
    "zone": "เขตสุขภาพที่ 12",
    "zone_code": "12",
    "elderly_total_69": 116339,
    "screened_total_69": 95324,
    "screened_pct": 81.9,
    "target_population_b": 26738,
    "risk_rate_pct": 28,
    "cared_population_a": 10642,
    "coverage_pct": 39.8,
    "q1_data_ready": true,
    "q2_current_pct": 39.8,
    "q3_projected_pct": 53.7,
    "q4_projected_pct": 73.6,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 53,
    "gap_to_70pct": 8075,
    "domain_risks": {
      "dementia": {
        "risk": 2460,
        "cared": 550,
        "pct": 22.4
      },
      "fall": {
        "risk": 2936,
        "cared": 28,
        "pct": 1
      },
      "oral": {
        "risk": 4475,
        "cared": 2730,
        "pct": 61
      },
      "vision": {
        "risk": 5114,
        "cared": 376,
        "pct": 7.4
      },
      "hearing": {
        "risk": 1699,
        "cared": 209,
        "pct": 12.3
      },
      "depression": {
        "risk": 814,
        "cared": 512,
        "pct": 62.9
      },
      "adl": {
        "risk": 2593,
        "cared": 227,
        "pct": 8.8
      },
      "urine": {
        "risk": 1441,
        "cared": 64,
        "pct": 4.4
      },
      "nutrition": {
        "risk": 1515,
        "cared": 202,
        "pct": 13.3
      }
    }
  },
  {
    "province": "พัทลุง",
    "zone": "เขตสุขภาพที่ 12",
    "zone_code": "12",
    "elderly_total_69": 102005,
    "screened_total_69": 88038,
    "screened_pct": 86.3,
    "target_population_b": 23778,
    "risk_rate_pct": 27,
    "cared_population_a": 5754,
    "coverage_pct": 24.2,
    "q1_data_ready": true,
    "q2_current_pct": 24.2,
    "q3_projected_pct": 32.7,
    "q4_projected_pct": 44.8,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 3757,
    "gap_to_70pct": 10891,
    "domain_risks": {
      "dementia": {
        "risk": 1929,
        "cared": 366,
        "pct": 19
      },
      "fall": {
        "risk": 2741,
        "cared": 26,
        "pct": 0.9
      },
      "oral": {
        "risk": 4896,
        "cared": 3743,
        "pct": 76.5
      },
      "vision": {
        "risk": 5739,
        "cared": 318,
        "pct": 5.5
      },
      "hearing": {
        "risk": 1468,
        "cared": 233,
        "pct": 15.9
      },
      "depression": {
        "risk": 715,
        "cared": 595,
        "pct": 83.2
      },
      "adl": {
        "risk": 2055,
        "cared": 162,
        "pct": 7.9
      },
      "urine": {
        "risk": 1578,
        "cared": 76,
        "pct": 4.8
      },
      "nutrition": {
        "risk": 1298,
        "cared": 173,
        "pct": 13.3
      }
    }
  },
  {
    "province": "ปัตตานี",
    "zone": "เขตสุขภาพที่ 12",
    "zone_code": "12",
    "elderly_total_69": 87946,
    "screened_total_69": 70574,
    "screened_pct": 80.2,
    "target_population_b": 23111,
    "risk_rate_pct": 32.7,
    "cared_population_a": 4946,
    "coverage_pct": 21.4,
    "q1_data_ready": true,
    "q2_current_pct": 21.4,
    "q3_projected_pct": 28.9,
    "q4_projected_pct": 39.6,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 4298,
    "gap_to_70pct": 11232,
    "domain_risks": {
      "dementia": {
        "risk": 2054,
        "cared": 439,
        "pct": 21.4
      },
      "fall": {
        "risk": 2569,
        "cared": 19,
        "pct": 0.7
      },
      "oral": {
        "risk": 3813,
        "cared": 2215,
        "pct": 58.1
      },
      "vision": {
        "risk": 4417,
        "cared": 234,
        "pct": 5.3
      },
      "hearing": {
        "risk": 1713,
        "cared": 274,
        "pct": 16
      },
      "depression": {
        "risk": 644,
        "cared": 482,
        "pct": 74.8
      },
      "adl": {
        "risk": 2076,
        "cared": 158,
        "pct": 7.6
      },
      "urine": {
        "risk": 1415,
        "cared": 64,
        "pct": 4.5
      },
      "nutrition": {
        "risk": 1243,
        "cared": 130,
        "pct": 10.5
      }
    }
  },
  {
    "province": "ยะลา",
    "zone": "เขตสุขภาพที่ 12",
    "zone_code": "12",
    "elderly_total_69": 64576,
    "screened_total_69": 58096,
    "screened_pct": 90,
    "target_population_b": 19381,
    "risk_rate_pct": 33.4,
    "cared_population_a": 7811,
    "coverage_pct": 40.3,
    "q1_data_ready": true,
    "q2_current_pct": 40.3,
    "q3_projected_pct": 54.4,
    "q4_projected_pct": 74.6,
    "q2_target_met": true,
    "q3_target_met": true,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 0,
    "gap_to_70pct": 5756,
    "domain_risks": {
      "dementia": {
        "risk": 1397,
        "cared": 226,
        "pct": 16.2
      },
      "fall": {
        "risk": 2557,
        "cared": 27,
        "pct": 1.1
      },
      "oral": {
        "risk": 3179,
        "cared": 2395,
        "pct": 75.3
      },
      "vision": {
        "risk": 3908,
        "cared": 280,
        "pct": 7.2
      },
      "hearing": {
        "risk": 1420,
        "cared": 229,
        "pct": 16.1
      },
      "depression": {
        "risk": 526,
        "cared": 430,
        "pct": 81.7
      },
      "adl": {
        "risk": 1918,
        "cared": 192,
        "pct": 10
      },
      "urine": {
        "risk": 1270,
        "cared": 79,
        "pct": 6.2
      },
      "nutrition": {
        "risk": 1007,
        "cared": 98,
        "pct": 9.7
      }
    }
  },
  {
    "province": "นราธิวาส",
    "zone": "เขตสุขภาพที่ 12",
    "zone_code": "12",
    "elderly_total_69": 90979,
    "screened_total_69": 78214,
    "screened_pct": 86,
    "target_population_b": 22285,
    "risk_rate_pct": 28.5,
    "cared_population_a": 8691,
    "coverage_pct": 39,
    "q1_data_ready": true,
    "q2_current_pct": 39,
    "q3_projected_pct": 52.7,
    "q4_projected_pct": 72.2,
    "q2_target_met": true,
    "q3_target_met": false,
    "q4_target_met": false,
    "gap_to_20pct": 0,
    "gap_to_40pct": 223,
    "gap_to_70pct": 6908,
    "domain_risks": {
      "dementia": {
        "risk": 1580,
        "cared": 250,
        "pct": 15.8
      },
      "fall": {
        "risk": 2928,
        "cared": 22,
        "pct": 0.8
      },
      "oral": {
        "risk": 4514,
        "cared": 3027,
        "pct": 67.1
      },
      "vision": {
        "risk": 4286,
        "cared": 218,
        "pct": 5.1
      },
      "hearing": {
        "risk": 1469,
        "cared": 196,
        "pct": 13.3
      },
      "depression": {
        "risk": 742,
        "cared": 563,
        "pct": 75.9
      },
      "adl": {
        "risk": 2029,
        "cared": 155,
        "pct": 7.6
      },
      "urine": {
        "risk": 1378,
        "cared": 69,
        "pct": 5
      },
      "nutrition": {
        "risk": 1146,
        "cared": 135,
        "pct": 11.8
      }
    }
  }
];

export const OFFICIAL_CONTACTS: ContactPerson[] = [
  {
    name: "นางสาวปิยะนุช ชัยสวัสดิ์",
    role: "นักวิชาการสาธารณสุขชำนาญการพิเศษ (หัวหน้ากลุ่มงาน & ผู้รับผิดชอบรายงานผล)",
    division: "กลุ่มงานสารสนเทศระบบสุขภาพด้านผู้สูงอายุ สถาบันเวชศาสตร์ฯ ผู้สูงอายุ",
    phone: "0 2024 8481 ต่อ 212-215",
    mobile: "06 2272 0565, 09 5256 3109",
    email: "agingdmsinfo@gmail.com",
    lineId: "info22025"
  },
  {
    name: "นางสาวคุณัญญา แก้วภาพ",
    role: "ผู้ช่วยนักวิจัย",
    division: "กลุ่มงานสารสนเทศระบบสุขภาพด้านผู้สูงอายุ",
    phone: "0 2024 8481 ต่อ 212-215",
    mobile: "06 2272 0565",
    email: "agingdmsinfo@gmail.com"
  },
  {
    name: "นางสาวสิริมินทร์ เชื้อกุณะ",
    role: "นักวิชาการสาธารณสุขปฏิบัติการ",
    division: "กลุ่มงานสารสนเทศระบบสุขภาพด้านผู้สูงอายุ",
    phone: "0 2024 8481 ต่อ 212-215",
    mobile: "09 5256 3109",
    email: "agingdmsinfo@gmail.com"
  },
  {
    name: "นางสมฤดี เนียมหอม",
    role: "นักสังคมสงเคราะห์ชำนาญการ",
    division: "กลุ่มงานสารสนเทศระบบสุขภาพด้านผู้สูงอายุ",
    phone: "0 2024 8481 ต่อ 212-215",
    mobile: "06 2272 0565",
    email: "agingdmsinfo@gmail.com"
  },
  {
    name: "นายภูมิภาส กัณฑรักษ์",
    role: "นักวิชาการสาธารณสุขปฏิบัติการ",
    division: "กลุ่มงานสารสนเทศระบบสุขภาพด้านผู้สูงอายุ",
    phone: "0 2024 8481 ต่อ 212-215",
    mobile: "09 5256 3109",
    email: "agingdmsinfo@gmail.com"
  },
  {
    name: "นางสาวปนิตา มุ่งกลาง",
    role: "นักวิชาการสาธารณสุขชำนาญการ",
    division: "กลุ่มงานพัฒนายุทธศาสตร์ด้านสุขภาพผู้สูงอายุ",
    phone: "0 2024 8481 ต่อ 204",
    mobile: "09 3321 5288",
    email: "panitamungklang07@gmail.com"
  },
  {
    name: "นางพงางาม พงศ์จตุรวิทย์",
    role: "นักสังคมสงเคราะห์ชำนาญการ",
    division: "กลุ่มงานพัฒนายุทธศาสตร์ด้านสุขภาพผู้สูงอายุ",
    phone: "0 2024 8481 ต่อ 205",
    mobile: "09 5530 6681",
    email: "tapoo55@gmail.com"
  },
  {
    name: "นางสาวเกศราภรณ์ ไค่นุ่นภา",
    role: "นักวิชาการสาธารณสุข",
    division: "กลุ่มงานพัฒนายุทธศาสตร์ด้านสุขภาพผู้สูงอายุ",
    phone: "0 2024 8481 ต่อ 208",
    mobile: "08 2409 5179",
    email: "katesaraporn66@gmail.com"
  }
];

export const SUPPORTING_DOCUMENTS: SupportingDocument[] = [
  {
    title: "คู่มือการบันทึกและบริหารจัดการข้อมูลในระบบ DMS Care Tools",
    category: "ระบบ DMS Care Tools",
    description: "ขั้นตอนการเข้าใช้งาน การบันทึกข้อมูลรายบุคคล และการบริหารจัดการสิทธิ์ผู้ใช้งาน",
    url: "https://agingthai.dms.go.th/agingthai/wp-content/uploads/2026/10/8-10-69_2.pdf",
    badge: "คู่มือทางการ PDF"
  },
  {
    title: "แนวทางการส่งต่อเพื่อดูแลรักษา (Flow of Management) สุขภาพผู้สูงอายุ 9 ด้าน",
    category: "Clinical Guidelines",
    description: "เกณฑ์การประเมินและการส่งต่อการดูแลรักษา 9 ด้านอย่างเป็นรูปธรรม",
    url: "https://agingthai.dms.go.th/agingthai/wp-content/uploads/2026/10/8-10-69_1.pdf",
    badge: "Flow 9 ด้าน PDF"
  },
  {
    title: "คู่มือการคัดกรองและประเมินสุขภาพผู้สูงอายุ พ.ศ. 2564",
    category: "เกณฑ์คัดกรองกระทรวง",
    description: "เครื่องมือคัดกรอง 9 ด้าน และเกณฑ์ประเมินความเสี่ยงระดับชุมชน",
    url: "https://drive.google.com/file/d/1AzA7XPBrra2btoqeTs9O5Mhk0oD7naNZ/view?usp=drive_link",
    badge: "Google Drive"
  },
  {
    title: "แบบฟอร์มหนังสือรับรองและลงทะเบียนขอ Username/Password DMS Care Tools",
    category: "การขอสิทธิ์เข้าใช้งาน",
    description: "ดาวน์โหลดไฟล์หนังสือรับรองลงนามโดยผู้บริหาร และลงทะเบียนขอสิทธิ์ User",
    url: "https://forms.gle/raAMAZv5AwnSxmoz6",
    badge: "Google Form"
  }
];
