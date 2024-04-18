import { JSX } from 'preact';
import './no-results.css';
import { createNewReportEntryRow} from '../utils/rows-api/report';
import Button from './button';

interface Props {
  message?: string;
}

const NoResults = ({ message }: Props): JSX.Element => {
  const redirectToFeedback = () => {
    setTimeout(() => window.close(), 150);
    createNewReportEntryRow();
  };

  return (
    <div className="no-results-container">
      <div className="no-results">
        <img src="/empty.svg" />
        <strong>No results</strong>
        <span>{message ?? 'Would you like RowsX to support this website?'}</span>
        <div className="btn-container">
          <Button variant="primary" onClick={redirectToFeedback}>
            Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoResults;
