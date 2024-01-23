import { customScrapper } from './scrappers/custom';
import { scrapHTMLTables } from './scrappers/html-tables';
import {scrapDivHTMLTables, ScrapDivTablesOptions} from './scrappers/div-tables';

export async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  return tab;
}

interface ScrapperOptions {
  parseTables?: ScrapDivTablesOptions;
}

export async function runScrapper(options?: ScrapperOptions) {
  const tab = await getCurrentTab();

  let computation: any = [];

  if (!options) {
    computation = await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: scrapHTMLTables,
    });
  } else if (options.parseTables) {
    computation = await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      args: [options.parseTables],
      func: scrapDivHTMLTables,
    });
  } else {
    computation = await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      args: [options],
      func: customScrapper,
    });
  }

  return computation[0].result ?? [];
}
