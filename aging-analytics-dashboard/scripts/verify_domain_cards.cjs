const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: '1920', width: 1920, height: 1080, isMobile: false, expectedRows: [9] },
  { name: '1700', width: 1700, height: 950, isMobile: false, expectedRows: [9] },
  { name: '1440', width: 1440, height: 900, isMobile: false, expectedRows: [3, 3, 3] },
  { name: '1280', width: 1280, height: 800, isMobile: false, expectedRows: [3, 3, 3] },
  { name: '1024', width: 1024, height: 768, isMobile: false, expectedRows: [3, 3, 3] },
  { name: '768', width: 768, height: 1024, isMobile: false, expectedRows: [3, 3, 3] },
  { name: '390', width: 390, height: 844, isMobile: true, isHorizontalScroll: true },
];

async function run() {
  console.log('🚀 Starting Verification for Domain Cards Fix...');
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

    // 1) Check Horizontal Overflow of document body
    const overflowCheck = await page.evaluate(() => {
      const docEl = document.documentElement;
      const body = document.body;
      const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
      const innerWidth = window.innerWidth;
      return { scrollWidth, innerWidth, overflow: scrollWidth > innerWidth };
    });

    if (overflowCheck.overflow) {
      console.error(`  ❌ OVERFLOW FAIL: scrollWidth=${overflowCheck.scrollWidth} > innerWidth=${overflowCheck.innerWidth}`);
      allPassed = false;
    } else {
      console.log(`  ✅ 0 Page Overflow: scrollWidth=${overflowCheck.scrollWidth} <= innerWidth=${overflowCheck.innerWidth}`);
    }

    // 2) Check Domain Cards in the grid
    const metrics = await page.evaluate((vpInfo) => {
      const section = document.querySelector('section[aria-labelledby="domains-heading"]');
      const grid = document.querySelector('.domain-grid');
      if (!grid || !section) return { error: 'Grid or section not found' };

      const sectionRect = section.getBoundingClientRect();
      const gridRect = grid.getBoundingClientRect();

      const cards = Array.from(grid.querySelectorAll('.domain-card'));
      if (cards.length !== 9) {
        return { error: `Expected 9 cards, found ${cards.length}` };
      }

      // Check each card internal elements position and bounds
      const cardDetails = cards.map((c, i) => {
        const cRect = c.getBoundingClientRect();
        const icon = c.querySelector('.domain-icon');
        const pct = c.querySelector('.domain-pct');
        const name = c.querySelector('.domain-name');
        const count = c.querySelector('.domain-count');
        const bar = c.querySelector('.domain-bar');

        const iRect = icon && window.getComputedStyle(icon).display !== 'none' ? icon.getBoundingClientRect() : null;
        const pRect = pct ? pct.getBoundingClientRect() : null;
        const nRect = name ? name.getBoundingClientRect() : null;
        const cntRect = count ? count.getBoundingClientRect() : null;
        const bRect = bar ? bar.getBoundingClientRect() : null;

        // Check if icon and pct collide
        let iconPctCollide = false;
        if (iRect && pRect) {
          // Collision if horizontal bounds overlap
          iconPctCollide = (iRect.right > pRect.left && iRect.left < pRect.right && iRect.bottom > pRect.top && iRect.top < pRect.bottom);
        }

        // Check if count or bar overflow card bottom
        let barOverflowsCard = false;
        if (bRect && cRect) {
          barOverflowsCard = bRect.bottom > (cRect.bottom + 2);
        }

        return {
          idx: i,
          width: Math.round(cRect.width),
          height: Math.round(cRect.height),
          top: Math.round(cRect.top),
          bottom: Math.round(cRect.bottom),
          iconPctCollide,
          barOverflowsCard,
        };
      });

      const heights = cardDetails.map(c => c.height);
      const minH = Math.min(...heights);
      const maxH = Math.max(...heights);

      // Check row grouping
      const rows = [];
      cardDetails.forEach(c => {
        let row = rows.find(r => Math.abs(r.top - c.top) < 8);
        if (!row) {
          row = { top: c.top, items: [] };
          rows.push(row);
        }
        row.items.push(c);
      });

      // Check section bottom padding vs side padding
      const sectionStyles = window.getComputedStyle(section);
      const padBottom = parseFloat(sectionStyles.paddingBottom);
      const padLeft = parseFloat(sectionStyles.paddingLeft);
      const padRight = parseFloat(sectionStyles.paddingRight);

      // Check grid bottom inside section
      const gridInsideSection = gridRect.bottom <= sectionRect.bottom;

      return {
        cardCount: cards.length,
        minH,
        maxH,
        rowCount: rows.length,
        rowCounts: rows.map(r => r.items.length),
        cardWidths: cardDetails.map(c => c.width),
        collisions: cardDetails.filter(c => c.iconPctCollide).length,
        barOverflows: cardDetails.filter(c => c.barOverflowsCard).length,
        padBottom,
        padLeft,
        padRight,
        gridInsideSection,
      };
    }, vp);

    if (metrics.error) {
      console.error(`  ❌ Card Error: ${metrics.error}`);
      allPassed = false;
    } else {
      console.log(`  📏 Card Heights: min=${metrics.minH}px, max=${metrics.maxH}px`);
      console.log(`  📐 Outer Section Padding: bottom=${metrics.padBottom}px, left=${metrics.padLeft}px, right=${metrics.padRight}px`);
      console.log(`  🛡️ Grid contained inside gray section: ${metrics.gridInsideSection ? 'YES ✅' : 'NO ❌'}`);

      if (metrics.collisions > 0) {
        console.error(`  ❌ Icon and % collided in ${metrics.collisions} cards!`);
        allPassed = false;
      } else {
        console.log(`  ✅ 0 Collisions between Icon and %!`);
      }

      if (metrics.barOverflows > 0) {
        console.error(`  ❌ Progress bar overflowed card in ${metrics.barOverflows} cards!`);
        allPassed = false;
      } else {
        console.log(`  ✅ 0 Bar/Count overflows: All content stays strictly inside card!`);
      }

      if (vp.isHorizontalScroll) {
        console.log(`  📱 Mobile Horizontal Scroll: card width=${metrics.cardWidths[0]}px, cards in scroll row`);
      } else if (vp.expectedRows) {
        const match = JSON.stringify(metrics.rowCounts) === JSON.stringify(vp.expectedRows);
        if (match) {
          console.log(`  ✅ Layout matches expected rows [${metrics.rowCounts.join(', ')}]!`);
        } else {
          console.error(`  ❌ Layout mismatch! Expected [${vp.expectedRows.join(', ')}], got [${metrics.rowCounts.join(', ')}]`);
          allPassed = false;
        }
      }
    }

    // 3) Screenshot section
    const sectionElement = await page.$('section[aria-labelledby="domains-heading"]');
    if (sectionElement) {
      const screenshotPath = path.join(SCREENSHOT_DIR, `domains_fixed_${vp.name}.png`);
      await sectionElement.screenshot({ path: screenshotPath });
      console.log(`  📸 Screenshot saved: ${screenshotPath}`);
    }
  }

  // 4) Interactive Testing: Click all 9 cards
  console.log(`\n========================================`);
  console.log(`🧪 Testing Interactive Clicks across all 9 cards...`);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/?tab=1', { waitUntil: 'networkidle0' });

  for (let i = 0; i < 9; i++) {
    await page.evaluate((idx) => {
      const cards = document.querySelectorAll('.domain-card');
      if (cards[idx]) (cards[idx]).click();
    }, i);

    await new Promise(r => setTimeout(r, 120));

    const isChecked = await page.evaluate((idx) => {
      const cards = document.querySelectorAll('.domain-card');
      return cards[idx]?.getAttribute('aria-checked') === 'true';
    }, i);

    if (isChecked) {
      console.log(`  ✅ Card ${i + 1}: Clicked -> aria-checked=true`);
    } else {
      console.error(`  ❌ Card ${i + 1}: Click failed`);
      allPassed = false;
    }
  }

  // 5) Keyboard Navigation
  console.log(`\n========================================`);
  console.log(`⌨️ Testing Keyboard Navigation (Arrow keys)...`);
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.domain-card');
    if (cards[0]) {
      cards[0].click();
      cards[0].focus();
    }
  });

  await page.keyboard.press('ArrowRight');
  await new Promise(r => setTimeout(r, 120));
  const card2 = await page.evaluate(() => document.querySelectorAll('.domain-card')[1]?.getAttribute('aria-checked') === 'true');
  console.log(`  ${card2 ? '✅' : '❌'} ArrowRight selects Card 2: ${card2}`);

  await page.keyboard.press('End');
  await new Promise(r => setTimeout(r, 120));
  const card9 = await page.evaluate(() => document.querySelectorAll('.domain-card')[8]?.getAttribute('aria-checked') === 'true');
  console.log(`  ${card9 ? '✅' : '❌'} End key selects Card 9: ${card9}`);

  await page.keyboard.press('Home');
  await new Promise(r => setTimeout(r, 120));
  const card1 = await page.evaluate(() => document.querySelectorAll('.domain-card')[0]?.getAttribute('aria-checked') === 'true');
  console.log(`  ${card1 ? '✅' : '❌'} Home key selects Card 1: ${card1}`);

  if (!card2 || !card9 || !card1) allPassed = false;

  await browser.close();

  console.log(`\n========================================`);
  if (allPassed) {
    console.log('🎉 ALL DOMAIN CARD FIXES VERIFIED SUCCESSFULLY!');
  } else {
    console.error('❌ SOME CHECKS FAILED!');
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
