export interface MortalityRatioItem {
  rank: number;
  name: string;
  ratio: number;
  icd?: string;
}

export interface AllocatedIconGroup {
  rank: number;
  name: string;
  thName: string;
  ratio: number;
  count: number;
  colorVar: string;
  isOther: boolean;
  icd?: string;
}

/**
 * Largest Remainder Method (Hare-Niemeyer method)
 * Allocates exactly `targetTotal` (default 100) items based on percentages,
 * ensuring the sum of all integer allocations is exactly targetTotal.
 */
export function allocateLargestRemainder(
  items: MortalityRatioItem[],
  targetTotal = 100
): AllocatedIconGroup[] {
  if (!items || items.length === 0) return [];

  // Calculate sum of top causes
  const sumTop = items.reduce((acc, it) => acc + (Number(it.ratio) || 0), 0);
  const otherRatio = Math.max(0, +(100 - sumTop).toFixed(2));

  // Build full list with ranks 1..N and "สาเหตุอื่น ๆ"
  const groups = items.map((it) => ({
    rank: it.rank,
    name: it.name,
    thName: it.name.replace(/\s*\(.*?\)$/, '').trim(),
    ratio: Number(it.ratio) || 0,
    colorVar: `var(--rank-${it.rank})`,
    isOther: false,
    icd: it.icd,
  }));

  if (otherRatio > 0.05) {
    groups.push({
      rank: 11,
      name: 'สาเหตุอื่น ๆ (Other Causes)',
      thName: 'สาเหตุอื่น ๆ',
      ratio: otherRatio,
      colorVar: '#d1d5db',
      isOther: true,
      icd: 'Other',
    });
  }

  const totalRatio = groups.reduce((acc, g) => acc + g.ratio, 0);
  if (totalRatio <= 0) return [];

  // Exact proportion scaled to targetTotal
  const withCalculations = groups.map((g, idx) => {
    const exact = (g.ratio / totalRatio) * targetTotal;
    const floor = Math.floor(exact);
    const remainder = exact - floor;
    return {
      ...g,
      idx,
      floor,
      remainder,
      count: floor,
    };
  });

  const currentSum = withCalculations.reduce((acc, g) => acc + g.floor, 0);
  const remainderToDistribute = targetTotal - currentSum;

  // Sort by remainder descending to give +1 to highest remainder items
  const sorted = [...withCalculations].sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; i < remainderToDistribute && i < sorted.length; i++) {
    sorted[i].count += 1;
  }

  // Restore original ordering
  sorted.sort((a, b) => a.idx - b.idx);

  return sorted.map(({ idx, floor, remainder, ...rest }) => rest);
}
