# 🏥 แดชบอร์ดสถานการณ์และสุขภาพผู้สูงอายุไทย (2566–2569)
### Thai Elderly Health & Clinical Analytics Dashboard — Department of Medical Services (DMS), MOPH

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Branch](https://img.shields.io/badge/Branch-Aging--Data--Analysis-blue?logo=github)](https://github.com/ClangxCL/Work-Work/tree/Aging-Data-Analysis)

ระบบสารสนเทศและแดชบอร์ดวิเคราะห์สถานการณ์และสุขภาพผู้สูงอายุไทย พัฒนาขึ้นโดยอ้างอิงข้อมูลทางการของ **สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์ กระทรวงสาธารณสุข**, **ระบบคลังข้อมูลด้านการแพทย์และสุขภาพ (Health Data Center: HDC)**, **กรมการปกครอง (DOPA)**, และ **สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ (สศช.)** ครอบคลุมการติดตาม ประเมิน และคาดการณ์โครงสร้างประชากรผู้สูงวัยใน 77 จังหวัด 13 เขตสุขภาพ

---

## 📌 สารบัญ (Table of Contents)
1. [จุดเด่นและฟังก์ชันหลัก 4 แท็บ](#-จุดเด่นและฟังก์ชันหลัก-4-แท็บ-key-features)
2. [โครงสร้างโฟลเดอร์ของโครงการ](#-โครงสร้างโฟลเดอร์ของโครงการ-project-structure)
3. [แคตตาล็อกและไฟล์ข้อมูลทั้งหมด (Data Catalog)](#-แคตตาล็อกและไฟล์ข้อมูลทั้งหมด-data-catalog)
4. [วิธีการติดตั้งและรันโครงการ (Getting Started)](#-วิธีการติดตั้งและรันโครงการ-getting-started)
5. [แหล่งข้อมูลอ้างอิงและหมายเหตุทางเทคนิค](#-แหล่งข้อมูลอ้างอิงและหมายเหตุทางเทคนิค-official-sources--technical-notes)

---

## 🌟 จุดเด่นและฟังก์ชันหลัก 4 แท็บ (Key Features)

### 🩺 แท็บที่ 1: คลินิกผู้สูงอายุ (Geriatric Clinic System)
* **แผนผังภูมิศาสตร์คลินิกผู้สูงอายุประเทศไทย (Choropleth SVG Map):** แผนที่ประเทศไทย 77 จังหวัด แสดงผลความครอบคลุมของการจัดตั้งคลินิกผู้สูงอายุด้วยการไล่ระดับสีแบบต่อเนื่อง (Continuous Color Gradient) พร้อมตัวเลือกสลับชุดสี (Emerald Jade, Viridis, Deep Ocean)
* **การเจาะลึกรายจังหวัดและรายโรงพยาบาล (Hospital Drill-Down Panel):** เมื่อคลิกเลือกจังหวัดจะแสดงรายชื่อโรงพยาบาลเป้าหมาย ระดับ รพ. (A, S, M1, M2, F1, F2, F3) และผลการประเมิน 5 ระดับคุณภาพ
* **ระบบตัวกรองคู่ (Dual Filters):** ฟิลเตอร์เขตสุขภาพ (1–12 + กทม.) และตัวกรองจังหวัด โดยมีค่าตั้งต้นเป็น `ทุกจังหวัด (ยังไม่เลือก)` เพื่อให้เห็นภาพรวมระดับประเทศก่อน
* **ตารางผลประเมินมาตรฐานคลินิกผู้สูงอายุครบ 77 จังหวัด:** สรุปตัวเลข รพ. ทั้งหมด, ผ่านเกณฑ์ดีเด่น, ดีมาก, ดี, พื้นฐาน, ควรพัฒนา, และที่ยังไม่ประเมิน
* **การ์ดแหล่งอ้างอิงเฉพาะแท็บ 1:** ลิงก์ตรงสู่สถาบันเวชศาสตร์ผู้สูงอายุ และคู่มือเกณฑ์มาตรฐานบริการ กรมการแพทย์ พร้อมไฟล์ `geriatric_clinic_report.xlsx`

### 👥 แท็บที่ 2: ข้อมูลประชากรผู้สูงอายุ (Aging Demographics & Forecasting)
* **แผนผังภูมิศาสตร์ประชากรผู้สูงอายุประเทศไทย (77 จังหวัด):** แสดงสัดส่วนร้อยละผู้สูงอายุ (% Aging Ratio) และจำนวนประชากรรายจังหวัดแบบ Continuous Gradient
* **ระบบเครื่องเล่นไทม์ไลน์เคลื่อนไหวอัตโนมัติ (Timeline Auto-Play 2566–2569):** ปุ่มเล่น (Play/Pause/Reset) เพื่อชมการเปลี่ยนแปลงเชิงพื้นที่ของประชากรสูงวัยในรอบ 4 ปีแบบ Real-time
* **โมเดลทำนายและพยากรณ์ประชากรล่วงหน้า (Demographic Forecasting Model 2570–2580):** แบบจำลองคณิตศาสตร์อิงอัตราเติบโต CAGR ร่วมกับสมมติฐานการคาดประมาณประชากรของ สศช. แบ่งตาม 3 ฉากทัศน์ (Baseline, High Aging, Conservative) แสดงจุดเปลี่ยนผ่านสู่ **Super-Aged Society**
* **กระดานจัดอันดับ 10 จังหวัดที่มีสัดส่วนผู้สูงอายุสูงสุด (Visual Leaderboard):** แท่นโพเดียม Top 3 ทอง-เงิน-ทองแดง (ลำปาง 37.6%, แพร่ 36.0%, พะเยา 33.9%) พร้อม Gradient Progress Bars สำหรับอันดับ 4–10 และข้อสังเกตเชิงยุทธศาสตร์ระบบสุขภาพ
* **อินโฟกราฟิกโครงสร้าง 3 วัยและสัดส่วนเพศ:** วิเคราะห์เจาะลึกกลุ่มวัยต้น (60–69 ปี: 58.7%), วัยกลาง (70–79 ปี: 28.5%), และวัยปลาย (80+ ปี: 12.8%) ร่วมกับสัดส่วนเพศหญิง 56% / ชาย 44% (ในวัย 80+ หญิงสูงถึง 63.4%)
* **การ์ดแหล่งอ้างอิงเฉพาะแท็บ 2:** ลิงก์สู่ระบบ HDC สป.สธ., กรมการปกครอง (DOPA), และ สศช. พร้อมไฟล์ `ข้อมูลประชากรผู้สูงอายุ_60ปีขึ้นไป_2566-2569_รายเขต_รายจังหวัด.xlsx`

### 📋 แท็บที่ 3: ข้อมูลสุขภาพและการคัดกรอง (Screening & DMS Care Tools)
* **การคัดกรองสุขภาพผู้สูงอายุ 9 ด้าน (WHO ICOPE Framework):** ผลการคัดกรองระดับประเทศ 8,848,154 คน (คิดเป็น 80.6% ของเป้าหมาย 10.98M คน) จำแนกตาม 9 มิติสุขภาพที่สำคัญ
* **การประเมินการปฏิบัติกิจวัตรประจำวัน (Barthel ADL Index):** จำแนกกลุ่มติดสังคม (ADL 12–20), ติดบ้าน (ADL 5–11), และติดเตียง (ADL 0–4)
* **ระบบสารสนเทศ DMS Care Tools ในโรงพยาบาล:** สถิติการประเมินความเสี่ยงต่อการหกล้ม (Falls Risk), ภาวะสมองเสื่อม (Dementia), สุขภาพช่องปาก, การส่งต่อรักษาเฉพาะทาง, และการจัดทำแผนการดูแลรายบุคคล (Care Plan)
* **การ์ดแหล่งอ้างอิงเฉพาะแท็บ 3:** ลิงก์สู่ Blue Book Application กรมอนามัย และ DMS Care Tools พร้อมไฟล์ `1. hdc_elderly_screening_9domains.xlsx` และ `2. geriatric_data_report_2567-2569.xlsx`

### 🩺 แท็บที่ 4: โรคและสาเหตุการป่วยและตาย (Morbidity & Mortality Statistics)
* **สถิติผู้ป่วยโรคไม่ติดต่อเรื้อรัง (NCDs) 8.90 ล้านคน:** ติดตามแนวโน้มการป่วยรายปี 2566–2569 ทั้งความดันโลหิตสูง, เบาหวาน, โรคไตเรื้อรัง, สโตรก, หลอดเลือดหัวใจ, ปอดอุดกั้นเรื้อรัง (COPD) และโรคมะเร็ง
* **10 อันดับโรคที่มารับบริการผู้ป่วยนอก (OPD) และผู้ป่วยใน (IPD):** วิเคราะห์ตามรหัส ICD-10 สากล โดยผู้ป่วยนอกนับเป็นจำนวนครั้ง (Visits) และผู้ป่วยในนับเป็นจำนวนการนอนโรงพยาบาล (Admissions)
* **10 อันดับสาเหตุการตายหลัก และการวิเคราะห์เปรียบเทียบตามเพศ:** มะเร็ง, หลอดเลือดสมอง, ปอดอักเสบ, หัวใจขาดเลือด, ไตวายเรื้อรัง และการวิเคราะห์ความแตกต่างทางระบาดวิทยาระหว่างชายและหญิง
* **การ์ดแหล่งอ้างอิงเฉพาะแท็บ 4:** ลิงก์สู่ HDC Chronic/OPD/IPD, กรมควบคุมโรค, และกองยุทธศาสตร์และแผนงาน สธ. พร้อมไฟล์สถิติ NCDs, สถิติการป่วย และสถิติสาเหตุการตาย

---

## 📂 โครงสร้างโฟลเดอร์ของโครงการ (Project Structure)

```
Work-Work (Branch: Aging-Data-Analysis)
├── aging-analytics-dashboard/           # แอปพลิเคชัน React + Vite + Tailwind CSS Dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── tabs/
│   │   │   │   ├── Tab1Clinic.tsx       # แท็บ 1: คลินิกผู้สูงอายุ + แผนที่ประเทศไทย + ตาราง 77 จังหวัด
│   │   │   │   ├── Tab2Population.tsx   # แท็บ 2: ประชากร + Timeline Player + โมเดลทำนาย 2570-2580 + Top 10
│   │   │   │   ├── Tab3Screening.tsx    # แท็บ 3: คัดกรอง 9 ด้าน (ICOPE) + DMS Care Tools
│   │   │   │   └── Tab4Morbidity.tsx    # แท็บ 4: โรค NCDs + สถิติการป่วย OPD/IPD + สาเหตุการตาย
│   │   │   ├── Header.tsx               # ส่วนหัวระบบ + ตัวเลือกแท็บ + ตัวกรองปี/เขตสุขภาพ
│   │   │   ├── KPICard.tsx              # การ์ดแสดงผลตัวชี้วัดสำคัญ
│   │   │   ├── ThailandClinicMap.tsx    # แผนที่ประเทศไทย SVG (คลินิกผู้สูงอายุ) Continuous Gradient
│   │   │   ├── ThailandPopulationMap.tsx# แผนที่ประเทศไทย SVG (ประชากรสูงวัย) Continuous Gradient
│   │   │   └── TabSourceReference.tsx   # คอมโพเนนต์แหล่งอ้างอิงและหมายเหตุเฉพาะแต่ละแท็บ
│   │   ├── data/
│   │   │   └── dashboardData.json       # ข้อมูลโครงสร้างสมบูรณ์สำหรับเรนเดอร์แดชบอร์ด
│   │   ├── types.ts                     # TypeScript Type Definitions
│   │   ├── App.tsx                      # Root Application Component
│   │   ├── main.tsx                     # Entry Point
│   │   └── index.css                    # Tailwind CSS Base & Theme Styles
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── data/                                # ชุดข้อมูลดิบและข้อมูลประมวลผลทั้งหมด (ครบทุกไฟล์)
│   ├── raw_excel/
│   │   ├── 01_geriatric_clinic/         # geriatric_clinic_report.xlsx
│   │   ├── 02_population/               # ข้อมูลประชากรผู้สูงอายุ_60ปีขึ้นไป_2566-2569_รายเขต_รายจังหวัด.xlsx
│   │   ├── 03_health_screening/         # 1. hdc_elderly_screening_9domains.xlsx, 2. geriatric_data_report_2567-2569.xlsx
│   │   └── 04_ncds_morbidity_mortality/ # 3. สถิติผู้สูงอายุ_NCDs_2566-2569.xlsx, 4. สถิติสาเหตุการป่วย_10อันดับแรก, 5. สถิติสาเหตุการตาย
│   ├── analysis_reports_and_csv/        # รายงานสรุปสถานการณ์สุขภาพ DOCX และชุดข้อมูล CSV ทั้ง 8 ไฟล์
│   ├── json/                            # dashboardData.json
│   └── README.md                        # คำอธิบายชุดข้อมูล (Data Dictionary)
├── docs/                                # เอกสารวิชาการ ข้อกำหนด และการออกแบบระบบ
│   ├── GLOSSARY.md                      # พจนานุกรมคำศัพท์เวชศาสตร์ผู้สูงอายุและสาธารณสุข
│   ├── KNOWLEDGE_BASE_Multimorbidity_ML.md # ฐานความรู้ Machine Learning วิเคราะห์โรคเรื้อรังร่วม
│   ├── Project2_Multimorbidity_Transition_Proposal.md # ข้อเสนอโครงการวิจัยการเปลี่ยนผ่านพหุพยาธิสภาพ
│   ├── DESIGN.md                        # เอกสารข้อกำหนดระบบการออกแบบและ Palette สี
│   └── adr/                             # Architectural Decision Records
├── scripts/                             # สคริปต์ประมวลผลข้อมูลและสร้างไฟล์ Excel (Python ETL)
│   ├── generate_excel.py
│   └── generate_mortality_excel.py
├── package.json                         # Root NPM Scripts สำหรับรันคำสั่งโครงการอย่างสะดวก
├── .gitignore                           # Git ignore ป้องกันไฟล์ขยะและ node_modules
└── README.md                            # คู่มือการใช้งานระบบฉบับสมบูรณ์
```

---

## 📊 แคตตาล็อกและไฟล์ข้อมูลทั้งหมด (Data Catalog)

| ลำดับ | ชื่อไฟล์ข้อมูล | โฟลเดอร์ | รายละเอียด | แหล่งข้อมูลต้นทาง |
|---|---|---|---|---|
| 1 | `geriatric_clinic_report.xlsx` | `data/raw_excel/01_geriatric_clinic` | ข้อมูลผลการประเมินมาตรฐานคลินิกผู้สูงอายุ 937 รพ. (77 จังหวัด) | กรมการแพทย์ ([agingmed.dms.go.th](https://agingmed.dms.go.th)) |
| 2 | `ข้อมูลประชากรผู้สูงอายุ_60ปีขึ้นไป_2566-2569_รายเขต_รายจังหวัด.xlsx` | `data/raw_excel/02_population` | สถิติประชากรสูงวัย 4 ปีย้อนหลัง รายเขต-รายจังหวัด (77 จว.) | HDC สป.สธ. ([hdcservice.moph.go.th](https://hdcservice.moph.go.th)) & DOPA |
| 3 | `1. hdc_elderly_screening_9domains.xlsx` | `data/raw_excel/03_health_screening` | ผลการคัดกรองสุขภาพ 9 ด้าน (WHO ICOPE) และ ADL | กรมอนามัย / HDC ([bluebook.anamai.moph.go.th](https://bluebook.anamai.moph.go.th)) |
| 4 | `2. geriatric_data_report_2567-2569.xlsx` | `data/raw_excel/03_health_screening` | ข้อมูลหกล้ม สมองเสื่อม ช่องปาก และ Care Plan ใน รพ. | สถาบันเวชศาสตร์ผู้สูงอายุ ([dmscaretools.dms.go.th](https://dmscaretools.dms.go.th)) |
| 5 | `3. สถิติผู้สูงอายุ_NCDs_2566-2569.xlsx` | `data/raw_excel/04_ncds_morbidity_mortality` | สถิติผู้ป่วยโรคไม่ติดต่อเรื้อรัง 6 กลุ่มโรคหลัก | HDC แฟ้ม Chronic / กรมควบคุมโรค ([ddc.moph.go.th](https://ddc.moph.go.th)) |
| 6 | `4. สถิติสาเหตุการป่วย_10อันดับแรก_2566-2569.xlsx` | `data/raw_excel/04_ncds_morbidity_mortality` | 10 อันดับโรคที่มารับบริการผู้ป่วยนอก (OPD) และผู้ป่วยใน (IPD) | HDC แฟ้ม Diagnosis OPD/IPD สป.สธ. |
| 7 | `5. สถิติสาเหตุการตายในผู้สูงอายุ.xlsx` | `data/raw_excel/04_ncds_morbidity_mortality` | 10 อันดับสาเหตุการตาย และการเปรียบเทียบเพศชาย-หญิง | กองยุทธศาสตร์และแผนงาน สธ. ([spd.moph.go.th](https://spd.moph.go.th)) & DOPA |
| 8 | `01 - Elderly_Thailand_Health_Report_2565_2569.docx` | `data/analysis_reports_and_csv` | รายงานสังเคราะห์เชิงนโยบายสุขภาพผู้สูงอายุไทย | คณะผู้วิจัยและวิเคราะห์ข้อมูล |
| 9 | `elderly_health_5year_comprehensive_dataset_2565_2569.csv` | `data/analysis_reports_and_csv/CSV` | ชุดข้อมูลรวม 5 ปี (CSVs 8 ไฟล์) | ฐานข้อมูลบูรณาการ |
| 10 | `dashboardData.json` | `data/json` และ `aging-analytics-dashboard/src/data` | โครงสร้างข้อมูล JSON สำหรับขับเคลื่อนแดชบอร์ด | ประมวลผลจาก Excel ทั้งหมด |

---

## 🚀 วิธีการติดตั้งและรันโครงการ (Getting Started)

### ความต้องการของระบบ (Prerequisites)
* **Node.js:** เวอร์ชั่น 18.0.0 หรือใหม่กว่า
* **npm:** เวอร์ชั่น 9.0.0 หรือใหม่กว่า (หรือ pnpm / yarn)

### ขั้นตอนการรันแดชบอร์ด (Local Development)

```bash
# 1. เข้าสู่โฟลเดอร์แดชบอร์ด
cd aging-analytics-dashboard

# 2. ติดตั้ง Dependencies ทั้งหมด
npm install

# 3. รันเซิร์ฟเวอร์สำหรับการพัฒนา (Development Server)
npm run dev
```

เปิดเว็บเบราว์เซอร์ไปที่ `http://localhost:5173/` เพื่อใช้งานแดชบอร์ด

### การทดสอบและ Build สำหรับ Production

```bash
# ตรวจสอบ TypeScript และสร้าง Production Build
npm run build

# ทดสอบรันไฟล์ Build (Preview)
npm run preview
```

---

## 🏛️ แหล่งข้อมูลอ้างอิงและหมายเหตุทางเทคนิค (Official Sources & Technical Notes)

1. **สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์ กระทรวงสาธารณสุข**  
   เว็บไซต์: [https://agingmed.dms.go.th](https://agingmed.dms.go.th) | โทรศัพท์: 0-2568-1991  
   *ผู้ดูแลเกณฑ์มาตรฐานการจัดบริการคลินิกผู้สูงอายุในโรงพยาบาลทั่วประเทศ*
2. **ระบบคลังข้อมูลด้านการแพทย์และสุขภาพ (Health Data Center: HDC) สป.สธ.**  
   เว็บไซต์: [https://hdcservice.moph.go.th](https://hdcservice.moph.go.th)  
   *ฐานข้อมูลบริการสุขภาพ 43 แฟ้มมาตรฐาน ครอบคลุม 12 เขตสุขภาพ 76 จังหวัด*
3. **สำนักบริหารการทะเบียน กรมการปกครอง กระทรวงมหาดไทย (DOPA)**  
   เว็บไซต์: [https://stat.bora.dopa.go.th](https://stat.bora.dopa.go.th)  
   *สถิติทะเบียนราษฎรทางการ จำนวนประชากรรายอายุ และพื้นที่กรุงเทพมหานคร*
4. **สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ (สศช. / NESDC)**  
   เว็บไซต์: [https://www.nesdc.go.th](https://www.nesdc.go.th)  
   *รายงานการคาดประมาณประชากรของประเทศไทย พ.ศ. 2553–2583*
5. **กรมอนามัย กระทรวงสาธารณสุข**  
   เว็บไซต์: [https://bluebook.anamai.moph.go.th](https://bluebook.anamai.moph.go.th)  
   *ระบบสมุดบันทึกสุขภาพผู้สูงอายุ (Blue Book Application) และการคัดกรอง 9 ด้าน*

---

*จัดทำและพัฒนาโดย กลุ่มงานวิเคราะห์ข้อมูลสุขภาพผู้สูงอายุ (Aging Data Analytics Team) — พ.ศ. 2569*
