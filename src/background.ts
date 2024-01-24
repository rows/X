/// <reference types="@modyfi/vite-plugin-yaml/modules" />
import { getCurrentTab, runScrapper, ScrapperOptions } from './utils/chrome';

import youtubeOptions from './scrappers/youtube.yml';
import kuantoKustaOptions from './scrappers/kuanto-kusta.yml';
import autotraderOptions from './scrappers/autotrader.yml';
import g2ReviewsOptions from './scrappers/g2-reviews.yml';
import g2SearchOptions from './scrappers/g2-search.yml';

function getScrapperOptionsByUrl(url: string, title: string): ScrapperOptions | null {
  // TikTok - Accounts - Search Results
  if (url.includes('tiktok.com/search/user')) {
    return {
      header: 'TikTok Search Results',
      listElementsQuery: '[class*="DivPanelContainer"] > [class*="-DivLink"]',
      elementParser: [
        { title: 'Avatar', query: '[class*="-ImgAvatar"]', type: 'image' },
        { title: 'Name', query: '[class*="-PTitle"]', type: 'text' },
        {
          title: 'Followers count',
          query: '[class*="-DivSubTitleWrapper"] > span',
          type: 'text',
        },
        { title: 'Description', query: '[class*="-PDesc"]', type: 'text' },
      ],
    };
  }

  // TikTok - Top - Search results or TikTok - Videos - Search Results
  if (url.includes('tiktok.com/search') || url.includes('tiktok.com/search/video')) {
    return {
      header: 'TikTok Search Results',
      listElementsQuery: '[class*="-DivItemContainerForSearch"]',
      elementParser: [
        { title: 'Url', query: '[class*="-DivWrapper"] > a', type: 'link' },
        { title: 'Description', query: '[class*="-SpanText"]', type: 'text' },
        { title: 'Author', query: '[class*="-PUniqueId"]', type: 'text' },
        {
          title: 'Views count',
          query: '[class*="-StrongVideoCount"]',
          type: 'text',
        },
      ],
    };
  }

  if (url.includes('bpinet.bancobpi.pt/BPINet_Contas/Movimentos.aspx')) {
    return {
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
  }

  if (url.includes('g2.com/')) {
    if (url.includes('/search')) {
      return g2SearchOptions;
    } else if (url.includes('/reviews')) {
      return g2ReviewsOptions;
    }
  }

  if (url.includes('ycombinator.com/companies')) {
    return {
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
  }

  if (url.includes('linkedin.com') && url.includes('search')) {
    return {
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
  }

  if (url.includes('idealista.')) {
    return {
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
  }

  if (url.includes('deliveroo') && url.includes('/restaurants/')) {
    return {
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
  }

  if (url.includes('youtube') && url.includes('/results')) {
    return youtubeOptions;
  }

  if (url.includes('amazon') && url.includes('/s?k')) {
    return {
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
  }

  if (url.includes('producthunt.com')) {
    return {
      header: 'ProductHunt results',
      listElementsQuery:
        '[class*="styles_item_"][data-test*="post-item-"],[class*="styles_item_"][data-test*="ad-slot"],[class*="styles_item_"][data-test*="product-"]',
      elementParser: [
        { title: 'Product image', query: 'img,video', type: 'image' },
        {
          title: 'Product name',
          query:
            '[data-test*="post-name"], a[href*="/products"] div:nth-child(1), [class*="titleTaglineItem"]',
          type: 'text',
        },
        {
          title: 'Description',
          query:
            '[class*="styles_tagline"], a[href*="/products"] div:nth-child(2), [class*="_extraInfo"], [class*="styles_adMeta"]',
          type: 'text',
        },
        { title: 'Up votes', query: '[data-test="vote-button"]', type: 'text' },
        {
          title: 'Product hunt link',
          query: 'a[data-test*="post-name"], a[href*="/products"]',
          type: 'link',
        },
      ],
    };
  }

  if (
    url.includes('https://my.pitchbook.com/search-results') &&
    (url.includes('deals') || url.includes('companies') || url.includes('investors'))
  ) {
    return {
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
  }

  if (url.includes('finance.yahoo.com/quote/') && url.includes('financials')) {
    return {
      parseTables: {
        header: title,
        tables: [
          { rows: '[class*="(tbhg)"]>[class*="(tbr)"]', cols: 'div > span' },
          { rows: '[class*="(tbr)"]', cols: '[data-test="fin-col"], [title]' },
        ],
        mergeTablesBy: 'row',
      },
    };
  }

  if (url.includes('www.netflix.com/browse')) {
    return {
      header: 'Netflix browse results',
      listElementsQuery: '.title-card',
      elementParser: [
        { title: 'Cover', query: 'img', type: 'image' },
        { title: 'Title', query: '.fallback-text', type: 'text' },
        { title: 'Link', query: 'a', type: 'clean-url' },
      ],
    };
  }

  if (url.includes('yellowpages.com/search')) {
    return {
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
  }

  if (url.includes('yelp.com/search')) {
    return {
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
  }

  if (url.includes('zillow.com') && (url.includes('/for_') || url.includes('?search'))) {
    return {
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
  }

  if (url.includes('ebay.com/sch/')) {
    return {
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
  }

  if (url.includes('google.com/maps/search')) {
    return {
      header: title,
      listElementsQuery: '[role="feed"] [jsaction*="mouseover"]',
      elementParser: [
        { title: 'Image', query: 'img', type: 'image' },
        {
          title: 'Name',
          query: 'a',
          type: 'get-attribute',
          attribute: 'aria-label',
        },
        {
          title: 'Rating',
          query: 'span[role="img"]',
          type: 'get-attribute',
          attribute: 'aria-label',
        },
        { title: 'Link', query: 'a', type: 'clean-url' },
      ],
    };
  }

  if (url.includes('kuantokusta.')) {
    return kuantoKustaOptions;
  }

  if (url.includes('autotrader.')) {
    return autotraderOptions;
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
