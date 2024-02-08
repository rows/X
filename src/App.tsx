import { useEffect, useState } from 'preact/hooks';
import './index.css';
import NoResults from './components/no-results';
import Header from './components/header';
import Preview from './components/preview';
import LoadingSkeleton from './components/loading-skeleton';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'rows-x:scrap' }, (response) => {
      setResults(response);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>{results.length > 0 ? <Preview results={results} /> : <NoResults />}</>
        )}
      </div>
    </>
  );
};

export default App;
