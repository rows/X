import './no-results.css'

const NoResults = () => {
    return (
        <div className="no-results-container">
            <div className="no-results">
                <img src="/empty.svg" />
                <strong>No results</strong>
                We are sorry but we couldn't identify any list or table in the page
            </div>
        </div>
    );
}

export default NoResults;
