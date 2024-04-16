import { getCurrentTab } from '../chrome';
import fetch from './fetch';

const TABLE_HEADERS = [
  'UTC datetime',
  'URL',
  'Domain',
  'Browser',
  'Browser version',
  'Report type'
];

const SHEET_ID = '1aL6dsP2jqENGlkSq3A5O9';
const TABLE_ID = '87fa52ac-40fc-4d3f-9aff-0cb98f0e9b0d';

export async function createReportHeader() {
  const header_cells = TABLE_HEADERS.map((cell) => ({ value: cell }));

  await fetch.post(`https://api.rows.com/v1/spreadsheets/${SHEET_ID}/tables/${TABLE_ID}/cells/A1:F1`, {
    cells: [
      header_cells
    ]
  });
}

export async function createAddEmptyPageRow() {
  const tab = await getCurrentTab();

  if (!tab) {
    return null;
  }

  const row_cells = [
    new Date().toUTCString(),
    tab.url,
    new URL(tab.url!).hostname,
    navigator.userAgent,
    navigator.userAgent,
    'no table detected'
  ]

  await fetch.post(`https://api.rows.com/v1/spreadsheets/${SHEET_ID}/tables/${TABLE_ID}/values/A1:F99999:append`, {
    values: [row_cells]
  });
}
