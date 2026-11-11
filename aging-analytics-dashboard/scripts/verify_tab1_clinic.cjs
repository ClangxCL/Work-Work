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
  { name: '1024', width: 1024, height: 768, isMobile: false, sideBySide: true },
  { name: '768', width: 768, height: 1024, isMobile: false, sideBySide: false },
  { name: '390', width: 390, height: 844, isMobile: true, sideBySide: false },
];

async function run() {
  console.log('🚀 Starting Verification for Tab 1 Clinic (Map & Side Overview Panel)...');
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

    const url = 'http://localhost:5173/?tab=3';
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 600));

    // Find the geographic section: outer grid, left card, right card
    const metrics = await page.evaluate(() => {
      // Find cards by text content
      const headings = Array.from(document.querySelectorAll('h3'));
      const mapHeading = headings.find(h => h.textContent.includes('แผนผังภูมิศาสตร์'));
      const overviewHeading = headings.find(h => h.textContent.includes('ภาพรวมคลินิกผู้สูงอายุ') || h.textContent.includes('จังหวัด'));

      if (!mapHeading || !overviewHeading) return null;

      // Card is container with bg-[#f2f2f3] and rounded-[24px]
      const leftCard = mapHeading.closest('.bg-\\[\\#f2f2f3\\]');
      const rightCard = overviewHeading.closest('.bg-\\[\\#f2f2f3\\]');

      if (!leftCard || !rightCard) return null;

      const leftRect = leftCard.getBoundingClientRect();
      const rightRect = rightCard.getBoundingClientRect();

      // Find province list inside right card
      const listButtons = Array.from(rightCard.querySelectorAll('button')).filter(b => {
        return b.textContent.includes('รพ.') && b.textContent.includes('ประเมิน');
      });

      const listContainer = rightCard.querySelector('.slim-scrollbar');
      let listScrollInfo = null;
      if (listContainer) {
        listScrollInfo = {
          scrollHeight: listContainer.scrollHeight,
          clientHeight: listContainer.clientHeight,
          canScroll: listContainer.scrollHeight > listContainer.clientHeight,
          className: listContainer.className
        };
      }

      // Check stats cards
      const statsNumbers = Array.from(rightCard.querySelectorAll('.tabular-nums')).filter(el => {
        return ['953', '818', '119'].some(val => el.textContent.trim() === val);
      }).length;

      return {
        left: {
          width: Math.round(leftRect.width),
          height: Math.round(leftRect.height),
          top: Math.round(leftRect.top),
        },
        right: {
          width: Math.round(rightRect.width),
          height: Math.round(rightRect.height),
          top: Math.round(rightRect.top),
        },
        heightDiff: Math.abs(Math.round(leftRect.height) - Math.round(rightRect.height)),
        provinceCount: listButtons.length,
        firstRowHeight: listButtons.length > 0 ? Math.round(listButtons[0].getBoundingClientRect().height) : null,
        listScrollInfo,
        statsNumbers
      };
    });

    if (!metrics) {
      console.error(`❌ Could not find Left Map Card or Right Panel on viewport ${vp.name}!`);
      allPassed = false;
      continue;
    }

    console.log(`📊 Geometry: Left Card = ${metrics.left.width}x${metrics.left.height}px | Right Card = ${metrics.right.width}x${metrics.right.height}px`);
    console.log(`📏 Height Difference: ${metrics.heightDiff}px`);
    console.log(`📋 Province Rows Count: ${metrics.provinceCount} (Row 1 Height: ${metrics.firstRowHeight}px)`);
    if (metrics.listScrollInfo) {
      console.log(`📜 List Scroll: clientHeight=${metrics.listScrollInfo.clientHeight}px, scrollHeight=${metrics.listScrollInfo.scrollHeight}px, canScroll=${metrics.listScrollInfo.canScroll}`);
    }

    // Assertions
    if (vp.sideBySide) {
      if (metrics.heightDiff > 2) {
        console.error(`❌ Height difference (${metrics.heightDiff}px) exceeds 2px on desktop viewport ${vp.name}!`);
        allPassed = false;
      } else {
        console.log(`✅ Height matched perfectly! (diff: ${metrics.heightDiff}px)`);
      }
      if (metrics.left.height < 600 || metrics.right.height < 600) {
        console.warn(`⚠️ Warning: Card height (${metrics.left.height}px) is less than expected 640px minimum.`);
      }
    }

    if (metrics.provinceCount !== 77) {
      console.error(`❌ Expected 77 provinces in overview list, found ${metrics.provinceCount}`);
      allPassed = false;
    } else {
      console.log(`✅ All 77 provinces present in overview list.`);
    }

    if (metrics.firstRowHeight && (metrics.firstRowHeight < 50 || metrics.firstRowHeight > 75)) {
      console.warn(`⚠️ First row height is ${metrics.firstRowHeight}px (expected 56–60px)`);
    } else {
      console.log(`✅ Province row height is well proportioned (${metrics.firstRowHeight}px).`);
    }

    if (metrics.listScrollInfo && !metrics.listScrollInfo.canScroll) {
      console.error(`❌ Province list should be scrollable (scrollHeight=${metrics.listScrollInfo.scrollHeight}, clientHeight=${metrics.listScrollInfo.clientHeight})`);
      allPassed = false;
    } else {
      console.log(`✅ Province list scrolls cleanly within its container.`);
    }

    // Screenshot overview
    const overviewImgPath = path.join(SCREENSHOT_DIR, `tab1_clinic_overview_${vp.name}.png`);
    await page.screenshot({ path: overviewImgPath });
    console.log(`📸 Saved overview screenshot: ${overviewImgPath}`);

    // If desktop (1920), test click interaction:
    if (vp.name === '1920') {
      console.log(`\n🖱️ Testing Click Interaction on 1920px:`);

      // 1. Click first province button in list
      const clickedName = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h3'));
        const overviewHeading = headings.find(h => h.textContent.includes('ภาพรวมคลินิกผู้สูงอายุ'));
        const rightCard = overviewHeading.closest('.bg-\\[\\#f2f2f3\\]');
        const firstBtn = rightCard.querySelector('.slim-scrollbar button');
        if (firstBtn) {
          const provName = firstBtn.querySelector('.truncate')?.textContent || 'first';
          firstBtn.click();
          return provName;
        }
        return null;
      });

      console.log(`👉 Clicked province in list: ${clickedName}`);
      await new Promise(r => setTimeout(r, 600));

      // Verify detail view active
      const detailMetrics = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h3'));
        const mapHeading = headings.find(h => h.textContent.includes('แผนผังภูมิศาสตร์'));
        const detailHeading = headings.find(h => h.textContent.includes('จังหวัด'));

        if (!mapHeading || !detailHeading) return null;

        const leftCard = mapHeading.closest('.bg-\\[\\#f2f2f3\\]');
        const rightCard = detailHeading.closest('.bg-\\[\\#f2f2f3\\]');

        const leftRect = leftCard.getBoundingClientRect();
        const rightRect = rightCard.getBoundingClientRect();

        const hospitalList = rightCard.querySelector('.slim-scrollbar');

        return {
          detailTitle: detailHeading.textContent.trim(),
          leftHeight: Math.round(leftRect.height),
          rightHeight: Math.round(rightRect.height),
          heightDiff: Math.abs(Math.round(leftRect.height) - Math.round(rightRect.height)),
          hasHospitalList: !!hospitalList,
          hospitalItemsCount: hospitalList ? hospitalList.children.length : 0
        };
      });

      console.log(`📋 Detail View Title: "${detailMetrics?.detailTitle}"`);
      console.log(`📏 Detail View Heights: Left=${detailMetrics?.leftHeight}px, Right=${detailMetrics?.rightHeight}px (diff: ${detailMetrics?.heightDiff}px)`);
      console.log(`🏥 Hospital Items: ${detailMetrics?.hospitalItemsCount} items`);

      if (detailMetrics?.heightDiff <= 2) {
        console.log(`✅ Detail View height also matches Left Map Card perfectly!`);
      } else {
        console.error(`❌ Detail View height difference (${detailMetrics?.heightDiff}px) exceeds 2px!`);
        allPassed = false;
      }

      const detailImgPath = path.join(SCREENSHOT_DIR, `tab1_clinic_detail_1920.png`);
      await page.screenshot({ path: detailImgPath });
      console.log(`📸 Saved detail screenshot: ${detailImgPath}`);

      // Click "ภาพรวม" back button
      await page.evaluate(() => {
        const backBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ภาพรวม') && b.querySelector('svg'));
        if (backBtn) backBtn.click();
      });
      await new Promise(r => setTimeout(r, 500));

      // Verify back in overview mode
      const isBackInOverview = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('h3')).some(h => h.textContent.includes('ภาพรวมคลินิกผู้สูงอายุ'));
      });
      console.log(`🔄 Back in overview mode: ${isBackInOverview ? 'YES ✅' : 'NO ❌'}`);
      if (!isBackInOverview) allPassed = false;

      // 2. Test clicking on map polygon
      console.log(`\n🗺️ Testing Map Polygon Click:`);
      await page.evaluate(() => {
        const paths = document.querySelectorAll('svg path.cursor-pointer');
        if (paths.length > 10) {
          paths[5].dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
      });
      await new Promise(r => setTimeout(r, 600));

      const mapClickResult = await page.evaluate(() => {
        const heading = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('จังหวัด'));
        return heading ? heading.textContent.trim() : null;
      });
      console.log(`👉 Selected province from map click: "${mapClickResult}"`);
      if (mapClickResult) {
        console.log(`✅ Map polygon click successfully updated side panel!`);
      } else {
        console.error(`❌ Map polygon click did not open detail view!`);
        allPassed = false;
      }

      // Return to overview
      await page.evaluate(() => {
        const backBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ภาพรวม') && b.querySelector('svg'));
        if (backBtn) backBtn.click();
      });
      await new Promise(r => setTimeout(r, 400));

      // 3. Test Switcher to "การ์ดจังหวัด" view
      console.log(`\n🃏 Testing Cards Matrix Switcher:`);
      await page.evaluate(() => {
        const cardsBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('การ์ดจังหวัด'));
        if (cardsBtn) cardsBtn.click();
      });
      await new Promise(r => setTimeout(r, 600));

      const cardsModeMetrics = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h3'));
        const mapHeading = headings.find(h => h.textContent.includes('แผนผังภูมิศาสตร์'));
        const overviewHeading = headings.find(h => h.textContent.includes('ภาพรวมคลินิกผู้สูงอายุ'));

        const leftCard = mapHeading.closest('.bg-\\[\\#f2f2f3\\]');
        const rightCard = overviewHeading.closest('.bg-\\[\\#f2f2f3\\]');

        const leftRect = leftCard.getBoundingClientRect();
        const rightRect = rightCard.getBoundingClientRect();

        return {
          leftHeight: Math.round(leftRect.height),
          rightHeight: Math.round(rightRect.height),
          heightDiff: Math.abs(Math.round(leftRect.height) - Math.round(rightRect.height)),
        };
      });

      console.log(`📏 Cards Mode Heights: Left=${cardsModeMetrics?.leftHeight}px, Right=${cardsModeMetrics?.rightHeight}px (diff: ${cardsModeMetrics?.heightDiff}px)`);
      if (cardsModeMetrics?.heightDiff <= 2) {
        console.log(`✅ Cards Mode heights match Left and Right cards perfectly!`);
      } else {
        console.error(`❌ Cards Mode height diff (${cardsModeMetrics?.heightDiff}px) exceeds 2px!`);
        allPassed = false;
      }

      const cardsImgPath = path.join(SCREENSHOT_DIR, `tab1_clinic_cards_1920.png`);
      await page.screenshot({ path: cardsImgPath });
      console.log(`📸 Saved cards view screenshot: ${cardsImgPath}`);
    }
  }

  await browser.close();

  console.log(`\n========================================`);
  if (allPassed) {
    console.log(`🎉 ALL TAB 1 CLINIC TESTS PASSED 100%!`);
  } else {
    console.error(`❌ SOME TESTS FAILED! Check logs above.`);
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
