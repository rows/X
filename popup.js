
function array2tsv(data = []) {
    return `${data.map(row => row.map(col => col.startsWith('+') ? `='${col}'` : col).join('\t')).join('\n').toString().replaceAll('"','&#34')}`;
}


function array2table(header, data = []) {
    return `<div data-tsv="${array2tsv(data)}">
              <h1>${header}</h1>
              <div>${data.length}</div>
              <div class="table-preview">
                <table style="width:100%">${data.slice(0,5).map(row => `<tr>${row.map(col => `<td>${col}</td>`).join('')}</tr>`).join('')}</table>
              </div>
              <button>Copy</button>
            </div>`;
}

function copyToClipboard(evt) {
    const tsv = evt.currentTarget.parentNode.getAttribute('data-tsv');

    navigator.clipboard.writeText(JSON.stringify({ from: 'rows_extension', data: tsv.toString() })).then(() => {
        window.open('https://app-13038.app.qa-rows.com/new');
    });
}

(() => {
    chrome.runtime.sendMessage('rows-scrapper:start', (response) => {
        const element = document.querySelector('#preview');

        if (response.length <= 0) {
            element.innerHTML = `<div class="noResults">
                                    <b>No results</b>
                                    <p>We are sorry but we couldn't identify any list or table</p>
                                </div>`;
        } else {
            element.innerHTML = response.map(table => array2table('header', table)).join('');

            document.querySelectorAll('button').forEach(element => element.addEventListener('click', copyToClipboard))
        }

    });
})();
