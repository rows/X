export function hasImage(cell: any) {
    return cell.startsWith('http') && (
        cell.includes('image') || (
            cell.endsWith('.jpg') || cell.endsWith('.jpeg') || cell.endsWith('.png')
        )
    );
}

function processCell(cell: string) {
    if (!cell) {
        return '';
    } else if (cell.startsWith('+')) {
        return `='${cell}'`;
    } else if (hasImage(cell)) {
        return `=IMAGE("${cell}")`
    }

    return cell;
}

export function array2tsv(data: any = []) {
    return `${data.map((row: any) => row.map(processCell).join('\t')).join('\n').toString()}`;
}
