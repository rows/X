import { getCurrentTab } from '../chrome';
import fetch from './fetch';
import UAParser from 'ua-parser-js';

interface ReportUsageParams {
  action: 'copy_values' | 'open_in_Rows';
  url?: string;
}

export async function createNewReportEntryRow(feedback? : string) {
  const tab = await getCurrentTab();

  if (!tab) {
    return null;
  }

  const userAgent = new UAParser(navigator.userAgent);

  const row_cells = [
    new Date().toUTCString(),
    tab.url,
    new URL(tab.url!).hostname,
    userAgent.getBrowser().name,
    userAgent.getBrowser().version,
    feedback ?? 'no table detected'
  ];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await fetch.post(`https://api.rows.com/v1/spreadsheets/${import.meta.env.VITE_SPREADSHEET_ID}/tables/${import.meta.env.VITE_TABLE_ID}/values/A1:F:append`, {
    values: [row_cells]
  });
}

export async function reportUsage(params: ReportUsageParams): Promise<void> {
  const { action } = params;
  const tab = await getCurrentTab();
  if (!tab) {
    return;
  }

  const userAgent = new UAParser(navigator.userAgent);

  const row_cells = [
    new Date(),
    params.url ? params.url : tab.url,
    new URL(params.url ? params.url : tab.url!).hostname,
    userAgent.getBrowser().name,
    userAgent.getBrowser().version,
    action,
  ];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await fetch.post(`https://api.rows.com/v1/spreadsheets/${import.meta.env.VITE_SPREADSHEET_ID}/tables/${import.meta.env.VITE_TABLE_ID_USAGE}/values/A1:F:append`, {
    values: [row_cells]
  });
}