function parseAmazonData() {
  function getText(element, query) {
    const elm = element.querySelector(query);

    return elm ? elm.innerText.replaceAll('\n', '').trim() : '';
  }

  function getImageLink(element, query) {
    const elm = element.querySelector(query);

    return elm ? elm.src : '';
  }

  const elements = Array.from(document.querySelectorAll('.sg-col-4-of-24[data-cel-widget*="search_result_"]'))
    .map((element) => [
      getImageLink(element, 'img'),
      getText(element, '[data-cy="title-recipe"]'),
      getText(element, '.a-price .a-offscreen'),
      element.querySelector('.a-row.a-size-small > span') ? element.querySelector('.a-row.a-size-small > span').getAttribute('aria-label') : '',
      element.querySelector('[data-cy="title-recipe"] a') ? element.querySelector('[data-cy="title-recipe"] a').href : ''
    ]);

  return [
    [
      ['Product image' ,'Product Name', 'Price', 'Rating', 'Amazon link'],
      ...elements.filter(product => !product[1].toLowerCase().includes('patrocinado'))
    ]
  ]
}


async function getCurrentTab() {
    const tabs = await chrome.tabs.query({
        active: true,
    });

    return tabs[0];
}
