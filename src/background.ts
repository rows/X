import {getCurrentTab, runScrapper} from './utils/chrome';

function getScrapperOptionsByUrl(url: string) {
    if (url.includes('ycombinator.com/companies')) {
        return {
            header: 'YCombinator results',
            listElementsQuery: '[class*="_results_"] > a[class*="_company_"]',
            elementParser: [
                { title: 'Logo', query: 'img', type: 'image' },
                { title: 'Description', query: '[class*="_coDescription_"]', type: 'text' },
                { title: 'Company name', query: '[class*="_coName_"]', type: 'text' },
                { title: 'Location', query: '[class*="_coLocation_"]', type: 'text' },
            ]
        };
    }

    if (url.includes('linkedin.com') && url.includes('search')) {
        return {
            header: 'Linkedin search results',
            listElementsQuery: '[data-chameleon-result-urn*="urn:li:member:"]',
            elementParser: [
                { title: 'Avatar', query: 'img', type: 'image' },
                { title: 'Name', query: '.entity-result__title-text > .app-aware-link span[aria-hidden="true"]', type: 'text' },
                { title: 'Job', query: '.entity-result__primary-subtitle', type: 'text' },
                { title: 'Location', query: '.entity-result__secondary-subtitle', type: 'text' },
                { title: 'Profile url', query: '.entity-result__title-text > .app-aware-link', type: 'clean-url' },
            ]
        };
    }

    if (url.includes('idealista.pt') && url.includes('/comprar-')) {
        return {
            header: 'Idealista search results',
            listElementsQuery: '.item',
            elementParser: [
                { title: 'Home', query: '.item-link', type: 'text' },
                { title: 'Price', query: '.item-price', type: 'text' },
                { title: 'Typology', query: '.item-detail-char > .item-detail:nth-child(1)', type: 'text' },
                { title: 'Area', query: '.item-detail-char > .item-detail:nth-child(2)', type: 'text' },
                { title: 'Description', query: '.item-description', type: 'text' },
                { title: 'Link', query: '.item-link', type: 'link' }
            ]
        }
    }

    if (url.includes('deliveroo') && url.includes('/restaurants/')) {
        return {
            header: 'Deliveroo search results',
            listElementsQuery: 'a[class*="HomeFeedUICard-"]',
            elementParser: [
                { title: 'Restaurant', query: 'p', type: 'text' },
                { title: 'Description', type: 'get-attribute', attribute: 'aria-label' },
                { title: 'Rating', query: 'li:nth-child(2) > span:nth-child(3) > span', type: 'text' },
                { title: 'Delivery time', query: '[class*="Bubble-"]', type: 'text'},
                { title: 'Promotions', query: '[class*="BadgesOverlay-"]', type: 'text' },
                { title: 'Restaurant link', type: 'clean-url' }
            ]
        }
    }

    if (url.includes('youtube') && url.includes('/results')) {
        return {
            header: 'Youtube search results',
            listElementsQuery: 'ytd-video-renderer',
            elementParser: [
                { title: 'Video thumbnail', query: 'img', type: 'image' },
                { title: 'Video title', query: '#video-title', type: 'text' },
                { title: 'Video views', query: '#metadata-line > span', type: 'text' },
                { title: 'Video description', query: '.metadata-snippet-text', type: 'text' },
                { title: 'Video duration', query: '#time-status', type: 'text' },
                { title: 'Video URL', query: '#video-title', type: 'link' },
                { title: 'Channel', query: '.ytd-channel-name a', type: 'text' },
                { title: 'Channel URL', query: '.ytd-channel-name a', type: 'link' },
            ]
        }
    }

    if (url.includes('amazon') && url.includes('/s?k')) {
        return {
            header: 'Amazon search results',
            listElementsQuery: '[class*="sg-"][data-cel-widget*="search_result_"]',
            elementParser: [
                { title: 'Product image', query: 'img', type: 'image' },
                { title: 'Product name', query: '[data-cy="title-recipe"]', type: 'text' },
                { title: 'Price', query: '.a-price .a-offscreen', type: 'text' },
                { title: 'Rating', query: '.a-row.a-size-small > span', type: 'get-attribute', attribute: 'aria-label' },
                { title: 'Amazon link', query : '[data-cy="title-recipe"] a', type: 'link' },
            ]
        }
    }

    if (url.includes('producthunt.com')) {
        return {
            header: 'ProductHunt results',
            listElementsQuery: '[class*="styles_item_"]',
            elementParser: [
                { title: 'Product image', query: 'img,video', type: 'image' },
                { title: 'Product name', query: '[data-test*="post-name"], a[href*="/products"] div:nth-child(1)', type: 'text' },
                { title: 'Description', query: '[class*="styles_tagline"], a[href*="/products"] div:nth-child(2)', type: 'text' },
                { title: 'Up votes', query: '[data-test="vote-button"]', type: 'text' },
                { title: 'Product hunt link', query: 'a[data-test*="post-name"], a[href*="/products"]', type: 'link' },
            ]
        }
    }

    /*if (url.includes('file://')) { // Pitchbook
        return {
            header: 'PitchBook results',
            parseTables: {
                tables: [
                    { rows: '#search-results-data-table-left .data-table__row', cols: '.data-table__cell' },
                    { rows: '#search-results-data-table-right .data-table__row, #search-results-data-table-right .data-table__headers', cols: '.data-table__cell' },
                ],
                mergeTablesBy: 'column',
            },
        }
    }*/

    return null;
}

async function scrap() {
    const tab = await getCurrentTab();
    const options = getScrapperOptionsByUrl(tab.url!);

    const elements = await runScrapper(options);

    return elements;
}

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message === 'rows-x:scrap') {
        scrap().then((data) => sendResponse(data));
    }

    return true; // return true to indicate you want to send a response asynchronously
});