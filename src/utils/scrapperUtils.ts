import { ScrapperOptions, getDomainName } from './chrome';
import { urlMatchesPatternUrl } from './urlUtils';
import scrapperOptions from './../scrappers';

export function getScrapperOptionsByUrl(url: string, title: string): ScrapperOptions | null {
  let options;

  const domain = getDomainName(url);

  if (domain && scrapperOptions.has(domain)) {
    const scrappers = scrapperOptions.get(domain);
    if (!scrappers) return null;

    const scrapper = scrappers.find((scrapper) => {
      if (Array.isArray(scrapper.url)) {
        return scrapper.url.some((scrapperURL: string) => urlMatchesPatternUrl(url, scrapperURL));
      } else {
        return urlMatchesPatternUrl(url, scrapper.url);
      }
    });

    options = scrapper;
  }

  if (options) {
    if (!options.header) {
      return {
        header: title,
        ...options,
      };
    }

    return options;
  }

  return null;
}
