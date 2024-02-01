import { getCurrentTab, getDomainName, runScrapper, ScrapperOptions } from './utils/chrome';
import scrapperOptions from './scrappers';

function urlMatchesPatternUrl(url: string, patternURL: string) {
  if (!patternURL) {
    return false;
  }
  // @ts-ignore
  const pattern = new URLPattern(patternURL);

  return pattern.test(url);
}

function getScrapperOptionsByUrl(url: string, title: string): ScrapperOptions | null {
  let options;

  const domain = getDomainName(url);

  if (domain && scrapperOptions.has(domain)) {
    const scrappers = scrapperOptions.get(domain)!;

    const scrapper = scrappers.find((scrapper) => {
      if (Array.isArray(scrapper.url)) {
        return scrapper.url.some((scrapperURL: string) => urlMatchesPatternUrl(url, scrapperURL));
      } else {
        return urlMatchesPatternUrl(url, scrapper.url);
      }
    });

    options = scrapper;
  }

  if (options) {
    if (!options.header) {
      return {
        header: title,
        ...options,
      };
    }

    return options;
  }

  return null;
}

async function scrap() {
  const tab = await getCurrentTab();
  const options = getScrapperOptionsByUrl(tab.url!, tab.title!);

  return await runScrapper(options);
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
