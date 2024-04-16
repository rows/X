import { JSX } from "preact";

interface Props {
  message: string;
}

const Exception = ({ message }: Props): JSX.Element => {
  return (
    <div className="no-results-container">
      <div className="no-results">
        <strong>{message}</strong>
      </div>
    </div>
  );
};

export default Exception;
