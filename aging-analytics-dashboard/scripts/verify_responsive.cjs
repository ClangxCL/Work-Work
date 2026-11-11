const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'mobile_390x844', width: 390, height: 844, isMobile: true },
  { name: 'mobile_360x740', width: 360, height: 740, isMobile: true },
  { name: 'tablet_portrait_768x1024', width: 768, height: 1024, isMobile: false },
  { name: 'tablet_landscape_1024x768', width: 1024, height: 768, isMobile: false },
  { name: 'desktop_1440x900', width: 1440, height: 900, isMobile: false },
  { name: 'ultrawide_1920x1080', width: 1920, height: 1080, isMobile: false },
];

const TABS = [1, 2, 3, 4];

async function run() {
  console.log('🚀 Starting responsive verification on Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const results = [];
  let allPassed = true;

  for (const vp of VIEWPORTS) {
    console.log(`\n📱 Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.isMobile ? 2 : 1,
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
    });

    for (const tab of TABS) {
      const url = `http://localhost:5173/?tab=${tab}`;
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
      await new Promise(r => setTimeout(r, 600)); // wait for transitions/charts to settle

      const metrics = await page.evaluate(() => {
        const docEl = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
        const innerWidth = window.innerWidth;
        const hasHorizontalScroll = scrollWidth > innerWidth;
        return {
          scrollWidth,
          innerWidth,
          hasHorizontalScroll,
        };
      });

      const passed = !metrics.hasHorizontalScroll;
      if (!passed) allPassed = false;

      const filename = `${vp.name}_tab${tab}.png`;
      const filepath = path.join(SCREENSHOT_DIR, filename);
      await page.screenshot({ path: filepath, fullPage: false });

      console.log(`  [Tab ${tab}] scrollWidth: ${metrics.scrollWidth}px, innerWidth: ${metrics.innerWidth}px -> ${passed ? '✅ PASS' : '❌ FAIL (horizontal overflow)'}`);

      results.push({
        viewport: vp.name,
        tab,
        width: vp.width,
        scrollWidth: metrics.scrollWidth,
        innerWidth: metrics.innerWidth,
        passed,
        screenshot: filename,
      });
    }
  }

  // Also test mobile bottom sheet interaction on Tab 1
  console.log('\n🔍 Testing Mobile Filter Bottom Sheet on Tab 1 (390x844)...');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173/?tab=1', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));

  // Find and click the "ตัวกรอง" button
  const filterBtn = await page.$('button:has(svg.lucide-filter)');
  if (filterBtn) {
    await filterBtn.click();
    await new Promise(r => setTimeout(r, 400));
    const sheetScreenshot = path.join(SCREENSHOT_DIR, 'mobile_390x844_tab1_bottomsheet.png');
    await page.screenshot({ path: sheetScreenshot });
    console.log('  ✅ Mobile Bottom Sheet opened and captured!');
  }

  await browser.close();

  console.log('\n📊 === SUMMARY REPORT ===');
  console.log(`Total checks: ${results.length}`);
  console.log(`Status: ${allPassed ? '🎉 ALL VIEWPORTS PASSED (0 Horizontal Overflow)' : '⚠️ SOME VIEWPORTS FAILED'}`);

  return { allPassed, results };
}

run().catch(err => {
  console.error('Error running verification:', err);
  process.exit(1);
});
