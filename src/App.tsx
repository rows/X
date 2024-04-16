import { FunctionalComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import './index.css';
import Exception from "./components/exception";
import NoResults from './components/no-results';
import Header from './components/header';
import Preview from './components/preview';
import LoadingSkeleton from './components/loading-skeleton';

function isResponseIsAnException(response) {
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
        setLoading(false);
        setException("");
      }
    });
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        {showLoading && (<LoadingSkeleton />)}
        {showResults &&  <Preview results={results} />}
        {noResults && <NoResults />}
        {hasExceptions && <Exception message={exceptionOnScrapperResult} />}
      </div>
    </>
  );
};

export default App;
