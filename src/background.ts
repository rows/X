/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ERROR_MESSAGES, ErrorCodes } from './error-codes';
import { getCurrentTab, runScrapper } from './utils/chrome';
import { reportUsage } from './utils/rows-api/report';
import { getScrapperOptionsByUrl } from './utils/scrapperUtils';

async function scrap() {
  const tab = await getCurrentTab();

  if (!tab || !tab.url || !tab.title) {
    return;
  }

  if (tab.url.includes('chrome://')) {
    return {
      code: ErrorCodes.GOOGLE_CHROME_INTERNAL_PAGES,
      message: ERROR_MESSAGES.get(ErrorCodes.GOOGLE_CHROME_INTERNAL_PAGES)
    };
  }

  const options = getScrapperOptionsByUrl(tab.url, tab.title);

  return await runScrapper(tab, options);
}

async function openInRows(message: { data: string; }) {
  const tab = await getCurrentTab();

  if (!tab || !tab.url || !tab.title) {
    return;
  }

  const tabUrl = tab.url;

  chrome.tabs.create({ url: 'https://rows.com/new' }, (tab) => {
    return storeRowsXData(message.data, tab.id!).then(() => reportUsage({ action: 'open_in_Rows', url: tabUrl }));
  });
}

async function storeRowsXData(tsv: string, tabId: number) {
  await chrome.scripting.executeScript({
    target: { tabId },
    args: [tsv],
    func: (tsv) => {
      window.localStorage.setItem('rows_x', JSON.stringify({ source: '%ROWS_X%', data: tsv }));
    },
  });
}

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  switch (message.action) {
    case 'rows-x:scrap':
      scrap().then((data) => sendResponse(data));
      break;
    case 'rows-x:store':
      openInRows(message);
      break;
    default:
      break;
  }

  return true; // return true to indicate you want to send a response asynchronously
});

// Listener when the extension is uninstalled
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    const uninstall_form_link = 'https://rows.com/share/uninstall-survey-1N9rGowAFzUfdRn4BLihHnOb6qUq1pdLRfHSEEHa9eoE';
    chrome.runtime.setUninstallURL(uninstall_form_link);
  }
});
