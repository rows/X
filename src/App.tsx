import { FunctionalComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import './index.css';
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
        setException("");
      }

      setLoading(false);
    });
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        {showLoading && (<LoadingSkeleton />)}
        {showResults &&  <Preview results={results} />}
        {noResults && <NoResults />}
        {hasExceptions && <NoResults message={exceptionOnScrapperResult} />}
      </div>
    </>
  );
};

export default App;
