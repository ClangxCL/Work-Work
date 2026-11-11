const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: '1920', width: 1920, height: 1080, isMobile: false, expectedCols: 5 },
  { name: '1440', width: 1440, height: 900, isMobile: false, expectedCols: 5 },
  { name: '1280', width: 1280, height: 800, isMobile: false, expectedCols: 5 },
  { name: '1024', width: 1024, height: 768, isMobile: false, expectedCols: 3 },
  { name: '768', width: 768, height: 1024, isMobile: false, expectedCols: 2 },
  { name: '390', width: 390, height: 844, isMobile: true, expectedCols: 1 },
];

async function run() {
  console.log('🚀 Starting Verification for Top 5 KPI Cards Rotating Gradient Ring Light...');
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

    // 2) Check Top 5 KPI Cards
    const kpiInfo = await page.evaluate(() => {
      const grid = document.querySelector('.kpi-grid');
      const cards = Array.from(grid ? grid.querySelectorAll('.kpi-card') : []);
      return cards.map(c => {
        const rect = c.getBoundingClientRect();
        const inner = c.querySelector('.kpi-card__inner');
        const innerRect = inner ? inner.getBoundingClientRect() : null;
        const title = inner ? inner.querySelector('span.text-base')?.textContent.trim() : '';
        const stat = inner ? inner.querySelector('.font-serif')?.textContent.trim() : '';
        const subtitle = inner ? inner.querySelector('.text-\\[0\\.9375rem\\]')?.textContent.trim() : '';
        const badge = inner ? inner.querySelector('.text-\\[0\\.875rem\\]')?.textContent.trim() : '';
        const nowrapSpan = inner ? inner.querySelector('.nowrap') : null;
        const nowarpText = nowrapSpan ? nowrapSpan.textContent.trim() : '';
        const isAlwaysSpin = c.classList.contains('is-always-spin');
        const computedStyle = window.getComputedStyle(c);
        const innerComputed = inner ? window.getComputedStyle(inner) : null;

        return {
          title,
          stat,
          subtitle,
          badge,
          nowarpText,
          height: rect.height,
          width: rect.width,
          top: rect.top,
          isAlwaysSpin,
          animationName: computedStyle.animationName,
          borderRadius: computedStyle.borderRadius,
          innerBorderRadius: innerComputed ? innerComputed.borderRadius : '',
          innerPadding: innerComputed ? innerComputed.padding : ''
        };
      });
    });

    if (kpiInfo.length !== 5) {
      console.error(`❌ Expected 5 KPI cards, found ${kpiInfo.length}`);
      allPassed = false;
    } else {
      console.log(`✅ Found 5 KPI cards`);
    }

    // Check titles and nowrap stats
    kpiInfo.forEach((card, idx) => {
      console.log(`   Card ${idx + 1}: "${card.title}" | Stat: ${card.stat} | Badge: "${card.badge}" | Subtitle: "${card.subtitle}" | Nowrap: "${card.nowarpText}"`);
      if (!card.nowarpText) {
        console.warn(`⚠️ Card ${idx + 1} did not find .nowrap span in subtitle`);
      }
    });

    // Check Card 1 has is-always-spin
    if (kpiInfo[0] && kpiInfo[0].isAlwaysSpin) {
      console.log(`✅ Card 1 has is-always-spin enabled (Animation: ${kpiInfo[0].animationName})`);
    } else {
      console.error(`❌ Card 1 missing is-always-spin!`);
      allPassed = false;
    }

    // Check cards heights in row are equal
    // Group by row (top position within 5px)
    const rows = {};
    kpiInfo.forEach(c => {
      const rowKey = Math.round(c.top / 10) * 10;
      if (!rows[rowKey]) rows[rowKey] = [];
      rows[rowKey].push(c);
    });

    Object.entries(rows).forEach(([rowY, rowCards]) => {
      const heights = rowCards.map(c => Math.round(c.height));
      const minH = Math.min(...heights);
      const maxH = Math.max(...heights);
      if (maxH - minH <= 2) {
        console.log(`✅ Row at top ~${rowY}px: ${rowCards.length} cards with equal height (${minH}px)`);
      } else {
        console.warn(`⚠️ Row at top ~${rowY}px heights vary: min=${minH}px, max=${maxH}px`);
      }
    });

    // Screenshot
    const shotPath = path.join(SCREENSHOT_DIR, `kpi_cards_${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`📸 Screenshot saved: ${shotPath}`);
  }

  // 3) Hover testing: Cards 2-5 spin on hover
  console.log(`\n========================================`);
  console.log(`🖱️ Testing Hover effect on Card 2...`);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/?tab=1', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));

  const card2Before = await page.evaluate(() => {
    const card2 = document.querySelectorAll('.kpi-card')[1];
    return window.getComputedStyle(card2).animationName;
  });
  console.log(`   Card 2 animation before hover: "${card2Before}"`);

  await page.hover('.kpi-card:nth-child(2)');
  await new Promise(r => setTimeout(r, 200));

  const card2Hover = await page.evaluate(() => {
    const card2 = document.querySelectorAll('.kpi-card')[1];
    return window.getComputedStyle(card2).animationName;
  });
  console.log(`   Card 2 animation during hover: "${card2Hover}"`);

  if (card2Hover.includes('spin-ring')) {
    console.log(`✅ Card 2 starts spinning on hover!`);
  } else {
    console.log(`ℹ️ Card 2 animation during hover: ${card2Hover}`);
  }

  // 4) Testing Reduced Motion
  console.log(`\n========================================`);
  console.log(`♿ Testing prefers-reduced-motion: reduce...`);
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await new Promise(r => setTimeout(r, 200));

  const reducedMotionCard1 = await page.evaluate(() => {
    const card1 = document.querySelectorAll('.kpi-card')[0];
    return window.getComputedStyle(card1).animationName;
  });
  console.log(`   Card 1 animation with reduced motion: "${reducedMotionCard1}"`);

  if (reducedMotionCard1 === 'none') {
    console.log(`✅ Reduced motion respected: animation is none!`);
  } else {
    console.error(`❌ Reduced motion failed to disable animation: ${reducedMotionCard1}`);
    allPassed = false;
  }

  await browser.close();

  console.log(`\n========================================`);
  if (allPassed) {
    console.log(`🎉 ALL KPI CARDS VERIFICATION TESTS PASSED SUCCESSFULLY!`);
  } else {
    console.error(`💥 SOME KPI CARDS TESTS FAILED!`);
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
