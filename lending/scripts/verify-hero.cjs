/* Reproducible production check for the RED & BLUE hero. */
const { chromium } = require('playwright');

const url = process.env.REDBLUE_URL ?? 'https://just.m-br.ru/redblue/';
const desktop = { width: 1442, height: 1026 };
const mobile = { width: 390, height: 844 };

async function check(viewport) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  const failures = [];
  page.on('response', (response) => {
    if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  const data = await page.evaluate(() => {
    const getBox = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x: Math.round(x), y: Math.round(y), width: Math.round(width), height: Math.round(height) };
    };
    const master = document.querySelector('.hero-master');
    return {
      title: document.querySelector('.hero h1')?.textContent?.trim(),
      hero: getBox('.hero'),
      master: getBox('.hero-master'),
      masterLoaded: master instanceof HTMLImageElement && master.complete && master.naturalWidth > 0,
      masterSrc: master instanceof HTMLImageElement ? master.currentSrc : '',
      flag: getBox('.hero-flag'),
      ice: getBox('.hero-ice'),
      legacyScenePresent: Boolean(document.querySelector('.hero-ocean, .hero-scene, .iceberg, .ribbon')),
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      imagesLoaded: [...document.images].every((image) => image.complete && image.naturalWidth > 0),
      mobileMenu: Boolean(document.querySelector('.menu-button') && getComputedStyle(document.querySelector('.menu-button')).display !== 'none'),
    };
  });
  await page.screenshot({ path: `/tmp/redblue-hero-${viewport.width}.png`, fullPage: false });
  await browser.close();
  return { viewport, data, failures };
}

(async () => {
  const results = await Promise.all([check(desktop), check(mobile)]);
  const desktopResult = results[0];
  const mobileResult = results[1];
  const desktopOk = desktopResult.data.title === 'English'
    && desktopResult.data.hero?.height === 1026
    && desktopResult.data.masterLoaded
    && desktopResult.data.masterSrc.includes('/redblue/assets/source/img_d84cb49df496.png')
    && desktopResult.data.flag?.width === 149
    && desktopResult.data.ice?.width === 325
    && !desktopResult.data.legacyScenePresent
    && !desktopResult.data.overflow
    && desktopResult.data.imagesLoaded
    && desktopResult.failures.length === 0;
  const mobileOk = mobileResult.data.masterLoaded
    && !mobileResult.data.overflow
    && mobileResult.data.imagesLoaded
    && mobileResult.data.mobileMenu
    && mobileResult.failures.length === 0;
  const report = { url, desktop: desktopResult, mobile: mobileResult, passed: desktopOk && mobileOk };
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.passed ? 0 : 1);
})().catch((error) => { console.error(error); process.exit(1); });
