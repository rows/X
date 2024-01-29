import { getCurrentTab, runScrapper, ScrapperOptions } from './utils/chrome';
import scrapperOptions from './scrappers';

function getScrapperOptionsByUrl(url: string, title: string): ScrapperOptions | null {
  let options;

  if (url.includes('tiktok.com/search/user')) {
    options = scrapperOptions.tiktokAccounts;
  } else if (url.includes('tiktok.com/search/video')) {
    options = scrapperOptions.tiktokSearch;
  } else if (url.includes('bpinet.bancobpi.pt/BPINet_Contas/Movimentos.aspx')) {
    options = scrapperOptions.bpi;
  } else if (url.includes('g2.com/')) {
    if (url.includes('/search')) {
      options = scrapperOptions.g2SearchOptions;
    } else if (url.includes('/reviews')) {
      options = scrapperOptions.g2ReviewsOptions;
    }
  } else if (url.includes('ycombinator.com/companies')) {
    options = scrapperOptions.ycombinator;
  } else if (url.includes('linkedin.com')) {
    if (url.includes('search/results') || url.includes('mynetwork')) {
      options = scrapperOptions.linkedin;
    } else if (url.includes('jobs/')) {
      options = scrapperOptions.linkedinJobs;
    }
  } else if (url.includes('idealista.')) {
    options = scrapperOptions.idealista;
  } else if (url.includes('deliveroo') && url.includes('/restaurants/')) {
    options = scrapperOptions.deliveroo;
  } else if (
    url.includes('youtube') &&
    (url.includes('/results') || url.includes('feed/history'))
  ) {
    options = scrapperOptions.youtubeOptions;
  } else if (url.includes('amazon') && url.includes('/s?k')) {
    options = scrapperOptions.amazon;
  } else if (url.includes('producthunt.com')) {
    options = scrapperOptions.productHuntOptions;
  } else if (
    url.includes('https://my.pitchbook.com/search-results') &&
    (url.includes('deals') || url.includes('companies') || url.includes('investors'))
  ) {
    options = scrapperOptions.pitchbook;
  } else if (url.includes('finance.yahoo.com/quote/') && url.includes('financials')) {
    options = scrapperOptions.yahooFinance;
  } else if (url.includes('www.netflix.com/browse')) {
    options = scrapperOptions.netflix;
  } else if (url.includes('yellowpages.com/search')) {
    options = scrapperOptions.yellowPages;
  } else if (url.includes('yelp.') && url.includes('/search')) {
    options = scrapperOptions.yelp;
  } else if (
    url.includes('zillow.com') &&
    (url.includes('/homes') || url.includes('/for_') || url.includes('?search'))
  ) {
    options = scrapperOptions.zillow;
  } else if (url.includes('ebay.com/sch/')) {
    options = scrapperOptions.ebay;
  } else if (url.includes('google.com/maps/search')) {
    options = scrapperOptions.googleMapsSearchOptions;
  } else if (url.includes('kuantokusta.')) {
    if (url.includes('/p/')) {
      options = scrapperOptions.kuantoKustaProductOptions;
    }
    options = scrapperOptions.kuantoKustaOptions;
  } else if (url.includes('autotrader.com')) {
    options = scrapperOptions.autotraderOptions;
  } else if (url.includes('redfin.com')) {
    options = scrapperOptions.redfin;
  } else if (url.includes('craigslist.org')) {
    options = scrapperOptions.craigslist;
  } else if (url.includes('x.com') || url.includes('twitter.com')) {
    options = scrapperOptions.twitter;
  } else if (url.includes('imovirtual.')) {
    options = scrapperOptions.imovirtual;
  } else if (url.includes('trulia.')) {
    options = scrapperOptions.trulia;
  } else if (url.includes('immobiliare.')) {
    options = scrapperOptions.immobiliare;
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
