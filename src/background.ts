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

    if (url.includes('idealista.pt/comprar-')) {
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
