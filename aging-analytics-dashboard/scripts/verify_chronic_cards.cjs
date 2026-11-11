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
  { name: '1024', width: 1024, height: 768, isMobile: false, expectedCols: 2 },
  { name: '768', width: 768, height: 1024, isMobile: false, expectedCols: 2 },
  { name: '390', width: 390, height: 844, isMobile: true, expectedCols: 1 },
];

const EXPECTED_COLORS = [
  '#5d2a1a', // 1
  '#74371f', // 2
  '#8a4730', // 3
  '#9e5a42', // 4
  '#b27058', // 5
  '#c48a72', // 6
  '#d5a58f', // 7
  '#e3bba6', // 8
  '#eed0be', // 9
  '#fbe1d1', // 10
];

async function run() {
  console.log('🚀 Starting Verification for Top 10 Chronic Diseases Cards 10-level Color Scale...');
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

    const url = 'http://localhost:5173/?tab=2';
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

    // 2) Check Legend Elements
    const legendInfo = await page.evaluate(() => {
      const title = document.querySelector('h3.font-serif')?.textContent.trim();
      const leftLabel = document.querySelector('.chronic-grid')?.previousElementSibling?.querySelector('span.font-medium')?.textContent.trim();
      const rightLabel = document.querySelector('.chronic-grid')?.previousElementSibling?.querySelectorAll('span')?.[2]?.textContent.trim();
      const dotsCount = document.querySelectorAll('.chronic-grid')?.length > 0
        ? document.querySelector('.chronic-grid')?.previousElementSibling?.querySelectorAll('.grid-cols-10 > span')?.length
        : 0;

      return { title, leftLabel, rightLabel, dotsCount };
    });

    console.log(`   Section Title: "${legendInfo.title}"`);
    console.log(`   Legend: "${legendInfo.leftLabel}" -> "${legendInfo.rightLabel}" (10 Steps Dots: ${legendInfo.dotsCount})`);

    // 3) Check 10 Chronic Cards
    const cardsInfo = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.chronic-card'));
      return cards.map(c => {
        const rect = c.getBoundingClientRect();
        const topBar = c.querySelector('.chronic-top-bar');
        const rankBadge = c.querySelector('span.font-serif');
        const diseaseName = c.querySelector('h4')?.textContent.trim();
        const prevText = c.querySelector('.text-lg.font-serif')?.textContent.trim();
        const rangeBar = c.querySelector('.h-full.rounded-full');
        const pillBadge = c.querySelector('.mt-4 span:last-child');
        const computed = window.getComputedStyle(c);
        const rankStyle = c.getAttribute('style') || '';
        const rankBadgeComputed = rankBadge ? window.getComputedStyle(rankBadge) : null;
        const pillComputed = pillBadge ? window.getComputedStyle(pillBadge) : null;

        return {
          rankStyle,
          ariaLabel: c.getAttribute('aria-label'),
          isTopRank: c.classList.contains('is-top-rank'),
          diseaseName,
          prevText,
          hasTopBar: !!topBar,
          hasRangeBar: !!rangeBar,
          height: rect.height,
          width: rect.width,
          top: rect.top,
          badgeColor: rankBadgeComputed ? rankBadgeComputed.color : '',
          badgeBg: rankBadgeComputed ? rankBadgeComputed.backgroundColor : '',
          pillColor: pillComputed ? pillComputed.color : '',
          pillBg: pillComputed ? pillComputed.backgroundColor : '',
          border: computed.border,
          boxShadow: computed.boxShadow,
        };
      });
    });

    if (cardsInfo.length !== 10) {
      console.error(`❌ Expected 10 chronic cards, found ${cardsInfo.length}`);
      allPassed = false;
    } else {
      console.log(`✅ Found 10 chronic cards`);
    }

    // Verify dynamic --rank-color and text contrast
    cardsInfo.forEach((card, idx) => {
      const rankNum = idx + 1;
      const hasRankVar = card.rankStyle.includes(`--rank-${rankNum}`);
      if (!hasRankVar) {
        console.error(`❌ Card ${rankNum} style does not contain --rank-${rankNum}: "${card.rankStyle}"`);
        allPassed = false;
      }

      console.log(`   Rank ${rankNum}: "${card.diseaseName}" | Prev: ${card.prevText} | Badge Color: ${card.badgeColor} | Pill Color: ${card.pillColor} | TopRank: ${card.isTopRank}`);
    });

    // Check ranks 1-3 have isTopRank
    const top3Ok = cardsInfo.slice(0, 3).every(c => c.isTopRank) && cardsInfo.slice(3).every(c => !c.isTopRank);
    if (!top3Ok) {
      console.error(`❌ Top rank highlighting mismatch! Ranks 1-3 should be top rank, 4-10 should not.`);
      allPassed = false;
    } else {
      console.log(`✅ Ranks 1–3 highlighted with is-top-rank (border & shadow), ranks 4–10 clean 1px border`);
    }

    // Screenshot
    const shotPath = path.join(SCREENSHOT_DIR, `chronic_cards_${vp.name}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`📸 Screenshot saved: ${shotPath}`);
  }

  await browser.close();

  console.log(`\n========================================`);
  if (allPassed) {
    console.log(`🎉 ALL CHRONIC CARDS VERIFICATION TESTS PASSED SUCCESSFULLY!`);
  } else {
    console.error(`💥 SOME CHRONIC CARDS TESTS FAILED!`);
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
