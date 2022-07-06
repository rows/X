function getYCombinatorData() {
    const list = document.querySelectorAll('a.no-hovercard');

    const results = [];

   list.forEach((item) => {
    const items = item.querySelectorAll('.right div');
    results.push({
        logo: item.querySelector('img')?.src ?? '',
        company: items[0].querySelectorAll('span')[0].innerText ?? '',
        description: items[0].querySelectorAll('span')[1].innerText ?? '',
    });
   });

    return { headers: Object.keys(results[0]), items: results.map(result => Object.values(result)).flat(Infinity) };
}

function getLinkedinData() {
    const list = document.querySelectorAll('.search-results-container li .entity-result__item');
    const results = [];

   list.forEach((item) => {
    results.push({
        avatar: item.querySelector('img')?.src ?? ' N.A.',
        name: item.querySelector('.entity-result__title-line a span[aria-hidden="true"]')?.innerText ?? '',
        city: item.querySelector('.entity-result__secondary-subtitle')?.innerText ?? '',
        job:  item.querySelector('.entity-result__primary-subtitle')?.innerText  ?? '',
        profile: item.querySelector('.entity-result__title-line a')?.href ?? '',
    });
   });

    return { headers: Object.keys(results[0]), items: results.map(result => Object.values(result)).flat(Infinity) };
}

function getProductHuntData() {
    const list = document.querySelectorAll("[data-test^='post-item-']")
    const results = [];

   list.forEach((item) => {
    results.push({
        avatar: item.querySelector('img') ? item.querySelector('img')?.src : item.querySelector('video')?.poster ?? 'N.A.',
        company: item.querySelector("[data-test^='post-name-']")?.innerText ?? '',
        link: item.querySelector("[data-test^='post-name-']")?.href ?? '',
        description: item.querySelector("[data-test$='-tagline']")?.innerText ?? '',
        upvotes: item.querySelector("[data-test='vote-button']").innerText
    });
   });

   return { headers: Object.keys(results[0]), items: results.map(result => Object.values(result)).flat(Infinity) };
}

function parseHTMLTableElem(expectingHeaderRow) {
    const tableEl = document.querySelector('table');
	var columns = Array.from( tableEl.querySelectorAll( 'th' ) ).map( it => it.textContent );
	var rows = Array.from( tableEl.querySelectorAll( 'tbody > tr' ) );
	// must check for table that has no th cells, but only if we are told to "expectingHeaderRow"
	if ( columns.length == 0 && expectingHeaderRow ) {
		// get columns for a non-th'd table
		columns = Array.from( tableEl.querySelectorAll( 'tbody > tr' )[ 0 ].children ).map( it => it.textContent ? it.textContent : it.querySelector('img')?.src ?? '' )
		// must remove first row as it is the header
		rows.shift();
	}
	const returnJson = {
		'headers': columns,
		'rows': rows.map( row => {
			const cells = Array.from( row.querySelectorAll( 'td' ) )
			return columns.reduce( ( obj, col, idx ) => {
				obj[ col ] = cells[idx].textContent ? cells[idx].textContent.replace('+', '') : 'N.A.'
				return obj
			}, {} )
		} )
	};
	// if we were expecting a header row with th cells lets see if we got it
	// if we got nothing lets try looking for a regular table row as the header
	if ( !expectingHeaderRow && returnJson.headers.length == 0 && ( returnJson.rows[ 0 ] && Object.keys( returnJson.rows[ 0 ] ).length === 0 ) ) {
		return parseHTMLTableElem(true, tableEl);
	}

	return { headers: returnJson.headers, items: returnJson.rows.map(row => Object.values(row)).flat(Infinity) };
}

function parseFinancialTimes(expectingHeaderRow) {
    const tableEl = document.querySelector('.mod-ui-table');
	var columns = Array.from( tableEl.querySelectorAll( 'th' ) ).map( it => it.textContent );
	var rows = Array.from( tableEl.querySelectorAll( 'tbody > tr' ) );
	// must check for table that has no th cells, but only if we are told to "expectingHeaderRow"
	if ( columns.length == 0 && expectingHeaderRow ) {
		// get columns for a non-th'd table
		columns = Array.from( tableEl.querySelectorAll( 'tbody > tr' )[ 0 ].children ).map( it => it.textContent ? it.textContent : it.querySelector('img')?.src ?? '' )
		// must remove first row as it is the header
		rows.shift();
	}
	const returnJson = {
		'headers': columns,
		'rows': rows.map( row => {
			const cells = Array.from( row.querySelectorAll( 'td' ) )
			return columns.reduce( ( obj, col, idx ) => {
				obj[ col ] = cells[idx].textContent ? cells[idx].textContent.replace('+', '') : 'N.A.'
				return obj
			}, {} )
		} )
	};
	// if we were expecting a header row with th cells lets see if we got it
	// if we got nothing lets try looking for a regular table row as the header
	if ( !expectingHeaderRow && returnJson.headers.length == 0 && ( returnJson.rows[ 0 ] && Object.keys( returnJson.rows[ 0 ] ).length === 0 ) ) {
		return parseFinancialTimes(true, tableEl);
	}

	return { headers: returnJson.headers, items: returnJson.rows.map(row => Object.values(row)).flat(Infinity) };
}

async function getCurrentTab() {
    const tabs = await chrome.tabs.query({
        active: true,
    });

    return tabs[0];
}

function getNotionData() {
    const newTable = document.querySelector(".notion-table-view");    
    const results = { headers: [], items: [] };

    if (newTable) {
        const headers = Array.from(newTable.querySelectorAll('.notion-table-view-header-cell')).map(item => item.innerText);
        const items = Array.from(newTable.querySelectorAll('.notion-collection-item span')).map(item => item?.innerText ? item?.innerText : 'N.A.');

        return { headers, items }
    }
    
    return results;
}

function scrapWebsite(tabId, func, title, resolve) {
    chrome.scripting.executeScript({
        target: { tabId },
        function: func
    }, (data) => {
        resolve({ title: title, data: data[0].result });
    }); 
}

async function scrap() {
    const tab = await getCurrentTab();

    return new Promise((resolve) => {
        if(tab.url.includes('https://www.linkedin.com/search/results/')) {
            scrapWebsite(tab.id, getLinkedinData, 'Linkedin Search Result (template by Rows)', resolve);
        } else if (tab.url.includes('https://www.ycombinator.com/companies')) {
            scrapWebsite(tab.id, getYCombinatorData, 'YCombinator Startup Directory (template by Rows)', resolve);    
        } else if (tab.url.includes('https://www.producthunt.com')) {
            scrapWebsite(tab.id, getProductHuntData, 'Product Hunt (template by Rows)', resolve);
        } else if (tab.url.includes('notion.so')) {
            scrapWebsite(tab.id, getNotionData, 'Notion Tables (template by Rows)', resolve);
        } else if (tab.url.includes('ft.com')) {
            scrapWebsite(tab.id, parseFinancialTimes, `${tab.title} (parsed table)`, resolve);
        } else {
            scrapWebsite(tab.id, parseHTMLTableElem, `${tab.title} (parsed table)`, resolve);
        }
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'rows-scrapper:start') {
        scrap().then((data) => {
            sendResponse(data);
        });
    }

    return true; // return true to indicate you want to send a response asynchronously
});
