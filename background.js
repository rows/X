function toArray (table)  {
  const data = []

  for (let i = 0; i < table.length; i++) {
    const tr = table[i]

    for (let j = 0; j < tr.length; j++) {
      const td = tr[j]

      for (let c = 0; c < td.colspan; c++) {
        if (!data[i]) data[i] = []

        data[i].push({ ...td, colspan: 1 })
      }
    }
  }

  for (let i = 0; i < data.length; i++) {
    const tr = data[i]
    for (let j = 0; j < tr.length; j++) {
      const td = tr[j]
      for (let r = 1; r < td.rowspan; r++) {
        if (!data[i + r]) data[i + r] = []
        data[i + r].splice(j, 0, { ...td, rowspan: 1 })
      }
    }
  }

  return data.map((a) => a.map((a) => a.value))
}

function parseHTMLTableElem() {
  const tables = Array.from(document.querySelectorAll('table'));

  const rowSelector = 'tr';
  const colSelector = 'td,th';

  return tables.map(table => {
    return Array.from(table.querySelectorAll(rowSelector)).map((tr) => {
      if (!tr) return []
      return Array.from(tr.querySelectorAll(colSelector)).map((td) => {
        if (!td) return {value: '', colspan: 1, rowspan: 1}

        const rowspan = +(td.getAttribute('rowspan') || 1) || 1
        const colspan = +(td.getAttribute('colspan') || 1) || 1

        const value = td.innerText || '';


        return {value: value.replaceAll('\n', ' ').replaceAll('\t', ' ').trim(), colspan, rowspan}
      });
    })
  });
}

async function getCurrentTab() {
    const tabs = await chrome.tabs.query({
        active: true,
    });

    return tabs[0];
}

async function getTableElements(tabId) {
    const result = await chrome.scripting.executeScript({
      target: { tabId },
      function: parseHTMLTableElem
    });

    if ( result[0].length <= 0) {
      return [];
    }

    return result[0].result;
}

async function scrap() {
    const tab = await getCurrentTab();

    const tables = await getTableElements(tab.id);

    return tables.map(toArray);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'rows-scrapper:start') {
     scrap().then((data) => {
       sendResponse(data)
     });
    }

    return true; // return true to indicate you want to send a response asynchronously
})
