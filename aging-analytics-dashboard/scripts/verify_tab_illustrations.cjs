const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots', 'illustrations');

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

const TABS = [
  { id: 1, name: 'Screening', expectedImg: 'tab-screening.webp', expectedH1: 'ความเสี่ยงต่อปัญหาสุขภาพ ผู้สูงอายุ 9 ด้าน' },
  { id: 2, name: 'Morbidity', expectedImg: 'tab-illness.webp', expectedH1: 'สถิติสาเหตุการป่วยและสาเหตุการตาย' },
  { id: 3, name: 'Clinic', expectedImg: 'tab-clinic.webp', expectedH1: 'ข้อมูลคลินิกผู้สูงอายุ พร้อมแสดงจำนวนเป้าหมาย รพ. 937 แห่ง' },
];

async function run() {
  console.log('🚀 Starting Comprehensive Verification for Tab Illustrations & Empty States...');
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

  for (const tab of TABS) {
    console.log(`\n============================================================`);
    console.log(`📑 Verifying Tab ${tab.id}: ${tab.name} (${tab.expectedImg})`);
    console.log(`============================================================`);

    for (const vp of VIEWPORTS) {
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: vp.isMobile ? 2 : 1,
        isMobile: vp.isMobile,
        hasTouch: vp.isMobile,
      });

      const url = `http://localhost:5173/?tab=${tab.id}`;
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
      await new Promise(r => setTimeout(r, 400));

      const res = await page.evaluate((expectedImg, expectedH1, isDesktop) => {
        const h1 = document.querySelector('h1');
        const h1Text = h1 ? h1.textContent.trim() : '';

        // Illustration img
        const img = document.querySelector('.tab-illustration-img');
        const wrapper = document.querySelector('.tab-illustration-wrapper');
        const textCol = h1 ? h1.closest('.flex-1') : null;

        let imgSrc = img ? img.src : '';
        let naturalWidth = img ? img.naturalWidth : 0;
        let naturalHeight = img ? img.naturalHeight : 0;
        let isVisible = false;
        let imgRect = null;
        let textRect = null;
        let wrapperRect = null;

        if (img && wrapper) {
          const style = window.getComputedStyle(wrapper);
          isVisible = style.display !== 'none' && style.visibility !== 'hidden';
          imgRect = img.getBoundingClientRect();
          wrapperRect = wrapper.getBoundingClientRect();
        }

        if (textCol) {
          textRect = textCol.getBoundingClientRect();
        }

        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        const hasHorizontalScroll = scrollWidth > innerWidth + 1; // 1px tolerance

        // Position check: On desktop (>=1024), image should be to the right of text
        let isRightOfText = false;
        let isBelowText = false;
        if (textRect && imgRect && isVisible) {
          if (imgRect.left >= textRect.right - 10) {
            isRightOfText = true;
          }
          if (imgRect.top >= textRect.bottom - 10) {
            isBelowText = true;
          }
        }

        return {
          h1Text,
          h1Matches: h1Text.includes(expectedH1),
          imgSrc,
          hasImg: imgSrc.includes(expectedImg),
          naturalWidth,
          naturalHeight,
          isVisible,
          imgWidth: imgRect ? Math.round(imgRect.width) : 0,
          imgHeight: imgRect ? Math.round(imgRect.height) : 0,
          scrollWidth,
          innerWidth,
          hasHorizontalScroll,
          isRightOfText,
          isBelowText,
        };
      }, tab.expectedImg, tab.expectedH1, vp.width >= 1024);

      const passH1 = res.h1Matches;
      const passImg = res.hasImg && res.naturalWidth > 0 && res.isVisible;
      const passScroll = !res.hasHorizontalScroll;
      let passLayout = true;

      if (vp.width >= 1024) {
        passLayout = res.isRightOfText;
      } else {
        passLayout = res.isBelowText;
      }

      const statusIcon = (passH1 && passImg && passScroll && passLayout) ? '✅' : '❌';
      if (!passH1 || !passImg || !passScroll || !passLayout) allPassed = false;

      console.log(`  ${statusIcon} [${vp.name}px] H1: "${res.h1Text.substring(0, 30)}..." | Img: ${res.imgWidth}x${res.imgHeight}px | RightOfText=${res.isRightOfText} BelowText=${res.isBelowText} | H-Scroll: ${res.hasHorizontalScroll ? 'YES (OVERFLOW!)' : 'None'}`);

      // Save screenshot for 1440 and 390
      if (vp.name === '1440' || vp.name === '390') {
        const screenshotPath = path.join(SCREENSHOT_DIR, `tab${tab.id}_${vp.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
      }
    }
  }

  // Test Landscape < 700px height constraint: should hide illustration
  console.log(`\n============================================================`);
  console.log(`📱 Testing Landscape Mobile (<640w and <700h) constraint...`);
  await page.setViewport({ width: 568, height: 320, isMobile: true });
  await page.goto('http://localhost:5173/?tab=1', { waitUntil: 'networkidle0' });
  const isHiddenOnLandscape = await page.evaluate(() => {
    const wrapper = document.querySelector('.tab-illustration-wrapper');
    if (!wrapper) return false;
    return window.getComputedStyle(wrapper).display === 'none';
  });
  console.log(`  ${isHiddenOnLandscape ? '✅' : '❌'} Landscape illustration hidden on height < 700px: ${isHiddenOnLandscape}`);
  if (!isHiddenOnLandscape) allPassed = false;

  // Test EmptyState rendering on Tab 1 by typing nonsense in search
  console.log(`\n============================================================`);
  console.log(`🔍 Testing EmptyState on Tab 1 with unmatched search...`);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/?tab=1', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));

  // Switch to table view
  await page.evaluate(() => {
    const tableBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ตาราง'));
    if (tableBtn) tableBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));

  // Type non-existent query in search input
  const searchInput = await page.$('input[placeholder*="ค้นหา"]');
  if (searchInput) {
    await searchInput.type('ขอนแก่น_nonexistent_xyz');
    await new Promise(r => setTimeout(r, 400));
  }

  const emptyStateRes = await page.evaluate(() => {
    const emptyImg = document.querySelector('img[src*="tab-screening.webp"]');
    const emptyText = document.body.textContent.includes('ไม่พบข้อมูลตามตัวกรองที่เลือก');
    const resetBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ล้างตัวกรอง'));
    return {
      hasEmptyImg: !!emptyImg,
      hasEmptyText: emptyText,
      hasResetBtn: !!resetBtn,
    };
  });

  const passEmpty = emptyStateRes.hasEmptyText && emptyStateRes.hasResetBtn;
  console.log(`  ${passEmpty ? '✅' : '❌'} EmptyState visible on zero search results | Text: ${emptyStateRes.hasEmptyText} | ResetBtn: ${emptyStateRes.hasResetBtn}`);
  if (!passEmpty) allPassed = false;

  const emptyScreenshot = path.join(SCREENSHOT_DIR, `empty_state_search.png`);
  await page.screenshot({ path: emptyScreenshot });

  await browser.close();

  if (allPassed) {
    console.log('\n🎉 ALL TAB ILLUSTRATIONS & EMPTY STATES VERIFIED SUCCESSFULLY 100%!');
  } else {
    console.error('\n⚠️ Some verification checks did not meet the exact criteria.');
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
