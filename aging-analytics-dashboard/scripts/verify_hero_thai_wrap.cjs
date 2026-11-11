const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots', 'thai_wrap');

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
  {
    id: 1,
    name: 'Screening',
    title: 'ความเสี่ยงต่อปัญหาสุขภาพ ผู้สูงอายุ 9 ด้าน',
    forbiddenSplits: ['ผู้สูง', 'อายุ', 'ปัญหา', 'สุขภาพ']
  },
  {
    id: 2,
    name: 'Morbidity',
    title: 'สถิติสาเหตุการป่วยและสาเหตุการตาย',
    forbiddenSplits: ['สาเหตุ', 'การตาย', 'การป่วย']
  },
  {
    id: 3,
    name: 'Clinic',
    title: 'ข้อมูลคลินิกผู้สูงอายุ พร้อมแสดงจำนวนเป้าหมาย รพ. 937 แห่ง',
    forbiddenSplits: ['ผู้สูง', 'อายุ', 'เป้า', 'หมาย', 'คลินิก']
  },
];

async function run() {
  console.log('🚀 Starting Verification for Hero Heading Thai Word Wrapping...');
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
    console.log(`📑 Verifying Tab ${tab.id}: ${tab.name}`);
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

      const evaluation = await page.evaluate(() => {
        const h1 = document.querySelector('.tab-hero h1, .hero h1, h1');
        const p = document.querySelector('.tab-hero p, .hero p, h1 + p');
        const heroText = document.querySelector('.tab-hero__text');

        const h1Style = h1 ? window.getComputedStyle(h1) : null;
        const pStyle = p ? window.getComputedStyle(p) : null;
        const heroTextStyle = heroText ? window.getComputedStyle(heroText) : null;

        // Function to extract line text by measuring range bounding rects
        function getLinesFromElement(el) {
          if (!el) return [];
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
          let lines = [];
          let currentLine = '';
          let lastY = null;
          let node;

          while ((node = walker.nextNode())) {
            const text = node.textContent;
            for (let i = 0; i < text.length; i++) {
              if (text[i] === '\n' || text[i] === '\r') continue;
              const range = document.createRange();
              range.setStart(node, i);
              range.setEnd(node, i + 1);
              const rect = range.getBoundingClientRect();
              if (rect.width === 0 && rect.height === 0) continue;

              if (lastY === null || Math.abs(rect.top - lastY) < 6) {
                currentLine += text[i];
              } else {
                if (currentLine.trim()) lines.push(currentLine.trim());
                currentLine = text[i];
              }
              lastY = rect.top;
            }
          }
          if (currentLine.trim()) lines.push(currentLine.trim());
          return lines.map(l => l.replaceAll('\u2060', ''));
        }

        const h1Lines = getLinesFromElement(h1);
        const pLines = getLinesFromElement(p);

        return {
          h1Lines,
          pLinesCount: pLines.length,
          h1WordBreak: h1Style ? h1Style.wordBreak : '',
          h1OverflowWrap: h1Style ? h1Style.overflowWrap : '',
          h1TextWrap: h1Style ? (h1Style.textWrap || h1Style.webkitTextWrap) : '',
          pTextWrap: pStyle ? (pStyle.textWrap || pStyle.webkitTextWrap) : '',
          heroTextMaxWidth: heroTextStyle ? heroTextStyle.maxWidth : '',
          heroTextWidth: heroText ? Math.round(heroText.getBoundingClientRect().width) : 0,
        };
      });

      // Verify no forbidden mid-word splits in h1Lines
      // E.g. line 1 ending in "ผู้สูง" while line 2 starts with "อายุ"
      let hasForbiddenSplit = false;
      let splitDetails = '';

      for (let i = 0; i < evaluation.h1Lines.length - 1; i++) {
        const lineA = evaluation.h1Lines[i];
        const lineB = evaluation.h1Lines[i + 1];

        if (lineA.endsWith('ผู้สูง') && lineB.startsWith('อายุ')) {
          hasForbiddenSplit = true;
          splitDetails = 'Split "ผู้สูง|อายุ" across lines!';
        }
        if (lineA.endsWith('สาเหตุ') && lineB.startsWith('การตาย')) {
          hasForbiddenSplit = true;
          splitDetails = 'Split "สาเหตุ|การตาย" across lines!';
        }
        if (lineA.endsWith('สาเหตุ') && lineB.startsWith('การป่วย')) {
          hasForbiddenSplit = true;
          splitDetails = 'Split "สาเหตุ|การป่วย" across lines!';
        }
        if (lineA.endsWith('ปัญหา') && lineB.startsWith('สุขภาพ')) {
          hasForbiddenSplit = true;
          splitDetails = 'Split "ปัญหา|สุขภาพ" across lines!';
        }
        if (lineA.endsWith('คลินิก') && lineB.startsWith('ผู้สูงอายุ')) {
          hasForbiddenSplit = true;
          splitDetails = 'Split "คลินิก|ผู้สูงอายุ" across lines!';
        }
        if (lineA.endsWith('เป้า') && lineB.startsWith('หมาย')) {
          hasForbiddenSplit = true;
          splitDetails = 'Split "เป้า|หมาย" across lines!';
        }
      }

      const passCSS =
        evaluation.h1WordBreak === 'normal' &&
        evaluation.h1OverflowWrap === 'normal';

      const passNoSplit = !hasForbiddenSplit;
      const statusIcon = (passCSS && passNoSplit) ? '✅' : '❌';

      if (!passCSS || !passNoSplit) {
        allPassed = false;
      }

      console.log(`  ${statusIcon} [${vp.name}px] Lines: [${evaluation.h1Lines.map(l => `"${l}"`).join(' / ')}]`);
      if (hasForbiddenSplit) {
        console.error(`     ❌ FORBIDDEN SPLIT DETECTED: ${splitDetails}`);
      }

      if (vp.name === '1440' || vp.name === '390') {
        const screenshotPath = path.join(SCREENSHOT_DIR, `tab${tab.id}_${vp.name}_wrap.png`);
        await page.screenshot({ path: screenshotPath });
      }
    }
  }

  await browser.close();

  if (allPassed) {
    console.log('\n🎉 ALL HERO HEADINGS & PARAGRAPHS PASSED THAI WORD BOUNDARY WRAPPING 100%!');
  } else {
    console.error('\n⚠️ Some Thai word wrapping checks failed.');
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
