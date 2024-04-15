export function hasImage(cell: string): boolean {
  if (!cell) {
    return false;
  }

  return (
    cell.startsWith('http') &&
    (cell.toLowerCase().includes('/image/') ||
      cell.toLowerCase().includes('/images/') ||
      cell.toLowerCase().includes('thumbnail') ||
      cell.includes('googleusercontent.com/p/') ||
      cell.includes('photo') ||
      cell.includes('.jpg') ||
      cell.includes('.jpeg') ||
      cell.includes('.png') ||
      cell.includes('.gif') ||
      cell.includes('.svg') ||
      cell.includes('.webp'))
  );
}

function processCell(cell: string) {
  if (!cell) {
    return '';
  } else if (cell?.startsWith('+')) {
    return `='${cell}'`;
  } else if (hasImage(cell)) {
    return `=IMAGE("${cell}")`;
  }

  return cell;
}

export function array2tsv(data: string[][] = []): string {
  return `${data
    .map((row) => row.map(processCell).join('\t'))
    .join('\n')
    .toString()}`;
}
