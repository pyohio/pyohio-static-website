import { chromium } from 'playwright';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const inputPath = resolve(__dirname, 'og-preview.html');
const outputPath = resolve(__dirname, '_static/img/og-image.png');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${inputPath}`);
const frame = page.locator('.og-frame');
await frame.screenshot({ path: outputPath });
await browser.close();
console.log(`Saved to ${outputPath}`);
