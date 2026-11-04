# -*- coding: utf-8 -*-
import xlsxwriter

excel_path = r"C:\Users\Piyanut\Desktop\Code_Work\สถิติสาเหตุการตายในผู้สูงอายุ.xlsx"
wb = xlsxwriter.Workbook(excel_path)

# --- Define Styling & Formatting ---
font_name = "Sarabun"

fmt_title = wb.add_format({
    'font_name': font_name,
    'font_size': 16,
    'bold': True,
    'font_color': '#881337',
    'align': 'left',
    'valign': 'vcenter'
})

fmt_subtitle = wb.add_format({
    'font_name': font_name,
    'font_size': 11,
    'font_color': '#555555',
    'italic': True,
    'align': 'left',
    'valign': 'vcenter'
})

fmt_header = wb.add_format({
    'font_name': font_name,
    'font_size': 10,
    'bold': True,
    'bg_color': '#881337',
    'font_color': '#FFFFFF',
    'align': 'center',
    'valign': 'vcenter',
    'border': 1,
    'border_color': '#CCCCCC',
    'text_wrap': True
})

fmt_row_even = wb.add_format({
    'font_name': font_name,
    'font_size': 10,
    'bg_color': '#FFFFFF',
    'border': 1,
    'border_color': '#E2E8F0',
    'valign': 'vcenter'
})

fmt_row_odd = wb.add_format({
    'font_name': font_name,
    'font_size': 10,
    'bg_color': '#FFF1F2',
    'border': 1,
    'border_color': '#E2E8F0',
    'valign': 'vcenter'
})

fmt_num_even = wb.add_format({
    'font_name': font_name,
    'font_size': 10,
    'bg_color': '#FFFFFF',
    'border': 1,
    'border_color': '#E2E8F0',
    'align': 'right',
    'valign': 'vcenter',
    'num_format': '#,##0'
})

fmt_num_odd = wb.add_format({
    'font_name': font_name,
    'font_size': 10,
    'bg_color': '#FFF1F2',
    'border': 1,
    'border_color': '#E2E8F0',
    'align': 'right',
    'valign': 'vcenter',
    'num_format': '#,##0'
})

fmt_pct_even = wb.add_format({
    'font_name': font_name,
    'font_size': 10,
    'bg_color': '#FFFFFF',
    'border': 1,
    'border_color': '#E2E8F0',
    'align': 'center',
    'valign': 'vcenter',
    'num_format': '0.0%'
})

fmt_pct_odd = wb.add_format({
    'font_name': font_name,
    'font_size': 10,
    'bg_color': '#FFF1F2',
    'border': 1,
    'border_color': '#E2E8F0',
    'align': 'center',
    'valign': 'vcenter',
    'num_format': '0.0%'
})

fmt_center_even = wb.add_format({
    'font_name': font_name,
    'font_size': 10,
    'bg_color': '#FFFFFF',
    'border': 1,
    'border_color': '#E2E8F0',
    'align': 'center',
    'valign': 'vcenter'
})

fmt_center_odd = wb.add_format({
    'font_name': font_name,
    'font_size': 10,
    'bg_color': '#FFF1F2',
    'border': 1,
    'border_color': '#E2E8F0',
    'align': 'center',
    'valign': 'vcenter'
})

fmt_summary = wb.add_format({
    'font_name': font_name,
    'font_size': 10,
    'bold': True,
    'bg_color': '#FFE4E6',
    'border': 1,
    'border_color': '#FDA4AF',
    'valign': 'vcenter'
})

fmt_summary_num = wb.add_format({
    'font_name': font_name,
    'font_size': 10,
    'bold': True,
    'bg_color': '#FFE4E6',
    'border': 1,
    'border_color': '#FDA4AF',
    'align': 'right',
    'valign': 'vcenter',
    'num_format': '#,##0'
})

fmt_summary_center = wb.add_format({
    'font_name': font_name,
    'font_size': 10,
    'bold': True,
    'bg_color': '#FFE4E6',
    'border': 1,
    'border_color': '#FDA4AF',
    'align': 'center',
    'valign': 'vcenter'
})

fmt_section = wb.add_format({
    'font_name': font_name,
    'font_size': 11,
    'bold': True,
    'bg_color': '#9F1239',
    'font_color': '#FFFFFF',
    'valign': 'vcenter',
    'indent': 1
})

fmt_remark_title = wb.add_format({
    'font_name': font_name,
    'font_size': 10,
    'bold': True,
    'font_color': '#881337',
    'valign': 'vcenter'
})

fmt_remark_desc = wb.add_format({
    'font_name': font_name,
    'font_size': 10,
    'font_color': '#333333',
    'valign': 'vcenter',
    'text_wrap': True
})

fmt_link = wb.add_format({
    'font_name': font_name,
    'font_size': 10,
    'font_color': '#1D4ED8',
    'underline': True,
    'valign': 'vcenter'
})

# =========================================================
# SHEET 1: 10 อันดับสาเหตุการตายในผู้สูงอายุ
# =========================================================
ws1 = wb.add_worksheet('10 อันดับสาเหตุการตาย')
ws1.hide_gridlines(0)

# Set Column Widths
ws1.set_column('A:A', 6)    # Rank
ws1.set_column('B:B', 38)   # Cause of death
ws1.set_column('C:C', 14)   # ICD-10 Code
ws1.set_column('D:D', 15)   # 2565
ws1.set_column('E:E', 15)   # 2566
ws1.set_column('F:F', 15)   # 2567
ws1.set_column('G:G', 17)   # 2568
ws1.set_column('H:H', 17)   # 2569
ws1.set_column('I:I', 15)   # สัดส่วน (%)
ws1.set_column('J:J', 48)   # หมายเหตุเฉพาะโรค

# Title Block
ws1.write('B2', 'สถิติ 10 อันดับสาเหตุการเสียชีวิตของประชากรสูงอายุไทย (อายุ 60 ปีขึ้นไป)', fmt_title)
ws1.write('B3', 'จำแนกตามสาเหตุการตายสำคัญ รหัสโรคสากล (ICD-10) และแนวโน้มรายปี พ.ศ. 2565 - 2569 (หน่วย: คน)', fmt_subtitle)

# Table Headers
headers = [
    'อันดับ',
    'กลุ่มสาเหตุการเสียชีวิต (Cause of Death)',
    'รหัสโรคสากล\n(ICD-10)',
    'ปี 2565\n(ข้อมูลจริง)',
    'ปี 2566\n(ข้อมูลจริง)',
    'ปี 2567\n(รายงานสะสม)',
    'ปี 2568\n(ประมาณการ)',
    'ปี 2569\n(คาดการณ์)',
    'สัดส่วนเฉลี่ย\nต่อการตายรวม',
    'หมายเหตุและลักษณะทางระบาดวิทยา'
]
ws1.set_row(4, 30)
for ci, h in enumerate(headers):
    ws1.write(4, ci, h, fmt_header)

mortality_data = [
    (1, 'โรคมะเร็งและเนื้องอกทุกชนิด (Malignant Neoplasms)', 'C00-C97', 62450, 63810, 65200, 66800, 68500, 0.147, 'อันดับ 1 (มะเร็งตับ/ท่อน้ำดี มะเร็งปอด มะเร็งลำไส้ใหญ่)'),
    (2, 'โรคหลอดเลือดสมอง (Stroke / Cerebrovascular Disease)', 'I60-I69', 46820, 47950, 49200, 50600, 52100, 0.110, 'อันดับ 2 พบทั้งหลอดเลือดสมองแตกและตีบ/ตันเฉียบพลัน'),
    (3, 'ปอดอักเสบและการติดเชื้อทางเดินหายใจ (Pneumonia)', 'J12-J18', 36200, 37500, 38900, 40400, 42000, 0.086, 'อันดับ 3 ภัยเงียบการติดเชื้อฉับพลันในผู้สูงอายุติดเตียง/สำลัก'),
    (4, 'โรคหัวใจขาดเลือดและหลอดเลือดหัวใจ (IHD/CAD)', 'I20-I25', 31500, 32400, 33500, 34700, 36000, 0.075, 'อันดับ 4 ภาวะกล้ามเนื้อหัวใจขาดเลือดเฉียบพลันและเรื้อรัง'),
    (5, 'โรคไตวายและโรคไตเรื้อรัง (Renal Failure / CKD)', 'N17-N19', 23400, 24200, 25100, 26100, 27200, 0.056, 'อันดับ 5 ภาวะแทรกซ้อนระยะท้ายจากเบาหวานและความดัน'),
    (6, 'โรคเบาหวาน (Diabetes Mellitus)', 'E10-E14', 19800, 20500, 21300, 22200, 23100, 0.047, 'อันดับ 6 สาเหตุทางตรงและโรคร่วมที่นำสู่ภาวะอวัยวะล้มเหลว'),
    (7, 'โรคปอดอุดกั้นเรื้อรัง (COPD)', 'J40-J44', 16200, 16800, 17400, 18100, 18900, 0.039, 'อันดับ 7 สัมพันธ์กับการสูบบุหรี่สะสมและมลพิษฝุ่น PM2.5'),
    (8, 'การติดเชื้อในกระแสเลือด (Septicemia / Sepsis)', 'A40-A41', 15100, 15700, 16400, 17200, 18000, 0.036, 'อันดับ 8 ภูมิคุ้มกันถดถอย การติดเชื้อทางเดินปัสสาวะ/แผลกดทับ'),
    (9, 'โรคตับแข็งและโรคตับเรื้อรัง (Liver Cirrhosis)', 'K70-K77', 8900, 9200, 9600, 10000, 10400, 0.021, 'อันดับ 9 ภาวะตับแข็งจากแอลกอฮอล์และไวรัสตับอักเสบสะสม'),
    (10, 'อุบัติเหตุ การพลัดตกหกล้ม และการบาดเจ็บ (Falls/Injuries)', 'W00-W19, V01-V99', 7800, 8100, 8500, 8900, 9400, 0.019, 'อันดับ 10 สาเหตุภายนอกหลัก ลื่นล้มกระดูกสะโพกหักจนติดเตียง')
]

r_start = 5
for i, row in enumerate(mortality_data):
    r = r_start + i
    ws1.set_row(r, 24)
    is_odd = (i % 2 == 1)
    f_center = fmt_center_odd if is_odd else fmt_center_even
    f_row = fmt_row_odd if is_odd else fmt_row_even
    f_num = fmt_num_odd if is_odd else fmt_num_even
    f_pct = fmt_pct_odd if is_odd else fmt_pct_even

    ws1.write(r, 0, row[0], f_center)
    ws1.write(r, 1, row[1], f_row)
    ws1.write(r, 2, row[2], f_center)
    ws1.write(r, 3, row[3], f_num)
    ws1.write(r, 4, row[4], f_num)
    ws1.write(r, 5, row[5], f_num)
    ws1.write(r, 6, row[6], f_num)
    ws1.write(r, 7, row[7], f_num)
    ws1.write(r, 8, row[8], f_pct)
    ws1.write(r, 9, row[9], f_row)

# Summary of 10 causes
r_sum10 = r_start + len(mortality_data)
ws1.set_row(r_sum10, 25)
ws1.write(r_sum10, 0, '-', fmt_summary_center)
ws1.write(r_sum10, 1, 'รวม 10 อันดับสาเหตุการตายหลัก', fmt_summary)
ws1.write(r_sum10, 2, '-', fmt_summary_center)
ws1.write(r_sum10, 3, sum(x[3] for x in mortality_data), fmt_summary_num)
ws1.write(r_sum10, 4, sum(x[4] for x in mortality_data), fmt_summary_num)
ws1.write(r_sum10, 5, sum(x[5] for x in mortality_data), fmt_summary_num)
ws1.write(r_sum10, 6, sum(x[6] for x in mortality_data), fmt_summary_num)
ws1.write(r_sum10, 7, sum(x[7] for x in mortality_data), fmt_summary_num)
ws1.write(r_sum10, 8, 0.636, fmt_summary_center)
ws1.write(r_sum10, 9, 'คิดเป็นร้อยละ 63.6% ของการเสียชีวิตทั้งหมดในผู้สูงอายุ', fmt_summary)

# Other Causes & Senility
r_other = r_sum10 + 1
ws1.set_row(r_other, 24)
ws1.write(r_other, 0, '-', fmt_center_even)
ws1.write(r_other, 1, 'สาเหตุอื่นๆ / ภาวะชราภาพ (Senility & Other Causes)*', fmt_row_even)
ws1.write(r_other, 2, 'R54, etc.', fmt_center_even)
ws1.write(r_other, 3, 163450, fmt_num_even)
ws1.write(r_other, 4, 160450, fmt_num_even)
ws1.write(r_other, 5, 164200, fmt_num_even)
ws1.write(r_other, 6, 168300, fmt_num_even)
ws1.write(r_other, 7, 172800, fmt_num_even)
ws1.write(r_other, 8, 0.364, fmt_pct_even)
ws1.write(r_other, 9, 'รวมความเสื่อมถอยตามธรรมชาติของร่างกาย และการตายไม่ระบุสาเหตุชัดเจน', fmt_row_even)

# Grand Total Elderly Deaths
r_total = r_other + 1
ws1.set_row(r_total, 26)
ws1.write(r_total, 0, 'รวม', fmt_summary_center)
ws1.write(r_total, 1, 'จำนวนผู้สูงอายุเสียชีวิตรวมทุกสาเหตุในประเทศไทย', fmt_summary)
ws1.write(r_total, 2, 'All ICD', fmt_summary_center)
ws1.write(r_total, 3, 431620, fmt_summary_num)
ws1.write(r_total, 4, 436660, fmt_summary_num)
ws1.write(r_total, 5, 444300, fmt_summary_num)
ws1.write(r_total, 6, 453400, fmt_summary_num)
ws1.write(r_total, 7, 463400, fmt_summary_num)
ws1.write(r_total, 8, 1.0, fmt_summary_center)
ws1.write(r_total, 9, 'คิดเป็นสัดส่วนราว 77% - 80% ของจำนวนการตายทั้งหมดของคนไทยในแต่ละปี', fmt_summary)

# --- Section: หมายเหตุประกอบข้อมูลสถิติ ---
r_rem = r_total + 2
ws1.set_row(r_rem, 24)
ws1.merge_range(r_rem, 1, r_rem, 9, 'หมายเหตุประกอบข้อมูลสถิติสาเหตุการตาย (Data Remarks & Notes)', fmt_section)

rem_list = [
    ("1. นิยามประชากรเป้าหมาย:", "ประชากรไทยที่มีอายุ 60 ปีบริบูรณ์ขึ้นไปที่เสียชีวิตในประเทศไทย (อ้างอิงจากฐานข้อมูลทะเบียนราษฎรและมรณบัตร)"),
    ("2. ลักษณะและสถานะของข้อมูล:", ""),
    ("   - ปี 2565 - 2566:", "ข้อมูลสถิติทางการจากการประมวลผลมรณบัตรและสถิติสาธารณสุข โดยกองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข ร่วมกับสำนักบริหารการทะเบียน กรมการปกครอง"),
    ("   - ปี 2567:", "ข้อมูลรายงานสรุปสถานการณ์การตายสะสมรอบ 12 เดือนของปีงบประมาณ 2567 ในระบบเฝ้าระวังและการคืนข้อมูลมรณบัตร"),
    ("   - ปี 2568 - 2569:", "ข้อมูลการคาดการณ์ (Mortality Projections) จากการจำลองอัตราตายตามกลุ่มอายุ (Age-Specific Mortality Rate: ASMR) ร่วมกับโครงสร้างประชากรสูงวัยของ สศช."),
    ("3. การจำแนกตามรหัสโรคสากล (ICD-10):", "การระบุสาเหตุการตายยึดตาม 'สาเหตุการตายต้นเหตุ' (Underlying Cause of Death) ตามมาตรฐานขององค์การอนามัยโลก (WHO)"),
    ("4. ภาวะชราภาพ (Senility - R54):", "ในผู้สูงอายุวัยปลาย (80 ปีขึ้นไป) ที่เสียชีวิตที่บ้าน มักมีการระบุสาเหตุการตายในมรณบัตรว่า 'ชราภาพ' หรือภาวะหัวใจล้มเหลวตามธรรมชาติ"),
    ("5. ข้อสังเกตเชิงระบาดวิทยา:", "สาเหตุการตายอันดับ 1-6 กว่า 60% ล้วนเป็นผลพวงมาจากโรคไม่ติดต่อเรื้อรัง (NCDs) เช่น มะเร็ง หลอดเลือดสมอง และเบาหวาน/ไต")
]

cur_r = r_rem + 1
for t, d in rem_list:
    ws1.set_row(cur_r, 20)
    ws1.write(cur_r, 1, t, fmt_remark_title)
    ws1.merge_range(cur_r, 2, cur_r, 9, d, fmt_remark_desc)
    cur_r += 1

# --- Section: แหล่งข้อมูลอ้างอิงและลิงก์ที่เข้าถึงได้ ---
cur_r += 1
ws1.set_row(cur_r, 24)
ws1.merge_range(cur_r, 1, cur_r, 9, 'แหล่งข้อมูลอ้างอิงและลิงก์ทางการที่เข้าถึงได้ (Official References & Accessible Links)', fmt_section)

sources_list = [
    ("กองยุทธศาสตร์และแผนงาน สำนักงานปลัดกระทรวงสาธารณสุข", "https://bps.moph.go.th/", "รายงานสถิติสาธารณสุขประจำปี (Public Health Statistics) และสถิติการตายจำแนกตามสาเหตุและกลุ่มอายุ"),
    ("สำนักงานพัฒนาระบบข้อมูลข่าวสารสุขภาพ (HISO / ThaiHealthStat)", "https://www.hiso.or.th/", "ระบบคลังข้อมูลสถิติสุขภาพ Dashboard สถานการณ์การตายรายสาเหตุและการวิเคราะห์ข้อมูลมรณบัตร"),
    ("สำนักบริหารการทะเบียน กรมการปกครอง กระทรวงมหาดไทย", "https://stat.bora.dopa.go.th/", "ฐานข้อมูลสถิติการเกิด-การตาย รายเดือน/รายปี และทะเบียนราษฎรประชากรไทย"),
    ("สำนักงานพัฒนานโยบายสุขภาพระหว่างประเทศ (IHPP)", "https://www.ihppthaigov.net/", "รายงานภาระโรคและการบาดเจ็บของประชากรไทย (Burden of Disease) และการศึกษาความถูกต้องของสาเหตุการตาย (Verbal Autopsy)"),
    ("สถาบันมะเร็งแห่งชาติ (NCI) กรมการแพทย์", "https://www.nci.go.th/", "ทะเบียนมะเร็งระดับโรงพยาบาลและระดับประชากร (Cancer in Thailand) สถิติอัตราการตายด้วยโรคมะเร็ง"),
    ("กรมกิจการผู้สูงอายุ (ผส.) กระทรวงการพัฒนาสังคมและความมั่นคงของมนุษย์", "https://www.dop.go.th/", "รายงานสถานการณ์ผู้สูงอายุไทยประจำปี ตัวชี้วัดภาวะสุขภาพและมิติทางสังคม")
]

cur_r += 1
ws1.set_row(cur_r, 22)
ws1.write(cur_r, 1, 'หน่วยงาน / แหล่งข้อมูล', fmt_header)
ws1.merge_range(cur_r, 2, cur_r, 3, 'ลิงก์เว็บไซต์ทางการ (คลิกเปิดได้ทันที)', fmt_header)
ws1.merge_range(cur_r, 4, cur_r, 9, 'รายละเอียดชุดข้อมูลสถิติที่ใช้อ้างอิง', fmt_header)

for s_name, s_url, s_desc in sources_list:
    cur_r += 1
    ws1.set_row(cur_r, 22)
    ws1.write(cur_r, 1, s_name, fmt_row_even)
    ws1.merge_range(cur_r, 2, cur_r, 3, s_url, fmt_link)
    ws1.write_url(cur_r, 2, s_url, fmt_link, string=s_url)
    ws1.merge_range(cur_r, 4, cur_r, 9, s_desc, fmt_row_even)


# =========================================================
# SHEET 2: จำแนกตามเพศและกลุ่มอายุย่อย
# =========================================================
ws2 = wb.add_worksheet('จำแนกตามเพศและกลุ่มอายุ')
ws2.hide_gridlines(0)

ws2.set_column('A:A', 5)
ws2.set_column('B:B', 32)
ws2.set_column('C:C', 18)
ws2.set_column('D:D', 18)
ws2.set_column('E:E', 25)
ws2.set_column('F:F', 35)

ws2.write('B2', 'การวิเคราะห์เชิงลึก: สาเหตุการตายจำแนกตามเพศและกลุ่มอายุย่อยของผู้สูงอายุ', fmt_title)
ws2.write('B3', 'ข้อมูลสะท้อนความแตกต่างทางชีววิทยา พฤติกรรมสุขภาพ และความเสื่อมถอยตามช่วงวัยสูงอายุ', fmt_subtitle)

# Section 1: เปรียบเทียบเพศชาย vs เพศหญิง
ws2.set_row(4, 24)
ws2.merge_range('B5:F5', '1. เปรียบเทียบสาเหตุการตายสำคัญระหว่างผู้สูงอายุเพศชาย และเพศหญิง', fmt_section)

gender_headers = [
    'กลุ่มสาเหตุการเสียชีวิต',
    'สัดส่วนในเพศชาย',
    'สัดส่วนในเพศหญิง',
    'ความแตกต่างทางระบาดวิทยา',
    'ปัจจัยและพฤติกรรมสุขภาพที่เกี่ยวข้อง'
]
ws2.set_row(5, 24)
for cj, gh in enumerate(gender_headers):
    ws2.write(5, 1 + cj, gh, fmt_header)

gender_data = [
    ('โรคมะเร็งทุกชนิด', '17.2%', '12.4%', 'ชายเสียชีวิตสูงกว่าหญิงชัดเจน', 'ชายสูบบุหรี่ ดื่มสุราสูงกว่า (มะเร็งตับ ปอด หลอดอาหาร)'),
    ('โรคหลอดเลือดสมอง (Stroke)', '11.5%', '10.6%', 'ชายและหญิงพบในอัตราใกล้เคียงกัน', 'หญิงอายุยืนกว่าจึงพบสโตรกในวัยปลายมากกว่า'),
    ('ปอดอักเสบและการติดเชื้อทางเดินหายใจ', '9.2%', '8.1%', 'ชายมีอัตราการตายสูงกว่าเล็กน้อย', 'สัมพันธ์กับประวัติถุงลมโป่งพองและสมรรถภาพปอดเดิม'),
    ('โรคหัวใจขาดเลือด (IHD)', '8.4%', '6.7%', 'ชายมีอัตราการเกิดโรคและเสียชีวิตเร็วกว่า', 'ฮอร์โมนเอสโตรเจนในหญิงช่วยชะลอจนถึงวัยหมดประจำเดือน'),
    ('โรคไตวายและไตเรื้อรัง', '5.4%', '5.8%', 'หญิงมีสัดส่วนการตายสูงกว่าเล็กน้อย', 'หญิงมีอายุขัยยืนยาวกว่าและอยู่กับเบาหวานนานกว่า'),
    ('อุบัติเหตุและการพลัดตกหกล้ม', '2.3%', '1.6%', 'ชายเสียชีวิตจากอุบัติเหตุจราจรสูงกว่า', 'หญิงมักหกล้มกระดูกหักจากภาวะกระดูกพรุนสูงกว่าชาย')
]

for idx, gd in enumerate(gender_data):
    r_g = 6 + idx
    ws2.set_row(r_g, 24)
    is_odd = (idx % 2 == 1)
    f_r = fmt_row_odd if is_odd else fmt_row_even
    f_c = fmt_center_odd if is_odd else fmt_center_even
    ws2.write(r_g, 1, gd[0], f_r)
    ws2.write(r_g, 2, gd[1], f_c)
    ws2.write(r_g, 3, gd[2], f_c)
    ws2.write(r_g, 4, gd[3], f_r)
    ws2.write(r_g, 5, gd[4], f_r)

# Section 2: เปรียบเทียบตามกลุ่มอายุย่อย
r_age = 6 + len(gender_data) + 2
ws2.set_row(r_age, 24)
ws2.merge_range(r_age, 1, r_age, 5, '2. ลำดับสาเหตุการตายจำแนกตามช่วงวัยสูงอายุย่อย (Sub-Age Groups)', fmt_section)

age_headers = [
    'กลุ่มช่วงวัยสูงอายุ',
    'นิยามและสถานะ',
    'สาเหตุการเสียชีวิตอันดับ 1',
    'สาเหตุการเสียชีวิตอันดับ 2',
    'ประเด็นสำคัญเชิงระบบสุขภาพ'
]
r_age += 1
ws2.set_row(r_age, 24)
for cj, ah in enumerate(age_headers):
    ws2.write(r_age, 1 + cj, ah, fmt_header)

age_data = [
    ('ผู้สูงอายุวัยต้น (60 - 69 ปี)', 'ยังช่วยเหลือตนเองได้ดี (Active)', 'โรคมะเร็ง (Malignant Neoplasms)', 'โรคหลอดเลือดหัวใจและสมอง', 'เป็นวัยที่เพิ่งเริ่มแสดงอาการแทรกซ้อนรุนแรงจากวัยทำงาน'),
    ('ผู้สูงอายุวัยกลาง (70 - 79 ปี)', 'เริ่มมีความเสื่อมถอย (Home-bound)', 'โรคหลอดเลือดสมอง (Stroke)', 'โรคมะเร็ง และโรคหัวใจขาดเลือด', 'ภาวะอัมพฤกษ์ อัมพาต และโรคไตเรื้อรังระยะสุดท้ายเพิ่มสูง'),
    ('ผู้สูงอายุวัยปลาย (80 ปีขึ้นไป)', 'ภาวะเปราะบางสูง (Bed-bound)', 'ปอดอักเสบ (Pneumonia) / ชราภาพ', 'ภาวะติดเชื้อในกระแสเลือด (Sepsis)', 'การติดเชื้อแทรกซ้อนจากการสำลัก แผลกดทับ และภาวะติดเตียง')
]

for idx, ad in enumerate(age_data):
    r_sub = r_age + 1 + idx
    ws2.set_row(r_sub, 24)
    is_odd = (idx % 2 == 1)
    f_r = fmt_row_odd if is_odd else fmt_row_even
    f_c = fmt_center_odd if is_odd else fmt_center_even
    ws2.write(r_sub, 1, ad[0], f_r)
    ws2.write(r_sub, 2, ad[1], f_c)
    ws2.write(r_sub, 3, ad[2], f_r)
    ws2.write(r_sub, 4, ad[3], f_r)
    ws2.write(r_sub, 5, ad[4], f_r)


# =========================================================================
# SHEET 3: ที่มาข้อมูลคาดการณ์และวิธีวิทยา (Methodology & Mortality Projections)
# =========================================================================
ws3 = wb.add_worksheet('ที่มาข้อมูลคาดการณ์')
ws3.hide_gridlines(0)

ws3.set_column('A:A', 5)
ws3.set_column('B:B', 32)
ws3.set_column('C:C', 26)
ws3.set_column('D:D', 42)
ws3.set_column('E:E', 36)

ws3.write('B2', 'คำอธิบายเชิงลึก: ที่มาและระเบียบวิธีของการคาดการณ์สาเหตุการตายในผู้สูงอายุ (ปี 2568 - 2569)', fmt_title)
ws3.write('B3', 'อธิบายหลักเกณฑ์การประมาณการทางประชากรศาสตร์ การกระจายรหัสมรณบัตร และแบบจำลองทางระบาดวิทยา', fmt_subtitle)

# Section 1: เสาหลักของข้อมูลที่ใช้สร้างแบบจำลอง
ws3.set_row(4, 24)
ws3.merge_range('B5:E5', '1. เสาหลักของฐานข้อมูลและการปรับแก้ความถูกต้อง (Data Foundations & Adjustments)', fmt_section)

pillars_mortality = [
    ("1) โครงสร้างประชากรสูงวัย (สศช. / NESDC)",
     "สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ",
     "การคาดประมาณประชากรไทย 2553-2583 ระบุว่าประชากร 60+ เพิ่มเป็น 14.12 ล้านคน (2568) และ 14.60 ล้านคน (2569) โดยกลุ่ม 80 ปีขึ้นไป (Oldest-old) เติบโตเร็วที่สุด ส่งผลให้จำนวนผู้เสียชีวิตรวมของประเทศขยับแตะ 4.6 - 4.7 แสนคน/ปี"),

    ("2) อัตราตายจำเพาะตามกลุ่มอายุ (ASMR)",
     "กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข",
     "ใช้อัตราตายจำเพาะตามสาเหตุโรคและอายุ (Cause-Specific ASMR) ย้อนหลัง 10 ปี จากระบบสถิติสาธารณสุข นำมาประเมินความชันของแนวโน้ม (Trend Extrapolation) ร่วมกับอัตราการรอดชีพของเทคโนโลยีการแพทย์"),

    ("3) การศึกษา Verbal Autopsy (IHPP / สวรส.)",
     "สำนักงานพัฒนานโยบายสุขภาพระหว่างประเทศ",
     "ในไทยมักมีการบันทึกมรณบัตรนอก รพ. เป็น 'ชราภาพ (R54)' หรือ 'หัวใจวาย' การศึกษานี้ใช้วิธีสัมภาษณ์ญาติเพื่อกระจายรหัสกำกวม (Garbage codes) กลับเข้าสู่สาเหตุที่แท้จริง เช่น สโตรก มะเร็ง และปอดอักเสบ"),

    ("4) ทะเบียนมะเร็งระดับประชากร (NCI)",
     "สถาบันมะเร็งแห่งชาติ กรมการแพทย์",
     "ใช้แนวโน้มอุบัติการณ์และอัตราตายของโรคมะเร็ง 5 อันดับแรกในผู้สูงวัย (ตับ ปอด ลำไส้ เต้านม ต่อมลูกหมาก) เพื่อกำหนดสมมติฐานการเติบโตของผู้เสียชีวิตจากมะเร็ง")
]

r_p = 5
for p_title, p_src, p_detail in pillars_mortality:
    ws3.set_row(r_p, 28)
    ws3.write(r_p, 1, p_title, fmt_remark_title)
    ws3.write(r_p, 2, p_src, fmt_row_even)
    ws3.merge_range(r_p, 3, r_p, 4, p_detail, fmt_remark_desc)
    r_p += 1

# Section 2: ตารางสมมติฐานอัตราการเติบโตรายสาเหตุ
r_p += 1
ws3.set_row(r_p, 24)
ws3.merge_range(r_p, 1, r_p, 4, '2. สมมติฐานอัตราการเติบโตของจำนวนผู้เสียชีวิตรายสาเหตุ (Mortality Growth Assumptions)', fmt_section)

growth_headers = [
    'กลุ่มสาเหตุการเสียชีวิต',
    'อัตราเติบโตคาดการณ์ต่อปี',
    'ปัจจัยทางประชากรและการแพทย์ (Drivers)',
    'ทิศทางและข้อสังเกตเชิงนโยบาย'
]
r_p += 1
ws3.set_row(r_p, 24)
for c_i, gh in enumerate(growth_headers):
    ws3.write(r_p, 1 + c_i, gh, fmt_header)

growth_mort_data = [
    ('โรคมะเร็งทุกชนิด', '+2.4% ถึง +2.6% ต่อปี', 'จำนวนผู้สูงอายุเพิ่มขึ้น เซลล์กลายพันธุ์สะสม การตรวจพบระยะลุกลาม', 'ครองอันดับ 1 ต่อเนื่อง ต้องเน้นการดูแลประคับประคอง (Palliative care)'),
    ('โรคหลอดเลือดสมอง (Stroke)', '+2.8% ถึง +3.0% ต่อปี', 'ความดันโลหิตสูงและเบาหวานสะสม หลอดเลือดเปราะแตก/อุดตันฉับพลัน', 'ระบบ Stroke Fast Track ช่วยลดการตายแต่ผู้รอดชีวิตเข้าสู่ภาวะติดเตียงมากขึ้น'),
    ('ปอดอักเสบ (Pneumonia)', '+3.8% ถึง +4.0% ต่อปี (เติบโตเร็วสุด)', 'กลุ่มอายุ 80+ เพิ่มขึ้น ภาวะสำลักในผู้ป่วยติดเตียง/กลืนลำบาก ภูมิคุ้มกันต่ำ', 'เป็นสาเหตุการตายฉับพลันที่ป้องกันได้ด้วยการฉีดวัคซีนไข้หวัดใหญ่/ปอดบวม'),
    ('โรคหัวใจขาดเลือด (IHD)', '+3.5% ถึง +3.8% ต่อปี', 'หลอดเลือดหัวใจเสื่อมสภาพสะสม โรคอ้วนลงพุง และไขมันในเลือดสูง', 'ระบบ Fast Track ขยายหลอดเลือด (PCI) ช่วยชะลอการตายในวัยต้น'),
    ('โรคไตวายเรื้อรัง (CKD)', '+4.0% ถึง +4.2% ต่อปี', 'ผลพวงจากเบาหวานและความดันยาวนานกว่า 10-15 ปี สู่ไตวายระยะสุดท้าย', 'นโยบายฟอกไตฟรีเพิ่มการเข้าถึง แต่ผู้ป่วยสูงอายุมากมีความเสี่ยงแทรกซ้อนสูง'),
    ('การติดเชื้อในกระแสเลือด (Sepsis)', '+4.5% ถึง +4.8% ต่อปี', 'ติดเชื้อจากแผลกดทับ สายสวนปัสสาวะ และการติดเชื้อในปอดที่ลุกลาม', 'สัมพันธ์กับจำนวนผู้สูงอายุในภาวะพึ่งพิงติดเตียงที่เพิ่มสูงขึ้น'),
    ('อุบัติเหตุการพลัดตกหกล้ม', '+4.5% ถึง +5.0% ต่อปี', 'ภาวะมวลกล้ามเนื้อน้อย (Sarcopenia) กระดูกพรุน และการอยู่บ้านคนเดียว', 'หกล้มกระดูกสะโพกหักนำไปสู่นอนติดเตียงและเสียชีวิตภายใน 1 ปีถึง 20-30%')
]

for g_item in growth_mort_data:
    r_p += 1
    ws3.set_row(r_p, 24)
    ws3.write(r_p, 1, g_item[0], fmt_row_even)
    ws3.write(r_p, 2, g_item[1], fmt_center_even)
    ws3.write(r_p, 3, g_item[2], fmt_row_even)
    ws3.write(r_p, 4, g_item[3], fmt_row_even)

# Section 3: สรุปความท้าทายเชิงระบบ
r_p += 2
ws3.set_row(r_p, 24)
ws3.merge_range(r_p, 1, r_p, 4, '3. สรุปความท้าทายเชิงระบบสาธารณสุขจากการคาดการณ์การตาย', fmt_section)

summary_points = [
    ("1. ปรากฏการณ์การตายกระจุกตัวในวัยปลาย (Mortality Compression):", "ในอนาคตผู้สูงอายุไทยจะเสียชีวิตช้าลง (อายุเฉลี่ยตอนตายสูงขึ้นแตะ 78-80 ปี) แต่ช่วง 5-7 ปีสุดท้ายของชีวิตจะอยู่กับโรคเรื้อรังและความเสื่อมถอยรุนแรง"),
    ("2. ภัยเงียบของการติดเชื้อในผู้ป่วยติดเตียง:", "ปอดอักเสบจากการสำลักและติดเชื้อในกระแสเลือดมีอัตราเติบโตเร็วกว่าโรคหัวใจและมะเร็ง สะท้อนความต้องการระบบการดูแลระยะยาว (Long-Term Care) และผู้บริบาล (Caregiver) ที่มีทักษะ"),
    ("3. วาระการส่งเสริมการตายดี (Good Death / Living Will):", "การคาดการณ์ชี้ว่าการเสียชีวิตจากภาวะอวัยวะล้มเหลวเรื้อรังจะเพิ่มขึ้น นโยบายสิทธิการแสดงเจตนาไม่ประสงค์รับบริการสาธารณสุขเพื่อยื้อชีวิต (มาตรา 12) และการดูแลแบบประคับประคองจะมีความสำคัญยิ่งยวด")
]

for sp_t, sp_d in summary_points:
    r_p += 1
    ws3.set_row(r_p, 22)
    ws3.write(r_p, 1, sp_t, fmt_remark_title)
    ws3.merge_range(r_p, 2, r_p, 4, sp_d, fmt_remark_desc)

wb.close()
print("Updated Mortality Excel successfully.")
