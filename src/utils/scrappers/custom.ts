import { ScrapperOptions } from '../chrome';
import { DOM_Element } from './types';

export async function customScrapper(options: ScrapperOptions) {
  // parser functions
  function getText(element?: DOM_Element, query?: string) {
    let elem = element;

    if (query) {
      elem = element?.querySelector(query);
    }

    return elem?.innerText?.replaceAll('\n', ' ')?.trim() ?? '';
  }

  function getImageSrc(element?: DOM_Element, query?: string) {
    let elem = element;

    if (query) {
      elem = element?.querySelector(query);
    }

    return elem ? elem.poster ?? elem.src : '';
  }

  function getLink(element?: DOM_Element, query?: string) {
    let elem = element;

    if (query) {
      elem = element?.querySelector(query);
    }

    return elem ? elem.href : '';
  }

  function getCleanUrl(element?: DOM_Element, query?: string) {
    let elem = element;

    if (query) {
      elem = element?.querySelector(query);
    }

    if (!elem) {
      return '';
    }

    const url = new URL(elem.href);
    return url.origin + url.pathname;
  }

  function getAttribute(element?: DOM_Element, query?: string, attribute?: string) {
    let elem = element;

    if (query) {
      elem = element?.querySelector(query);
    }

    return elem?.getAttribute(attribute!)?.replaceAll('\n', ' ').trim() ?? '';
  }

  function parse(element: DOM_Element, query?: string, type?: string, attribute?: string) {
    switch (type) {
      case 'text':
        return getText(element, query);
      case 'image':
        return getImageSrc(element, query);
      case 'clean-url':
        return getCleanUrl(element, query);
      case 'link':
        return getLink(element, query);
      case 'get-attribute':
        return getAttribute(element, query, attribute);
      default:
        return '';
    }
  }

  const tableElements = Array.from<DOM_Element>(
    document.querySelectorAll(options.listElementsQuery!) as Iterable<DOM_Element>
  ).map((element) => {
    return options.elementParser!.map((parserInfo) =>
      parse(element, parserInfo?.query, parserInfo.type, parserInfo?.attribute)
    );
  });

  return [
    {
      title: options.header,
      table: [[...options.elementParser!.map((element) => element.title)], ...tableElements],
    },
  ];
}
