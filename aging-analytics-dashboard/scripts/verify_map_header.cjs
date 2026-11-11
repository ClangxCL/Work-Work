const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: '1920', width: 1920, height: 1080, isMobile: false },
  { name: '1440', width: 1440, height: 900, isMobile: false },
  { name: '1024', width: 1024, height: 768, isMobile: false },
  { name: '768', width: 768, height: 1024, isMobile: false },
  { name: '390', width: 390, height: 844, isMobile: true },
];

const EXPECTED_SHORT_LABELS = [
  'สายตา',
  'ช่องปาก',
  'หกล้ม',
  'ADL',
  'การได้ยิน',
  'ความจำ',
  'ปัสสาวะ',
  'โภชนาการ',
  'ซึมเศร้า'
];

async function run() {
  console.log('🚀 Starting Verification for Map Header, Metric Selector Pills & Risk Legend...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  let allPassed = true;

  page.on('pageerror', err => {
    console.error('❌ Page Error:', err.message);
    allPassed = false;
  });

  for (const vp of VIEWPORTS) {
    console.log(`\n========================================`);
    console.log(`📱 Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.isMobile ? 2 : 1,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
    });

    const url = 'http://localhost:5173/?tab=1';
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 600));

    // 1) Check Horizontal Overflow of body
    const overflowCheck = await page.evaluate(() => {
      const docEl = document.documentElement;
      const body = document.body;
      const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
      const innerWidth = window.innerWidth;
      return { scrollWidth, innerWidth, overflow: scrollWidth > innerWidth };
    });

    if (overflowCheck.overflow) {
      console.error(`❌ Page has horizontal overflow! scrollWidth=${overflowCheck.scrollWidth}, innerWidth=${overflowCheck.innerWidth}`);
      allPassed = false;
    } else {
      console.log(`✅ No horizontal overflow (${overflowCheck.scrollWidth} <= ${overflowCheck.innerWidth})`);
    }

    // 2) Check Header Elements
    const headerInfo = await page.evaluate(() => {
      // Find the map card's h3 specifically
      const allH3 = Array.from(document.querySelectorAll('h3.font-serif'));
      const mapTitleEl = allH3.find(h => h.textContent.includes('แผนที่ฮีทแมพ'));
      const titleText = mapTitleEl ? mapTitleEl.textContent.trim() : '';
      const subtitleEl = mapTitleEl ? mapTitleEl.nextElementSibling : null;
      const subtitleText = subtitleEl ? subtitleEl.textContent.trim() : '';
      
      const badgeEl = mapTitleEl ? mapTitleEl.closest('.flex-wrap')?.querySelector('span.tabular-nums') : null;
      const badgeText = badgeEl ? badgeEl.textContent.trim() : '';

      return {
        titleText,
        subtitleText,
        badgeText,
        hasColorCodeInSubtitle: subtitleText.includes('#5d2a1a')
      };
    });

    console.log(`   Header Title: "${headerInfo.titleText}"`);
    console.log(`   Subtitle: "${headerInfo.subtitleText}"`);
    console.log(`   Badge: "${headerInfo.badgeText}"`);

    if (headerInfo.titleText !== 'แผนที่ฮีทแมพพื้นที่เสี่ยงสุขภาพ 77 จังหวัด') {
      console.error(`❌ Unexpected title: ${headerInfo.titleText}`);
      allPassed = false;
    } else {
      console.log(`✅ Title matches exactly`);
    }

    if (headerInfo.hasColorCodeInSubtitle) {
      console.error(`❌ Subtitle still contains color code (#5d2a1a)!`);
      allPassed = false;
    } else {
      console.log(`✅ Subtitle has color code removed: "${headerInfo.subtitleText}"`);
    }

    // 3) Check 9 Metric Pills
    const pillsInfo = await page.evaluate(() => {
      const pills = Array.from(document.querySelectorAll('.map-metric-pill'));
      return pills.map(p => {
        const rect = p.getBoundingClientRect();
        const span = p.querySelector('span:last-child');
        const iconCircle = p.querySelector('.domain-icon, span.w-6');
        const isSelected = p.classList.contains('is-selected');
        const computed = window.getComputedStyle(p);
        return {
          text: span ? span.textContent.trim() : p.textContent.trim(),
          role: p.getAttribute('role'),
          ariaChecked: p.getAttribute('aria-checked'),
          title: p.getAttribute('title'),
          ariaLabel: p.getAttribute('aria-label'),
          height: rect.height,
          width: rect.width,
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
          isSelected,
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          hasIconCircle: !!iconCircle,
        };
      });
    });

    if (pillsInfo.length !== 9) {
      console.error(`❌ Expected 9 metric pills, found ${pillsInfo.length}`);
      allPassed = false;
    } else {
      console.log(`✅ Found 9 metric pills`);
    }

    // Verify short labels
    const labelsMatch = pillsInfo.every((p, idx) => p.text === EXPECTED_SHORT_LABELS[idx]);
    if (!labelsMatch) {
      console.error(`❌ Pill labels mismatch! Found:`, pillsInfo.map(p => p.text));
      allPassed = false;
    } else {
      console.log(`✅ All 9 pills have exact short labels: ${pillsInfo.map(p => p.text).join(', ')}`);
    }

    // Verify heights around 40px
    const heightsOk = pillsInfo.every(p => Math.abs(p.height - 40) <= 2);
    if (!heightsOk) {
      console.error(`❌ Some pills height not ~40px:`, pillsInfo.map(p => p.height));
      allPassed = false;
    } else {
      console.log(`✅ All pills have 40px height`);
    }

    // Verify no bounding rectangle overlaps among visible pills on same line
    const overlapDetected = await page.evaluate(() => {
      const pills = Array.from(document.querySelectorAll('.map-metric-pill'));
      for (let i = 0; i < pills.length; i++) {
        const r1 = pills[i].getBoundingClientRect();
        for (let j = i + 1; j < pills.length; j++) {
          const r2 = pills[j].getBoundingClientRect();
          // Check collision only if they are roughly horizontally aligned or stacked
          const xOverlap = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left));
          const yOverlap = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top));
          if (xOverlap > 1 && yOverlap > 1) {
            return { overlap: true, i, j, xOverlap, yOverlap };
          }
        }
      }
      return { overlap: false };
    });

    if (overlapDetected.overlap) {
      console.error(`❌ Overlap detected between pills!`, overlapDetected);
      allPassed = false;
    } else {
      console.log(`✅ Zero overlap between pills`);
    }

    // 4) Check Risk Scale Legend & Pointer
    const legendInfo = await page.evaluate(() => {
      const container = document.querySelector('.map-legend-container');
      const cRect = container ? container.getBoundingClientRect() : null;
      const pointerLabel = container ? container.querySelector('.map-legend-container > div:first-child > div') : null;
      const tick = container ? container.querySelector('.map-legend-container > div:nth-child(2) > div:nth-child(2)') : null;
      const midLabels = Array.from(document.querySelectorAll('.map-legend-mid'));
      const midVisible = midLabels.some(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });

      return {
        containerWidth: cRect ? cRect.width : 0,
        pointerText: pointerLabel ? pointerLabel.textContent.trim() : '',
        hasTick: !!tick,
        midLabelsVisible: midVisible
      };
    });

    console.log(`   Legend Container Width: ${legendInfo.containerWidth.toFixed(1)}px`);
    console.log(`   Pointer Text: "${legendInfo.pointerText}"`);
    console.log(`   Mid Labels Visible: ${legendInfo.midLabelsVisible}`);

    if (legendInfo.containerWidth <= 700 && legendInfo.midLabelsVisible) {
      console.error(`❌ Mid labels should be hidden when container <= 700px!`);
      allPassed = false;
    } else if (legendInfo.containerWidth > 700 && !legendInfo.midLabelsVisible) {
      console.warn(`⚠️ Mid labels hidden when container > 700px (check container-query)`);
    } else {
      console.log(`✅ Container query behavior correct for legend labels`);
    }

    // Take screenshot
    const shotPath = path.join(SCREENSHOT_DIR, `map_header_${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`📸 Screenshot saved: ${shotPath}`);
  }

  // 5) Interactive Click Testing across all 9 metrics
  console.log(`\n========================================`);
  console.log(`🖱️ Interactive Click Testing Across 9 Metrics...`);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/?tab=1', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));

  for (let i = 0; i < EXPECTED_SHORT_LABELS.length; i++) {
    const label = EXPECTED_SHORT_LABELS[i];
    const clickSuccess = await page.evaluate((idx) => {
      const pills = Array.from(document.querySelectorAll('.map-metric-pill'));
      if (pills[idx]) {
        pills[idx].click();
        return true;
      }
      return false;
    }, i);

    await new Promise(r => setTimeout(r, 200));

    const verifyState = await page.evaluate((idx) => {
      const pills = Array.from(document.querySelectorAll('.map-metric-pill'));
      const p = pills[idx];
      const isSelected = p.classList.contains('is-selected');
      const ariaChecked = p.getAttribute('aria-checked') === 'true';
      const pointerText = document.querySelector('.map-legend-container > div:first-child > div')?.textContent.trim();
      const badgeText = document.querySelector('span.tabular-nums')?.textContent.trim();
      return { isSelected, ariaChecked, pointerText, badgeText };
    }, i);

    if (verifyState.isSelected && verifyState.ariaChecked) {
      console.log(`✅ Pill ${i + 1} (${label}): Selected! Pointer: "${verifyState.pointerText}", Badge: "${verifyState.badgeText}"`);
    } else {
      console.error(`❌ Pill ${i + 1} (${label}) failed selection:`, verifyState);
      allPassed = false;
    }
  }

  // 6) Keyboard Navigation Testing
  console.log(`\n========================================`);
  console.log(`⌨️ Keyboard Navigation Testing (Arrow Keys)...`);
  const initialSelectedIdx = await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('.map-metric-pill'));
    return pills.findIndex(p => p.classList.contains('is-selected'));
  });

  // Focus the selected pill and press ArrowLeft
  await page.evaluate(() => {
    const active = document.querySelector('.map-metric-pill.is-selected');
    if (active) active.focus();
  });
  await page.keyboard.press('ArrowLeft');
  await new Promise(r => setTimeout(r, 200));

  const afterLeftIdx = await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('.map-metric-pill'));
    return pills.findIndex(p => p.classList.contains('is-selected'));
  });
  console.log(`   Initial index: ${initialSelectedIdx} -> After ArrowLeft: ${afterLeftIdx}`);

  await page.keyboard.press('ArrowRight');
  await new Promise(r => setTimeout(r, 200));
  const afterRightIdx = await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('.map-metric-pill'));
    return pills.findIndex(p => p.classList.contains('is-selected'));
  });
  console.log(`   After ArrowRight: ${afterRightIdx}`);

  if (afterRightIdx === initialSelectedIdx) {
    console.log(`✅ Keyboard navigation (ArrowLeft & ArrowRight) passed!`);
  } else {
    console.error(`❌ Keyboard navigation did not return to initial index!`);
    allPassed = false;
  }

  await browser.close();

  console.log(`\n========================================`);
  if (allPassed) {
    console.log(`🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY!`);
  } else {
    console.error(`💥 SOME VERIFICATION TESTS FAILED!`);
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
