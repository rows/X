import { FunctionalComponent } from 'preact';
import { useEffect, useState, useReducer } from 'preact/hooks';
import './index.css';
import FeedbackForm from './components/feedback-form';
import NoResults from './components/no-results';
import Header from './components/header';
import Preview from './components/preview';
import LoadingSkeleton from './components/loading-skeleton';
import { ExceptionMessage } from "./types";

function isResponseIsAnException(response: ExceptionMessage) {
  return response.code >= 0 && typeof response.message === 'string';
}

const App: FunctionalComponent = () => {
  const [isLoading, setLoading] = useState(true);
  const [exceptionOnScrapperResult, setException] = useState("");
  const [results, setResults] = useState([]);
  const [isReportFormOpen, toggleReportTab] = useReducer((isOpen) => !isOpen, false);

  const hasExceptions = Boolean(exceptionOnScrapperResult);
  const showLoading = !hasExceptions && isLoading;
  const showResults = !showLoading && results.length > 0;
  const noResults = !showLoading && (!hasExceptions && results.length === 0);

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'rows-x:scrap' }, (response) => {
      if (isResponseIsAnException(response)) {
        setResults([]);
        setException(response.message);
      } else {
        setResults(response);
        setException('');
      }

      setLoading(false);
    });
  }, []);

  return (
    <>
      <Header onReportClick={toggleReportTab} />
      <div className="container">
        {isReportFormOpen ? (
          <FeedbackForm />
        ) : (
          <>
            {showLoading && (<LoadingSkeleton />)}
            {showResults &&  <Preview results={results} />}
            {noResults && <NoResults />}
            {hasExceptions && <NoResults message={exceptionOnScrapperResult} />}
          </>
        )}
      </div>
    </>
  );
};

export default App;
