import { customScrapper } from "./scrappers/custom.ts";
import { scrapHTMLTables } from "./scrappers/html-tables.ts";
import { scrapDivHTMLTables } from "./scrappers/div-tables.ts";

export async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  return tab;
}

export async function runScrapper(options: any) {
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
