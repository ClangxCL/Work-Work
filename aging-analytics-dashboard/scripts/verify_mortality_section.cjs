const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: '1920', width: 1920, height: 1080, isMobile: false, sideBySide: true },
  { name: '1440', width: 1440, height: 900, isMobile: false, sideBySide: true },
  { name: '1280', width: 1280, height: 900, isMobile: false, sideBySide: true },
  { name: '1024', width: 1024, height: 768, isMobile: false, sideBySide: false },
  { name: '768', width: 768, height: 1024, isMobile: false, sideBySide: false },
  { name: '390', width: 390, height: 844, isMobile: true, sideBySide: false },
];

async function run() {
  console.log('🚀 Starting Verification for Mortality Causes Section...');
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

    // 2) Check Sub-view Switcher Pills
    const switcherInfo = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button')).filter(b => 
        b.textContent.includes('ภาพรวมทั้งหมด') ||
        b.textContent.includes('สถิติการเจ็บป่วย') ||
        b.textContent.includes('สถิติสาเหตุการเสียชีวิต')
      );
      return buttons.map(b => ({
        text: b.textContent.trim(),
        hasIcon: !!b.querySelector('svg'),
        height: b.getBoundingClientRect().height,
        classes: b.className
      }));
    });

    console.log(`   Sub-view Switcher Buttons: found ${switcherInfo.length}`);
    switcherInfo.forEach(b => {
      console.log(`     - "${b.text}" (Height: ${b.height.toFixed(1)}px, Icon: ${b.hasIcon})`);
    });

    if (switcherInfo.length !== 3) {
      console.error(`❌ Expected 3 switcher buttons, got ${switcherInfo.length}`);
      allPassed = false;
    }

    // 3) Check Left Card (10 อันดับสาเหตุการเสียชีวิต)
    await page.evaluate(async () => {
      const card = document.querySelector('.mortality-card');
      if (card) {
        card.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
      const img = card ? card.querySelector('img') : null;
      if (img) {
        try { await img.decode(); } catch (e) {}
      }
    });
    await new Promise(r => setTimeout(r, 400));

    const leftCardCheck = await page.evaluate(() => {
      const card = document.querySelector('.mortality-card');
      if (!card) return { error: 'Mortality card not found' };

      const title = card.querySelector('h3')?.textContent.trim() || '';
      const subtitle = card.querySelector('p')?.textContent.trim() || '';
      const badge = card.querySelector('span.rounded-full')?.textContent.trim() || '';
      const rows = Array.from(card.querySelectorAll('.mortality-row'));

      const rowDetails = rows.map(r => {
        const rankText = r.querySelector('span[style*="var(--rank-"]')?.textContent.trim() || '';
        const thName = r.querySelector('.leading-snug')?.textContent.trim() || '';
        const deathsText = r.querySelector('.tabular-nums')?.textContent.trim() || '';
        const ratioText = r.querySelector('.font-serif.text-\\[\\#5d2a1a\\]')?.textContent.trim() || '';
        const barFill = r.querySelector('.mortality-bar-fill');
        const barWidth = barFill ? barFill.style.width : '';
        const titleAttr = r.getAttribute('title') || '';
        const isHighlighted = r.style.backgroundColor?.includes('color-mix') || false;

        return {
          rankText,
          thName,
          deathsText,
          ratioText,
          barWidth,
          titleAttr,
          isHighlighted
        };
      });

      // Infographic Image Check
      const infoBox = card.querySelector('.rounded-\\[20px\\]');
      const infoTitle = infoBox?.querySelector('h4')?.textContent.trim() || '';
      const infoSubtitle = infoBox?.querySelector('p')?.textContent.trim() || '';
      const imgEl = infoBox?.querySelector('img');
      const imgSrc = imgEl?.getAttribute('src') || '';
      const imgAlt = imgEl?.getAttribute('alt') || '';
      const imgLoading = imgEl?.getAttribute('loading') || '';
      const imgDecoding = imgEl?.getAttribute('decoding') || '';
      const imgNaturalWidth = imgEl?.naturalWidth || 0;
      const imgNaturalHeight = imgEl?.naturalHeight || 0;
      const imgClientWidth = imgEl?.clientWidth || 0;
      const imgClientHeight = imgEl?.clientHeight || 0;

      // Mobile hint
      const hintEl = infoBox?.querySelector('span.sm\\:hidden');
      const hintVisible = hintEl ? window.getComputedStyle(hintEl).display !== 'none' : false;
      const hintText = hintEl?.textContent.trim() || '';

      // Bottom info box
      const infoBoxes = card.querySelectorAll('.bg-white.rounded-\\[16px\\]');
      const summaryBox = infoBoxes[infoBoxes.length - 1];
      const infoText = summaryBox ? summaryBox.textContent.trim() : '';

      const cardRectRaw = card.getBoundingClientRect();
      const cardRect = { width: cardRectRaw.width, height: cardRectRaw.height, top: cardRectRaw.top };
      const cardStyle = window.getComputedStyle(card);
      const hasNestedScrollbar = card.scrollHeight > card.clientHeight + 2 && (cardStyle.overflowY === 'auto' || cardStyle.overflowY === 'scroll');

      return {
        title,
        subtitle,
        badge,
        rowsCount: rows.length,
        rowDetails,
        infoTitle,
        infoSubtitle,
        imgSrc,
        imgAlt,
        imgLoading,
        imgDecoding,
        imgNaturalWidth,
        imgNaturalHeight,
        imgClientWidth,
        imgClientHeight,
        hintVisible,
        hintText,
        infoText,
        cardRect,
        hasNestedScrollbar
      };
    });

    if (leftCardCheck.error) {
      console.error(`❌ ${leftCardCheck.error}`);
      allPassed = false;
      continue;
    }

    console.log(`   Left Card: "${leftCardCheck.title}" (Rows: ${leftCardCheck.rowsCount}, Height: ${leftCardCheck.cardRect.height.toFixed(1)}px)`);
    console.log(`     Row 1: Rank ${leftCardCheck.rowDetails[0].rankText} "${leftCardCheck.rowDetails[0].thName}" - ${leftCardCheck.rowDetails[0].deathsText} (${leftCardCheck.rowDetails[0].ratioText}) Bar: ${leftCardCheck.rowDetails[0].barWidth} Highlight: ${leftCardCheck.rowDetails[0].isHighlighted}`);
    console.log(`     Row 2: Rank ${leftCardCheck.rowDetails[1].rankText} "${leftCardCheck.rowDetails[1].thName}" - ${leftCardCheck.rowDetails[1].deathsText} (${leftCardCheck.rowDetails[1].ratioText}) Bar: ${leftCardCheck.rowDetails[1].barWidth} Highlight: ${leftCardCheck.rowDetails[1].isHighlighted}`);
    console.log(`     Row 10: Rank ${leftCardCheck.rowDetails[9].rankText} "${leftCardCheck.rowDetails[9].thName}" - ${leftCardCheck.rowDetails[9].deathsText} (${leftCardCheck.rowDetails[9].ratioText}) Bar: ${leftCardCheck.rowDetails[9].barWidth}`);
    console.log(`     Infographic Image: "${leftCardCheck.infoTitle}" ("${leftCardCheck.infoSubtitle}")`);
    console.log(`       - src: "${leftCardCheck.imgSrc}" (Natural: ${leftCardCheck.imgNaturalWidth}x${leftCardCheck.imgNaturalHeight}, Rendered: ${leftCardCheck.imgClientWidth}x${leftCardCheck.imgClientHeight})`);
    console.log(`       - loading: "${leftCardCheck.imgLoading}", decoding: "${leftCardCheck.imgDecoding}"`);
    console.log(`       - mobile hint: "${leftCardCheck.hintText}" (Visible: ${leftCardCheck.hintVisible})`);
    console.log(`     Summary Info Box: "${leftCardCheck.infoText.substring(0, 75)}..."`);

    if (leftCardCheck.rowsCount !== 10) {
      console.error(`❌ Expected 10 rows in Left Card, got ${leftCardCheck.rowsCount}`);
      allPassed = false;
    }
    if (leftCardCheck.imgSrc !== '/images/mortality-infographic.webp') {
      console.error(`❌ Expected imgSrc '/images/mortality-infographic.webp', got '${leftCardCheck.imgSrc}'`);
      allPassed = false;
    } else {
      console.log(`✅ Infographic image src is correctly set to /images/mortality-infographic.webp`);
    }
    if (leftCardCheck.imgNaturalWidth <= 0) {
      console.error(`❌ Infographic image failed to load (naturalWidth = 0)!`);
      allPassed = false;
    } else {
      console.log(`✅ Infographic image loaded successfully (${leftCardCheck.imgNaturalWidth}x${leftCardCheck.imgNaturalHeight})`);
    }
    if (vp.isMobile && !leftCardCheck.hintVisible) {
      console.error(`❌ Expected mobile scroll hint to be visible on mobile!`);
      allPassed = false;
    } else if (vp.isMobile) {
      console.log(`✅ Mobile scroll hint is visible on mobile`);
    }
    if (!leftCardCheck.rowDetails[0].isHighlighted || !leftCardCheck.rowDetails[1].isHighlighted) {
      console.error(`❌ Expected ranks 1 and 2 to have color-mix highlight!`);
      allPassed = false;
    }

    // 4) Check Right Card (เปรียบเทียบสาเหตุการตาย: ชาย vs หญิง)
    const rightCardCheck = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.rounded-\\[24px\\]'));
      const card = cards.find(c => c.textContent.includes('เปรียบเทียบสาเหตุการตาย: ชาย vs หญิง'));
      if (!card) return { error: 'Gender comparison card not found' };

      const title = card.querySelector('h3')?.textContent.trim() || '';
      const subtitle = card.querySelector('p')?.textContent.trim() || '';
      const badge = card.querySelector('span.rounded-full')?.textContent.trim() || '';

      // Check legend
      const legendText = card.textContent.includes('เพศชาย (#5d2a1a)') && card.textContent.includes('เพศหญิง (#c48a72)');

      // Sub-cards
      const subCards = Array.from(card.querySelectorAll('.rounded-\\[16px\\].bg-white'));
      const subCardDetails = subCards.map(sc => {
        const cause = sc.querySelector('.leading-snug')?.textContent.trim() || '';
        const diffPill = sc.querySelector('.rounded-full.font-medium')?.textContent.trim() || '';
        const maleText = sc.textContent.match(/ชาย\s*[\d.]+\s*%/)?.[0] || '';
        const femaleText = sc.textContent.match(/หญิง\s*[\d.]+\s*%/)?.[0] || '';
        const epiText = sc.querySelector('.border-t .font-medium')?.textContent.trim() || '';
        const factorText = sc.querySelector('.border-t .text-\\[\\#5f6370\\]')?.textContent.trim() || '';

        return {
          cause,
          diffPill,
          maleText,
          femaleText,
          epiText,
          factorText
        };
      });

      const cardRectRaw = card.getBoundingClientRect();
      const cardRect = { width: cardRectRaw.width, height: cardRectRaw.height, top: cardRectRaw.top };
      const cardStyle = window.getComputedStyle(card);
      const hasNestedScrollbar = card.scrollHeight > card.clientHeight + 2 && (cardStyle.overflowY === 'auto' || cardStyle.overflowY === 'scroll');

      return {
        title,
        subtitle,
        badge,
        legendText,
        subCardsCount: subCards.length,
        subCardDetails,
        cardRect,
        hasNestedScrollbar
      };
    });

    if (rightCardCheck.error) {
      console.error(`❌ ${rightCardCheck.error}`);
      allPassed = false;
      continue;
    }

    console.log(`   Right Card: "${rightCardCheck.title}" (Sub-cards: ${rightCardCheck.subCardsCount}, Height: ${rightCardCheck.cardRect.height.toFixed(1)}px, Legend: ${rightCardCheck.legendText})`);
    rightCardCheck.subCardDetails.forEach((sc, i) => {
      console.log(`     Sub-card ${i+1}: "${sc.cause}" [${sc.diffPill}] - ${sc.maleText} | ${sc.femaleText} - "${sc.epiText}"`);
    });

    if (rightCardCheck.subCardsCount !== 6) {
      console.error(`❌ Expected 6 sub-cards in Right Card, got ${rightCardCheck.subCardsCount}`);
      allPassed = false;
    }
    if (leftCardCheck.hasNestedScrollbar || rightCardCheck.hasNestedScrollbar) {
      console.error(`❌ Found nested scrollbar inside mortality cards!`);
      allPassed = false;
    } else {
      console.log(`✅ No nested scrollbars in either card`);
    }

    // 5) Check Height Alignment on side-by-side viewports (>= 1280px)
    if (vp.sideBySide) {
      const heightDiff = Math.abs(leftCardCheck.cardRect.height - rightCardCheck.cardRect.height);
      console.log(`   Height Alignment Check (Side-by-Side): Left=${leftCardCheck.cardRect.height.toFixed(1)}px, Right=${rightCardCheck.cardRect.height.toFixed(1)}px (Diff=${heightDiff.toFixed(1)}px)`);
      if (heightDiff > 40) {
        console.error(`❌ Height mismatch between side-by-side cards: diff is ${heightDiff}px!`);
        allPassed = false;
      } else {
        console.log(`✅ Left and Right cards are visually aligned and equal in height!`);
      }
    }

    // Scroll to mortality section and capture screenshot
    await page.evaluate(() => {
      const el = document.querySelector('.mortality-card');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise(r => setTimeout(r, 400));

    const screenshotPath = path.join(SCREENSHOT_DIR, `mortality_section_${vp.name}.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`📸 Screenshot saved: ${screenshotPath}`);
  }

  await browser.close();

  console.log(`\n========================================`);
  if (allPassed) {
    console.log('🎉 ALL MORTALITY SECTION VERIFICATION TESTS PASSED SUCCESSFULLY! 100%');
  } else {
    console.error('❌ SOME CHECKS FAILED. See details above.');
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
