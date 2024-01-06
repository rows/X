export async function getCurrentTab() {
    const tabs = await chrome.tabs.query({
        active: true,
    });

    return tabs[0];
}

export async function scrapHTMLTables() {
    function toArray (table: any)  {
        const data : any = []

        for (let i = 0; i < table.length; i++) {
            const tr : any = table[i]

            for (let j = 0; j < tr.length; j++) {
                const td = tr[j]

                for (let c = 0; c < td.colspan; c++) {
                    if (!data[i]) data[i] = []

                    data[i].push({ ...td, colspan: 1 })
                }
            }
        }

        for (let i = 0; i < data.length; i++) {
            const tr : any = data[i]
            for (let j = 0; j < tr.length; j++) {
                const td = tr[j]
                for (let r = 1; r < td.rowspan; r++) {
                    if (!data[i + r]) data[i + r] = []
                    data[i + r].splice(j, 0, { ...td, rowspan: 1 })
                }
            }
        }

        return data.map((a : any) => a.map((a : any) => a.value))
    }

    const titles: string[] = [];

    const tableElements = Array.from(document.querySelectorAll('table'));

    const rowSelector = 'tr';
    const colSelector = 'td,th';

    const tables = tableElements.map((tableElement: any) => {

        let title = tableElement.previousElementSibling? tableElement.previousElementSibling.innerText.trim() : '';
        let scrapElement = tableElement;

        while  (title === '' || title.startsWith('.')) {
            const titleElement = scrapElement.querySelector('caption,h6,h5,h4,h3,h2,h1,title')

            if (titleElement) {
                title = titleElement.innerText.replaceAll('\n', ' ').trim();
            }

            scrapElement = scrapElement.parentElement;
        }

        titles.push(title.replace('[edit]', ''));

        return Array.from(tableElement.querySelectorAll(rowSelector)).map((tr: any) => {
            if (!tr) {
                return [];
            }

            return Array.from(tr.querySelectorAll(colSelector)).map((td: any) => {
                if (!td) {
                    return { value: '', colspan: 1, rowspan: 1 };
                }

                const rowspan = +(td.getAttribute('rowspan') || 1) || 1;
                const colspan = +(td.getAttribute('colspan') || 1) || 1;

                const value = td.innerText || '';


                return { value: value.replaceAll('\n', ' ').replaceAll('\t', ' ').trim(), colspan, rowspan };
            });
        })
    });


    return tables.map((table: any, index: number) => ({ title: titles[index], table: toArray(table) }));
}

export async function runScrapper(options: any) {
    const tab = await getCurrentTab();

    let computation = [];

    if (!options) {
        computation = await chrome.scripting.executeScript({
            target: { tabId: tab.id! },
            func: scrapHTMLTables
        });
    } else {
        computation = await chrome.scripting.executeScript({
            target: { tabId: tab.id! },
            args: [options],
            func: (options) => {
                // parser functions
                function getText(element: any, query: string) {
                    const elem = element.querySelector(query);

                    return elem?.innerText?.replaceAll('\n', ' ')?.trim() ?? '';
                }

                function getImageSrc(element: any, query: string) {
                    const elem = element.querySelector(query);

                    return elem ? elem.src : '';
                }

                function getLink(element: any, query: any) {
                    const elem = element.querySelector(query);

                    return elem ? elem.href : '';
                }

                function getCleanUrl(element: any, query: string) {
                    const elem = element.querySelector(query);

                    if (!elem) {
                        return '';
                    }

                    const url = new URL(elem.href);
                    return url.origin + url.pathname
                }

                function parse(element: any, query: string, type: string) {
                    switch (type) {
                        case 'text':
                            return getText(element, query);
                        case 'image':
                            return getImageSrc(element, query);
                        case 'clean-url':
                            return getCleanUrl(element, query);
                        case 'link':
                            return getLink(element, query);
                        default:
                            return '';
                    }
                }

                const tableElements = Array.from(document.querySelectorAll(options.listElementsQuery))
                    .map((element) => {
                        return options.elementParser
                            .map((parserInfo: any) => parse(element, parserInfo.query, parserInfo.type))
                    });

                return [{
                    title: options.header,
                    table: [
                        [...options.elementParser.map((element: any) => element.title )],
                        ...tableElements
                    ]
                }];
            }
        });
    }

    return computation[0].result ?? [];
}
