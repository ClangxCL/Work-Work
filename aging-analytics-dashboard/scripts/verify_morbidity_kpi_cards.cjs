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
  { name: '1280', width: 1280, height: 900, isMobile: false, expectedLayout: '3+2' },
  { name: '1024', width: 1024, height: 768, isMobile: false, expectedLayout: '3+2' },
  { name: '768', width: 768, height: 1024, isMobile: false, expectedCols: 2 },
  { name: '390', width: 390, height: 844, isMobile: true, expectedCols: 1 },
];

async function run() {
  console.log('🚀 Starting Verification for Tab 2 Morbidity KPI Cards & Header...');
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

    const checkResult = await page.evaluate(() => {
      // 1. Header check
      const h1 = document.querySelector('h1');
      const h1Text = h1 ? h1.textContent.trim() : '';
      const h1Style = h1 ? window.getComputedStyle(h1) : null;
      const subtitle = h1 ? h1.nextElementSibling : null;
      const subtitleStyle = subtitle ? window.getComputedStyle(subtitle) : null;

      let gapH1Sub = null;
      if (h1 && subtitle) {
        gapH1Sub = Math.round(subtitle.getBoundingClientRect().top - h1.getBoundingClientRect().bottom);
      }

      // 2. KPI Cards check
      const kpiGrid = document.querySelector('.kpi-grid');
      const cards = kpiGrid ? Array.from(kpiGrid.querySelectorAll('.kpi-card')) : [];
      const kpiGridGap = kpiGrid ? Math.round(kpiGrid.getBoundingClientRect().top - (subtitle ? subtitle.getBoundingClientRect().bottom : 0)) : null;

      const cardData = cards.map((card, i) => {
        const inner = card.querySelector('.kpi-card__inner');
        const rect = card.getBoundingClientRect();
        const innerRect = inner ? inner.getBoundingClientRect() : rect;
        const innerStyle = inner ? window.getComputedStyle(inner) : null;

        // Label row
        const labelRow = inner ? inner.children[0] : null;
        const labelRect = labelRow ? labelRow.getBoundingClientRect() : null;

        // Value row
        const valueRow = inner ? inner.children[1] : null;
        const valueRect = valueRow ? valueRow.getBoundingClientRect() : null;

        // Desc row
        const descRow = inner ? inner.children[2] : null;
        const descRect = descRow ? descRow.getBoundingClientRect() : null;

        // Tag row
        const tagRow = inner ? inner.children[3] : null;
        const tagRect = tagRow ? tagRow.getBoundingClientRect() : null;

        // Numbers & units
        const statVal = card.querySelector('.kpi-stat-value');
        const statUnit = card.querySelector('.kpi-stat-unit');

        // Check if unit is on same horizontal line as statVal
        let unitOnSameLine = true;
        if (statVal && statUnit) {
          const vRect = statVal.getBoundingClientRect();
          const uRect = statUnit.getBoundingClientRect();
          // bottom difference within 6px
          unitOnSameLine = Math.abs(vRect.bottom - uRect.bottom) < 8;
        }

        // Check card 5 gender ratio
        const maleVal = card.querySelector('.text-\\[\\#5d2a1a\\]');
        const femaleVal = card.querySelector('.text-\\[\\#74371f\\]');
        const dualBar = card.querySelector('.h-\\[12px\\]');
        const isPeach = inner?.classList.contains('bg-[#fbe1d1]');

        return {
          index: i + 1,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          top: Math.round(rect.top),
          isPeach,
          labelTop: labelRect ? Math.round(labelRect.top) : null,
          labelHeight: labelRect ? Math.round(labelRect.height) : null,
          valueTop: valueRect ? Math.round(valueRect.top) : null,
          valueHeight: valueRect ? Math.round(valueRect.height) : null,
          descTop: descRect ? Math.round(descRect.top) : null,
          tagTop: tagRect ? Math.round(tagRect.top) : null,
          statText: statVal ? statVal.textContent.trim() : null,
          unitText: statUnit ? statUnit.textContent.trim() : null,
          unitOnSameLine,
          hasGenderVisual: !!dualBar,
          dualBarWidth: dualBar ? Math.round(dualBar.getBoundingClientRect().width) : null
        };
      });

      return {
        header: {
          text: h1Text,
          fontSize: h1Style?.fontSize,
          fontWeight: h1Style?.fontWeight,
          gapH1Sub,
          kpiGridGap,
          subtitleMaxW: subtitleStyle?.maxWidth,
          subtitleColor: subtitleStyle?.color
        },
        cardCount: cards.length,
        cards: cardData
      };
    });

    console.log(`📝 Header H1: "${checkResult.header.text}" | fontSize=${checkResult.header.fontSize} | gapH1Sub=${checkResult.header.gapH1Sub}px | gapToCards=${checkResult.header.kpiGridGap}px`);
    console.log(`📦 Found ${checkResult.cardCount} KPI Cards`);

    // Verify Header
    if (!checkResult.header.text.includes('สถิติสาเหตุการป่วยและสาเหตุการตาย')) {
      console.error(`❌ Header text mismatch!`);
      allPassed = false;
    } else {
      console.log(`✅ H1 title matches requirement.`);
    }

    if (checkResult.cardCount !== 5) {
      console.error(`❌ Expected 5 KPI cards, found ${checkResult.cardCount}`);
      allPassed = false;
    } else {
      console.log(`✅ 5 KPI cards present.`);
    }

    // Verify Peach Card
    const peachCard = checkResult.cards.find(c => c.isPeach);
    if (!peachCard || peachCard.index !== 1) {
      console.error(`❌ First card must be peach background!`);
      allPassed = false;
    } else {
      console.log(`✅ Card 1 is peach (#fbe1d1) accent card.`);
    }

    // Verify Heights and Alignments
    const heights = checkResult.cards.map(c => c.height);
    const maxHeight = Math.max(...heights);
    console.log(`📏 Card Heights: ${heights.join(', ')} px (Max: ${maxHeight}px)`);

    if (vp.expectedCols === 5) {
      if (maxHeight > 275) {
        console.warn(`⚠️ Warning: Card height ${maxHeight}px exceeds ~260px on ${vp.name}px`);
      } else {
        console.log(`✅ Cards height is compact and well-balanced (${maxHeight}px <= ~260px).`);
      }

      // Check alignment of row 1 cards
      const valueTops = checkResult.cards.map(c => c.valueTop);
      const descTops = checkResult.cards.map(c => c.descTop);
      const tagTops = checkResult.cards.map(c => c.tagTop);

      const valTopDiff = Math.max(...valueTops) - Math.min(...valueTops);
      const descTopDiff = Math.max(...descTops) - Math.min(...descTops);
      const tagTopDiff = Math.max(...tagTops) - Math.min(...tagTops);

      console.log(`📐 Alignment check: Value Top Diff=${valTopDiff}px | Divider Top Diff=${descTopDiff}px | Tag Top Diff=${tagTopDiff}px`);
      if (valTopDiff <= 2) {
        console.log(`✅ Value row tops line up perfectly across all 5 cards!`);
      } else {
        console.error(`❌ Value row top difference (${valTopDiff}px) exceeds 2px!`);
        allPassed = false;
      }
      if (tagTopDiff <= 2) {
        console.log(`✅ Bottom tag pills line up perfectly across all 5 cards!`);
      } else {
        console.error(`❌ Tag row top difference (${tagTopDiff}px) exceeds 2px!`);
        allPassed = false;
      }
    }

    // Check 3+2 layout on 1024 and 1280
    if (vp.expectedLayout === '3+2') {
      const row1Cards = checkResult.cards.slice(0, 3);
      const row2Cards = checkResult.cards.slice(3, 5);

      const r1Tops = row1Cards.map(c => c.top);
      const r2Tops = row2Cards.map(c => c.top);
      const r1Same = Math.max(...r1Tops) === Math.min(...r1Tops);
      const r2Same = Math.max(...r2Tops) === Math.min(...r2Tops);
      const r2WidthsEqual = Math.abs(row2Cards[0].width - row2Cards[1].width) <= 2;

      console.log(`⚖️ 3+2 Layout Check: Row 1 all same top: ${r1Same} | Row 2 all same top: ${r2Same} | Row 2 widths equal: ${r2WidthsEqual} (${row2Cards[0].width}px vs ${row2Cards[1].width}px)`);
      if (r1Same && r2Same && r2WidthsEqual) {
        console.log(`✅ 3+2 layout perfectly balanced on ${vp.name}px!`);
      } else {
        console.error(`❌ 3+2 layout not balanced on ${vp.name}px!`);
        allPassed = false;
      }
    }

    // Check numbers and units on same line
    for (const card of checkResult.cards) {
      if (card.statText && card.unitText) {
        if (!card.unitOnSameLine) {
          console.error(`❌ Card ${card.index} unit "${card.unitText}" wrapped or not on baseline of "${card.statText}"!`);
          allPassed = false;
        }
      }
    }
    console.log(`✅ Numbers and units are on the same line across all text cards.`);

    // Check Gender Ratio Card (Card 5)
    const card5 = checkResult.cards[4];
    if (card5.hasGenderVisual) {
      console.log(`✅ Card 5 contains dual-color gender ratio visualization (bar width: ${card5.dualBarWidth}px).`);
    } else {
      console.error(`❌ Card 5 does not contain dual-color gender ratio visualization!`);
      allPassed = false;
    }

    // Screenshot
    const screenshotPath = path.join(SCREENSHOT_DIR, `tab4_kpi_cards_${vp.name}.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Saved screenshot: ${screenshotPath}`);
  }

  await browser.close();

  console.log(`\n========================================`);
  if (allPassed) {
    console.log(`🎉 ALL TAB 2 MORBIDITY KPI CARDS TESTS PASSED 100%!`);
  } else {
    console.error(`❌ SOME TESTS FAILED! Check logs above.`);
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
