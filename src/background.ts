import { getCurrentTab, runScrapper, ScrapperOptions } from './utils/chrome';
import scrapperOptions from './scrappers';

function getScrapperOptionsByUrl(url: string, title: string): ScrapperOptions | null {
  let options;

  if (url.includes('tiktok.com/search/user')) {
    options = scrapperOptions.tiktokAccounts;
  } else if (url.includes('tiktok.com/search/video')) {
    options = scrapperOptions.tiktokSearch;
  } else if (url.includes('bpinet.bancobpi.pt/BPINet_Contas/Movimentos.aspx')) {
    options = {
      header: 'BPI Bank Account Transactions',
      listElementsQuery: '.TableRecords > tbody > tr',
      elementParser: [
        {
          title: 'Date Movement',
          query: 'td:nth-child(1) > span',
          type: 'text',
        },
        {
          title: 'Date Movement',
          query: 'td:nth-child(2) > div > span',
          type: 'text',
        },
        {
          title: 'Description',
          query: 'td:nth-child(3) > div > div:nth-child(2) > div > div:nth-child(2) > a',
          type: 'text',
        },
        { title: 'Value', query: 'td:nth-child(4) > div > span', type: 'text' },
        {
          title: 'Balance',
          query: 'td:nth-child(5) > div > span',
          type: 'text',
        },
      ],
    };
  } else if (url.includes('g2.com/')) {
    if (url.includes('/search')) {
      options = scrapperOptions.g2SearchOptions;
    } else if (url.includes('/reviews')) {
      options = scrapperOptions.g2ReviewsOptions;
    }
  } else if (url.includes('ycombinator.com/companies')) {
    options = {
      header: 'YCombinator results',
      listElementsQuery: '[class*="_results_"] > a[class*="_company_"]',
      elementParser: [
        { title: 'Logo', query: 'img', type: 'image' },
        {
          title: 'Description',
          query: '[class*="_coDescription_"]',
          type: 'text',
        },
        { title: 'Company name', query: '[class*="_coName_"]', type: 'text' },
        { title: 'Location', query: '[class*="_coLocation_"]', type: 'text' },
      ],
    };
  } else if (url.includes('linkedin.com') && url.includes('search')) {
    options = {
      header: 'Linkedin search results',
      listElementsQuery: '[data-chameleon-result-urn*="urn:li:member:"]',
      elementParser: [
        { title: 'Avatar', query: 'img', type: 'image' },
        {
          title: 'Name',
          query: '.entity-result__title-text > .app-aware-link span[aria-hidden="true"]',
          type: 'text',
        },
        {
          title: 'Job',
          query: '.entity-result__primary-subtitle',
          type: 'text',
        },
        {
          title: 'Location',
          query: '.entity-result__secondary-subtitle',
          type: 'text',
        },
        {
          title: 'Profile url',
          query: '.entity-result__title-text > .app-aware-link',
          type: 'clean-url',
        },
      ],
    };
  } else if (url.includes('idealista.')) {
    options = {
      header: 'Idealista search results',
      listElementsQuery: '.item',
      elementParser: [
        { title: 'Home', query: '.item-link', type: 'text' },
        { title: 'Price', query: '.item-price', type: 'text' },
        {
          title: 'Typology',
          query: '.item-detail-char > .item-detail:nth-child(1)',
          type: 'text',
        },
        {
          title: 'Area',
          query: '.item-detail-char > .item-detail:nth-child(2)',
          type: 'text',
        },
        { title: 'Description', query: '.item-description', type: 'text' },
        { title: 'Link', query: '.item-link', type: 'link' },
      ],
    };
  } else if (url.includes('deliveroo') && url.includes('/restaurants/')) {
    options = {
      header: 'Deliveroo search results',
      listElementsQuery: 'a[class*="HomeFeedUICard-"]',
      elementParser: [
        { title: 'Restaurant', query: 'p', type: 'text' },
        {
          title: 'Description',
          type: 'get-attribute',
          attribute: 'aria-label',
        },
        {
          title: 'Rating',
          query: 'li:nth-child(2) > span:nth-child(3) > span',
          type: 'text',
        },
        { title: 'Delivery time', query: '[class*="Bubble-"]', type: 'text' },
        {
          title: 'Promotions',
          query: '[class*="BadgesOverlay-"]',
          type: 'text',
        },
        { title: 'Restaurant link', type: 'clean-url' },
      ],
    };
  } else if (url.includes('youtube') && url.includes('/results')) {
    options = scrapperOptions.youtubeOptions;
  } else if (url.includes('amazon') && url.includes('/s?k')) {
    options = {
      header: 'Amazon search results',
      listElementsQuery: '[class*="sg-"][data-cel-widget*="search_result_"]',
      elementParser: [
        { title: 'Product image', query: 'img', type: 'image' },
        {
          title: 'Product name',
          query: '[data-cy="title-recipe"]',
          type: 'text',
        },
        { title: 'Price', query: '.a-price .a-offscreen', type: 'text' },
        {
          title: 'Rating',
          query: '.a-row.a-size-small > span',
          type: 'get-attribute',
          attribute: 'aria-label',
        },
        {
          title: 'Amazon link',
          query: '[data-cy="title-recipe"] a',
          type: 'link',
        },
      ],
    };
  } else if (url.includes('producthunt.com')) {
    options = scrapperOptions.productHuntOptions;
  } else if (
    url.includes('https://my.pitchbook.com/search-results') &&
    (url.includes('deals') || url.includes('companies') || url.includes('investors'))
  ) {
    options = {
      parseTables: {
        header: title,
        tables: [
          {
            rows: '#search-results-data-table-left .data-table__row',
            cols: '.data-table__cell',
          },
          {
            rows: '#search-results-data-table-right .data-table__row, #search-results-data-table-right .data-table__headers',
            cols: '.data-table__cell',
          },
        ],
        mergeTablesBy: 'column',
      },
    };
  } else if (url.includes('finance.yahoo.com/quote/') && url.includes('financials')) {
    options = {
      parseTables: {
        header: title,
        tables: [
          { rows: '[class*="(tbhg)"]>[class*="(tbr)"]', cols: 'div > span' },
          { rows: '[class*="(tbr)"]', cols: '[data-test="fin-col"], [title]' },
        ],
        mergeTablesBy: 'row',
      },
    };
  } else if (url.includes('www.netflix.com/browse')) {
    options = {
      header: 'Netflix browse results',
      listElementsQuery: '.title-card',
      elementParser: [
        { title: 'Cover', query: 'img', type: 'image' },
        { title: 'Title', query: '.fallback-text', type: 'text' },
        { title: 'Link', query: 'a', type: 'clean-url' },
      ],
    };
  } else if (url.includes('yellowpages.com/search')) {
    options = {
      header: title,
      listElementsQuery: '.result',
      elementParser: [
        { title: 'Logo', query: 'img', type: 'image' },
        { title: 'Name', query: '.business-name', type: 'text' },
        { title: 'Phone number', query: '.phone', type: 'text' },
        { title: 'Address', query: '.adr', type: 'text' },
        { title: 'Categories', query: '.categories', type: 'text' },
        { title: 'Website', query: '.track-visit-website', type: 'link' },
      ],
    };
  } else if (url.includes('yelp.com/search')) {
    options = {
      header: title,
      listElementsQuery: '[data-testid="serp-ia-card"]',
      elementParser: [
        { title: 'Image', query: 'img', type: 'image' },
        { title: 'Name', query: '[class*="businessName_"]', type: 'text' },
        {
          title: 'Rating',
          query: 'span[data-font-weight="semibold"]',
          type: 'text',
        },
        {
          title: 'Categories',
          query: '[class*="priceCategory"]',
          type: 'text',
        },
        {
          title: 'Yelp link',
          query: '[class*="businessName_"] a',
          type: 'clean-url',
        },
      ],
    };
  } else if (url.includes('zillow.com') && (url.includes('/for_') || url.includes('?search'))) {
    options = {
      header: title,
      listElementsQuery: '[data-test="property-card"]',
      elementParser: [
        { title: 'Image', query: 'img', type: 'image' },
        {
          title: 'Address',
          query: '[data-test="property-card-addr"]',
          type: 'text',
        },
        {
          title: 'Price',
          query: '[data-test="property-card-price"]',
          type: 'text',
        },
        {
          title: 'Bedrooms',
          query: 'ul[class*="StyledPropertyCardHomeDetailsList"] li:nth-child(1)',
          type: 'text',
        },
        {
          title: 'Bathrooms',
          query: 'ul[class*="StyledPropertyCardHomeDetailsList"] li:nth-child(2)',
          type: 'text',
        },
        {
          title: 'Area',
          query: 'ul[class*="StyledPropertyCardHomeDetailsList"] li:nth-child(3)',
          type: 'text',
        },
        {
          title: 'Zillow link',
          query: '[data-test="property-card-link"]',
          type: 'link',
        },
      ],
    };
  } else if (url.includes('ebay.com/sch/')) {
    options = {
      header: title,
      listElementsQuery: 'ul > [id*="item"]',
      elementParser: [
        { title: 'Image', query: 'img', type: 'image' },
        { title: 'Name', query: '.s-item__title', type: 'text' },
        { title: 'Price', query: '.s-item__price', type: 'text' },
        { title: 'State', query: '.s-item__subtitle', type: 'text' },
        { title: 'From', query: '.s-item__itemLocation', type: 'text' },
        {
          title: 'Seller info',
          query: '.s-item__seller-info-text',
          type: 'text',
        },
        {
          title: 'Product link',
          query: '.s-item__info > a',
          type: 'clean-url',
        },
      ],
    };
  } else if (url.includes('google.com/maps/search')) {
    options = scrapperOptions.googleMapsSearchOptions;
  } else if (url.includes('kuantokusta.')) {
    if (url.includes('/p/')) {
      options = scrapperOptions.kuantoKustaProductOptions;
    }
    options = scrapperOptions.kuantoKustaOptions;
  } else if (url.includes('autotrader.com')) {
    options = scrapperOptions.autotraderOptions;
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

  const elements = await runScrapper(options);

  return elements;
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
