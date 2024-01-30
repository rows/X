import { ScrapperOptions } from '../utils/chrome';

// @ts-ignore
const data = import.meta.glob('./*.yml', { eager: true });
const scrappers: Array<ScrapperOptions> = [];

for (const scrapperPath in data) {
  scrappers.push(data[scrapperPath].default);
}

export default scrappers;
