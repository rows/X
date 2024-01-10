import Button from "./button.tsx";
import './preview.css';
import {array2tsv, hasImage} from "../utils/copy.ts";

function renderCell(cell: string) {
    if (hasImage(cell)) {
        return <img src={cell} />;
    }

    return cell;
}

function Preview({ results = [] }) {
    return <div className="results">
        {results.map((result: any) => {
            return (
                <div className="table-preview">
                    <div className="table-header">
                        <caption className="title">{result.title}</caption>
                        <div className="pill">{`${result.table.length - 1} records`}</div>
                    </div>
                    <div className="table-body">
                        <div className="table-container">
                            <table>
                                {result.table.slice(0, 6).map((row: any) =>
                                    <tr>{row.map((col: any) => <td>{renderCell(col)}</td>)}</tr>
                                )}
                            </table>
                            {result.table.length > 5 && (
                                <div className="shade" />
                            )}
                        </div>
                        <div className="table-actions">
                            <Button type="secondary" onClick={() => {
                                navigator.clipboard.writeText(array2tsv(result.table)).then(() => setTimeout(() => window.close(), 200));
                            }}>
                                <img src="/icons/copy.svg" />
                            </Button>
                            <Button className="open-rows-btn" type="primary" onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify({ source: '%ROWS_X%', data: array2tsv(result.table) })).then(() => {
                                    window.open('https://rows.new');
                                });
                            }}>Open in Rows</Button>
                        </div>
                    </div>

                </div>
            );
        })}
    </div>
}

export default Preview;
