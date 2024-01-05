import {useEffect, useState} from "react";
import './index.css'
import NoResults from "./no-results.tsx";

const App = () => {
    const [message, setMessage] = useState(['1']);

    useEffect(() => {
        chrome.runtime.sendMessage('rows-x:scrap', (response) => {
            setMessage(response);
        });
    }, []);

    return (
        <div className="container">
            {message.length > 0 ? <h1>Hello</h1> : <NoResults />}
            {message.toString()}
        </div>
    );
}

export default App;
