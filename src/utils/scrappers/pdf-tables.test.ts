import { extractTablesFromPDFPages, getPDFUrl } from './pdf-tables';

describe('PDF table scraping', () => {
  it('detects direct and embedded PDF viewer URLs', () => {
    expect(getPDFUrl('https://example.com/report.pdf')).toBe('https://example.com/report.pdf');
    expect(getPDFUrl('chrome-extension://viewer/index.html?src=https%3A%2F%2Fexample.com%2Ftable.pdf')).toBe('https://example.com/table.pdf');
    expect(getPDFUrl('https://example.com/report', 'report.pdf')).toBe('https://example.com/report');
    expect(getPDFUrl('https://example.com/report.html')).toBeNull();
    expect(getPDFUrl('file:///tmp/report.pdf')).toBeNull();
    expect(getPDFUrl('http://127.0.0.1/report.pdf')).toBeNull();
    expect(getPDFUrl('chrome-extension://viewer/index.html?src=http%3A%2F%2Flocalhost%2Ftable.pdf')).toBeNull();
  });

  it('groups positioned PDF text into aligned tables', () => {
    const results = extractTablesFromPDFPages([
      {
        pageNumber: 1,
        items: [
          text('Student performance', 50, 780),
          text('Country', 50, 740),
          text('Math', 220, 740),
          text('Reading', 310, 740),
          text('Portugal', 50, 720),
          text('472', 220, 720),
          text('477', 310, 720),
          text('Spain', 50, 700),
          text('473', 220, 700),
          text('474', 310, 700),
        ],
      },
    ]);

    expect(results).toEqual([
      {
        title: 'Student performance',
        includeHeader: true,
        table: [
          ['Country', 'Math', 'Reading'],
          ['Portugal', '472', '477'],
          ['Spain', '473', '474'],
        ],
      },
    ]);
  });

  it('keeps separate PDF tables separate', () => {
    const results = extractTablesFromPDFPages([
      {
        pageNumber: 2,
        items: [
          text('A', 20, 700),
          text('B', 120, 700),
          text('1', 20, 682),
          text('2', 120, 682),
          text('C', 20, 610),
          text('D', 120, 610),
          text('3', 20, 592),
          text('4', 120, 592),
        ],
      },
    ], 'sample.pdf');

    expect(results).toHaveLength(2);
    expect(results[0].table).toEqual([
      ['A', 'B'],
      ['1', '2'],
    ]);
    expect(results[1].table).toEqual([
      ['C', 'D'],
      ['3', '4'],
    ]);
  });

});

function text(str: string, x: number, y: number) {
  return {
    str,
    transform: [1, 0, 0, 10, x, y],
    width: str.length * 7,
    height: 10,
  };
}
