function encodeInformation (info, hidden) {
    if (info.includes('.png') || info.includes('.gif') || info.includes('.jpg') || info.includes('.jpeg') || info.includes('/image/')) {
        return hidden ? `=IMAGE('${info}')` : `<img src="${info}" />`;
    } else if (info.includes('http://') || info.includes('https://')) {
        return hidden ? info : `<a href="${info}">${info}</a>`;
    }

    return info;
}

function copyElementToClipboard(element) {
    window.getSelection().removeAllRanges();
    let range = document.createRange();
    range.selectNode(typeof element === 'string' ? document.getElementById(element) : element);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  }

function json2table(headers, items, hidden = false) {
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const chunkSize = headers.length;
    const parsedItems = [];
       
    for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        
        const data = chunk.reduce((acc, curr, index) => {
            acc[headers[index]] = curr;
            return acc;
        }, {});

        parsedItems.push(data);
    }

    let headerRow = '';
    let bodyRows = '';    
  
  
    headers.map(function(col) {
      headerRow += '<th><strong>' + capitalizeFirstLetter(col) + '</strong></th>';
    });

    const data = hidden ? parsedItems : parsedItems.slice(0,6);

  
    data.map(function(row) {
      bodyRows += '<tr>';
  
      headers.map(function(header) {
        bodyRows += '<td>' + encodeInformation(row[header], hidden) + '</td>';
      })
  
      bodyRows += '</tr>';
    });
  
    return '<table id="table-'+ hidden +'"><thead><tr>' +
           headerRow +
           '</tr></thead><tbody>' +
           bodyRows +
           '</tbody></table>';
  }

(() => {
    chrome.runtime.sendMessage('rows-scrapper:start', (response) => {
        const element = document.querySelector('#preview');
        const copy = document.querySelector('#preview-hidden');

        element.innerHTML = json2table(response.data.headers, response.data.items, false);
        copy.innerHTML = json2table(response.data.headers, response.data.items, true);
        document.querySelector('#title').innerHTML = response.title;
        document.querySelector('#description').innerHTML = `We found ${response.data.items.length/response.data.headers.length} results`;
    });

    document.getElementById('copy').addEventListener("click", () => copyElementToClipboard('table-true'));
})();
