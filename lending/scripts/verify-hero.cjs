/* Reproducible local check for the responsive RED & BLUE hero. */
const { chromium } = require('playwright');

const url = process.env.REDBLUE_URL ?? 'http://127.0.0.1:4174/redblue/';
const viewports = [
  { name: 'desktop', width: 1442, height: 1600 },
  { name: 'mobile', width: 390, height: 1500 },
];
const requiredLabels = ['Точка А', 'Нет барьеру!', 'Полезная лексика', 'Новые знакомства', 'Умение вести диалог', 'Точка Б'];

async function check(viewport) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  const failures = [];
  page.on('response', (response) => {
    if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(url, { waitUntil: 'networkidle' });
  const data = await page.evaluate((labels) => {
    const box = (element) => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x, y, width, height, bottom: y + height };
    };
    const visible = (element) => {
      const rect = box(element);
      const style = getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const scene = document.querySelector('.iceberg-scene');
    const art = document.querySelector('.iceberg-art');
    const route = document.querySelector('.route-line path');
    const hero = document.querySelector('.hero');
    const nextSection = document.querySelector('.intro-section');
    const cards = [...document.querySelectorAll('.route-point, .route-card')];
    const labelsFound = labels.every((label) => cards.some((card) => card.textContent?.trim() === label && visible(card)));
    const sceneBox = scene ? box(scene) : null;
    const heroBox = hero ? box(hero) : null;
    const nextBox = nextSection ? box(nextSection) : null;
    const routeStyle = route ? getComputedStyle(route) : null;
    const cardsInsideScene = sceneBox && cards.every((card) => {
      const rect = box(card);
      return rect.x >= sceneBox.x && rect.bottom <= sceneBox.bottom && rect.y >= sceneBox.y && rect.x + rect.width <= sceneBox.x + sceneBox.width;
    });
    const cardsInsideHero = heroBox && cards.every((card) => {
      const rect = box(card);
      return rect.y >= heroBox.y && rect.bottom <= heroBox.bottom;
    });
    const cardsBeforeNextSection = nextBox && cards.every((card) => box(card).bottom <= nextBox.y);
    return {
      title: document.querySelector('.hero h1')?.textContent?.trim(),
      artLoaded: art instanceof HTMLImageElement && art.complete && art.naturalWidth > 0,
      routePresent: Boolean(route),
      solidRoute: routeStyle?.strokeDasharray === 'none',
      labelsFound,
      cardsInsideScene,
      cardsInsideHero,
      cardsBeforeNextSection,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      imagesLoaded: [...document.images].every((image) => image.complete && image.naturalWidth > 0),
    };
  }, requiredLabels);
  await page.screenshot({ path: `/tmp/redblue-hero-${viewport.name}.png`, fullPage: false });
  await browser.close();
  return { viewport, data, failures };
}

(async () => {
  const results = await Promise.all(viewports.map(check));
  const passed = results.every(({ data, failures }) => (
    data.title === 'English'
    && data.artLoaded
    && data.routePresent
    && data.solidRoute
    && data.labelsFound
    && data.cardsInsideScene
    && data.cardsInsideHero
    && data.cardsBeforeNextSection
    && !data.overflow
    && data.imagesLoaded
    && failures.length === 0
  ));
  console.log(JSON.stringify({ url, results, passed }, null, 2));
  process.exit(passed ? 0 : 1);
})().catch((error) => { console.error(error); process.exit(1); });
