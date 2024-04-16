/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {ERROR_MESSAGES, ErrorCodes} from "./error-codes";
import { getCurrentTab, runScrapper } from './utils/chrome';
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
      chrome.tabs.create({ url: 'https://rows.com/new' }, (tab) => {
        return storeRowsXData(message.data, tab.id!);
      });
      break;
    default:
      break;
  }

  return true; // return true to indicate you want to send a response asynchronously
});
