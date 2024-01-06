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

    if (url.includes('linkedin.com/search')) {
        return {
            header: 'Linkedin search results',
            listElementsQuery: '.reusable-search__entity-result-list > li',
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
