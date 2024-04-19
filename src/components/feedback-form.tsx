import { JSX } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import {createNewReportEntryRow} from '../utils/rows-api/report';
import Button from './button';

const FeedbackForm = (): JSX.Element => {
  const [reason, setReason] = useState('table not detected');
  const [feedback, setFeedback] = useState('');
  const inputElement = useRef<HTMLInputElement>(null);
  const shouldShowInput = reason === 'other';

  useEffect(() => {
    if (inputElement.current && shouldShowInput) {
      inputElement.current.focus();
    }
  }, [reason]);

  const handleRadioInputChange: JSX.GenericEventHandler<HTMLInputElement> = (event) => {
    setReason(event.currentTarget.id);
    setFeedback('');
  }

  const handleInputTextChange: JSX.GenericEventHandler<HTMLInputElement> = (event) => {
    setFeedback(event.currentTarget.value);
  }

  const handleSubmit: JSX.SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setTimeout(() => window.close(), 150);
    createNewReportEntryRow(feedback ? feedback : reason);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          type="radio"
          id="table not detected"
          name="reason"
          value={reason}
          onChange={handleRadioInputChange}
        />
        <label htmlFor="table not detected">Table wasn't detected</label>
      </div>

      <div className="input-wrapper">
        <input
          type="radio"
          id="table broken"
          name="reason"
          value={reason}
          onChange={handleRadioInputChange}
        />
        <label htmlFor="table broken">Table is broken</label>
      </div>

      <div className="input-wrapper">
        <input
          type="radio"
          id="other"
          name="reason"
          value={reason}
          onChange={handleRadioInputChange}
        />
        <label htmlFor="other">Other</label>
      </div>


      <div className="input-wrapper">
        <input
          ref={inputElement}
          type="text"
          maxLength={30}
          value={feedback}
          placeholder="Write your feedback"
          onChange={handleInputTextChange}
          disabled={!shouldShowInput}
        />
      </div>

      <Button type="submit" variant="primary">
        Report
      </Button>
    </form>
  );
};

export default FeedbackForm;
