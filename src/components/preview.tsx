import Button from './button';
import './preview.css';
import { array2tsv, hasImage } from '../utils/copy';
import { FunctionComponent } from 'preact';
import { ScrapperResults } from '../utils/chrome';

function renderCell(cell: string) {
  if (hasImage(cell)) {
    return <img alt="rows_x_image" src={cell} />;
  }

  return cell;
}

interface Props {
  results: ScrapperResults;
}

const Preview: FunctionComponent<Props> = ({ results = [] }) => {
  return (
    <div className="results">
      {results.map((result) => {
        return (
          <div className="table-preview">
            <div className="table-header">
              <caption className="title">{result.title}</caption>
              <div className="pill">{`${result.table.length - 1} records`}</div>
            </div>
            <div className="table-body">
              <div className="table-container">
                <table>
                  {result.table.slice(0, 6).map((row) => (
                    <tr>
                      {row.map((col) => (
                        <td>{renderCell(col)}</td>
                      ))}
                    </tr>
                  ))}
                </table>
                {result.table.length > 5 && <div className="shade" />}
              </div>
              <div className="table-actions">
                <Button
                  type="secondary"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(array2tsv(result.table))
                      .then(() => setTimeout(() => window.close(), 200));
                  }}
                >
                  <img alt="copy" src="/icons/copy.svg" />
                </Button>
                <Button
                  className="open-rows-btn"
                  type="primary"
                  onClick={() => {
                    chrome.runtime.sendMessage({
                      action: 'rows-x:store',
                      data: array2tsv(result.table),
                    });
                  }}
                >
                  Open in Rows
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Preview;
