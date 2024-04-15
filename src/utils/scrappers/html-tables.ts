import { DOM_Element } from './types';

type Row = Array<string>;
type Table = Array<Row>;

type ScrapperColumn = {
  value: string;
  colspan: number;
  rowspan: number;
};

type ScrapperRow = Array<ScrapperColumn>;

type TableWithRowAndColSpan = Array<ScrapperRow>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function scrapHTMLTables() {
  function removeEmptyColumns(arr: Table) {
    // detect empty columns
    const emptyColumns = (arr[0] || []).map((_: string, index: number) =>
      arr.some((col) => col[index])
    );

    // filter empty columns
    return arr.map((column) => column.filter((_: string, index: number) => emptyColumns[index]));
  }

  function toArray(table: TableWithRowAndColSpan) {
    const data: TableWithRowAndColSpan = [];

    for (let i = 0; i < table.length; i++) {
      const tr = table[i];

      for (let j = 0; j < tr.length; j++) {
        const td = tr[j];

        for (let c = 0; c < td.colspan; c++) {
          if (!data[i]) {
            data[i] = [];
          }

          data[i].push({ ...td, colspan: 1 });
        }
      }
    }

    for (let i = 0; i < data.length; i++) {
      const tr = data[i];
      for (let j = 0; j < tr.length; j++) {
        const td = tr[j];
        for (let r = 1; r < td.rowspan; r++) {
          if (!data[i + r]) {
            data[i + r] = [];
          }
          data[i + r].splice(j, 0, { ...td, rowspan: 1 });
        }
      }
    }

    return removeEmptyColumns(data.map((row) => row.map((col) => col.value)));
  }

  const titles: string[] = [];

  const tableElements = Array.from(document.querySelectorAll('table') as Iterable<DOM_Element>);

  const rowSelector = 'tr';
  const colSelector = 'td,th';

  const tables = tableElements.map((tableElement) => {
    let title = tableElement?.previousElementSibling?.innerText?.trim() ?? '';
    let scrapElement = tableElement;

    while (title === '' || title.startsWith('.')) {
      const titleElement = scrapElement?.querySelector(
        'caption,h6,h5,h4,h3,h2,h1,title'
      ) as DOM_Element;

      if (titleElement) {
        title = titleElement?.innerText?.replaceAll('\n', ' ')?.trim() ?? '';
      }

      scrapElement = scrapElement?.parentElement as DOM_Element;
    }

    titles.push(title);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return Array.from(tableElement!.querySelectorAll(rowSelector)).map((tr) => {
      if (!tr) {
        return [];
      }

      return Array.from(tr.querySelectorAll(colSelector) as Iterable<DOM_Element>).map((td) => {
        if (!td) {
          return { value: '', colspan: 1, rowspan: 1 };
        }

        const rowspan = +(td.getAttribute('rowspan') || 1) || 1;
        const colspan = +(td.getAttribute('colspan') || 1) || 1;

        const value = td.innerText || '';

        return {
          value: value.replaceAll('\n', ' ').replaceAll('\t', ' ').trim(),
          colspan,
          rowspan,
        };
      });
    });
  });

  // Maps the table to the correct structure and after that remove the empty tables
  return tables
    .map((table, index: number) => ({
      title: titles[index],
      table: toArray(table),
      includeHeader: true,
    }))
    .filter((table) => !table.table.every((row: Row) => row.every((col) => col === '')));
}
