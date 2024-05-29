import Button from './button';
import './preview.css';
import { array2tsv, hasImage } from '../utils/copy';
import { FunctionComponent } from 'preact';
import { ScrapperResults } from '../utils/chrome';
import { reportUsage } from '../utils/rows-api/report';

interface Props {
  results: ScrapperResults;
}

const Preview: FunctionComponent<Props> = ({ results = [] }) => {
  const openInRows = async (table: string[][]) => {
    try {
      await chrome.runtime.sendMessage({
        action: 'rows-x:store',
        data: array2tsv(table),
      });
    } catch (error) {
      console.error("Failed to open data in Rows:", error);
    }
  };
  
  const copyToClipboard = async (result: {
    title?: string;
    table: string[][];
    includeHeader?: boolean;
  }) => {
    let tableToCopy = result.table;
    if (!result.includeHeader) {
      tableToCopy = result.table.slice(1); // Remove the first row (header)
    }
  
    try {
      await navigator.clipboard.writeText(array2tsv(tableToCopy));
    
      // Send usage report
      await reportUsage({action: 'copy_values'});
    } catch (error) {
      console.error("Failed to copy data to clipboard:", error);
    }
  
    setTimeout(() => window.close(), 200);
  };  

  const renderCell = (cell: string) => {
    if (hasImage(cell)) {
      return <img alt="rows_x_image" src={cell} />;
    }
  
    return cell;
  };

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
                  className="copy-btn"
                  variant="secondary"
                  onClick={() => copyToClipboard(result)}
                >
                  <img alt="copy" src="/icons/copy.svg" />
                </Button>
                <Button
                  className="open-rows-btn"
                  variant="primary"
                  onClick={() => openInRows(result.table)}
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
