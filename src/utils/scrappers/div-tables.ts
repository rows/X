/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { DOM_Element } from './types';
import { ScrapperOptions } from '../chrome';

export type ScrapDivTablesOptions = {
  tables: Array<{
    rows: string;
    cols: string;
  }>;
  mergeTablesBy: 'row' | 'column';
};

export async function scrapDivHTMLTables(options: ScrapperOptions) {
  function getText(element: DOM_Element, query: string) {
    let elems: DOM_Element | Iterable<DOM_Element> = element;

    if (query) {
      elems = element?.querySelectorAll(query) as Iterable<DOM_Element>;
    }

    return Array.from<DOM_Element>(elems as Iterable<DOM_Element>)?.map(
      (element) => element?.innerText?.replaceAll('\n', ' ')?.trim() ?? ''
    );
  }

  let table = [];

  const tables = options.parseTables!.tables.map((tableInfo) => {
    return Array.from<DOM_Element>(
      document.querySelectorAll(tableInfo.rows) as Iterable<DOM_Element>
    ).map((rowElement) => getText(rowElement, tableInfo.cols));
  });

  if (options.parseTables!.mergeTablesBy === 'column') {
    for (let i = 0; i <= tables[0].length; ++i) {
      table.push(tables.map((table) => table[i]).flat(Infinity));
    }
  } else if (options.parseTables!.mergeTablesBy === 'row') {
    table = [...tables.flat(1)];
  } else {
    table = tables;
  }

  return [
    {
      title: options.header,
      table,
      includeHeader: true,
    },
  ];
}
