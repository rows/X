
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message === 'rows-x:scrap') {
        sendResponse([]);
    }

    return true; // return true to indicate you want to send a response asynchronously
});
