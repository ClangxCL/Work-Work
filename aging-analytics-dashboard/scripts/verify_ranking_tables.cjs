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
  { name: '1280', width: 1280, height: 900, isMobile: false },
  { name: '1024', width: 1024, height: 768, isMobile: false },
  { name: '768', width: 768, height: 1024, isMobile: false },
  { name: '390', width: 390, height: 844, isMobile: true },
];

async function run() {
  console.log('🚀 Starting Verification for OPD & IPD Top 10 Ranking Tables...');
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

    // 1) Check Page Horizontal Overflow
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

    // 2) Check Ranking Table Cards
    const tablesCheck = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.ranking-table-card'));
      if (cards.length !== 2) {
        return { error: `Expected 2 ranking-table-card, found ${cards.length}` };
      }

      const results = [];
      cards.forEach((card, idx) => {
        const title = card.querySelector('h4')?.textContent.trim() || '';
        const subtitle = card.querySelector('p')?.textContent.trim() || '';
        const badge = card.querySelector('span.rounded-full')?.textContent.trim() || '';
        const headerEl = card.querySelector('.ranking-table-header');
        const headerVisible = headerEl && window.getComputedStyle(headerEl).display !== 'none';
        
        // Check rows
        const rows = Array.from(card.querySelectorAll('.ranking-table-row'));
        
        // Check scrollbars inside card
        const cardStyle = window.getComputedStyle(card);
        const hasNestedScrollbar = card.scrollHeight > card.clientHeight + 2 && (cardStyle.overflowY === 'auto' || cardStyle.overflowY === 'scroll');

        const rowDetails = rows.map((r, rIdx) => {
          const desktopCols = r.querySelector('.ranking-desktop-cols');
          const mobileCols = r.querySelector('.ranking-mobile-row');
          const desktopVisible = desktopCols && window.getComputedStyle(desktopCols).display !== 'none';
          const mobileVisible = mobileCols && window.getComputedStyle(mobileCols).display !== 'none';

          // Rank badge
          const rankBadge = r.querySelector('span[style*="var(--rank-"]');
          const rankNum = rankBadge?.textContent.trim() || '';
          const rankBg = rankBadge ? window.getComputedStyle(rankBadge).backgroundColor : '';
          const rankColor = rankBadge ? window.getComputedStyle(rankBadge).color : '';

          // Disease name & ICD pill
          const diseaseTh = r.querySelector('.leading-snug')?.textContent.trim() || '';
          const icdPill = r.querySelector('span.font-mono')?.textContent.trim() || '';

          // Check if number or percent wrap mid-text
          let numText = '';
          let pctText = '';
          if (desktopVisible) {
            const countDiv = r.children[0]?.children?.[2]; // col 3
            numText = countDiv ? countDiv.textContent.trim().replace(/\s+/g, ' ') : '';
            const pctDiv = r.children[0]?.children?.[3]; // col 4
            pctText = pctDiv ? pctDiv.querySelector('.font-serif')?.textContent.trim() : '';
          } else {
            const stats = r.querySelector('.ranking-mobile-row .bg-\\[\\#fafafb\\]');
            numText = stats ? stats.children[0]?.textContent.trim().replace(/\s+/g, ' ') : '';
            pctText = stats ? stats.children[1]?.textContent.trim().replace(/\s+/g, ' ') : '';
          }

          // Mini bar
          const miniBar = r.querySelector('.h-1\\.5 .rounded-full');
          const miniBarWidth = miniBar ? miniBar.style.width : '';

          return {
            rankNum,
            rankBg,
            rankColor,
            diseaseTh,
            icdPill,
            numText,
            pctText,
            miniBarWidth,
            desktopVisible,
            mobileVisible
          };
        });

        results.push({
          title,
          subtitle,
          badge,
          headerVisible,
          rowsCount: rows.length,
          hasNestedScrollbar,
          cardRect: card.getBoundingClientRect(),
          firstRow: rowDetails[0],
          tenthRow: rowDetails[9]
        });
      });

      return { success: true, results };
    });

    if (tablesCheck.error) {
      console.error(`❌ ${tablesCheck.error}`);
      allPassed = false;
      continue;
    }

    const [opd, ipd] = tablesCheck.results;
    console.log(`   Table 1 (OPD): "${opd.title}" - Rows: ${opd.rowsCount}, HeaderVisible: ${opd.headerVisible}, NestedScrollbar: ${opd.hasNestedScrollbar}`);
    console.log(`     Row 1: Rank ${opd.firstRow.rankNum} "${opd.firstRow.diseaseTh}" [${opd.firstRow.icdPill}] - ${opd.firstRow.numText} | ${opd.firstRow.pctText} (Bar: ${opd.firstRow.miniBarWidth})`);
    console.log(`     Row 10: Rank ${opd.tenthRow.rankNum} "${opd.tenthRow.diseaseTh}" [${opd.tenthRow.icdPill}] - ${opd.tenthRow.numText} | ${opd.tenthRow.pctText} (Bar: ${opd.tenthRow.miniBarWidth})`);

    console.log(`   Table 2 (IPD): "${ipd.title}" - Rows: ${ipd.rowsCount}, HeaderVisible: ${ipd.headerVisible}, NestedScrollbar: ${ipd.hasNestedScrollbar}`);
    console.log(`     Row 1: Rank ${ipd.firstRow.rankNum} "${ipd.firstRow.diseaseTh}" [${ipd.firstRow.icdPill}] - ${ipd.firstRow.numText} | ${ipd.firstRow.pctText} (Bar: ${ipd.firstRow.miniBarWidth})`);
    console.log(`     Row 10: Rank ${ipd.tenthRow.rankNum} "${ipd.tenthRow.diseaseTh}" [${ipd.tenthRow.icdPill}] - ${ipd.tenthRow.numText} | ${ipd.tenthRow.pctText} (Bar: ${ipd.tenthRow.miniBarWidth})`);

    if (opd.rowsCount !== 10 || ipd.rowsCount !== 10) {
      console.error(`❌ Expected 10 rows per table, got OPD=${opd.rowsCount}, IPD=${ipd.rowsCount}`);
      allPassed = false;
    } else {
      console.log(`✅ Both OPD and IPD have exactly 10 rows`);
    }

    if (opd.hasNestedScrollbar || ipd.hasNestedScrollbar) {
      console.error(`❌ Found nested scrollbar inside table card!`);
      allPassed = false;
    } else {
      console.log(`✅ No nested scrollbars in ranking cards`);
    }

    // Scroll to ranking tables and take screenshot
    await page.evaluate(() => {
      const el = document.querySelector('.ranking-table-card');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 400));

    const screenshotPath = path.join(SCREENSHOT_DIR, `ranking_tables_${vp.name}.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Screenshot saved: ${screenshotPath}`);
  }

  await browser.close();

  console.log(`\n========================================`);
  if (allPassed) {
    console.log('🎉 ALL RANKING TABLE VERIFICATION TESTS PASSED SUCCESSFULLY! 100%');
  } else {
    console.error('❌ SOME CHECKS FAILED. See details above.');
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
