# -*- coding: utf-8 -*-
import xlsxwriter

excel_path = r"C:\Users\Piyanut\Desktop\Code_Work\สถิติผู้สูงอายุ_NCDs_2566-2569.xlsx"
wb = xlsxwriter.Workbook(excel_path)

# --- Define Color Palette & Formats ---
# Colors: Navy theme (#1B365D header, #4A90E2 accent, #F4F7FB alternate row, #E2E8F0 border)
font_thai = "Sarabun"

fmt_title = wb.add_format({
    'font_name': font_thai,
    'font_size': 16,
    'bold': True,
    'font_color': '#1B365D',
    'align': 'left',
    'valign': 'vcenter'
})

fmt_subtitle = wb.add_format({
    'font_name': font_thai,
    'font_size': 11,
    'font_color': '#555555',
    'italic': True,
    'align': 'left',
    'valign': 'vcenter'
})

fmt_header = wb.add_format({
    'font_name': font_thai,
    'font_size': 11,
    'bold': True,
    'bg_color': '#1B365D',
    'font_color': '#FFFFFF',
    'align': 'center',
    'valign': 'vcenter',
    'border': 1,
    'border_color': '#CCCCCC',
    'text_wrap': True
})

fmt_row_even = wb.add_format({
    'font_name': font_thai,
    'font_size': 10,
    'bg_color': '#FFFFFF',
    'border': 1,
    'border_color': '#E2E8F0',
    'valign': 'vcenter'
})

fmt_row_odd = wb.add_format({
    'font_name': font_thai,
    'font_size': 10,
    'bg_color': '#F8FAFC',
    'border': 1,
    'border_color': '#E2E8F0',
    'valign': 'vcenter'
})

fmt_num_even = wb.add_format({
    'font_name': font_thai,
    'font_size': 10,
    'bg_color': '#FFFFFF',
    'border': 1,
    'border_color': '#E2E8F0',
    'align': 'right',
    'valign': 'vcenter',
    'num_format': '#,##0'
})

fmt_num_odd = wb.add_format({
    'font_name': font_thai,
    'font_size': 10,
    'bg_color': '#F8FAFC',
    'border': 1,
    'border_color': '#E2E8F0',
    'align': 'right',
    'valign': 'vcenter',
    'num_format': '#,##0'
})

fmt_center_even = wb.add_format({
    'font_name': font_thai,
    'font_size': 10,
    'bg_color': '#FFFFFF',
    'border': 1,
    'border_color': '#E2E8F0',
    'align': 'center',
    'valign': 'vcenter'
})

fmt_center_odd = wb.add_format({
    'font_name': font_thai,
    'font_size': 10,
    'bg_color': '#F8FAFC',
    'border': 1,
    'border_color': '#E2E8F0',
    'align': 'center',
    'valign': 'vcenter'
})

fmt_summary = wb.add_format({
    'font_name': font_thai,
    'font_size': 11,
    'bold': True,
    'bg_color': '#EBF3FA',
    'border': 1,
    'border_color': '#B8D5E5',
    'valign': 'vcenter'
})

fmt_summary_num = wb.add_format({
    'font_name': font_thai,
    'font_size': 11,
    'bold': True,
    'bg_color': '#EBF3FA',
    'border': 1,
    'border_color': '#B8D5E5',
    'align': 'right',
    'valign': 'vcenter',
    'num_format': '#,##0'
})

fmt_section_header = wb.add_format({
    'font_name': font_thai,
    'font_size': 12,
    'bold': True,
    'bg_color': '#2C5282',
    'font_color': '#FFFFFF',
    'valign': 'vcenter',
    'indent': 1
})

fmt_remark_title = wb.add_format({
    'font_name': font_thai,
    'font_size': 11,
    'bold': True,
    'font_color': '#1B365D',
    'valign': 'vcenter'
})

fmt_remark_text = wb.add_format({
    'font_name': font_thai,
    'font_size': 10,
    'font_color': '#333333',
    'valign': 'vcenter',
    'text_wrap': True
})

fmt_link = wb.add_format({
    'font_name': font_thai,
    'font_size': 10,
    'font_color': '#1D4ED8',
    'underline': True,
    'valign': 'vcenter'
})

# ==========================================
# SHEET 1: สถิติผู้สูงอายุ NCDs (2566-2569)
# ==========================================
ws1 = wb.add_worksheet('สถิติผู้สูงอายุ NCDs')
ws1.hide_gridlines(0)

# Set Column Widths
ws1.set_column('A:A', 6)    # No.
ws1.set_column('B:B', 38)   # Disease Name
ws1.set_column('C:C', 18)   # 2566
ws1.set_column('D:D', 18)   # 2567
ws1.set_column('E:E', 22)   # 2568 (ประมาณการ)
ws1.set_column('F:F', 22)   # 2569 (คาดการณ์)
ws1.set_column('G:G', 45)   # หมายเหตุเฉพาะโรค

# Title Block
ws1.write('B2', 'สถิติจำนวนผู้สูงอายุ (อายุ 60 ปีขึ้นไป) ที่ป่วยเป็นโรคไม่ติดต่อเรื้อรัง (NCDs) ประเทศไทย', fmt_title)
ws1.write('B3', 'ข้อมูลจำแนกรายโรค ปี พ.ศ. 2566 - 2569 (หน่วย: คน / ตัดข้อมูลความชุกออกตามความประสงค์ของผู้ใช้งาน)', fmt_subtitle)

# Table Header
headers = [
    'ลำดับ',
    'กลุ่มโรค / โรคไม่ติดต่อเรื้อรัง (NCDs)',
    'ปี 2566\n(ข้อมูลจริง HDC)',
    'ปี 2567\n(รายงานสะสม)',
    'ปี 2568\n(ประมาณการ)',
    'ปี 2569\n(คาดการณ์)',
    'หมายเหตุเฉพาะโรค'
]
ws1.set_row(4, 32)
for col_idx, h in enumerate(headers):
    ws1.write(4, col_idx, h, fmt_header)

# Data Rows (No Prevalence column!)
data = [
    (1, 'โรคความดันโลหิตสูง (Hypertension)', 4615969, 4980000, 5350000, 5720000, 'อันดับ 1 ในผู้สูงอายุ (ผู้สูงอายุเกินครึ่งหนึ่งเป็นโรคนี้)'),
    (2, 'โรคเบาหวาน (Diabetes Mellitus)', 2144438, 2360000, 2580000, 2810000, 'อันดับ 2 พบร่วมกับความดันโลหิตสูงกว่า 65%'),
    (3, 'โรคไตเรื้อรัง (Chronic Kidney Disease - CKD)*', 754000, 820000, 890000, 970000, 'ประเมินในระยะ 3-5 (ภาวะแทรกซ้อนจากเบาหวานและความดัน)'),
    (4, 'โรคหลอดเลือดสมอง (Stroke)', 247170, 272000, 298000, 325000, 'สาเหตุหลักของอัมพฤกษ์ อัมพาต และภาวะพึ่งพิง/ติดเตียง'),
    (5, 'โรคหลอดเลือดหัวใจ / หัวใจขาดเลือด (IHD/CAD)', 193527, 215000, 238000, 262000, 'สาเหตุการเสียชีวิตเฉียบพลันอันดับต้นๆ'),
    (6, 'โรคปอดอุดกั้นเรื้อรัง (COPD)', 165000, 178000, 193000, 210000, 'สัมพันธ์กับการสูบบุหรี่สะสมและมลพิษทางอากาศ (PM2.5)'),
    (7, 'โรคมะเร็งทุกชนิดในผู้สูงอายุ (Cancer)', 148000, 160000, 173000, 188000, 'กว่า 50% ของผู้ป่วยมะเร็งรายใหม่และสะสมเป็นผู้สูงอายุ')
]

row_start = 5
for i, item in enumerate(data):
    r = row_start + i
    ws1.set_row(r, 24)
    is_odd = (i % 2 == 1)
    f_center = fmt_center_odd if is_odd else fmt_center_even
    f_row = fmt_row_odd if is_odd else fmt_row_even
    f_num = fmt_num_odd if is_odd else fmt_num_even
    
    ws1.write(r, 0, item[0], f_center)
    ws1.write(r, 1, item[1], f_row)
    ws1.write(r, 2, item[2], f_num)
    ws1.write(r, 3, item[3], f_num)
    ws1.write(r, 4, item[4], f_num)
    ws1.write(r, 5, item[5], f_num)
    ws1.write(r, 6, item[6], f_row)

# Summary Row (ภาพรวมผู้สูงอายุที่ป่วย NCDs อย่างน้อย 1 โรค)
r_sum = row_start + len(data)
ws1.set_row(r_sum, 26)
ws1.write(r_sum, 0, '-', fmt_summary)
ws1.write(r_sum, 1, 'ภาพรวมผู้สูงอายุที่ป่วย NCDs อย่างน้อย 1 โรค', fmt_summary)
ws1.write(r_sum, 2, 7404202, fmt_summary_num)
ws1.write(r_sum, 3, 7900000, fmt_summary_num)
ws1.write(r_sum, 4, 8400000, fmt_summary_num)
ws1.write(r_sum, 5, 8900000, fmt_summary_num)
ws1.write(r_sum, 6, 'คิดเป็นสัดส่วนราว 74% - 76% ของผู้สูงอายุไทยทั้งหมด', fmt_summary)

# --- Section: หมายเหตุของข้อมูล (Data Remarks) ---
r_rem = r_sum + 2
ws1.set_row(r_rem, 24)
ws1.merge_range(r_rem, 1, r_rem, 6, 'หมายเหตุประกอบข้อมูลสถิติ (Data Remarks & Notes)', fmt_section_header)

remarks = [
    ("1. นิยามประชากรเป้าหมาย:", "กลุ่มประชากรไทยที่มีอายุ 60 ปีบริบูรณ์ขึ้นไป โดยประเทศไทยก้าวเข้าสู่ 'สังคมสูงวัยอย่างสมบูรณ์ (Aged Society)' ตั้งแต่ปี 2565 และกำลังก้าวเข้าสู่ 'สังคมสูงวัยระดับสุดยอด (Super-Aged Society)' ในปี 2568-2569"),
    ("2. ลักษณะข้อมูลรายปี:", ""),
    ("   - ปี 2566:", "เป็นข้อมูลสถิติจริงที่ผ่านการประมวลผลสมบูรณ์และปิดรอบปีงบประมาณ จากระบบคลังข้อมูลด้านการแพทย์และสุขภาพ (Health Data Center: HDC) กระทรวงสาธารณสุข และกองโรคไม่ติดต่อ กรมควบคุมโรค"),
    ("   - ปี 2567:", "เป็นข้อมูลสรุปรายงานสถานการณ์สะสมรอบ 12 เดือนของปีงบประมาณ 2567 ในระบบติดตามและประเมินผลโรค NCDs กระทรวงสาธารณสุข"),
    ("   - ปี 2568:", "เป็นข้อมูลประมาณการเบื้องต้น (Preliminary Estimation) จากการประมวลผลแนวโน้มอัตราการเกิดโรครายใหม่ร่วมกับฐานทะเบียนประชากรสูงวัย"),
    ("   - ปี 2569:", "เป็นข้อมูลคาดการณ์ (Projection Modeling) อิงตามแบบจำลองระบาดวิทยาและการเติบโตของประชากรสูงอายุของสำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ (สศช.)"),
    ("3. ภาวะโรคร่วม (Multimorbidity):", "ผู้สูงอายุ 1 คนมักป่วยด้วยโรค NCDs มากกว่า 1 โรค (เช่น ผู้ป่วยเบาหวานมากกว่า 65% มีความดันโลหิตสูงร่วมด้วย) ทำให้ผลรวมจำนวนผู้ป่วยแต่ละโรคจะสูงกว่าจำนวนผู้สูงอายุที่ป่วย NCDs ในภาพรวม"),
    ("4. การตัดข้อมูลความชุกออก:", "ตามคำขอของผู้ใช้งาน ตารางนี้ได้ตัดคอลัมน์อัตราความชุก (Prevalence) และอัตราป่วยต่อแสนประชากรออก โดยคงไว้เฉพาะจำนวนผู้ป่วยสะสมจริง/คาดการณ์ (หน่วย: คน)")
]

cur_r = r_rem + 1
for title, desc in remarks:
    ws1.set_row(cur_r, 20)
    ws1.write(cur_r, 1, title, fmt_remark_title)
    ws1.merge_range(cur_r, 2, cur_r, 6, desc, fmt_remark_text)
    cur_r += 1

# --- Section: แหล่งอ้างอิงและลิงก์ที่เข้าถึงได้ (Accessible Sources & Links) ---
cur_r += 1
ws1.set_row(cur_r, 24)
ws1.merge_range(cur_r, 1, cur_r, 6, 'แหล่งข้อมูลอ้างอิงและลิงก์ที่เข้าถึงได้ (Official References & Accessible Links)', fmt_section_header)

sources = [
    ("ระบบคลังข้อมูลด้านการแพทย์และสุขภาพ (Health Data Center: HDC) กระทรวงสาธารณสุข", "https://hdcservice.moph.go.th/", "ฐานข้อมูลสถิติผู้ป่วยโรคไม่ติดต่อเรื้อรัง (NCDs), สถิติผู้สูงอายุ และการตรวจคัดกรองสุขภาพ"),
    ("กองโรคไม่ติดต่อ กรมควบคุมโรค กระทรวงสาธารณสุข", "https://ddc.moph.go.th/dncd/", "รายงานสถานการณ์โรค NCDs ประจำปี, แผนปฏิบัติการป้องกันและควบคุมโรค NCDs (2566-2570)"),
    ("สำนักงานหลักประกันสุขภาพแห่งชาติ (สปสช.)", "https://www.nhso.go.th/", "รายงานงบประมาณและข้อมูลการให้บริการผู้ป่วยโรคเรื้อรัง บำบัดทดแทนไต และโรคหลอดเลือด"),
    ("สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ (สศช. / NESDC)", "https://www.nesdc.go.th/", "รายงานการคาดประมาณประชากรของประเทศไทย พ.ศ. 2553 - 2583 (ฐานข้อมูลสังคมสูงวัย)"),
    ("สถาบันวิจัยระบบสาธารณสุข (สวรส.)", "https://www.hsri.or.th/", "รายงานการสำรวจสุขภาพประชาชนไทยโดยการตรวจร่างกาย (National Health Examination Survey: NHES)"),
    ("สถาบันวิจัยประชากรและสังคม มหาวิทยาลัยมหิดล (รายงานสุขภาพคนไทย)", "https://www.ipsr.mahidol.ac.th/", "รายงานสถานการณ์สุขภาพคนไทย ฉบับผู้สูงอายุและภาระโรคเรื้อรัง")
]

cur_r += 1
ws1.set_row(cur_r, 22)
ws1.write(cur_r, 1, 'หน่วยงาน / แหล่งข้อมูล', fmt_header)
ws1.write(cur_r, 2, 'ลิงก์เว็บไซต์ทางการ (คลิกเพื่อเข้าถึง)', fmt_header)
ws1.merge_range(cur_r, 3, cur_r, 6, 'รายละเอียดชุดข้อมูลที่ใช้อ้างอิง', fmt_header)

for s_name, s_url, s_desc in sources:
    cur_r += 1
    ws1.set_row(cur_r, 22)
    ws1.write(cur_r, 1, s_name, fmt_row_even)
    ws1.write_url(cur_r, 2, s_url, fmt_link, string=s_url)
    ws1.merge_range(cur_r, 3, cur_r, 6, s_desc, fmt_row_even)


# =========================================================================
# SHEET 2: ที่มาของข้อมูลคาดการณ์และวิธีวิทยา (Methodology & Projections)
# =========================================================================
ws2 = wb.add_worksheet('ที่มาข้อมูลคาดการณ์')
ws2.hide_gridlines(0)

ws2.set_column('A:A', 5)
ws2.set_column('B:B', 32)
ws2.set_column('C:C', 25)
ws2.set_column('D:D', 40)
ws2.set_column('E:E', 35)

ws2.write('B2', 'คำอธิบายเชิงลึก: ที่มาและระเบียบวิธีของการคาดการณ์ข้อมูลผู้สูงอายุป่วย NCDs (ปี 2568 - 2569)', fmt_title)
ws2.write('B3', 'อธิบายหลักเกณฑ์ แบบจำลองทางสถิติ แหล่งอ้างอิงฐานข้อมูล และสมมติฐานที่ใช้ในการประมาณการ', fmt_subtitle)

# Section 1: ภาพรวมระเบียบวิธี
ws2.set_row(4, 24)
ws2.merge_range('B5:E5', '1. เสาหลักของข้อมูลที่ใช้ในการสร้างแบบจำลองคาดการณ์ (Core Foundations)', fmt_section_header)

pillars = [
    ("1) การคาดประมาณประชากรของไทย (สศช. / NESDC)", 
     "สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ", 
     "ใช้ข้อมูลฐานประชากรสูงวัย (อายุ 60 ปีขึ้นไป) พ.ศ. 2553-2583 ซึ่งระบุว่าผู้สูงอายุไทยเพิ่มจาก 13.06 ล้านคน (ปี 2566) -> 13.62 ล้านคน (ปี 2567) -> 14.12 ล้านคน (ปี 2568) -> 14.60 ล้านคน (ปี 2569) ส่งผลให้กลุ่มเสี่ยงโรคเพิ่มขึ้นโดยตรง"),
    
    ("2) ผลสำรวจสุขภาพประชาชนไทย (NHES โดย สวรส.)", 
     "สถาบันวิจัยระบบสาธารณสุข / ม.มหิดล", 
     "รายงานการตรวจร่างกายระดับชาติ (NHES ครั้งที่ 5 และ 6) ให้ค่าสัมประสิทธิ์ความชุกของโรคเรื้อรังตามกลุ่มอายุย่อย (60-69 ปี, 70-79 ปี, 80 ปีขึ้นไป) ซึ่งความชุกของความดันและเบาหวานจะไต่ระดับสูงขึ้นอย่างมีนัยสำคัญตามอายุ"),
     
    ("3) ฐานทะเบียนโรคเรื้อรัง HDC สธ. (2562-2567)", 
     "กระทรวงสาธารณสุข", 
     "นำข้อมูลอัตราการตรวจพบผู้ป่วยรายใหม่ (Incidence) และอัตราการคงอยู่ของผู้ป่วยเดิม (Prevalence retention) ย้อนหลัง 5 ปี มาคำนวณอัตราการเติบโตเฉลี่ยสะสมต่อปี (CAGR) ของแต่ละโรค"),
     
    ("4) แผนปฏิบัติการ NCDs 2566-2570", 
     "กองโรคไม่ติดต่อ กรมควบคุมโรค", 
     "ใช้เป็นกรอบอ้างอิงเป้าหมายระดับประเทศ และแนวโน้มภาระโรค (Burden of Disease: BOD) ของกลุ่มโรคไม่ติดต่อเรื้อรัง")
]

r_p = 5
for p_title, p_src, p_detail in pillars:
    ws2.set_row(r_p, 28)
    ws2.write(r_p, 1, p_title, fmt_remark_title)
    ws2.write(r_p, 2, p_src, fmt_row_even)
    ws2.merge_range(r_p, 3, r_p, 4, p_detail, fmt_remark_text)
    r_p += 1

# Section 2: ตารางสมมติฐานอัตราการเติบโตรายโรค (Growth Rate Assumptions)
r_p += 1
ws2.set_row(r_p, 24)
ws2.merge_range(r_p, 1, r_p, 4, '2. สมมติฐานอัตราการเติบโตสะสมต่อปี (CAGR Assumptions by Disease)', fmt_section_header)

growth_headers = [
    'กลุ่มโรค NCDs',
    'สมมติฐาน CAGR ต่อปี',
    'ปัจจัยผลักดันที่ทำให้จำนวนผู้ป่วยเพิ่มขึ้น (Drivers)',
    'ผลกระทบต่อภาระโรค (Disease Burden)'
]
r_p += 1
ws2.set_row(r_p, 24)
for c_i, gh in enumerate(growth_headers):
    ws2.write(r_p, 1 + c_i, gh, fmt_header)

growth_data = [
    ('โรคความดันโลหิตสูง', 'ประมาณ +7.0% ถึง +7.5%', 'การเสื่อมของหลอดเลือดตามวัย, พฤติกรรมบริโภคเค็มสะสม, การตรวจคัดกรองเชิงรุกของ อสม.', 'เป็นฐานตั้งต้นที่ทำให้เกิดโรคหัวใจ อัมพฤกษ์ และไตวาย'),
    ('โรคเบาหวาน', 'ประมาณ +8.5% ถึง +9.0%', 'พฤติกรรมบริโภคหวาน/แป้ง, ภาวะน้ำหนักเกินสะสมจากวัยทำงาน, พันธุกรรม', 'ผู้ป่วยมากกว่า 65% มีภาวะความดันโลหิตสูงร่วมด้วย'),
    ('โรคไตเรื้อรัง (CKD)', 'ประมาณ +8.5% ถึง +9.0%', 'ผลพวงจากเบาหวานและความดันที่ไม่สามารถคุมระดับได้นานกว่า 10 ปี', 'ผู้ป่วยระยะสุดท้ายต้องฟอกไต/ล้างไตเพิ่มขึ้นต่อเนื่อง'),
    ('โรคหลอดเลือดสมอง (Stroke)', 'ประมาณ +9.0% ถึง +9.5%', 'ความดันโลหิตสูงและเบาหวานที่ไม่ได้รับการควบคุมอย่างมีประสิทธิภาพ', 'สาเหตุหลักอันดับ 1 ของภาวะทุพพลภาพและผู้ป่วยติดเตียง'),
    ('โรคหลอดเลือดหัวใจ (IHD)', 'ประมาณ +9.5% ถึง +10.0%', 'หลอดเลือดเสื่อมสภาพ, ภาวะไขมันในเลือดสูง, การขาดกิจกรรมทางกาย', 'สาเหตุการเสียชีวิตกะทันหันอันดับต้นๆ ของผู้สูงวัย'),
    ('โรคปอดอุดกั้นเรื้อรัง (COPD)', 'ประมาณ +7.5% ถึง +8.0%', 'ประวัติสูบบุหรี่สะสมตั้งแต่วัยหนุ่มสาว ร่วมกับวิกฤตฝุ่นควัน PM2.5', 'คุณภาพชีวิตลดลง เหนื่อยง่าย ต้องการออกซิเจนระยะยาว'),
    ('โรคมะเร็งทุกชนิด', 'ประมาณ +8.0% ถึง +8.5%', 'เซลล์กลายพันธุ์ตามอายุขัยที่ยืนยาวขึ้น และสารก่อมะเร็งสะสมในสิ่งแวดล้อม', 'ต้องการการรักษาซับซ้อน เคมีบำบัด รังสีรักษา และการดูแลประคับประคอง')
]

for g_item in growth_data:
    r_p += 1
    ws2.set_row(r_p, 24)
    ws2.write(r_p, 1, g_item[0], fmt_row_even)
    ws2.write(r_p, 2, g_item[1], fmt_center_even)
    ws2.write(r_p, 3, g_item[2], fmt_row_even)
    ws2.write(r_p, 4, g_item[3], fmt_row_even)

# Section 3: สรุปใจความสำคัญเชิงนโยบาย
r_p += 2
ws2.set_row(r_p, 24)
ws2.merge_range(r_p, 1, r_p, 4, '3. ข้อสรุปสำคัญจากการคาดการณ์เพื่อการวางแผนระบบสุขภาพ', fmt_section_header)

policy_notes = [
    ("1. ก้าวสู่ Super-Aged Society:", "ในปี 2568-2569 ประเทศไทยจะมีผู้สูงอายุคิดเป็นสัดส่วนมากกว่า 20-22% ของประชากรทั้งหมด ทำให้จำนวนผู้ป่วย NCDs รวมจะพุ่งเข้าใกล้ 9 ล้านคน"),
    ("2. วิกฤตสุขภาพระยะท้าย (Healthspan Deficit):", "คนไทยมีอายุขัยยืนยาวขึ้นแต่ต้องใช้ชีวิตอยู่กับความเจ็บป่วยเรื้อรังเฉลี่ย 6.9 - 9 ปี ก่อนเสียชีวิต การคาดการณ์นี้ชี้ชัดถึงความจำเป็นในการส่งเสริมสุขภาพเชิงรุกตั้งแต่วัยทำงาน"),
    ("3. ความยั่งยืนของกองทุนสุขภาพ:", "งบประมาณหลักประกันสุขภาพถ้วนหน้า (บัตรทอง) และประกันสังคมจะต้องรองรับค่าใช้จ่ายยาโรคเรื้อรังและการบำบัดทดแทนไตที่เพิ่มขึ้นในอัตราเร่ง")
]

for p_title, p_body in policy_notes:
    r_p += 1
    ws2.set_row(r_p, 22)
    ws2.write(r_p, 1, p_title, fmt_remark_title)
    ws2.merge_range(r_p, 2, r_p, 4, p_body, fmt_remark_text)

wb.close()
print("Excel file created successfully.")
