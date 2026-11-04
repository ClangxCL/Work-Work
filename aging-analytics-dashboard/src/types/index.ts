export interface ClinicZoneData {
  year: string;
  zone: string;
  f3: number;
  f2: number;
  f1: number;
  m1: number;
  m2: number;
  s: number;
  a: number;
  not_eval: number;
  need_dev: number;
  basic: number;
  good: number;
  very_good: number;
  excellent: number;
  total_evaluated: number;
  total_hospitals: number;
}

export interface HospitalInfo {
  name: string;
  code: string;
  level: string;
}

export interface ClinicProvinceData extends ClinicZoneData {
  province: string;
  region?: string;
  hospitals_list?: HospitalInfo[];
}

export interface PopSummaryZone {
  zone_code: string;
  zone: string;
  y2566: number;
  y2567: number;
  y2568: number;
  y2569: number;
  change_66_69: number;
  growth_pct: number;
  ratio_66: number;
  ratio_69: number;
}

export interface PopAgeGroupData {
  male: number;
  female: number;
  total: number;
}

export interface PopYearZone {
  zone_code: string;
  zone: string;
  pop_all_male: number;
  pop_all_female: number;
  pop_all_total: number;
  elderly_male: number;
  elderly_female: number;
  elderly_total: number;
  aging_ratio_pct: number;
  age_groups: Record<string, PopAgeGroupData>;
}

export interface PopProvinceData {
  code: string;
  province: string;
  zone: string;
  total_male: number;
  total_female: number;
  total_pop: number;
  elderly_male: number;
  elderly_female: number;
  elderly_total: number;
  elderly_pct: number;
  age_groups: Record<string, PopAgeGroupData>;
}

export interface DemographicProjection {
  year: string;
  is_forecast: boolean;
  scenario: string;
  total_pop: number;
  elderly_total: number;
  elderly_pct: number;
  young_old: number;
  middle_old: number;
  old_old: number;
  working_ratio: number;
  aging_index: number;
  stage: string;
  high_scenario?: {
    elderly_total: number;
    elderly_pct: number;
    working_ratio: number;
  };
  low_scenario?: {
    elderly_total: number;
    elderly_pct: number;
    working_ratio: number;
  };
}

export interface DomainResult {
  screened: number;
  normal: number;
  risk: number;
}

export interface ScreeningZoneData {
  zone_code: string;
  zone: string;
  target: number;
  screened_all_9: number;
  screened_pct: number;
  domains: {
    vision: DomainResult;
    urine: DomainResult;
    hearing: DomainResult;
    adl: DomainResult;
    cognition: DomainResult;
    depression: DomainResult;
    movement: DomainResult;
    oral: DomainResult;
    nutrition: DomainResult;
  };
}

export interface DmsRiskZone {
  year: string;
  zone: string;
  falls_treat_person: number;
  falls_treat_times: number;
  falls_refer_person: number;
  falls_refer_times: number;
  falls_careplan_person: number;
  falls_careplan_times: number;
  dementia_treat_person: number;
  dementia_refer_person: number;
  oral_treat_person: number;
  oral_refer_person: number;
}

export interface DmsTotalZone {
  year: string;
  zone: string;
  screened_person: number;
  screened_times: number;
}

export interface NcdItem {
  rank: string;
  disease: string;
  y2566: number;
  y2567: number;
  y2568: number;
  y2569: number;
  note: string;
}

export interface ChronicTop10 {
  rank: number;
  icd: string;
  disease: string;
  prevalence: string;
  clinical_significance: string;
  hdc_relation: string;
}

export interface PatientCauseItem {
  rank: number;
  icd: string;
  disease_th: string;
  disease_en: string;
  male: number;
  female: number;
  total: number;
  pct: number;
}

export interface DeathCauseItem {
  rank: number;
  cause: string;
  icd: string;
  y2565: number;
  y2566: number;
  y2567: number;
  y2568: number;
  y2569: number;
  ratio_pct: number;
  note: string;
}

export interface DeathGenderItem {
  cause: string;
  male_pct: string;
  female_pct: string;
  epi_diff: string;
  behavior_factors: string;
}

export interface DashboardRootData {
  clinic: {
    by_zone: ClinicZoneData[];
    by_province: ClinicProvinceData[];
  };
  population: {
    summary_zones: PopSummaryZone[];
    summary_total: any;
    by_year_zones: Record<string, PopYearZone[]>;
    by_province_years?: Record<string, PopProvinceData[]>;
    projections?: DemographicProjection[];
  };
  screening_9domains: Record<string, ScreeningZoneData[]>;
  dms_care_tools: {
    risk_by_zone: DmsRiskZone[];
    totals_by_zone: DmsTotalZone[];
  };
  ncd: NcdItem[];
  illness: {
    chronic_top10_elderly: ChronicTop10[];
    opd_by_year: Record<string, PatientCauseItem[]>;
    ipd_by_year: Record<string, PatientCauseItem[]>;
  };
  death: {
    top10_causes: DeathCauseItem[];
    gender_comparison: DeathGenderItem[];
  };
}
