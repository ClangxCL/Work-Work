'use client';
import React, { useEffect, useRef, useState } from 'react';
import './cursor-snap.css';

const TARGET = 'a[href], button:not([disabled]), [role="button"], [role="tab"], summary, label[for], .card-clickable, [data-cursor="hover"]';
const TEXT = 'input, textarea, select, [contenteditable="true"]';
const PAD = 6;
const MAX_AREA = 140000;

export default function CursorSnap() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const hlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updatePointer = () => setEnabled(media.matches);
    updatePointer();

    if (media.addEventListener) {
      media.addEventListener('change', updatePointer);
      return () => media.removeEventListener('change', updatePointer);
    } else {
      media.addListener(updatePointer);
      return () => media.removeListener(updatePointer);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const k = reduce ? 1 : 0.3;
    const root = document.documentElement;
    const dot = dotRef.current;
    const hl = hlRef.current;
    if (!dot || !hl) return;

    root.classList.add('has-snap-cursor');

    let x = -100;
    let y = -100;
    let shown = false;
    let raf = 0;
    let target: HTMLElement | null = null;
    const cur = { x: -100, y: -100, w: 28, h: 28 };

    const pick = (el: Element | null) => {
      const t = el?.closest(TARGET) as HTMLElement | null;
      if (!t || t.closest('[data-cursor="none"]') || t.getAttribute('aria-disabled') === 'true') return null;
      const r = t.getBoundingClientRect();
      return r.width * r.height > MAX_AREA ? null : t;
    };

    const update = () => {
      const el = document.elementFromPoint(x, y);
      root.classList.toggle('snap-text', !!el?.closest(TEXT));
      const t = pick(el);
      if (t !== target) {
        target = t;
        root.classList.toggle('snap-hover', !!t);
        hl.style.borderRadius = t
          ? `${(parseFloat(getComputedStyle(t).borderTopLeftRadius) || 0) + PAD}px`
          : '50%';
      }
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        cur.x = x - 14;
        cur.y = y - 14;
        root.classList.add('snap-visible');
      }
      update();
    };

    const onDown = () => root.classList.add('snap-down');
    const onUp = () => root.classList.remove('snap-down');
    const onLeave = () => {
      shown = false;
      root.classList.remove('snap-visible');
    };

    const tick = () => {
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      let gx = x - 14;
      let gy = y - 14;
      let gw = 28;
      let gh = 28;
      if (target) {
        const r = target.getBoundingClientRect();
        gx = r.left - PAD;
        gy = r.top - PAD;
        gw = r.width + PAD * 2;
        gh = r.height + PAD * 2;
      }
      cur.x += (gx - cur.x) * k;
      cur.y += (gy - cur.y) * k;
      cur.w += (gw - cur.w) * k;
      cur.h += (gh - cur.h) * k;
      hl.style.width = cur.w + 'px';
      hl.style.height = cur.h + 'px';
      hl.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', update, { passive: true, capture: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      root.classList.remove('has-snap-cursor', 'snap-visible', 'snap-hover', 'snap-text', 'snap-down');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={hlRef} className="snap-hl" aria-hidden="true" />
      <div ref={dotRef} className="snap-dot" aria-hidden="true" />
    </>
  );
}

export { CursorSnap };
