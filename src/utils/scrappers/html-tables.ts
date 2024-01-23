export async function scrapHTMLTables() {
  function removeEmptyColumns(arr: any[]) {
    // detect empty columns
    const emptyColumns = (arr[0] || []).map((_: any, index: number) =>
      arr.some((col) => col[index])
    );

    // filter empty columns
    return arr.map((column) => column.filter((_: any, index: number) => emptyColumns[index]));
  }

  function toArray(table: any) {
    const data: any = [];

    for (let i = 0; i < table.length; i++) {
      const tr: any = table[i];

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
      const tr: any = data[i];
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

    return removeEmptyColumns(data.map((row: any) => row.map((col: any) => col.value)));
  }

  const titles: string[] = [];

  const tableElements = Array.from(document.querySelectorAll('table'));

  const rowSelector = 'tr';
  const colSelector = 'td,th';

  const tables = tableElements.map((tableElement: any) => {
    let title = tableElement.previousElementSibling
      ? tableElement.previousElementSibling.innerText.trim()
      : '';
    let scrapElement = tableElement;

    while (title === '' || title.startsWith('.')) {
      const titleElement = scrapElement.querySelector('caption,h6,h5,h4,h3,h2,h1,title');

      if (titleElement) {
        title = titleElement.innerText.replaceAll('\n', ' ').trim();
      }

      scrapElement = scrapElement.parentElement;
    }

    titles.push(title.replace('[edit]', ''));

    return Array.from(tableElement.querySelectorAll(rowSelector)).map((tr: any) => {
      if (!tr) {
        return [];
      }

      return Array.from(tr.querySelectorAll(colSelector)).map((td: any) => {
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

  return tables
    .map((table: any, index: number) => ({
      title: titles[index],
      table: toArray(table),
    }))
    .filter((table) => !table.table.every((row: any) => row.every((col: any) => col === '')));
}
