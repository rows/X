import { customScrapper } from './scrappers/custom';
import { scrapHTMLTables } from './scrappers/html-tables';
import { scrapDivHTMLTables, ScrapDivTablesOptions } from './scrappers/div-tables';

export async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  return tab;
}

export interface ScrapperOptions {
  header?: string;
  listElementsQuery?: string;
  elementParser?: Array<{
    title: string;
    query?: string; // if the query is not specified, the scrapper will use the own element
    type: 'text' | 'image' | 'clean-url' | 'link' | 'get-attribute';
    attribute?: string;
  }>;
  parseTables?: ScrapDivTablesOptions;
}

type ScrapperResultItem = {
  title: string;
  table: Array<Array<string>>;
};

export type ScrapperResults = Array<ScrapperResultItem>;

export async function runScrapper(options: ScrapperOptions | null) {
  const tab = await getCurrentTab();

  let computation: Array<{ result: ScrapperResults }>;

  if (!options) {
    computation = await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: scrapHTMLTables,
    });
  } else if (options.parseTables) {
    computation = (await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      args: [options],
      func: scrapDivHTMLTables,
    })) as Array<{ result: ScrapperResults }>;
  } else {
    computation = (await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      args: [options],
      func: customScrapper,
    })) as Array<{ result: ScrapperResults }>;
  }

  return computation[0].result ?? [];
}
