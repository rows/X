import { JSX } from 'preact';
import './no-results.css';
import Button from './button';
import { getCurrentTab } from '../utils/chrome';

interface Props {
  message?: string;
}

const NoResults = ({ message }: Props): JSX.Element => {
  const redirectToFeedback = async () => {
    const tab = await getCurrentTab();
    if (!tab || !tab.url) return;

    const url = new URL(tab.url);
    const message =
      'Hi Rows team,\n\n' +
      `I'd like to add "${tab.url}" to be compatible with RowsX.\n\nBest,\n\n--`;

    window.open(
      `mailto:enterprise@rows.com?subject=Request RowsX to be compatible with ${
        url.origin
      }&body=${encodeURIComponent(message)}`
    );
  };

  return (
    <div className="no-results-container">
      <div className="no-results">
        <img src="/empty.svg" />
        <strong>No results</strong>
        <span>{message ?? 'Would you like RowsX to support this website?'}</span>
        <div className="btn-container">
          <Button type="primary" onClick={redirectToFeedback}>
            Talk to us
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoResults;
