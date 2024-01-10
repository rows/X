export function hasImage(cell: any) {
    if (!cell) {
        return '';
    }

    return cell.startsWith('http') && (
        cell.toLowerCase().includes('/image/')
        || cell.toLowerCase().includes('/images/')
        || cell.toLowerCase().includes('thumbnail')
        || cell.includes('googleusercontent.com/p/')
        || (
            cell.includes('.jpg')
            || cell.includes('.jpeg')
            || cell.includes('.png')
            || cell.includes('.gif')
            || cell.includes('.svg')
            || cell.includes('.webp')
        )
    );
}

function processCell(cell: string) {
    if (!cell) {
        return '';
    } else if (cell?.startsWith('+')) {
        return `='${cell}'`;
    } else if (hasImage(cell)) {
        return `=IMAGE("${cell}")`
    }

    return cell;
}

export function array2tsv(data: any = []) {
    return `${data.map((row: any) => row.map(processCell).join('\t')).join('\n').toString()}`;
}
