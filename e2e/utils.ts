import * as puppeteer from 'puppeteer';

/**
 * Gets an extension ID from a URL.
 *
 * @param url URL to match against.
 * @returns Extension ID.
 * @throws If URL is not expected format.
 */
export function getExtensionId(url: string) {
  const urlRegex = /chrome-extension:\/\/(?<id>[a-z]+)/;
  const match = urlRegex.exec(url);

  if (!match || !match.groups) {
    throw new Error('Extension URL does not match expected format');
  }

  return match.groups.id;
}

/**
 * Waits for an extension worker to load. If omitted, returns the first
 * worker to load without checking the ID.
 *
 * @param browser Browser to wait for background page in.
 * @param id ID of extension. Returns first extension to load if omitted.
 */
export async function waitForExtensionWorker(
  browser,
  id?: string
) {
  const idMatches = (target: puppeteer.Target) => (id ? getExtensionId(target.url()) === id : true);

  // See https://pptr.dev/guides/chrome-extensions
  const workerTarget = await browser.waitForTarget(
    (target) => target.type() === 'service_worker' && idMatches(target)
  );

  return workerTarget.worker();
}

/**
 * Attempts to open the browser popup.
 *
 * @param browser Browser to open the popup in.
 * @param background Background page of the extension.
 * @param path Path to open.
 *
 * @returns Page representing the popup context.
 */
export async function openPopup(
  browser,
  worker,
  path: string
): Promise<puppeteer.Page> {
  const extensionId = getExtensionId(worker.url());
  await worker.evaluate('chrome.action.openPopup();');

  const popup = await browser.waitForTarget(
    (target) =>
      target.type() === 'page' && target.url() === `chrome-extension://${extensionId}${path}`
  );

  // We specified that we wanted a page in our condition above but what we
  // get back is not actually a page. This is due to a type mismatch caused by
  // an implementation detail in Chromium (https://crbug.com/1515626)
  return popup.asPage();
}
