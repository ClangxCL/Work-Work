/**
 * thaiTypography.ts
 * Utility to segment Thai text using Intl.Segmenter('th', { granularity: 'word' })
 * and protect key compound terms from being split mid-word across line breaks.
 */

export const PROTECTED_THAI_TERMS = [
  'ข้อมูลคลินิกผู้สูงอายุ',
  'คลินิกผู้สูงอายุ',
  'ผู้สูงอายุไทย',
  'ผู้สูงอายุ',
  'สาเหตุการตาย',
  'สาเหตุการป่วย',
  'ปัญหาสุขภาพ',
  'ความเสี่ยงต่อ',
  'ความเสี่ยง',
  'พื้นที่เสี่ยงสูง',
  'พื้นที่เสี่ยง',
  'เขตสุขภาพ',
  'เป้าหมาย',
  'โรงพยาบาล',
  'โรคเรื้อรัง',
  'กระทรวงสาธารณสุข',
  'การคัดกรอง',
  'การประเมิน',
  'มาตรฐาน',
  'จำนวนเป้าหมาย',
  'การรับบริการ',
  'การเสียชีวิต',
  '937 แห่ง',
  '77 จังหวัด',
  '9 ด้าน',
  'ICD-10',
  'OPD/IPD',
] as const;

function replaceAllPolyfill(str: string, find: string, replace: string): string {
  return str.split(find).join(replace);
}

/**
 * Uses Intl.Segmenter('th', { granularity: 'word' }) to segment Thai text
 * and inserts Unicode Word Joiner (U+2060) within compound words and atomic word tokens
 * so browsers never break words in the middle (e.g. preventing "ผู้สูง|อายุ" or "สาเหตุ|การตาย").
 */
export function formatThaiText(text: string): string {
  if (!text || typeof text !== 'string') return text;

  const intlAny = Intl as any;
  // Check if Intl.Segmenter is supported
  if (!intlAny || !intlAny.Segmenter) {
    return text;
  }

  // 1. Sort protected compound terms by descending length to match longest terms first
  const sortedTerms = [...PROTECTED_THAI_TERMS].sort((a, b) => b.length - a.length);

  // 2. Temporarily replace protected compound terms with unique placeholders
  let tokenized = text;
  const tokenMap = new Map<string, string>();
  sortedTerms.forEach((term, idx) => {
    if (tokenized.indexOf(term) !== -1) {
      const placeholder = `__THAI_TOK_${idx}__`;
      tokenMap.set(placeholder, term);
      tokenized = replaceAllPolyfill(tokenized, term, placeholder);
    }
  });

  // 3. Segment with Intl.Segmenter('th', { granularity: 'word' })
  const segmenter = new intlAny.Segmenter('th', { granularity: 'word' });
  const segments: string[] = Array.from(segmenter.segment(tokenized)).map(
    (s: any) => (s && s.segment ? String(s.segment) : '')
  );

  // 4. Restore tokens and join characters within multi-character word segments with \u2060 (Word Joiner)
  const result = segments.map(seg => {
    let word = seg;
    tokenMap.forEach((term, placeholder) => {
      word = replaceAllPolyfill(word, placeholder, term);
    });

    // If it's a word segment with more than 1 character and not whitespace/punctuation
    if (word.trim().length > 1) {
      return word.split('').join('\u2060');
    }
    return word;
  }).join('');

  return result;
}
