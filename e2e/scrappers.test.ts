import { readdirSync, promises as fs } from 'fs';
import { resolve } from 'path';

const extensionId = 'phpjngkjjocinjepokdimcomfmgkogbe';
const extensionUrl = `chrome-extension://${extensionId}/index.html`;

function listDirectories(path: string) {
  const directories = readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dir) => dir.name);

  return directories;
}

describe('RowsX - scrappers tests', () => {
  const tests = listDirectories(__dirname);

  it.each(tests)('Scrapping - %s', async (domain) => {
    const appPage = await browser.newPage();
    const data = await fs.readFile(resolve(__dirname, `./${domain}/index.html`));

    await appPage.setRequestInterception(true);

    appPage.on('request', async (request) => {
      if (request.url().endsWith('/')) {
        request.respond({ status: 200, contentType: 'text/html', body: data });
      } else {
        request.continue();
      }
    });

    const extensionPage = await browser.newPage();
    await appPage.bringToFront();
    await appPage.goto(`https://${domain}`, { waitUntil: 'domcontentloaded' });
    await extensionPage.goto(extensionUrl, { waitUntil: 'domcontentloaded' });
    await appPage.waitForTimeout(1000);
    await extensionPage.bringToFront();
    const button = await extensionPage.waitForSelector('.copy-btn');
    await button.click();
    await appPage.bringToFront();

    const context = await browser.defaultBrowserContext();
    await context.overridePermissions(`https://${domain}`, ['clipboard-read']);
    const clipboard = await appPage.evaluate(() => navigator.clipboard.readText());
    await appPage.close();
    const result = await fs.readFile(resolve(__dirname, `./${domain}/result.tsv`));
    expect(clipboard).toBe(result.toString().trimEnd());
  });
});
