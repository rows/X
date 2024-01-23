export type ScrapDivTablesOptions = {
  header: string;
  tables: Array<{
    rows: string;
    columns: string;
  }>;
  mergeTablesBy: 'row' | 'column';
};

export async function scrapDivHTMLTables(options: ScrapDivTablesOptions) {
  function getText(element: any, query: string) {
    let elems = element;

    if (query) {
      elems = element.querySelectorAll(query);
    }

    return Array.from(elems)?.map(
      (element: any) => element.innerText?.replaceAll('\n', ' ')?.trim() ?? ''
    );
  }

  let table: any = [];

  const tables = options.tables.map((tableInfo: any) => {
    return Array.from(document.querySelectorAll(tableInfo.rows)).map((rowElement) =>
      getText(rowElement, tableInfo.cols)
    );
  });

  if (options.mergeTablesBy === 'column') {
    for (let i = 0; i <= tables[0].length; ++i) {
      table.push(tables.map((table: any) => table[i]).flat(Infinity));
    }
  } else if (options.mergeTablesBy === 'row') {
    table = [...tables.flat(1)];
  } else {
    table = tables;
  }

  return [
    {
      title: options.header,
      table,
    },
  ];
}
