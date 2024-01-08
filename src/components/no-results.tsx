import './no-results.css'

const NoResults = () => {
    const redirectToFeedback = () => {
        window.open('https://feedback.rows.com');
    }

    return (
        <div className="no-results-container">
            <div className="no-results">
                <img src="/empty.svg" />
                <strong>No results</strong>
                <span>Are we missing something? <a href="https://feedback.rows.com" onClick={redirectToFeedback}>Request website</a> and we will make it work for you!</span>
            </div>
        </div>
    );
}

export default NoResults;
