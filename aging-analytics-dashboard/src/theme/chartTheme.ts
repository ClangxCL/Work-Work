// Central Chart Theme for Aging Analytics Dashboard based on Steep Design
// Monochromatic with warm peach and sienna brown accents

export const CHART_PALETTE = [
  '#5d2a1a', // Sienna Brown (Primary chart stroke/bar)
  '#17191c', // Ink Black
  '#b9826a', // Medium Sienna
  '#5f6370', // Slate Gray (High contrast)
  '#e8b9a0', // Soft Peach/Sienna
  '#6b6f7a', // Ash Gray
  '#8a5a45', // Deep Sienna
  '#d9d9dc', // Mist Accent
  '#c9a18d', // Warm Muted Sienna
];

export const CHART_COLORS = {
  single: '#5d2a1a',       // กราฟเส้น/แท่งสีเดียว: #5d2a1a
  primary: '#17191c',      // Ink Black
  secondary: '#5f6370',    // Slate Gray (High contrast)
  accent: '#b9826a',       // Sienna tint
  peach: '#fbe1d1',        // Blush Peach
  sienna: '#5d2a1a',       // Sienna Brown
  grid: '#ececec',         // เส้นกริด #ececec บางๆ
  axisText: '#5f6370',     // ตัวหนังสือแกน #5f6370 (ชัดเจน ไม่จาง)
  tooltipBg: '#ffffff',    // tooltip พื้นขาว
  tooltipBorder: '#ececec',// ขอบ #ececec
  tooltipText: '#17191c',  // ข้อความใน tooltip
};

// Recharts & SVG Axis Tick Style (14px, readable)
export const chartAxisTickStyle = {
  fontSize: 14,
  fill: '#5f6370',
  fontFamily: "'Inter', 'Noto Sans Thai', system-ui, sans-serif"
};

// Recharts Legend Style (14px)
export const chartLegendStyle = {
  fontSize: '14px',
  fontFamily: "'Inter', 'Noto Sans Thai', system-ui, sans-serif",
  color: '#5f6370',
  paddingTop: '12px'
};

// Tooltip style props for Recharts & ECharts (15px)
export const rechartsTooltipStyle = {
  backgroundColor: '#ffffff',
  borderColor: '#ececec',
  borderRadius: '12px',
  color: '#17191c',
  boxShadow: '0 0 0 1px rgba(4, 23, 43, 0.05), 0 8px 16px rgba(0, 0, 0, 0.08)',
  padding: '12px 16px',
  fontSize: '15px',
  fontFamily: "'Inter', 'Noto Sans Thai', system-ui, sans-serif",
  lineHeight: 1.6,
  fontVariantNumeric: 'tabular-nums',
};

// Common ECharts textStyle configuration
export const echartsTextStyle = {
  fontFamily: "'Inter', 'Noto Sans Thai', system-ui, sans-serif",
  fontSize: 14,
  color: '#5f6370',
};

export const echartsTitleStyle = {
  fontFamily: "'Source Serif 4', 'Noto Serif Thai', Georgia, serif",
  fontSize: 18,
  fontWeight: 400,
  color: '#17191c',
};

// Continuous choropleth interpolation from Blush Peach (#fbe1d1) to Sienna Brown (#5d2a1a)
// ค่าน้อย -> มาก
export function getChoroplethColor(value: number, minVal: number, maxVal: number): string {
  const norm = Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal || 1)));
  // Peach: rgb(251, 225, 209)
  // Sienna: rgb(93, 42, 26)
  const r = Math.round(251 + (93 - 251) * norm);
  const g = Math.round(225 + (42 - 225) * norm);
  const b = Math.round(209 + (26 - 209) * norm);
  return `rgb(${r}, ${g}, ${b})`;
}
