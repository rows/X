import { getDomainName, ScrapperOptions } from '../utils/chrome';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const data = import.meta.glob('./*.yml', { eager: true });
const scrappers = new Map<string, Array<ScrapperOptions>>();

for (const scrapperPath in data) {
  const url = data[scrapperPath].default.url;
  let hostname = '';

  if (Array.isArray(url)) {
    hostname = getDomainName(url[0]);
  } else {
    hostname = getDomainName(url);
  }

  if (hostname) {
    if (scrappers.has(hostname)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const options = scrappers.get(hostname)!;
      scrappers.set(hostname, [...options, data[scrapperPath].default]);
    } else {
      scrappers.set(hostname, [data[scrapperPath].default]);
    }
  }
}

export default scrappers;
