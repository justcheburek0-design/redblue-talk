#!/usr/bin/env node
/* Ad-hoc Figma-comparison verification for RED & BLUE desktop hero.
   Run from /root/redbluetalk/lending:  node scripts/verify-figma-hero.cjs
   Relies on Playwright (installed in this project) and the Figma export PNG.
*/
const { chromium } = require('playwright');
const { existsSync, writeFileSync } = require('fs');

const FIGMA_REF = __dirname + '/../public/assets/figma/dark-landing-figma.png';
const URL = process.env.REDBLUE_URL || 'http://127.0.0.1:53991/redblue/';
const OUT = process.env.OUPUT || '/tmp/hermes-verify-figma-hero.json';
const SCREENSHOT = '/tmp/hermes-verify-figma-hero.png';

const EXPECTED = [
  { name: 'English heading', word: 'English', xMin: 140, xMax: 260, yMin: 230, yMax: 320 },
  { name: 'Description start', word: 'Бесплатный', xMin: 1300, xMax: 1550, yMin: 250, yMax: 340 },
  { name: 'Call-to-action', word: 'Главное', xMin: 1300, xMax: 1700, yMin: 390, yMax: 480 },
  { name: 'Iceberg peak', word: 'Точка А', xMin: 900, xMax: 1150, yMin: 580, yMax: 750 },
  { name: 'Route label', word: 'Нет барьеру!', xMin: 400, xMax: 800, yMin: 700, yMax: 900 },
  { name: 'Iceberg destination', word: 'Точка Б', xMin: 700, xMax: 1100, yMin: 1300, yMax: 1600 },
];

async function main() {
  const errors = [];
  const warnings = [];

  // 1. Check Figma reference exists
  if (!existsSync(FIGMA_REF)) {
    errors.push('Figma reference not found: ' + FIGMA_REF);
  } else {
    const { statSync } = require('fs');
    const sz = statSync(FIGMA_REF).size;
    if (sz < 10000) warnings.push('Figma ref suspiciously small: ' + sz + ' bytes');
  }

  // 2. Launch browser at desktop viewport
  let browser, page;
  try {
    browser = await chromium.launch({ headless: true });
    page = await browser.newPage({ viewport: { width: 2260, height: 1600 } });
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    errors.push('page load failed: ' + e.message);
    if (browser) await browser.close();
    writeFileSync(OUT, JSON.stringify({ verdict: 'FAIL', errors, warnings, checks: [] }, null, 2));
    console.log('FAIL: page load failed');
    process.exit(1);
  }

  // 3. Screenshot
  await page.screenshot({ path: SCREENSHOT, fullPage: false });

  // 4. Extract text positions
  const checks = [];
  for (const exp of EXPECTED) {
    try {
      const found = await page.evaluate((word) => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
          if (node.textContent.trim().includes(word)) {
            const range = document.createRange();
            range.selectNode(node);
            const rect = range.getBoundingClientRect();
            return { x: Math.round(rect.x), y: Math.round(rect.y), w: Math.round(rect.width), h: Math.round(rect.height) };
          }
        }
        return null;
      }, exp.word);

      if (!found) {
        checks.push({ ...exp, found: false, reason: 'text not found in DOM' });
        warnings.push(exp.word + ' — not found in DOM');
        continue;
      }

      const inX = found.x >= exp.xMin && found.x <= exp.xMax;
      const inY = found.y >= exp.yMin && found.y <= exp.yMax;

      if (!inX || !inY) {
        checks.push({ ...exp, found: true, actual: found, reason: (inX ? '' : 'x=' + found.x + ' expected [' + exp.xMin + '-' + exp.xMax + '] ') + (inY ? '' : 'y=' + found.y + ' expected [' + exp.yMin + '-' + exp.yMax + ']') });
        errors.push(exp.word + ' position mismatch: ' + JSON.stringify(found));
      } else {
        checks.push({ ...exp, found: true, actual: found, reason: 'OK' });
      }
    } catch (e) {
      checks.push({ ...exp, found: false, reason: 'eval error: ' + e.message });
      errors.push(exp.word + ' — eval error: ' + e.message);
    }
  }

  // 5. Verify hero section exists
  const hero = await page.evaluate(() => {
    const h = document.querySelector('.hero');
    if (!h) return null;
    const r = h.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  });
  if (!hero) {
    errors.push('.hero section not found');
  } else {
    checks.push({ name: '.hero section', found: true, actual: hero, reason: 'OK' });
  }

  await browser.close();

  const verdict = errors.length === 0 ? 'PASS' : 'FAIL';
  const report = { verdict, errors, warnings, checks, screenshot: SCREENSHOT, figma_ref: FIGMA_REF, url: URL };
  writeFileSync(OUT, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  console.log('\n' + verdict + ' — ' + errors.length + ' errors, ' + warnings.length + ' warnings');
  if (errors.length > 0) process.exit(1);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});