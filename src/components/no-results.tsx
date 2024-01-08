import './no-results.css'

const NoResults = () => {
    return (
        <div className="no-results-container">
            <div className="no-results">
                <img src="/empty.svg" />
                <strong>No results</strong>
                Are we missing something? <a>Request website</a> and we will make it work for you!
            </div>
        </div>
    );
}

export default NoResults;
