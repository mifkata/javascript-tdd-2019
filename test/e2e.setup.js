const path = require('path');
const { expect } = require('chai');
const puppeteer = require('puppeteer');
const { screenshots } = require('config');

global.expect = expect;

const saveScreenshot = async (prefix = 'error') => {
  const screenshot = `${prefix}_${new Date.toJSON()}.png`;
  await page.screenshot({
    path: path.resolve(screenshots, screenshot)
  });
}

before(async () => {
  global.browser = await puppeteer.launch();
  return true;
});

beforeEach(async () => {
  global.page = await browser.newPage();
  page.on('pageerror', async error => {
    console.error('Page Error:', page.url());
    console.error(error);
    await saveScreenshot('error_page');
  });
  return true;
});

after(async () => browser.close());

afterEach(async function() {
  if(this.currentTest.state === 'failed') {
    await saveScreenshot('error_test');
  }

  return page.close();
});
