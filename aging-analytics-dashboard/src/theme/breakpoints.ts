/**
 * Unified Responsive Breakpoints for Thailand Elderly Health Situation Dashboard
 * Mobile-first approach:
 * - Mobile: < 640px
 * - Tablet: 640px – 1023px (sm/md)
 * - Desktop: >= 1024px (lg/xl)
 * - Large Desktop: >= 1536px (2xl)
 */

export const BREAKPOINTS = {
  mobileMax: 639,
  tabletMin: 640,
  tabletMax: 1023,
  desktopMin: 1024,
  largeDesktopMin: 1536,
} as const;

export const SCREEN_SIZES = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type BreakpointKey = keyof typeof SCREEN_SIZES;
