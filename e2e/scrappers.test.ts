import { readdirSync, promises as fs } from 'fs';
import { resolve } from 'path';
import * as yaml from 'js-yaml';

function listDirectories(path: string) {
  const directories = readdirSync(path, { withFileTypes: true })
    .filter((dir) => dir.isDirectory() && dir.name !== '__snapshots__')
    .map((dir) => dir.name);

  return directories;
}

async function getExtensionId() {
  const workerTarget = await browser.waitForTarget((target) => target.type() === 'service_worker', {
    timeout: 3000,
  });

  const urlRegex = /chrome-extension:\/\/(?<id>[a-z]+)/;
  const match = urlRegex.exec(workerTarget.url());

  if (!match || !match.groups) {
    throw new Error('Extension URL does not match expected format');
  }

  return match.groups.id;
}

describe('RowsX - scrappers tests', () => {
  const tests = listDirectories(__dirname);
  let extensionId = '';

  beforeAll(async () => {
    extensionId = await getExtensionId();
  });

  it.each(tests)('Scrapping - %s', async (domain) => {
    // 1) get info about the e2e test
    const specData = await fs.readFile(resolve(__dirname, `./${domain}/test.yml`));
    const spec = yaml.load(specData.toString()) as { url: string; result: string };
    const extensionUrl = `chrome-extension://${extensionId}/index.html`;
    const data = await fs.readFile(resolve(__dirname, `./${domain}/index.html`));

    // 2) open website to scrap
    const appPage = await browser.newPage();
    const extensionPage = await browser.newPage();

    // 3) mock the requests
    await appPage.setRequestInterception(true);

    appPage.on('request', async (request) => {
      if (request.resourceType() === 'document') {
        request.respond({ status: 200, contentType: 'text/html', body: data.toString() });
      } else {
        request.abort();
      }
    });

    await appPage.bringToFront();
    await appPage.goto(spec.url, { waitUntil: 'domcontentloaded' });
    await extensionPage.goto(extensionUrl, { waitUntil: 'domcontentloaded' });
    await appPage.waitForTimeout(500);
    await extensionPage.bringToFront();
    const button = await extensionPage.waitForSelector('.copy-btn');
    await button.click();
    await appPage.bringToFront();

    const context = await browser.defaultBrowserContext();
    await context.overridePermissions(spec.url, ['clipboard-read']);
    const clipboard = await appPage.evaluate(() => navigator.clipboard.readText());

    // close pages
    await appPage.close();

    expect(clipboard.trimEnd()).toMatchSnapshot();
  });
});
