import { customScrapper } from './scrappers/custom';
import { scrapHTMLTables } from './scrappers/html-tables';
import { scrapDivHTMLTables, ScrapDivTablesOptions } from './scrappers/div-tables';

export function getDomainName(url: string): string {
  const urlParsed = new URL(url);

  // Split the hostname into parts
  const hostnameParts = urlParsed.hostname.split('.');

  // Determine the number of parts in the TLD
  const tldCount = urlParsed.hostname.endsWith(hostnameParts[hostnameParts.length - 1]) ? 1 : 2;

  // Remove the last n parts (TLD)
  for (let i = 0; i < tldCount; i++) {
    hostnameParts.pop();
  }

  return hostnameParts.at(-1) ?? '';
}

export async function getCurrentTab(): Promise<chrome.tabs.Tab | undefined> {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  return tab;
}

export interface ScrapperOptions {
  url: string | Array<string>;
  header?: string;
  includeHeader?: boolean;
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

export async function runScrapper(currentTab: chrome.tabs.Tab, options: ScrapperOptions | null): Promise<ScrapperResults> {
  let computation: Array<{ result: ScrapperResults }>;

  if (!currentTab.id) {
    throw new Error('Invalid tab ID.'); // Handle the case where tab ID is missing
  }

  if (!options) {
    computation = await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      func: scrapHTMLTables,
    });
  } else if (options.parseTables) {
    computation = (await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      args: [options],
      func: scrapDivHTMLTables,
    })) as Array<{ result: ScrapperResults }>;
  } else {
    computation = (await chrome.scripting.executeScript({
      target: { tabId: currentTab.id },
      args: [options],
      func: customScrapper,
    })) as Array<{ result: ScrapperResults }>;
  }

  return computation[0].result ?? [];
}
