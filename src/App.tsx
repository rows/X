import { useEffect, useState } from "preact/hooks";
import './index.css'
import NoResults from "./components/no-results.tsx";
import Header from "./components/header.tsx";
import Preview from "./components/preview.tsx";

const App = () => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        chrome.runtime.sendMessage({ action: 'rows-x:scrap' }, (response) => {
            setResults(response);
        });
    }, []);

    return (
        <>
        <Header />
            <div className="container">
                {results.length > 0 ? <Preview results={results} /> : <NoResults />}
            </div>
        </>
    );
}

export default App;
