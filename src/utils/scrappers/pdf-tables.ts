import { ScrapperResults } from '../chrome';

export type PDFTextItem = {
  str: string;
  transform: number[];
  width?: number;
  height?: number;
};

type PositionedText = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type Cell = {
  text: string;
  x: number;
};

type Row = {
  y: number;
  cells: Cell[];
};

type PageText = {
  pageNumber: number;
  items: PDFTextItem[];
};

const PDF_VIEWER_SRC_PARAMS = ['src', 'file'];
const LINE_Y_TOLERANCE = 3;
const COLUMN_X_TOLERANCE = 18;
const MAX_TABLE_ROW_GAP = 30;

export function getPDFUrl(url: string, title = ''): string | null {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname.toLowerCase();

    if (pathname.endsWith('.pdf') || title.toLowerCase().endsWith('.pdf')) {
      return url;
    }

    for (const param of PDF_VIEWER_SRC_PARAMS) {
      const viewerSource = parsedUrl.searchParams.get(param);

      if (viewerSource && viewerSource.toLowerCase().includes('.pdf')) {
        return viewerSource;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function isPDFUrl(url: string, title = ''): boolean {
  return getPDFUrl(url, title) !== null;
}

export async function scrapPDFTablesFromUrl(url: string, title = ''): Promise<ScrapperResults> {
  const pdfUrl = getPDFUrl(url, title);

  if (!pdfUrl) {
    return [];
  }

  try {
    const response = await fetch(pdfUrl);

    if (!response.ok) {
      return [];
    }

    const buffer = await response.arrayBuffer();

    return scrapPDFTablesFromBytes(new Uint8Array(buffer), title);
  } catch (error) {
    console.error('Failed to extract tables from PDF', error);
    return [];
  }
}

export async function scrapPDFTablesFromBytes(bytes: Uint8Array, title = ''): Promise<ScrapperResults> {
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const documentOptions = {
    data: bytes,
    disableWorker: true,
    isEvalSupported: false,
    useSystemFonts: true,
  };
  const document = await getDocument(documentOptions as Parameters<typeof getDocument>[0]).promise;

  try {
    const pages: PageText[] = [];

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
      const page = await document.getPage(pageNumber);
      const textContent = await page.getTextContent();

      pages.push({
        pageNumber,
        items: textContent.items.filter(isPDFTextItem) as PDFTextItem[],
      });
    }

    return extractTablesFromPDFPages(pages, title);
  } finally {
    await document.destroy();
  }
}

export function extractTablesFromPDFPages(pages: PageText[], documentTitle = ''): ScrapperResults {
  return pages.flatMap((page) => {
    const rows = getRows(page.items);
    const tableGroups = getTableGroups(rows);

    return tableGroups.map((tableRows, index) => {
      const table = alignTable(tableRows);

      return {
        title: getTableTitle(rows, tableRows[0], documentTitle, page.pageNumber, index),
        table,
        includeHeader: true,
      };
    }).filter((result) => result.table.length > 1);
  });
}

function isPDFTextItem(item: unknown): item is PDFTextItem {
  const maybeItem = item as PDFTextItem;

  return Boolean(
    maybeItem &&
    typeof maybeItem.str === 'string' &&
    Array.isArray(maybeItem.transform) &&
    typeof maybeItem.transform[4] === 'number' &&
    typeof maybeItem.transform[5] === 'number'
  );
}

function normalizeText(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

function toPositionedText(item: PDFTextItem): PositionedText | null {
  const text = normalizeText(item.str);

  if (!text) {
    return null;
  }

  return {
    text,
    x: item.transform[4],
    y: item.transform[5],
    width: item.width ?? estimateWidth(text, item.height),
    height: item.height ?? (Math.abs(item.transform[3] ?? 0) || 10),
  };
}

function estimateWidth(text: string, height?: number) {
  return text.length * ((height ?? 10) * 0.5);
}

function getRows(items: PDFTextItem[]): Row[] {
  const lines: Array<{
    y: number;
    items: PositionedText[];
  }> = [];

  items
    .map(toPositionedText)
    .filter((item): item is PositionedText => item !== null)
    .sort((a, b) => b.y - a.y || a.x - b.x)
    .forEach((item) => {
      const line = lines.find((line) => Math.abs(line.y - item.y) <= LINE_Y_TOLERANCE);

      if (line) {
        line.items.push(item);
        line.y = average(line.items.map((lineItem) => lineItem.y));
      } else {
        lines.push({ y: item.y, items: [item] });
      }
    });

  return lines.map((line) => ({
    y: line.y,
    cells: getCells(line.items),
  }));
}

function getCells(items: PositionedText[]): Cell[] {
  const sortedItems = [...items].sort((a, b) => a.x - b.x);
  const cells: Array<Cell & { right: number; charWidth: number; }> = [];

  sortedItems.forEach((item) => {
    const previousCell = cells.at(-1);

    if (!previousCell) {
      cells.push(createCell(item));
      return;
    }

    const gap = item.x - previousCell.right;
    const joinThreshold = Math.max(8, previousCell.charWidth * 2.8);

    if (gap > joinThreshold) {
      cells.push(createCell(item));
      return;
    }

    previousCell.text = normalizeText(`${previousCell.text} ${item.text}`);
    previousCell.right = Math.max(previousCell.right, item.x + item.width);
    previousCell.charWidth = (previousCell.right - previousCell.x) / Math.max(previousCell.text.length, 1);
  });

  return cells.map(({ text, x }) => ({ text, x }));
}

function createCell(item: PositionedText) {
  return {
    text: item.text,
    x: item.x,
    right: item.x + item.width,
    charWidth: item.width / Math.max(item.text.length, 1),
  };
}

function getTableGroups(rows: Row[]) {
  const tableRows = rows.filter((row) => row.cells.length > 1);
  const groups: Row[][] = [];

  tableRows.forEach((row) => {
    const previousGroup = groups.at(-1);
    const previousRow = previousGroup?.at(-1);

    if (!previousGroup || !previousRow || previousRow.y - row.y > MAX_TABLE_ROW_GAP) {
      groups.push([row]);
      return;
    }

    previousGroup.push(row);
  });

  return groups.filter((group) => group.length > 1);
}

function alignTable(rows: Row[]) {
  const columns = getColumnStarts(rows);
  const table = rows.map((row) => {
    const tableRow = new Array(columns.length).fill('');

    row.cells.forEach((cell) => {
      const columnIndex = getNearestColumnIndex(columns, cell.x);
      tableRow[columnIndex] = normalizeText(`${tableRow[columnIndex]} ${cell.text}`);
    });

    return tableRow;
  });

  return trimEmptyEdges(table);
}

function getColumnStarts(rows: Row[]) {
  return rows
    .flatMap((row) => row.cells.map((cell) => cell.x))
    .sort((a, b) => a - b)
    .reduce<number[]>((columns, x) => {
      const columnIndex = columns.findIndex((columnX) => Math.abs(columnX - x) <= COLUMN_X_TOLERANCE);

      if (columnIndex === -1) {
        columns.push(x);
      } else {
        columns[columnIndex] = (columns[columnIndex] + x) / 2;
      }

      return columns;
    }, []);
}

function getNearestColumnIndex(columns: number[], x: number) {
  return columns.reduce((nearestIndex, columnX, index) => {
    const nearestDistance = Math.abs(columns[nearestIndex] - x);
    const distance = Math.abs(columnX - x);

    return distance < nearestDistance ? index : nearestIndex;
  }, 0);
}

function trimEmptyEdges(table: string[][]) {
  let trimmed = table.filter((row) => row.some(Boolean));

  while (trimmed.length && trimmed.every((row) => !row[0])) {
    trimmed = trimmed.map((row) => row.slice(1));
  }

  while (trimmed.length && trimmed.every((row) => !row[row.length - 1])) {
    trimmed = trimmed.map((row) => row.slice(0, -1));
  }

  return trimmed;
}

function getTableTitle(rows: Row[], firstTableRow: Row, documentTitle: string, pageNumber: number, index: number) {
  const titleRow = rows
    .filter((row) => row.y > firstTableRow.y && row.y - firstTableRow.y <= 80 && row.cells.length === 1)
    .sort((a, b) => a.y - b.y)
    .at(-1);

  if (titleRow) {
    return titleRow.cells[0].text;
  }

  const title = documentTitle.replace(/\.pdf$/i, '').trim();

  if (title) {
    return `${title} - page ${pageNumber} table ${index + 1}`;
  }

  return `PDF page ${pageNumber} table ${index + 1}`;
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
