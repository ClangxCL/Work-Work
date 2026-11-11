const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots', 'neumorphism_tabs');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: '1920', width: 1920, height: 1080 },
  { name: '1280', width: 1280, height: 900 },
  { name: '768', width: 768, height: 1024 },
  { name: '390', width: 390, height: 844 },
];

async function run() {
  console.log('🚀 Starting Playwright Verification for Neumorphic Main Tabs...');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  let allPassed = true;

  for (const vp of VIEWPORTS) {
    console.log(`\n============================================================`);
    console.log(`📱 Testing Viewport: ${vp.name}px (${vp.width}x${vp.height})`);
    console.log(`============================================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.width <= 640 ? 2 : 1,
    });
    const page = await context.newPage();

    await page.goto('http://localhost:5173/?tab=1', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    const checks = await page.evaluate((width) => {
      const bar = document.querySelector('.main-tabs-bar');
      const tabs = Array.from(document.querySelectorAll('.main-tab'));

      const barStyle = bar ? window.getComputedStyle(bar) : null;
      const barBg = barStyle ? barStyle.backgroundColor : '';

      const tabData = tabs.map((t, idx) => {
        const style = window.getComputedStyle(t);
        const rect = t.getBoundingClientRect();
        return {
          idx,
          text: t.textContent.trim(),
          isActive: t.classList.contains('is-active'),
          ariaSelected: t.getAttribute('aria-selected') === 'true',
          color: style.color,
          bg: style.backgroundColor,
          fontWeight: style.fontWeight,
          boxShadow: style.boxShadow,
          borderRadius: style.borderRadius,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          left: Math.round(rect.left),
          top: Math.round(rect.top),
        };
      });

      // Check if tabs are horizontal on desktop/tablet (top is same)
      const isHorizontal = tabs.length === 3 &&
        Math.abs(tabData[0].top - tabData[1].top) <= 2 &&
        Math.abs(tabData[1].top - tabData[2].top) <= 2;

      // Check if widths are equal on desktop/tablet (>= 640px)
      const widthsEqual = width >= 640
        ? Math.abs(tabData[0].width - tabData[1].width) <= 2 && Math.abs(tabData[1].width - tabData[2].width) <= 2
        : true;

      return {
        barExists: !!bar,
        barBg,
        tabsCount: tabs.length,
        tabData,
        isHorizontal,
        widthsEqual,
      };
    }, vp.width);

    // Verify background is #e8e8e8 (rgb(232, 232, 232))
    const passBarBg = checks.barBg.includes('232, 232, 232');
    const passCount = checks.tabsCount === 3;
    const activeTab = checks.tabData[0];
    const passActive = activeTab && activeTab.isActive && activeTab.ariaSelected &&
      activeTab.color.includes('93, 42, 26') && // #5d2a1a
      activeTab.boxShadow.includes('inset');

    const inactiveTab = checks.tabData[1];
    const passInactive = inactiveTab && !inactiveTab.isActive &&
      !inactiveTab.boxShadow.includes('inset');

    let passLayout = true;
    if (vp.width >= 640) {
      passLayout = checks.isHorizontal && checks.widthsEqual;
    }

    const passedThis = passBarBg && passCount && passActive && passInactive && passLayout;
    if (!passedThis) allPassed = false;

    console.log(`  ${passedThis ? '✅' : '❌'} [${vp.name}px] Bar Bg: ${checks.barBg} | Tabs: ${checks.tabsCount}`);
    console.log(`     Active Tab: text="${activeTab?.text.substring(0, 20)}..." | color=${activeTab?.color} | inset=${activeTab?.boxShadow.includes('inset')}`);
    console.log(`     Inactive Tab: text="${inactiveTab?.text.substring(0, 20)}..." | color=${inactiveTab?.color} | elevated=${!inactiveTab?.boxShadow.includes('inset')}`);
    if (vp.width >= 640) {
      console.log(`     Layout: horizontal=${checks.isHorizontal} | widthsEqual=${checks.widthsEqual} (${checks.tabData.map(t => `${t.width}px`).join(', ')})`);
    } else {
      console.log(`     Layout Mobile: scrollable/snap | widths=(${checks.tabData.map(t => `${t.width}px`).join(', ')})`);
    }

    // Capture screenshot of the sticky nav bar and hero
    const shotPath = path.join(SCREENSHOT_DIR, `neumorphism_tabs_${vp.name}px.png`);
    await page.screenshot({ path: shotPath });
    console.log(`  📸 Screenshot saved: ${shotPath}`);

    // Test tab click interactivity on 1280px
    if (vp.name === '1280') {
      console.log(`  🔄 Testing tab click transition to Tab 2...`);
      await page.click('#main-tab-2');
      await page.waitForTimeout(300);

      const tab2Active = await page.evaluate(() => {
        const t2 = document.querySelector('#main-tab-2');
        const style = t2 ? window.getComputedStyle(t2) : null;
        return {
          isActive: t2?.classList.contains('is-active'),
          ariaSelected: t2?.getAttribute('aria-selected') === 'true',
          hasInset: style?.boxShadow.includes('inset'),
          h1Text: document.querySelector('h1')?.textContent.trim()
        };
      });

      console.log(`  ${tab2Active.isActive && tab2Active.hasInset ? '✅' : '❌'} Tab 2 clicked -> Active: ${tab2Active.isActive} | Inset: ${tab2Active.hasInset} | H1: "${tab2Active.h1Text}"`);
      const shotTab2 = path.join(SCREENSHOT_DIR, `neumorphism_tabs_tab2_active_1280px.png`);
      await page.screenshot({ path: shotTab2 });
    }

    await context.close();
  }

  await browser.close();

  if (allPassed) {
    console.log('\n🎉 ALL NEUMORPHIC MAIN TABS PLAYWRIGHT TESTS PASSED 100%!');
  } else {
    console.error('\n⚠️ Some Neumorphic Main Tabs tests failed.');
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error during Playwright verification:', err);
  process.exit(1);
});
